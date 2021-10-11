"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promise = _interopRequireDefault(require("babel-runtime/core-js/promise"));

var _asyncToGenerator2 = _interopRequireDefault(
  require("babel-runtime/helpers/asyncToGenerator")
);

var _keys = _interopRequireDefault(
  require("babel-runtime/core-js/object/keys")
);

var _extends2 = _interopRequireDefault(
  require("babel-runtime/helpers/extends")
);

var _path = _interopRequireDefault(require("path"));

var _warning = _interopRequireDefault(require("warning"));

var _globAll = _interopRequireDefault(require("glob-all"));

var _util = _interopRequireDefault(require("util.promisify"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

let applyAfterEmit = (() => {
  var _ref = (0, _asyncToGenerator2.default)(function*(
    compiler,
    compilation,
    plugin
  ) {
    try {
      const globOptions = globOptionsWith(compiler, plugin.globOptions);
      const fileDepsMap = getFileDepsMap(compilation);
      const files = yield globAll(
        plugin.options.patterns || plugin.options.pattern,
        globOptions
      );
      const unused = files.filter(
        it => !fileDepsMap[_path.default.join(globOptions.cwd, it)]
      );
      const warnPrefix = "UnusedFilesWebpackPlugin found some unused files";

      if (unused.length !== 0) {
        if (plugin.options.removeToBackup) {
          const _plugin$options$backu = plugin.options.backupOptions,
            backUpDirPath = _plugin$options$backu.backUpDirPath,
            backUpDirname = _plugin$options$backu.backUpDirname,
            overwrite = _plugin$options$backu.overwrite;

          const backupDir = _path.default.join(
            globOptions.cwd,
            backUpDirPath,
            backUpDirname
          );

          const promiseAll = [];

          for (const i in unused) {
            const dirName = unused[i].slice(0, unused[i].lastIndexOf("/"));
            const fileName = unused[i].slice(unused[i].lastIndexOf("/") + 1);
            promiseAll.push(
              moveUnusedFileByPath(
                _path.default.join(globOptions.cwd, unused[i]),
                _path.default.join(backupDir, `./${dirName}`),
                fileName,
                overwrite
              )
            );
          }

          yield _promise.default
            .all(promiseAll)
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
  });

  return function applyAfterEmit(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})();
/**
 * Gets the current time string
 */

let moveUnusedFileByPath = (() => {
  var _ref2 = (0, _asyncToGenerator2.default)(function*(
    sourcePath,
    targetPath,
    fileName,
    overwrite
  ) {
    return new _promise.default(
      (() => {
        var _ref3 = (0, _asyncToGenerator2.default)(function*(resolve, reject) {
          const saveModule = (() => {
            var _ref4 = (0, _asyncToGenerator2.default)(function*(
              sourcePath,
              targetPath
            ) {
              try {
                yield _fsExtra.default.move(
                  sourcePath,
                  `${targetPath}/${fileName}`,
                  {
                    overwrite
                  }
                );
                resolve();
              } catch (err) {
                (0, _warning.default)(!err, err);
                reject(err);
              }
            });

            return function saveModule(_x10, _x11) {
              return _ref4.apply(this, arguments);
            };
          })();

          if (_fsExtra.default.pathExists(`${targetPath}/${fileName}`)) {
            if (!overwrite) {
              const lastDotIndex = fileName.lastIndexOf(".");
              let timestamp = new Date().getTime();

              if (lastDotIndex !== -1) {
                fileName = [
                  fileName.slice(0, lastDotIndex),
                  "_",
                  timestamp,
                  fileName.slice(lastDotIndex)
                ].join("");
              } else {
                fileName = `${fileName}_${timestamp}`;
              }
            }
          } else {
            try {
              yield _fsExtra.default.mkdirp(targetPath);
            } catch (err) {
              throw new Error(`create ${targetPath} folder failed:
          ${err}
        `);
            }
          }

          yield saveModule(sourcePath, targetPath);
        });

        return function(_x8, _x9) {
          return _ref3.apply(this, arguments);
        };
      })()
    );
  });

  return function moveUnusedFileByPath(_x4, _x5, _x6, _x7) {
    return _ref2.apply(this, arguments);
  };
})();

const globAll = (0, _util.default)(_globAll.default);

function globOptionsWith(compiler, globOptions) {
  return (0, _extends2.default)(
    {
      cwd: compiler.context
    },
    globOptions
  );
}

function getFileDepsMap(compilation) {
  const fileDepsBy = [...compilation.fileDependencies].reduce(
    (acc, usedFilepath) => {
      acc[usedFilepath] = true;
      return acc;
    },
    {}
  );
  const assets = compilation.assets;
  (0, _keys.default)(assets).forEach(assetRelpath => {
    const existsAt = assets[assetRelpath].existsAt;
    fileDepsBy[existsAt] = true;
  });
  return fileDepsBy;
}

function getCurrentTimeStr() {
  const formatterTime = num => {
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
}

class UnusedFilesWebpackPlugin {
  constructor(options = {}) {
    (0, _warning.default)(
      !options.pattern,
      `
"options.pattern" is deprecated and will be removed in v4.0.0.
Use "options.patterns" instead, which supports array of patterns and exclude pattern.
See https://www.npmjs.com/package/glob-all#notes
`
    );
    const backUpDirname = getCurrentTimeStr();
    const backupOptions = options.backupOptions || {};
    this.options = (0, _extends2.default)({}, options, {
      patterns: options.patterns || options.pattern || [`**/*.*`],
      failOnUnused: options.failOnUnused === true,
      removeToBackup: !!options.removeToBackup,
      backupOptions: {
        backUpDirPath: backupOptions.backUpDirPath || "./.backup",
        backUpDirname: backupOptions.backUpDirname || backUpDirname,
        overwrite: backupOptions.overwrite || false
      }
    });
    this.globOptions = (0, _extends2.default)(
      {
        ignore: `node_modules/**/*`
      },
      options.globOptions
    );
  }

  apply(compiler) {
    compiler.plugin(`after-emit`, (compilation, done) =>
      applyAfterEmit(compiler, compilation, this).then(done, done)
    );
  }
}

var _default = UnusedFilesWebpackPlugin;
exports.default = _default;
