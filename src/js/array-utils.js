/**
 * return a filtered array by a key
 * @param {string} key
 * @param {Array<object>} array
 */
export function filterBy(key, array) {
  const track = new Set();

  const filteredArray = [];
  for (const obj of array) {
    if (track.has(obj[key])) continue;

    track.add(obj[key]);
    filteredArray.push(obj);
  }

  return filteredArray;
}
