# remove-unused-files-webpack-plugin

This plugin only supports webpack versions above 4.

> fork from unused-files-webpack-plugin。The main extension is to remove unused files.

[![Version][npm-image]][npm-url]

Install with npm:

```bash
npm i --save-dev @barretter/remove-unused-files-webpack-plugin
```

Install with yarn:

```bash
yarn add --dev @barretter/remove-unused-files-webpack-plugin
```

## Usage

### `webpack.config.babel.js`

```js
import RemoveUnusedFilesWebpackPlugin from "@barretter/remove-unused-files-webpack-plugin";

export default {
  plugins: [
    new RemoveUnusedFilesWebpackPlugin(options),
  ],
};
```

### `webpack.config.js`

```js
const RemoveUnusedFilesWebpackPlugin = require("@barretter/remove-unused-files-webpack-plugin").default;

module.exports = {
  plugins: [
    new RemoveUnusedFilesWebpackPlugin(options),
  ],
};
```


## Options

```js
new RemoveUnusedFilesWebpackPlugin(options)
```

### options.include

The (array of) pattern(s) to glob all files within the context.

* Default: `["src/**/*.*"]`
* Directly pass to [`fast-glob(patterns)`](https://github.com/mrmlnc/fast-glob#patterns-1)


### options.exclude

Ignore pattern for glob. Can be a String or an Array of String.

* Default: `"node_modules/**/*"`
* Pass to: [`fast-glob(ignore)`](https://github.com/mrmlnc/fast-glob#ignore)

### options.failOnUnused

Emit _error_ instead of _warning_ in webpack compilation result.

* Default: `false`
* Explicitly set it to `true` to enable this feature

### options.globOptions

The options object pass to second parameter of `fast-glob`.

* Default: `{ignore: "node_modules/**/*"}`
* Directly pass to [`fast-glob(pattern, globOptions)`](https://github.com/mrmlnc/fast-glob#api), which then pass to [`glob(…, globOptions)`](https://github.com/mrmlnc/fast-glob#options-3)

#### globOptions.cwd

Current working directory for glob. If you don't set explicitly, it defaults to the `context` specified by your webpack compiler at runtime.

* Default: `webpackCompiler.context`
* Pass to: [`fast-glob(options.cwd)`](https://github.com/mrmlnc/fast-glob#cwd)
* See also: [`context` in webpack](https://webpack.js.org/configuration/entry-context/#context)

#### backupOptions.remove

Whether to move unused files to the backup folder. Use this feature with caution.

* Default: `false`
* Explicitly set it to `true` to enable this feature

#### backupOptions.dirPath

Backup folder Path.

* Default: `./.backup`
* Only removeToBackup configuration to be `true`, This configuration item is valid.

#### backupOptions.dirname

Backup folder name.

* Default: `The time when you run this plugin`
* Only removeToBackup configuration to be `true`, This configuration item is valid.

#### backupOptions.overwrite

Whether to overwrite older files when the backup folder exit the same file

* Default: `false`
* Explicitly set it to `true` to enable this feature
* Only removeToBackup configuration to be `true`, This configuration item is valid.

## v3 to v4

1. @barretter/remove-unused-files-webpack-plugin@^4.0.0 only support webpack 4+;
2. This plugin api change from v3 to v4
    - options.patterns -> options.include
    - globOptions.ignore -> options.exclude
    - The value of `options.globOptions` has been changed from `glob-all` to `fast-glob`.
    - options.removeToBackup -> backupOptions.remove
    - backupOptions.backUpDirPath -> backupOptions.dirPath
    - backupOptions.backUpDirname -> backupOptions.dirname

## Contributing

[![devDependency Status][david-dm-image]][david-dm-url]

1. Fork it
2. Create your feature branch (`git checkout -b feature/my-new-feature`)
3. Commit your changes (`git commit -am 'feat: Add some feature'`)
4. Push to the branch (`git push origin feature/my-new-feature`)
5. Create new Pull Request


[npm-image]: https://img.shields.io/npm/v/@barretter/remove-unused-files-webpack-plugin.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@barretter/remove-unused-files-webpack-plugin
