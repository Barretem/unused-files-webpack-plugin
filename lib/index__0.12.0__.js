"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(
  require("babel-runtime/helpers/classCallCheck")
);

var _createClass2 = _interopRequireDefault(
  require("babel-runtime/helpers/createClass")
);

var _regenerator = _interopRequireDefault(require("babel-runtime/regenerator"));

var _promise = _interopRequireDefault(require("babel-runtime/core-js/promise"));

var _asyncToGenerator2 = _interopRequireDefault(
  require("babel-runtime/helpers/asyncToGenerator")
);

var _keys = _interopRequireDefault(
  require("babel-runtime/core-js/object/keys")
);

var _toConsumableArray2 = _interopRequireDefault(
  require("babel-runtime/helpers/toConsumableArray")
);

var _extends2 = _interopRequireDefault(
  require("babel-runtime/helpers/extends")
);

var _path = _interopRequireDefault(require("path"));

var _warning = _interopRequireDefault(require("warning"));

var _globAll = _interopRequireDefault(require("glob-all"));

var _util = _interopRequireDefault(require("util.promisify"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var applyAfterEmit = (function() {
  var _ref = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee(compiler, compilation, plugin) {
      var globOptions,
        fileDepsMap,
        files,
        unused,
        warnPrefix,
        _plugin$options$backu,
        backUpDirPath,
        backUpDirname,
        overwrite,
        backupDir,
        promiseAll,
        i,
        dirName,
        fileName,
        errorsList;

      return _regenerator.default.wrap(
        function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                _context.prev = 0;
                globOptions = globOptionsWith(compiler, plugin.globOptions);
                fileDepsMap = getFileDepsMap(compilation);
                _context.next = 5;
                return globAll(
                  plugin.options.patterns || plugin.options.pattern,
                  globOptions
                );

              case 5:
                files = _context.sent;
                unused = files.filter(function(it) {
                  return !fileDepsMap[_path.default.join(globOptions.cwd, it)];
                });
                warnPrefix = "UnusedFilesWebpackPlugin found some unused files";

                if (!(unused.length !== 0)) {
                  _context.next = 19;
                  break;
                }

                if (!plugin.options.removeToBackup) {
                  _context.next = 18;
                  break;
                }

                (_plugin$options$backu = plugin.options.backupOptions),
                  (backUpDirPath = _plugin$options$backu.backUpDirPath),
                  (backUpDirname = _plugin$options$backu.backUpDirname),
                  (overwrite = _plugin$options$backu.overwrite);
                backupDir = _path.default.join(
                  globOptions.cwd,
                  backUpDirPath,
                  backUpDirname
                );
                promiseAll = [];

                for (i in unused) {
                  dirName = unused[i].slice(0, unused[i].lastIndexOf("/"));
                  fileName = unused[i].slice(unused[i].lastIndexOf("/") + 1);
                  promiseAll.push(
                    moveUnusedFileByPath(
                      _path.default.join(globOptions.cwd, unused[i]),
                      _path.default.join(backupDir, "./".concat(dirName)),
                      fileName,
                      overwrite
                    )
                  );
                }

                _context.next = 16;
                return _promise.default
                  .all(promiseAll)
                  .then(function() {
                    console.log(
                      "".concat(warnPrefix, " move to ").concat(backupDir)
                    );
                  })
                  .catch(function() {
                    throw new Error(
                      "\n          "
                        .concat(warnPrefix, " move failed:\n          ")
                        .concat(unused.join("\n"))
                    );
                  });

              case 16:
                _context.next = 19;
                break;

              case 18:
                throw new Error(
                  "\n".concat(warnPrefix, ":\n").concat(unused.join("\n"))
                );

              case 19:
                _context.next = 27;
                break;

              case 21:
                _context.prev = 21;
                _context.t0 = _context["catch"](0);

                if (!(plugin.options.failOnUnused && compilation.bail)) {
                  _context.next = 25;
                  break;
                }

                throw _context.t0;

              case 25:
                errorsList = plugin.options.failOnUnused
                  ? compilation.errors
                  : compilation.warnings;
                errorsList.push(_context.t0);

              case 27:
              case "end":
                return _context.stop();
            }
          }
        },
        _callee,
        this,
        [[0, 21]]
      );
    })
  );

  return function applyAfterEmit(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})();
/**
 * Gets the current time string
 */

