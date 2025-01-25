import path from 'path';
import warning from 'warning';
import { glob } from 'glob';
import promisify from 'util.promisify';
import fs from 'fs-extra';
import type { Compiler, Compilation } from 'webpack';
import type { IUnusedFilesWebpackPluginOptions } from './types';
import type { GlobOptionsWithFileTypesFalse } from 'glob';

const getFileDepsList = (compilation: Compilation): string[] => {
  let filePath: string[] = [];
  const { fileDependencies, assets } = compilation;
  fileDependencies.forEach((item) => {
    // 检查该路径是否是文件
    if (fs.statSync(item).isFile()) {
      filePath.push(item);
    }
  });
  return filePath;
};

const getAllFilesPath = async (
  path: string | string[],
  globOptions: GlobOptionsWithFileTypesFalse,
) => {
  const files = await glob(path, globOptions);
  return files;
};

async function applyAfterEmit(
  compiler: Compiler,
  compilation: Compilation,
  options: IUnusedFilesWebpackPluginOptions,
) {
  try {
    const globOptions = {
      cwd: compiler.context,
      ignore: options.ignores,
    };
    // 获取文件夹中所有的文件
    const files = await getAllFilesPath(options.patterns, globOptions);
    console.log(
      '%c [ files ]-34',
      'font-size:13px; background:pink; color:#bf2c9f;',
      files,
    );
    // 获取打包中引用到的文件
    const fileDeps = getFileDepsList(compilation);
    const unused = files.filter(
      (item) => !fileDeps.includes(path.join(globOptions.cwd, item)),
    );
    const warnPrefix = 'UnusedFilesWebpackPlugin found some unused files';

    if (unused.length !== 0) {
      if (options.removeToBackup) {
        const { backUpDirPath, backUpDirname, overwrite } =
          options.backupOptions;
        const backupDir = path.join(
          globOptions.cwd,
          backUpDirPath,
          backUpDirname,
        );
        const promiseAll = [];
        for (const i in unused) {
          const dirName = unused[i].slice(0, unused[i].lastIndexOf('/'));
          const fileName = unused[i].slice(unused[i].lastIndexOf('/') + 1);
          promiseAll.push(
            moveUnusedFileByPath(
              path.join(globOptions.cwd, unused[i]),
              path.join(backupDir, `./${dirName}`),
              fileName,
              overwrite,
            ),
          );
        }

        await Promise.all(promiseAll)
          .then(() => {
            console.log(`${warnPrefix} move to ${backupDir}`);
          })
          .catch(() => {
            throw new Error(`
${warnPrefix} move failed:
${unused.join(`\n`)}`);
});
      } else {
        throw new Error(`
${warnPrefix}:
${unused.join(`\n`)}`);
      }
    }
  } catch (error) {}
}

class UnusedFilesWebpackPlugin {
  private readonly options: IUnusedFilesWebpackPluginOptions;
  constructor(options: Partial<IUnusedFilesWebpackPluginOptions>) {
    this.options = {
      ...options,
      patterns: options?.patterns || [`**/*.*`],
      ignores: options?.ignores || [],
    };
  }

  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tapPromise(
      `UnusedFilesWebpackPlugin`,
      (compilation) => applyAfterEmit(compiler, compilation, this.options),
    );
  }
}

export default UnusedFilesWebpackPlugin;
