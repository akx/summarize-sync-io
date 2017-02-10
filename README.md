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

## Command line parameters

### Excluded stacks

By default, writes, `require`s and `close`s are filtered out.

To not filter them, use the `--writes`/`--module-loads`/`--closes` parameters, respectively.

You can also use `--all` to exclude all of those filters from being used.

### Module matching

Add `--match=my-module` to filter the result to stacks that have at least one entry
from a module whose path contains `my-module`.
