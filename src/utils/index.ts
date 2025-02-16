/**
 * 获取当前时间字符串
 * @returns 当前时间字符串
 */
import * as fs from 'fs-extra';
import * as path from 'path';
import type { IMoveUnusedFileByPathParams } from '../types';

/**
 * 获取当前时间字符串
 * @returns 当前时间字符串
 */
export const getCurrentTimeStr = () => {
  const formatterTime = (num: number) => {
    return num < 10 ? `0${num}` : num;
  };
  const dateTime = new Date();
  const YY = dateTime.getFullYear();
  const MM = formatterTime(dateTime.getMonth() + 1);
  const DD = formatterTime(dateTime.getDate());
  const hh = formatterTime(dateTime.getHours());
  const mm = formatterTime(dateTime.getMinutes());
  const ss = formatterTime(dateTime.getSeconds());
  return `${YY}${MM}${DD}_${hh}${mm}${ss}`;
};

/**
 * 将无用文件移动到备份文件夹
 * @param param.fromPath 无用文件路径
 * @param param.toDirPath 备份文件夹路径
 * @param param.overwrite 是否覆盖
 */
export const moveUnusedFileByPath = async ({
  fromPath,
  toDirPath,
  overwrite,
}: IMoveUnusedFileByPathParams): Promise<void> => {
  const extName = path.extname(fromPath);
  const fileName = path.basename(fromPath, extName);
  let fileNameWithExt = fileName + extName;
  if (fs.pathExistsSync(`${toDirPath}/${fileNameWithExt}`)) {
    if (!overwrite) {
      const timestamp = new Date().getTime();
      fileNameWithExt = `${fileName}_${timestamp}${extName}`;
    }
  }
  await fs.move(fromPath, `${toDirPath}/${fileNameWithExt}`, { overwrite });
};
