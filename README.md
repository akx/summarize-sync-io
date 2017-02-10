# summarize-sync-io

A tool for easier analysis of Node.js synchronous IO tracebacks.

[Node's `--trace-sync-io` flag](https://github.com/nodejs/node/pull/1707)
makes it output tracebacks to stderr when synchronous IO occurs.

However, the traceback spam isn't that easy to read, so that's where
this tool comes in.

## Usage

```shell
$ node --trace-sync-io slow_script.js 2>trace.txt
$ node summarize-sync-io.js < trace.txt
```