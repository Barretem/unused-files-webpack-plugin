import type * as FastGlob from 'fast-glob';
import type { Compiler, Compilation, WebpackError } from 'webpack';

export interface IUnusedFilesWebpackPluginOptions {
  /** 需要分析是否有无用依赖的文件夹路径或文件夹路径数组 */
  include: string[];
  /** 需要忽略的文件路径或文件路径数组 */
  exclude: string[];
  /** 如果有不可用的文件，会直接终止构建 */
  failOnUnused: boolean;
  /** 备份配置 */
  backupOptions: {
    /** 是否将无用文件移动到备份文件夹, 默认为false */
    remove: boolean;
    /** 备份文件夹路径 */
    dirPath: string;
    /** 备份文件夹名，默认以时间戳命名 */
    dirname: string;
    /** 是否覆盖原有的备份文件，如果不覆盖，而且文件夹中已经有改文件，那么会在文件名后加上相应的时间戳. 默认为false */
    overwrite: boolean;
  };
  globOptions: IGlobOptions;
}

export type ICompiler = Compiler;

export type ICompilation = Compilation;

export type IGlobOptions = FastGlob.Options;

export type IWebpackError = WebpackError;

export interface IMoveUnusedFileByPathParams {
  /** 源文件地址 */
  fromPath: string;
  /** 目标文件地址 */
  toDirPath: string;
  /** 是否覆盖 */
  overwrite: boolean;
};

