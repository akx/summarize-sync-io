const excludes = require('./lib/excludes');
const parse = require('./lib/parse');
const printHistogram = require('./lib/print-histogram');

function count(map, key, value = 1) {
  map[key] = (map[key] || 0) + value;
}

function summarize(entries) {
  Object.entries(excludes).forEach(([name, fn]) => {
    entries = fn(entries);
  });
  const callsByImmediateCaller = {};
  entries.forEach((stack) => {
    const syncFn = stack[0].fn;
    const firstUserFrame = stack.filter((frame) => frame.file.indexOf('/') > -1)[0];
    if (!firstUserFrame) return;
    const caller = `${firstUserFrame.file}:${firstUserFrame.fn}`;
    count(callsByImmediateCaller, `${syncFn} by ${caller}`);
  });
  printHistogram(callsByImmediateCaller);
}

parse(process.stdin).then(summarize);
