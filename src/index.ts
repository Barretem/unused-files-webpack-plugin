import * as path from 'path';
import * as glob from 'fast-glob';
import { getCurrentTimeStr, moveUnusedFileByPath } from './utils';
import type { ICompiler, ICompilation, IUnusedFilesWebpackPluginOptions, IWebpackError } from './types';

export default class UnusedFilesWebpackPlugin {
  private readonly options: IUnusedFilesWebpackPluginOptions;
  constructor(options?: Partial<IUnusedFilesWebpackPluginOptions>) {
    const backUpDirname = getCurrentTimeStr();
    const backupOptions = options?.backupOptions;
    this.options = {
      ...options,
      include: options?.include ?? ['src/**/*.*'],
      exclude: options?.exclude ?? ['node_modules/**/*'],
      failOnUnused: options?.failOnUnused === true,
      backupOptions: {
        remove: !!options?.backupOptions?.remove,
        dirPath: backupOptions?.dirPath ?? './.backup',
        dirname: backupOptions?.dirname ?? backUpDirname,
        overwrite: backupOptions?.overwrite ?? false,
      },
      globOptions: options?.globOptions || {},
    };
  }

  apply(compiler: ICompiler) {
    compiler.hooks.afterEmit.tapPromise('UnusedFilesWebpackPlugin', (compilation) =>
      applyAfterEmit(compiler, compilation, this.options),
    );
  }
}

async function applyAfterEmit(
  compiler: ICompiler,
  compilation: ICompilation,
  options: IUnusedFilesWebpackPluginOptions,
) {
  const { globOptions: _globOptions, backupOptions, failOnUnused } = options;
  try {
    const globOptions = {
      cwd: compiler.context,
      ..._globOptions,
    };
    // 使用到的文件map
    const fileDepsMap = getFileDepsMap(compiler, compilation);
    // 获取所有文件
    const files = await getIncludeFiles(options);
    const unused = files.filter((it) => !fileDepsMap.has(it));

    const warnPrefix = 'UnusedFilesWebpackPlugin found some unused files';

    if (unused.length === 0) return;
    const { remove, dirPath, dirname, overwrite } = backupOptions;

    if (remove) {
      const backupDir = path.join(globOptions.cwd, dirPath, dirname);
      const promiseAll: Array<Promise<void>> = [];
      unused.forEach((item) => {
        const fileRelativePath = path.dirname(item).replace(globOptions.cwd, '');
        promiseAll.push(
          moveUnusedFileByPath({
            fromPath: item,
            toDirPath: path.join(backupDir, fileRelativePath),
            overwrite,
          }),
        );
      });

      await Promise.all(promiseAll);
      console.log(`${warnPrefix} move to ${backupDir}`);
    } else {
      throw new Error(`
${warnPrefix}:
${unused.join('\n')}`);
    }
  } catch (err) {
    const error = err as IWebpackError;
    if (failOnUnused && compilation.bail) {
      throw error;
    }
    const errorsList = failOnUnused ? compilation.errors : compilation.warnings;
    errorsList.push(error);
  }
}

/**
 * 获取文件依赖关系map
 * @param compiler webpack compiler
 * @param compilation webpack compilation
 * @returns key: 绝对文件路径 value: true
 */
function getFileDepsMap(compiler: ICompiler, compilation: ICompilation) {
  const resMap = Array.from<string>(compilation.fileDependencies).reduce(
    (total: Map<string, boolean>, usedFilePath) => {
      total.set(usedFilePath, true);
      return total;
    },
    new Map(),
  );

  compilation.getAssets().forEach((asset) => {
    const sourceFilename = asset.info?.sourceFilename;
    if (sourceFilename) {
      const sourcePath = path.resolve(compiler.context, sourceFilename);
      resMap.set(sourcePath, true);
    }
  });

  return resMap;
}

/**
 * 获取指定目录下的所有指定文件
 * @param options
 */
function getIncludeFiles(options: IUnusedFilesWebpackPluginOptions) {
  const { include, exclude } = options;
  const fileList = include.concat(exclude.map((item) => `!${item}`));
  return glob.sync(fileList, options.globOptions).map((filePath) => path.resolve(process.cwd(), filePath));
}
