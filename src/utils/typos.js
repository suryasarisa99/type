function mergeTypos(typos) {
  let arr = [];
  typos.forEach((item) => {
    let obj = arr.find((nItem) => nItem.a == item.a && nItem.b == item.b);
    if (obj) {
      obj.count += 1;
      obj.items.push({ word: item.word, index: item.index });
    } else {
      arr.push({
        a: item.a,
        b: item.b,
        items: [{ word: item.word, index: item.index }],
        count: 1,
      });
    }
  });
  return arr;
}

function checkIndex(wi, ci) {
  let isMatch = false; // Initialize a variable to track the match status
  inCorrectChars.forEach((item) => {
    if (item.word === wi && item.char === ci) {
      isMatch = true; // Set isMatch to true if a match is found
    }
  });
  return isMatch;
}

function addToAllTypos(typos) {
  typos.forEach((item) => {
    let obj = allTypos.find((nItem) => nItem.a == item.a && nItem.b == item.b);
    if (obj) {
      obj.count += 1;
      obj.items.push({ word: item.word, index: item.index });
    } else {
      allTypos.push({
        a: item.a,
        b: item.b,
        items: [{ word: item.word, index: item.index }],
        count: 1,
      });
    }
  });
  setAllTypos([...allTypos.sort((x, y) => y.count - x.count)]);
  localStorage.setItem("typos", JSON.stringify(allTypos));
}
const addMistake = (arr, mistake) => {
  if (mistake in arr) arr[mistake]++;
  else arr[mistake] = 1;
};

const mergeMistakes = (source) => {
  Object.entries(source).map(([key, value]) => {
    if (key in mistakes) mistakes[key] += value;
    else mistakes[key] = value;
  });
  setMistakes({ ...mistakes });
  localStorage.setItem("mistakes", JSON.stringify(mistakes));
};
