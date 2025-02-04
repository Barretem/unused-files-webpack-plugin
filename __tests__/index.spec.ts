import { expect, describe, it } from 'vitest'
import path from "path";
import MemoryFS from "memory-fs";
import webpack from "webpack";
import UnusedFilesWebpackPlugin from "../src/index";

const EXPECTED_FILENAME_LIST = [
  `CHANGELOG.md`,
  `README.md`,
  `__tests__/index.spec.js`,
  `package.json`
];

describe(`UnusedFilesWebpackPlugin module`, () => {
  it(
    `should work as expected`,
    async () => {
      const compiler = webpack({
        context: path.resolve(__dirname, `../`),
        entry: {
          UnusedFilesWebpackPlugin: path.resolve(__dirname, `../src/index.ts`)
        },
        output: {
          path: __dirname // It will be in MemoryFS :)
        },
        plugins: [new UnusedFilesWebpackPlugin()]
      });
      compiler.outputFileSystem = new MemoryFS();
      await new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
          expect(err).toBeFalsy();

          const { warnings } = stats.compilation;
          expect(warnings).toHaveLength(1);

          const [unusedFilesError] = warnings;
          expect(unusedFilesError).toBeInstanceOf(Error);

          const { message } = unusedFilesError;
          console.log('%c [ message ]-40', 'font-size:13px; background:pink; color:#bf2c9f;', message)
          const containsExpected = EXPECTED_FILENAME_LIST.every(filename =>
            message.match(filename)
          );
          expect(containsExpected).toBeTruthy();
        });
      })
    },
    10000
  );

  describe(`deprecated options.pattern`, () => {
    it(
      `should work as expected`,
      done => {
        const compiler = webpack({
          context: path.resolve(__dirname, `../../`),
          entry: {
            UnusedFilesWebpackPlugin: path.resolve(__dirname, `../index.js`)
          },
          output: {
            path: __dirname
          },
          plugins: [
            new UnusedFilesWebpackPlugin({
              include: ["src/**/*.*"]
            })
          ]
        });
        compiler.outputFileSystem = new MemoryFS();

        compiler.run((err, stats) => {
          expect(err).toBeFalsy();

          const { warnings } = stats.compilation;
          expect(warnings).toHaveLength(1);

          const [unusedFilesError] = warnings;
          expect(unusedFilesError).toBeInstanceOf(Error);

          const { message } = unusedFilesError;
          expect(message).toMatchSnapshot();

          done();
        });
      },
      10000
    );
  });

  describe(`options.include`, () => {
    it(
      `should work as expected for a single pattern`,
      done => {
        const compiler = webpack({
          context: path.resolve(__dirname, `../../`),
          entry: {
            UnusedFilesWebpackPlugin: path.resolve(__dirname, `../index.js`)
          },
          output: {
            path: __dirname
          },
          plugins: [
            new UnusedFilesWebpackPlugin({
              include: ["src/**/*.*"]
            })
          ]
        });
        compiler.outputFileSystem = new MemoryFS();

        compiler.run((err, stats) => {
          expect(err).toBeFalsy();

          const { warnings } = stats.compilation;
          expect(warnings).toHaveLength(1);

          const [unusedFilesError] = warnings;
          expect(unusedFilesError).toBeInstanceOf(Error);

          const { message } = unusedFilesError;
          expect(message).toMatchSnapshot();

          done();
        });
      },
      10000
    );

    it(
      `should work as expected for an array of patterns`,
      done => {
        const compiler = webpack({
          context: path.resolve(__dirname, `../../`),
          entry: {
            UnusedFilesWebpackPlugin: path.resolve(__dirname, `../index.js`)
          },
          output: {
            path: __dirname
          },
          plugins: [
            new UnusedFilesWebpackPlugin({
              include: ["src/**/*.*", "!**/__snapshots__/**/*.*"]
            })
          ]
        });
        compiler.outputFileSystem = new MemoryFS();

        compiler.run((err, stats) => {
          expect(err).toBeFalsy();

          const { warnings } = stats.compilation;
          expect(warnings).toHaveLength(1);

          const [unusedFilesError] = warnings;
          expect(unusedFilesError).toBeInstanceOf(Error);

          const { message } = unusedFilesError;
          expect(message).toMatchSnapshot();

          done();
        });
      },
      10000
    );
  });
});
