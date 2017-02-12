const excludes = require('./excludes');

module.exports = function filter(options, entries) {
  Object.entries(excludes).forEach(([name, fn]) => {
    if (!options[name]) entries = fn(entries);
  });

  if (options.match) {
    const matchRe = new RegExp(options.match);
    entries = entries.filter((stack) => stack.some((frame) => matchRe.test(frame.file)));
  }
  return entries;
};
