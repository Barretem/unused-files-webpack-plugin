import path from "path";
import warning from "warning";
import nativeGlobAll from "glob-all";
import promisify from "util.promisify";
import fs from "fs-extra"

const globAll = promisify(nativeGlobAll);

function globOptionsWith(compiler, globOptions) {
  return {
    cwd: compiler.context,
    ...globOptions
  };
}

function getFileDepsMap(compilation) {
  const fileDepsBy = [...compilation.fileDependencies].reduce(
    (acc, usedFilepath) => {
      acc[usedFilepath] = true;
      return acc;
    },
    {}
  );

  const { assets } = compilation;
  Object.keys(assets).forEach(assetRelpath => {
    const existsAt = assets[assetRelpath].existsAt;
    fileDepsBy[existsAt] = true;
  });
  return fileDepsBy;
}

async function applyAfterEmit(compiler, compilation, plugin) {
  try {
    const globOptions = globOptionsWith(compiler, plugin.globOptions);
    const fileDepsMap = getFileDepsMap(compilation);

    const files = await globAll(
      plugin.options.patterns || plugin.options.pattern,
      globOptions
    );
    const unused = files.filter(
      it => !fileDepsMap[path.join(globOptions.cwd, it)]
    );

    const warnPrefix = 'UnusedFilesWebpackPlugin found some unused files';

    if (unused.length !== 0) {

      if (plugin.options.removeToBackup) {
        const { backUpDirPath, backUpDirname, overwrite } = plugin.options.backupOptions;
        const backupDir = path.join(
          globOptions.cwd,
          backUpDirPath,
          backUpDirname
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
  } catch (error) {
    if (plugin.options.failOnUnused && compilation.bail) {
      throw error;
    }
    const errorsList = plugin.options.failOnUnused
      ? compilation.errors
      : compilation.warnings;
    errorsList.push(error);
  }
}

/**
 * Gets the current time string
 */
function getCurrentTimeStr() {
  const formatterTime = (num) => {
    return num < 10 ? `0${num}` : num;
  };
  const dateTime = new Date();
  const YY = dateTime.getFullYear();
  const MM = formatterTime(dateTime.getMonth() + 1);
  const DD = formatterTime(dateTime.getDate());
  const hh = formatterTime(dateTime.getHours());
  const mm = formatterTime(dateTime.getMinutes());
  const ss = formatterTime(dateTime.getSeconds());
  return `${YY}${MM}${DD}_${hh}${mm}${ss}`
}

async function moveUnusedFileByPath(sourcePath, targetPath, fileName, overwrite) {
  return new Promise(async (resolve, reject) => {

    const saveModule = async (sourcePath, targetPath) => {
      try {
        await fs.move(sourcePath, `${targetPath}/${fileName}`, { overwrite });
        resolve()
      } catch(err) {
        warning(!err, err)
        reject(err);
      }
    };
    if (fs.pathExists(`${targetPath}/${fileName}`)) {
      if (!overwrite) {
        const lastDotIndex = fileName.lastIndexOf('.')
        let timestamp = new Date().getTime()
        if (lastDotIndex !== -1) {
          fileName = [fileName.slice(0, lastDotIndex), '_', timestamp, fileName.slice(lastDotIndex)].join('')
        } else {
          fileName = `${fileName}_${timestamp}`
        }
      }
    } else {
      try {
        await fs.mkdirp(targetPath);
      } catch(err) {
        throw new Error(`create ${targetPath} folder failed:
          ${err}
        `);
      }
    }
    await saveModule(sourcePath, targetPath);
  });
}

class UnusedFilesWebpackPlugin {
  constructor(options = {}) {
    warning(
      !options.pattern,
      `
"options.pattern" is deprecated and will be removed in v4.0.0.
Use "options.patterns" instead, which supports array of patterns and exclude pattern.
See https://www.npmjs.com/package/glob-all#notes
`
    );
    const backUpDirname = getCurrentTimeStr()
    const backupOptions = options.backupOptions || {}
    this.options = {
      ...options,
      patterns: options.patterns || options.pattern || [`**/*.*`],
      failOnUnused: options.failOnUnused === true,
      removeToBackup: !!options.removeToBackup,
      backupOptions: {
        backUpDirPath: backupOptions.backUpDirPath || './.backup',
        backUpDirname: backupOptions.backUpDirname || backUpDirname,
        overwrite: backupOptions.overwrite || false,
      }
    };

    this.globOptions = {
      ignore: `node_modules/**/*`,
      ...options.globOptions
    };
  }

  apply(compiler) {
    compiler.plugin(`after-emit`, (compilation, done) =>
      applyAfterEmit(compiler, compilation, this).then(done, done)
    );
  }
}

export default UnusedFilesWebpackPlugin;
