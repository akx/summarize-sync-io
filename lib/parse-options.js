function parseOptions(defaults, argv) {
  return argv.reduce((acc, arg) => {
    const m = /^-+(.+?)(=(.+))?$/.exec(arg);
    if (m) {
      const key = m[1].replace(/(.)-(.)/g, (_, a, b) => a + b.toUpperCase());
      acc[key] = m[3] ? ({'true': true, 'false': false}[m[3]] || m[3]) : true;
    }
    return acc;
  }, Object.assign({}, defaults));
}

module.exports = parseOptions;
