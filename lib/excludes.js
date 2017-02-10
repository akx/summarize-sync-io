function excludeModuleLoads(entries) {
  // filter out boring module loads
  return entries.filter((stack) => {
    return !stack.some((frame) => frame.fn === 'Module.require' || frame.file === 'internal/module.js');
  });
}

function excludeCloses(entries) {
  // filter out closes
  return entries.filter((stack) => stack[0].fn !== 'fs.closeSync');
}

function excludeWrites(entries) {
  // filter out synchronous writes (usually there for a reason)
  return entries.filter((stack) => !(/^fs\.write/.test(stack[0].fn)));
}

module.exports = {
  moduleLoads: excludeModuleLoads,
  closes: excludeCloses,
  writes: excludeWrites,
};
