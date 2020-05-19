const fieldName = [
  "outerDiameter",
  "pitchLength",
  "tubeLayout",
  "Pp",
  "Pn"
];
const inchField = new Set(["Pp", "Pn"]);
const symbolAngle = {
  "◊": 30,
  "": 45,
  "": 90
};
const raw = `
5/8 = 0.625 13/16 = 0.812 →  0.704 0.406
3/4 = 0.750 15/16 = 0.938 →  0.814 0.469
3/4 = 0.750 1.000 →  1.000 1.000
3/4 = 0.750 1.000 → ◊ 0.707 0.707
3/4 = 0.750 1.000 →  0.866 0.500
1 1 1/4 = 1.250 →  1.250 1.250
1 1 1/4 = 1.250 → ◊ 0.884 0.884
1 1 1/4 = 1.250 →  1.082 0.625
`;
const parsedData = raw
  .replace(/→ (.)/g, (m, p1) => "" + symbolAngle[p1])
  .replace(/ = \d+(\.\d+)/g, "")
  .replace(/(\s\d )?(\d+)\/(\d+)/gm, (m, p1, p2, p3) => {
  const n = [p1, p2, p3].map(Number);
  return " " + ((n[0] || 0) + n[1] / n[2]);
})
  .split("\n")
  .filter(Boolean)
  .map(rawrow => rawrow
  .split(" ")
  .filter(Boolean)
  .map(Number)
  .reduce((acc, col, i) => {
  if (inchField.has(fieldName[i]))
      acc[fieldName[i]] = col * 0.0254;
  else
      acc[fieldName[i]] = col;
  return acc;
}, {}));
export const data = parsedData;
export const getData = (param) => {
  const filterLayout = parsedData.filter(o => param.tubeLayout === o.tubeLayout);
  if (!filterLayout.length)
      throw new Error("unsupport-tube-data");
  const scored = filterLayout
      .map(o => [
      Math.abs(o.outerDiameter - param.tubeOuterDiameter) +
          Math.abs(param.pitchLength - o.pitchLength),
      o
  ])
      .sort((a, b) => a[0] - b[0]);
  return scored[0][1];
};
export default getData;