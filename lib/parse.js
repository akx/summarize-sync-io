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

module.exports = parse;
