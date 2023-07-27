export function getFreqCat(fr) {
  if (fr < 2) {
    return 'very low';
  } else if (fr < 4) {
    return 'low';
  } else if (fr < 6) {
    return 'high';
  } else return 'very high';
}