var moveUnusedFileByPath = (function() {
  var _ref2 = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee4(
      sourcePath,
      targetPath,
      fileName,
      overwrite
    ) {
      return _regenerator.default.wrap(
        function _callee4$(_context4) {
          while (1) {
            switch ((_context4.prev = _context4.next)) {
              case 0:
                return _context4.abrupt(
                  "return",
                  new _promise.default(
                    (function() {
                      var _ref3 = (0, _asyncToGenerator2.default)(
                        /*#__PURE__*/
                        _regenerator.default.mark(function _callee3(
                          resolve,
                          reject
                        ) {
                          var saveModule, lastDotIndex, timestamp;
                          return _regenerator.default.wrap(
                            function _callee3$(_context3) {
                              while (1) {
                                switch ((_context3.prev = _context3.next)) {
                                  case 0:
                                    saveModule = (function() {
                                      var _ref4 = (0,
                                      _asyncToGenerator2.default)(
                                        /*#__PURE__*/
                                        _regenerator.default.mark(
                                          function _callee2(
                                            sourcePath,
                                            targetPath
                                          ) {
                                            return _regenerator.default.wrap(
                                              function _callee2$(_context2) {
                                                while (1) {
                                                  switch ((_context2.prev =
                                                    _context2.next)) {
                                                    case 0:
                                                      _context2.prev = 0;
                                                      _context2.next = 3;
                                                      return _fsExtra.default.move(
                                                        sourcePath,
                                                        ""
                                                          .concat(
                                                            targetPath,
                                                            "/"
                                                          )
                                                          .concat(fileName),
                                                        {
                                                          overwrite: overwrite
                                                        }
                                                      );

                                                    case 3:
                                                      resolve();
                                                      _context2.next = 10;
                                                      break;

                                                    case 6:
                                                      _context2.prev = 6;
                                                      _context2.t0 = _context2[
                                                        "catch"
                                                      ](0);
                                                      (0, _warning.default)(
                                                        !_context2.t0,
                                                        _context2.t0
                                                      );
                                                      reject(_context2.t0);

                                                    case 10:
                                                    case "end":
                                                      return _context2.stop();
                                                  }
                                                }
                                              },
                                              _callee2,
                                              this,
                                              [[0, 6]]
                                            );
                                          }
                                        )
                                      );

                                      return function saveModule(_x10, _x11) {
                                        return _ref4.apply(this, arguments);
                                      };
                                    })();

                                    if (
                                      !_fsExtra.default.pathExists(
                                        ""
                                          .concat(targetPath, "/")
                                          .concat(fileName)
                                      )
                                    ) {
                                      _context3.next = 5;
                                      break;
                                    }

                                    if (!overwrite) {
                                      lastDotIndex = fileName.lastIndexOf(".");
                                      timestamp = new Date().getTime();

                                      if (lastDotIndex !== -1) {
                                        fileName = [
                                          fileName.slice(0, lastDotIndex),
                                          "_",
                                          timestamp,
                                          fileName.slice(lastDotIndex)
                                        ].join("");
                                      } else {
                                        fileName = ""
                                          .concat(fileName, "_")
                                          .concat(timestamp);
                                      }
                                    }

                                    _context3.next = 13;
                                    break;

                                  case 5:
                                    _context3.prev = 5;
                                    _context3.next = 8;
                                    return _fsExtra.default.mkdirp(targetPath);

                                  case 8:
                                    _context3.next = 13;
                                    break;

                                  case 10:
                                    _context3.prev = 10;
                                    _context3.t0 = _context3["catch"](5);
                                    throw new Error(
                                      "create "
                                        .concat(
                                          targetPath,
                                          " folder failed:\n          "
                                        )
                                        .concat(_context3.t0, "\n        ")
                                    );

                                  case 13:
                                    _context3.next = 15;
                                    return saveModule(sourcePath, targetPath);

                                  case 15:
                                  case "end":
                                    return _context3.stop();
                                }
                              }
                            },
                            _callee3,
                            this,
                            [[5, 10]]
                          );
                        })
                      );

                      return function(_x8, _x9) {
                        return _ref3.apply(this, arguments);
                      };
                    })()
                  )
                );

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        },
        _callee4,
        this
      );
    })
  );

  return function moveUnusedFileByPath(_x4, _x5, _x6, _x7) {
    return _ref2.apply(this, arguments);
  };
})();

var globAll = (0, _util.default)(_globAll.default);

function globOptionsWith(compiler, globOptions) {
  return (0, _extends2.default)(
    {
      cwd: compiler.context
    },
    globOptions
  );
}

function getFileDepsMap(compilation) {
  var fileDepsBy = []
    .concat((0, _toConsumableArray2.default)(compilation.fileDependencies))
    .reduce(function(acc, usedFilepath) {
      acc[usedFilepath] = true;
      return acc;
    }, {});
  var assets = compilation.assets;
  (0, _keys.default)(assets).forEach(function(assetRelpath) {
    var existsAt = assets[assetRelpath].existsAt;
    fileDepsBy[existsAt] = true;
  });
  return fileDepsBy;
}

function getCurrentTimeStr() {
  var formatterTime = function formatterTime(num) {
    return num < 10 ? "0".concat(num) : num;
  };

  var dateTime = new Date();
  var YY = dateTime.getFullYear();
  var MM = formatterTime(dateTime.getMonth() + 1);
  var DD = formatterTime(dateTime.getDate());
  var hh = formatterTime(dateTime.getHours());
  var mm = formatterTime(dateTime.getMinutes());
  var ss = formatterTime(dateTime.getSeconds());
  return ""
    .concat(YY)
    .concat(MM)
    .concat(DD, "_")
    .concat(hh)
    .concat(mm)
    .concat(ss);
}

var UnusedFilesWebpackPlugin =
  /*#__PURE__*/
  (function() {
    function UnusedFilesWebpackPlugin() {
      var options =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      (0, _classCallCheck2.default)(this, UnusedFilesWebpackPlugin);
      (0, _warning.default)(
        !options.pattern,
        '\n"options.pattern" is deprecated and will be removed in v4.0.0.\nUse "options.patterns" instead, which supports array of patterns and exclude pattern.\nSee https://www.npmjs.com/package/glob-all#notes\n'
      );
      var backUpDirname = getCurrentTimeStr();
      var backupOptions = options.backupOptions || {};
      this.options = (0, _extends2.default)({}, options, {
        patterns: options.patterns || options.pattern || ["**/*.*"],
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
          ignore: "node_modules/**/*"
        },
        options.globOptions
      );
    }

    (0, _createClass2.default)(UnusedFilesWebpackPlugin, [
      {
        key: "apply",
        value: function apply(compiler) {
          var _this = this;

          compiler.plugin("after-emit", function(compilation, done) {
            return applyAfterEmit(compiler, compilation, _this).then(
              done,
              done
            );
          });
        }
      }
    ]);
    return UnusedFilesWebpackPlugin;
  })();

var _default = UnusedFilesWebpackPlugin;
exports.default = _default;
