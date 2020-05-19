const raw = `
30° 105–104 0.321 –0.388 1.450 0.519 0.372 –0.123 7.00 0.500
104–103 0.321 –0.388 0.486 –0.152
103–102 0.593 –0.477 4.570 –0.476
102–10 1.360 –0.657 45.100 –0.973
<10 1.400 –0.667 48.000 –1.000
45° 105–104 0.370 –0.396 1.930 0.500 0.303 –0.126 6.59 0.520
104–103 0.370 –0.396 0.333 –0.136
103–102 0.730 –0.500 3.500 –0.476
102–10 0.498 –0.656 26.200 –0.913
<10 1.550 –0.667 32.00 –1.000
90° 105–104 0.370 –0.395 1.187 0.370 0.391 –0.148 6.30 0.378
104–103 0.107 –0.266 0.0815 +0.022
103–102 0.408 –0.460 6.0900 –0.602
102–10 0.900 –0.631 32.1000 –0.963
<10 0.970 –0.667 35.0000 –1.000
`
const nanData = {
  a1: NaN,
  a2: NaN,
  a3: NaN,
  a4: NaN,
  b1: NaN,
  b2: NaN,
  b3: NaN,
  b4: NaN,
}
const parsedData = raw
  .replace(/–/g, '-')
  .split(/\s?(?=\d\d°)/g)
  .filter(Boolean)
  .map(subt => {
    const rows = subt
      .split('\n')
      .filter(Boolean)
      .map(r =>
        r
          .split(' ')
          .filter(Boolean)
          .map(w =>
            w.endsWith('°')
              ? Number(w.match(/(\d+)/)[1])
              : w.match(/\d+-\d+/)
              ? Number(w.match(/(\d)-/)[1])
              : w.match(/<10/)
              ? 1
              : Number(w),
          ),
      )
    return rows
  })
export const getRow = (angle, reynold) => {
  const aTable = parsedData.find(t => t[0][0] === angle)
  if (!aTable) return nanData
  const bRow = aTable.find((row, i) => {
    const pow = i === 0 ? row[1] : row[0]
    return reynold > Math.pow(10, pow - 1)
  })
  if (!bRow) return nanData
  const firstRow = aTable[0]
  return Object.assign(
    { a3: firstRow[4], a4: firstRow[5], b3: firstRow[8], b4: firstRow[9] },
    firstRow === bRow
      ? {
          a1: firstRow[2],
          a2: firstRow[3],
          b1: firstRow[6],
          b2: firstRow[7],
        }
      : {
          a1: bRow[1],
          a2: bRow[2],
          b1: bRow[3],
          b2: bRow[4],
        },
  )
}
export default getRow
