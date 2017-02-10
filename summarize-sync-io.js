const readline = require('readline');

function parse(stream) {
  const rl = readline.createInterface({input: stream});
  return new Promise((resolve) => {
    const entries = [];
    let currentEntry;
    rl.on('line', (line) => {
      if (/WARNING: Detected use of sync API$/.test(line)) {
        entries.push(currentEntry = []);
        return;
      }

      if (currentEntry) {
        const funcMatch = /^\s+at (.+?) \((.+?):(\d+):(\d+)\)/.exec(line);
        if (funcMatch) {
          const [_, fn, file, row, col] = funcMatch;
          currentEntry.push({fn, file, row, col});
          return;
        }
        const moduleMatch = /^\s+at (.+?):(\d+):(\d+)/.exec(line);
        if (moduleMatch) {
          const [_, file, row, col] = moduleMatch;
          currentEntry.push({fn: null, file, row, col});
          return;
        }
        currentEntry = null;
      }
    });
    rl.on('close', () => {
      resolve(entries);
    });
  });
}

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

function count(map, key, value = 1) {
  map[key] = (map[key] || 0) + value;
}

function padLeft(str, width, filler = ' ') {
  if (str.length >= width || width <= 0) return str;
  return (filler.repeat(width - str.length)) + str;
}

function printHistogram(map) {
  const maxVal = Math.max.apply(null, Object.values(map));
  const barWidth = 15;
  Object.entries(map).sort((a, b) => b[1] - a[1]).forEach(([key, val]) => {
    const barLen = Math.round(barWidth * (val / maxVal));
    const bar = new Array(barWidth).fill('.').map((v, i) => (i <= barLen ? '#' : v)).join('');
    console.log(bar, padLeft(`${val}`, 10), key);
  });
}


function summarize(entries) {
  entries = excludeModuleLoads(entries);
  entries = excludeCloses(entries);
  entries = excludeWrites(entries);
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
