const filter = require('./lib/filter');
const parse = require('./lib/parse');
const printHistogram = require('./lib/print-histogram');
const parseOptions = require('./lib/parse-options');

function count(map, key, value = 1) {
  map[key] = (map[key] || 0) + value;
}

function simplifyPath(path) {
  const bits = path.split('node_modules/');
  return bits[bits.length - 1];
}

function summarize(options, entries) {
  const callsByImmediateCaller = {};
  entries.forEach((stack) => {
    const syncFn = stack[0].fn;
    const firstUserFrame = stack.filter((frame) => frame.file.indexOf('/') > -1)[0];
    if (!firstUserFrame) return;
    const path = (options.simplifyPaths ? simplifyPath(firstUserFrame.file) : firstUserFrame.file);
    const caller = `${path}:${firstUserFrame.fn}`;
    count(callsByImmediateCaller, `${syncFn} by ${caller}`);
  });
  printHistogram(callsByImmediateCaller);
}

const defaults = {
  moduleLoads: false,
  closes: false,
  writes: false,
  match: null,
  simplifyPaths: true,
};

const options = parseOptions(defaults, process.argv);
if (options.all) {
  Object.keys(options).forEach((key) => {
    if (options[key] === false) options[key] = true;
  })
}
parse(process.stdin)
  .then((entries) => filter(options, entries))
  .then((entries) => summarize(options, entries));
