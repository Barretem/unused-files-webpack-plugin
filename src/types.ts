import type { Glob } from "glob";

export interface IUnusedFilesWebpackPluginOptions {
  /** 需要分析是否有无用依赖的文件夹路径或文件夹路径数组 */
  patterns: string | string[];
  /** 需要忽略的文件路径或文件路径数组 */
  ignores: string | string[];
  failOnUnused?: boolean;
  removeToBackup?: boolean;
  backupOptions?: {
    backUpDirPath?: string;
    backUpDirname?: string;
    overwrite?: boolean;
  };
}

export type IGlobOptions = Glob<{
  cwd?: string;
  ignore: string | string[];
}>;