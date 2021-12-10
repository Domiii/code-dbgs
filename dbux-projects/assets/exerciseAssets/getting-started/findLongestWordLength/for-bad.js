const runTest = require('../runTests');
const tests = require('./tests');

/**
 * @see https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/basic-algorithm-scripting/find-the-longest-word-in-a-string
 */
function findLongestWordLength(str) {
  const words = str.split(' ');
  let longest = 0;
  for (const word of words) {
    if (word.length > longest.length) {
      longest = word;
    }
  }
  return longest.length;
}


runTest(findLongestWordLength, tests);