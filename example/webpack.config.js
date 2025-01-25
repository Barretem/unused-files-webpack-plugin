const path = require('path');
const UnusedFilesWebpackPlugin = require('..').default;

module.exports = {
  entry:  path.resolve(__dirname, './src/index.js'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new UnusedFilesWebpackPlugin({
      patterns: ['example/src/**/*.*'],
      ignores: ['**/node_modules/**/*.*'],
      failOnUnused: true,
      removeToBackup: true,
      backupOptions: {
        backUpDirPath: 'backup',
        backUpDirname: 'unused',
        overwrite: true,
      },
    }),
  ],
};