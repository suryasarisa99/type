import { createContext, useState, useEffect, useReducer, useCallback } from 'react'
import threeL from "../3l.json";
import w200 from "../w-200.json";
import meanings from "../merge.json"
import facts from "../facts.json"

const DataContext = createContext();
export default function DataProvider({ children }) {
    const [limit, setLimit] = useState(JSON.parse(localStorage.getItem('limit')) || 30)
    const [allTypos, setAllTypos] = useState(JSON.parse(localStorage.getItem('typos')) || [])
    const [mistakes, setMistakes] = useState(JSON.parse(localStorage.getItem('mistakes')) || {})
    const [data, setData] = useState([])
    const [p, setP] = useState([])
    let [arr, setArr] = useState([])

    function reducer(state, action) {
        if (action.type == "") return action.payload;
        else
            return { ...state, [action.type]: action.payload }
    }
    const [opt, dSett] = useReducer(reducer,
        JSON.parse(
            localStorage.getItem('options')
        ) ||
        {
            min: 3,
            max: 5,
            all: [],
            any: [],
            none: [],
            random: false,
            type: 'char',
            data: "200",
            complexity: 5,
            randoms: { char: 8, cap: 0, num: 1, sym: 0 },
        })

    useEffect(() => {
        document.documentElement.classList.add(
            localStorage.getItem('theme')
        )
    }, [])




    const getData = useCallback(() => {
        let datax;
        switch (opt.data) {
            case '3l': datax = threeL.slice(0, sliceAt(opt.complexity)); break;
            case '200': datax = w200; break;
            case "meanings": datax = meanings; break;
            case "facts": datax = facts; break;
            case "random": return [];
        }

        let smallWords;
        if (opt.data == "meanings") {
            return datax;
        }
        else if (opt.data == "facts") {
            return datax.filter(item => item.split(' ').length <= limit)
        }
        else {
            return datax.filter(word =>
                !word.includes('z')
                && word.length >= opt.min
                && word.length <= opt.max
                && (opt.any.length > 0 ? opt.any.some(ch => word.includes(ch)) : true)
                && (opt.all).every(ch => word.includes(ch))
                && opt.none.every(ch => !word.includes(ch))
            )
        }
    }, [opt, limit]);

    useEffect(() => {
        const d = getData()
        setData(d);
    }, [opt, getData])

    useEffect(() => {
        // if (data == undefined || data.length == 0) return;
        console.log("### data useEffect")
        console.log(data);
        console.log(`dataLen: ${data.length}`);
        console.log(getWords())
        setArr(getWords())
    }, [data])

    function getWords() {
        if (opt.random) {
            console.log('ranomd-chars')
            return getRandomWords();
        }
        else return pickWords()
    }

    function pickWords() {
        if (data.length == 0) return;
        const dataLen = data.length;
        let i = 0;
        let randomWords = []

        while (i < limit) {
            if (opt.data == "meanings") {
                let item = data[parseInt(Math.random() * dataLen)];
                randomWords.push(item.name + ":");
                let words = item.text.split(' ');
                words[words.length - 1] += "."
                i += words.length + 1;
                if (i > limit) break;
                randomWords = [...randomWords, ...words]
            } else if (opt.data == "facts") {
                console.log(`len: ${limit}`);
                let factWords = data[parseInt(Math.random() * dataLen)].split(' ')
                console.log(factWords)
                i += factWords.length;
                if (randomWords.length != 0 && i > limit) break;
                randomWords = [...randomWords, ...factWords]
            } else {
                randomWords.push(data[parseInt(Math.random() * dataLen)]);
                i++;
            }
        }
        return randomWords;
    }
    function getRandomWords() {

        let i = 0;
        let list = []
        while (i < limit) {
            // list.push(makeRandomWord({ type, all }))
            list.push(makeRandomWord());
            i++;
        }
        return list;
    }

    function makeRandomWord() {
        // let word = all?.join('') ||
        let word = opt.all.join('');

        if (opt.any.length > 0) {
            let randomIndex = randomRange(0, opt.any.length);
            word += opt.any[randomIndex]
        }

        let wordLen = randomRange(opt.min, opt.max + 1);
        let randFun;

        const randFuns = []
        const randMap = { "char": randAlpha, "cap": randCapAlpha, "num": randNum, "sym": randSym }
        for (let randType in opt.randoms) {

            let i = 0;
            while (i < opt.randoms[randType]) {
                randFuns.push(randMap[randType])
                i++;
            }
        }


        while (word.length < wordLen) {
            randFun = randFuns[randomRange(0, randFuns.length)]

            let randomValue = randFun();
            if (!opt.none.includes(randomValue))
                word += randomValue;
        }

        return word.shuffle();
    }

    return (
        <DataContext.Provider value={{
            limit, setLimit, allTypos, setAllTypos, opt, dSett, mistakes, setMistakes, getWords, arr, setArr
        }}>
            {children}
        </DataContext.Provider>
    )
}

export { DataContext };


function sliceAt(rangePos) {
    let end;
    console.log(`rangePos: `, rangePos);
    switch (rangePos) {
        case 0: end = 500; break;
        case 1: end = 1000; break;
        case 2: end = 2000; break;
        case 3: end = 3000; break;
        case 4: end = 5000; break;
        case 5: end = 8000; break;
        case 6: end = 10000; break;
        case 7: end = 14000; break;
        case 8: end = 18000; break;
        case 9: end = 25000; break;
        case 10: end = 40000; break;
        case 11: end = 80000; break;
        case 12: end = 150000; break;
        case 13: end = 200000; break;
        case 14: end = 225000; break;
        case 15: end = 250000; break;
        case 16: end = 275000; break;
        case 17: end = 300000; break;
        case 18: end = 325000; break;
        case 19: end = 350000; break;
    }
    console.log('end ' + end)
    return end;
}
let alpha = "abcdefghijklmnopqrstuvwxy"
let capAlpha = "ABCDEFGHIJKLMNOPQRSTUVWXY"
let numbers = "0123456789"
let symbols = `~!@#$%^&*-_+="':;,.<>?/()[]{}`


const randAlpha = () => alpha[parseInt(Math.random() * alpha.length)]
const randCapAlpha = () => capAlpha[parseInt(Math.random() * capAlpha.length)]
const randNum = () => numbers[parseInt(Math.random() * numbers.length)]
const randSym = () => symbols[parseInt(Math.random() * symbols.length)]

function randomRange(min, max) {
    return parseInt(Math.random() * (max - min)) + min
}