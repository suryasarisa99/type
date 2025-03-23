import threeL from "../3l.json";
import w200 from "../w-200.json";
import meanings from "../merge.json";
import facts from "../facts.json";
import { defaultSettingsValues } from "../constants";

let alpha = "abcdefghijklmnopqrstuvwxy";
let capAlpha = "ABCDEFGHIJKLMNOPQRSTUVWXY";
let numbers = "0123456789";
let symbols = `~!@#$%^&*-_+="':;,.<>?/()[]{}`;

const randAlpha = () => alpha[parseInt(Math.random() * alpha.length)];
const randCapAlpha = () => capAlpha[parseInt(Math.random() * capAlpha.length)];
const randNum = () => numbers[parseInt(Math.random() * numbers.length)];
const randSym = () => symbols[parseInt(Math.random() * symbols.length)];

function makeWord({ type, all, opt }) {
  let word = all?.join("") || opt.all.join("");

  if (opt.any.length > 0) {
    let randomIndex = randomRange(0, opt.any.length);
    word += opt.any[randomIndex];
  }

  let wordLen = randomRange(opt.min, opt.max + 1);
  let randFun;

  if (opt.only.length != 0) {
    while (word.length < wordLen) {
      word += opt.only[randomRange(0, opt.only.length)];
    }
    return word.shuffle();
  }

  const randomFunctions = [];
  const randMap = {
    char: randAlpha,
    cap: randCapAlpha,
    num: randNum,
    sym: randSym,
  };
  for (let randType in opt.randoms) {
    let i = 0;
    while (i < opt.randoms[randType]) {
      randomFunctions.push(randMap[randType]);
      i++;
    }
  }

  while (word.length < wordLen) {
    randFun = randomFunctions[randomRange(0, randomFunctions.length)];

    let randomValue = randFun();
    if (!opt.none.includes(randomValue)) word += randomValue;
  }

  return word.shuffle();
}

function randomWords({ len, type, all, opt }) {
  let i = 0;
  let list = [];
  while (i < len) {
    list.push(makeWord({ type, all, opt }));
    i++;
  }
  return list;
}

function randomRange(min, max) {
  return parseInt(Math.random() * (max - min)) + min;
}

function randomArray(len, min, max) {
  let arr = [];
  let i = 0;
  while (i < len) {
    let elm = parseInt(Math.random() * (max - min)) + min;
    if (!arr.includes(elm)) {
      arr.push(elm);
      i++;
    }
  }
  return arr;
}

String.prototype.shuffle = function () {
  var a = this.split(""),
    n = a.length;

  for (var i = n - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a.join("");
};

function sliceAt(rangePos) {
  let end;
  switch (rangePos) {
    case 0:
      end = 500;
      break;
    case 1:
      end = 1000;
      break;
    case 2:
      end = 2000;
      break;
    case 3:
      end = 3000;
      break;
    case 4:
      end = 5000;
      break;
    case 5:
      end = 8000;
      break;
    case 6:
      end = 10000;
      break;
    case 7:
      end = 14000;
      break;
    case 8:
      end = 18000;
      break;
    case 9:
      end = 25000;
      break;
    case 10:
      end = 40000;
      break;
    case 11:
      end = 80000;
      break;
    case 12:
      end = 150000;
      break;
    case 13:
      end = 200000;
      break;
    case 14:
      end = 225000;
      break;
    case 15:
      end = 250000;
      break;
    case 16:
      end = 275000;
      break;
    case 17:
      end = 300000;
      break;
    case 18:
      end = 325000;
      break;
    case 19:
      end = 350000;
      break;
  }
  return end;
}

function getWords({ len, all, opt }) {
  opt = opt || defaultSettingsValues;
  let data;
  switch (opt.data) {
    case "3l":
      data = threeL.slice(0, sliceAt(opt.complexity));
      break;
    case "200":
      data = w200;
      break;
    case "meanings":
      data = meanings;
      break;
    case "facts":
      data = facts;
      break;
  }
  let smallWords;
  if (opt.data == "meanings") {
    smallWords = data.filter((word) => {
      // console.log(word);
      return (
        !word.name.includes("z") &&
        word.name.length >= opt.min &&
        word.name.length <= opt.max &&
        (opt.any.length > 0
          ? opt.any.some((ch) => word.name.includes(ch))
          : true) &&
        (all || opt.all).every((ch) => word.name.includes(ch)) &&
        opt.none.every((ch) => !word.name.includes(ch))
      );
    });
  } else
    smallWords = data.filter(
      (word) =>
        !word.includes("z") &&
        word.length >= opt.min &&
        word.length <= opt.max &&
        (opt.any.length > 0 ? opt.any.some((ch) => word.includes(ch)) : true) &&
        (opt.only.length > 0
          ? word.split("").every((ch) => opt.only.includes(ch))
          : true) &&
        (all || opt.all).every((ch) => word.includes(ch)) &&
        opt.none.every((ch) => !word.includes(ch))
    );
  const filterFacts = facts.filter((item) => item.split(" ").length <= len);

  const limit = smallWords.length;
  let i = 0;
  let randomWords = [];
  while (i < len) {
    if (opt.data == "meanings") {
      let item = smallWords[parseInt(Math.random() * limit)];
      randomWords.push(item.name + ":");
      let words = item.text.split(" ");
      words[words.length - 1] += ".";
      i += words.length + 1;
      if (i > len) break;
      randomWords = [...randomWords, ...words];
    } else if (opt.data == "facts") {
      // console.log(filterFacts)
      let factWords =
        filterFacts[parseInt(Math.random() * filterFacts.length)].split(" ");
      i += factWords.length;
      if (randomWords.length != 0 && i > len) break;
      randomWords = [...randomWords, ...factWords];
    } else {
      if (smallWords.length == 0) return [];
      randomWords.push(smallWords[parseInt(Math.random() * limit)]);
      i++;
    }
  }
  return randomWords;
}

export { getWords, randomWords };
