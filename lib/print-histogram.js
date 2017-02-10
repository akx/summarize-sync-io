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

module.exports = printHistogram;
