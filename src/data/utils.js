import _ from "lodash";

export const interpolate = (o1, o2, d) => {
  return _.mapValues(o1, (v, k) => {
    const diff = o2[k] - o1[k];
    return o1[k] + d * diff;
  });
};

export const parseData = (rawString, fieldName) =>
  rawString
    .split(/\n/)
    .filter(Boolean)
    .map(s =>
      s
        .split(",")
        .map(Number)
        .reduce((o, n, i) => Object.assign(o, { [fieldName[i]]: n }), {})
    );
