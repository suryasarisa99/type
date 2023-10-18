import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { hydrateRoot, createRoot } from 'react-dom';
import threeL from "../3l.json";
import w200 from "../w-200.json";
import meanings from "../merge.json"
import facts from "../facts.json"
import { DataContext } from "../context/DataContext";
import { motion } from 'framer-motion'
import { PiArrowArcLeftFill } from 'react-icons/pi';
import Typos from "../components/Typos";
import KeyBoard from '../components/KeyBoard';
import Empty from "../components/Empty";
export default function TextBox({ goSettings }) {
    const { limit, setLimit, allTypos, setAllTypos, settState: opt, mistakes, setMistakes } = useContext(DataContext)
    // localStorage.clear();
    let [arr, setArr] = useState(!opt.random ? getWords({ len: limit }) : randomWords({ len: limit }))
    // let [arr, setArr] = useState(randomWords(35, "char"))
    let cc = useRef(0)
    const [resetCount, setResetCount] = useState(0);
    let cw = useRef(0)
    let words = useRef(null);
    let chars = useRef(null);
    let charLen = useRef(null);
    let wordsLen = useRef(null);
    let wordsLimits = useRef([8, 15, 30, 45, 60, 80, 100, 150]);
    let mistakesRef = useRef({});
    const [currentKey, setCurrentKey] = useState()

    const hiddenInputRef = useRef(null);

    let textBoxRef = useRef(null);
    const [inCorrectChars, setInCorrectChars] = useState([])
    const typos = useRef([]);
    const timer = useRef({ m: 0, s: 0 });
    const timerRef = useRef(null);
    let [wpm, setWpm] = useState(0);
    let prvError = useRef(false);
    let [done, setDone] = useState(false);
    let doneRef = useRef(false);

    const changeLimit = (val) => {
        setLimit(val);
        reset({ len: val });
        localStorage.setItem('limit', val);
    }


    const handleKeyDown = useCallback((e) => {
        const nexWordFirstchar = words.current?.[cw.current + 1]?.querySelector('.char');

        // * @backspace  <------
        if (e.key == 'Backspace') {
            if (cc.current == 0) return;
            chars.current[cc.current].classList.remove('current')
            cc.current -= 1;
            chars.current[cc.current].classList.add('current')
            chars.current[cc.current].classList.remove('wrong')
            chars.current[cc.current].classList.remove('true')
            return;
        }
        // handle Keys
        if (e.key.length > 1) return;
        let key = e.key;
        if (e.altKey && (e.key == 'i' || e.key == "I")) {
            goSettings();
            return;
        }

        if (doneRef.current) {
            if (e.key == " ")
                reset({});
            return;
        }
        if (e.shiftKey)
            key = e.key.toUpperCase();



        // @first-Letter
        if (cw.current == 0 && cc.current == 0) {
            startTime();
        }

        // * @newWord or @space
        if (chars.current.length - 1 == cc.current) {
            chars.current[cc.current].classList.remove('current');
            chars.current[cc.current].classList.add('true')
            prvError.current = false;

            // * @end
            if (cw.current == arr.length - 1 && cc.current == arr[arr.length - 1].length) {
                setDone(true);
                doneRef.current = true;
                clearInterval(timerRef.current)
                const seconds = (timer.current.m * 60) + (+timer.current.s);
                addToAllTypos(typos.current);
                setWpm(parseInt(cw.current / (seconds / 60)))
                mergeMistakes(mistakesRef.current)
                return;

            }

            cc.current = 0;
            cw.current += 1;
            setCurrentKey(arr[cw.current][cc.current]);
            console.log(words.current[cw.current]);
            chars.current = words.current[cw.current].querySelectorAll('.char');

            nexWordFirstchar.classList.add('current')
            return;
        }

        //* @onTrue
        console.log(arr[cw.current][cc.current], key)
        if (arr[cw.current][cc.current] == key) {
            chars.current[cc.current].classList.add('true')
            chars.current[cc.current].classList.remove('current');
            prvError.current = false;


            cc.current += 1;
            chars.current[cc.current].classList.add("current")
            setCurrentKey(arr[cw.current][cc.current]);
        }

        // * @onFalse
        else {
            if (prvError.current) {
                chars.current[cc.current].classList.add('again-error');
                return;
            }
            setCurrentKey(arr[cw.current][cc.current + 1])

            const curChar = chars.current[cc.current]
            curChar.classList.add('wrong');
            curChar.classList.remove('current');
            prvError.current = true;
            if (arr[cw.current]?.[cc.current + 1] != key && key != ' ') {
                typos.current.push({ a: arr[cw.current][cc.current], b: key, word: arr[cw.current], index: cc.current })
                addMistake(mistakesRef.current, arr[cw.current][cc.current])
            }

            const xElm = document.createElement('span');
            xElm.innerHTML = key;
            xElm.className = "wrong-char";
            curChar.appendChild(xElm)

            if (arr[cw.current]?.[cc.current + 1] == key) {
                const xElm = document.createElement('span');
                const arrowIcon = <PiArrowArcLeftFill />;
                const root = createRoot(xElm)
                root.render(arrowIcon);
                xElm.className = "wrong-arrow";
                curChar.appendChild(xElm);
            }
            chars.current[cc.current + 1].classList.add("current")
            cc.current += 1;
        }

    }, [arr])

    useEffect(() => {
        if (arr == undefined || arr.length == 0) return;
        words.current = document.querySelectorAll('.word');
        chars.current = words.current[0].querySelectorAll('.char');
        wordsLen.current = arr.length;
        // charLen.current = arr.map(w => w.length);
    }, [])

    useEffect(() => {
        if (arr == undefined || arr.length == 0) return;
        document.addEventListener('keydown', handleKeyDown)
        document.querySelector('.char').classList.add('current')
        setCurrentKey(arr[0][0])
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown, arr])

    const addMistake = (arr, mistake) => {
        if (mistake in arr)
            arr[mistake]++;
        else arr[mistake] = 1;
    }

    const mergeMistakes = (source) => {
        Object.entries(source).map(([key, value]) => {
            if (key in mistakes)
                mistakes[key] += value;
            else mistakes[key] = value;
        })
        setMistakes({ ...mistakes })
        localStorage.setItem('mistakes', JSON.stringify(mistakes))
    }

    function startTime() {
        if (timerRef.current)
            clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
            if (timer.current.s < 59)
                timer.current = { m: timer.current.m, s: timer.current.s + 1 }
            else
                timer.current = { m: timer.current.m + 1, s: 0 }
        }, 1000)
    }
    const reset = ({ len, all }) => {
        console.log("called")
        setArr(!opt.random ? getWords({ len: len || limit, all: all }) : randomWords({ len: len || limit, all: all }))
        cw.current = 0;
        cc.current = 0;
        typos.current = [];
        setResetCount(prv => prv + 1);
        mistakesRef.current = {};
        if (hiddenInputRef.current) {
            hiddenInputRef.current.focus();
            hiddenInputRef.current.value = "";
        }

        setDone(false);
        doneRef.current = false;
        setTimeout(() => {
            words.current = document.querySelectorAll('.word');
            chars.current = words.current?.[0]?.querySelectorAll('.char');
            chars.current[0].classList.add('current')
        }, 300)
        timer.current = { m: 0, s: 0 }
        console.log(chars.current);

    }

    function checkIndex(wi, ci) {
        let isMatch = false; // Initialize a variable to track the match status
        inCorrectChars.forEach(item => {
            if (item.word === wi && item.char === ci) {
                console.log('matched');
                isMatch = true; // Set isMatch to true if a match is found
            }
        });
        return isMatch;
    }
    function getWords({ len, all }) {
        let data;
        switch (opt.data) {
            case '3l': data = threeL.slice(0, sliceAt(opt.complexity)); break;
            case '200': data = w200; break;
            case "meanings": data = meanings; break;
            case "facts": data = facts; break;
        }
        console.log(`data len: ${data.length}`)
        let smallWords;
        if (opt.data == 'meanings') {
            smallWords = data.filter(word => {
                // console.log(word);
                return (!word.name.includes('z')
                    && word.name.length >= opt.min
                    && word.name.length <= opt.max
                    && (opt.any.length > 0 ? opt.any.some(ch => word.name.includes(ch)) : true)
                    && (all || opt.all).every(ch => word.name.includes(ch))
                    && opt.none.every(ch => !word.name.includes(ch)))
            }
            )
        } else
            smallWords = data.filter(word =>
                !word.includes('z')
                && word.length >= opt.min
                && word.length <= opt.max
                && (opt.any.length > 0 ? opt.any.some(ch => word.includes(ch)) : true)
                && (all || opt.all).every(ch => word.includes(ch))
                && opt.none.every(ch => !word.includes(ch))
            )
        const filterFacts = facts.filter(item => item.split(' ').length <= len)

        const limit = smallWords.length;
        let i = 0;
        let randomWords = []
        while (i < len) {
            if (opt.data == "meanings") {
                let item = smallWords[parseInt(Math.random() * limit)];
                randomWords.push(item.name + ":");
                let words = item.text.split(' ');
                words[words.length - 1] += "."
                i += words.length + 1;
                if (i > len) break;
                randomWords = [...randomWords, ...words]
            } else if (opt.data == "facts") {
                console.log(`len: ${len}`);
                // console.log(filterFacts)
                let factWords = filterFacts[parseInt(Math.random() * filterFacts.length)].split(' ')
                console.log(factWords)
                i += factWords.length;
                if (randomWords.length != 0 && i > len) break;
                randomWords = [...randomWords, ...factWords]

            } else {
                if (smallWords.length == 0) return []
                randomWords.push(smallWords[parseInt(Math.random() * limit)]);
                i++;
            }
        }
        return randomWords;
    }
    function randomWords({ len, type, all }) {

        let i = 0;
        let list = []
        while (i < len) {
            list.push(makeWord({ type, all }))
            i++;
        }
        return list;
    }

    function makeWord({ type, all }) {
        let word = all?.join('') || opt.all.join('');

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
    function addToAllTypos(typos) {
        typos.forEach(item => {
            let obj = allTypos.find(nItem => nItem.a == item.a && nItem.b == item.b)
            if (obj) {
                obj.count += 1;
                obj.items.push({ word: item.word, index: item.index })
            } else {
                allTypos.push(
                    { a: item.a, b: item.b, items: [{ word: item.word, index: item.index }], count: 1 }
                )
            }

        })
        setAllTypos([...allTypos.sort((x, y) => y.count - x.count)]);
        localStorage.setItem('typos', JSON.stringify(allTypos))
    }

    if (arr.length == 0)
        return <Empty goSettings={goSettings} reset={reset} len={limit} />


    //* @jsx
    return (
        <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="textbox"
            style={{ width: limit > 80 && "95%" }}
        >
            <div className="top-row">
                <div className="word-limits">
                    {
                        wordsLimits.current.map((len, index) => (
                            <div key={len} className={"word-limit " + (len == limit ? "selected" : "")}>
                                <p onClick={() => changeLimit(len)} >{len}</p>
                                <div className="slash">/</div>
                            </div>
                        ))
                    }
                </div>
                <p className="wpm" >{done && `WPM: ${wpm}`}</p>

            </div>
            <div className="box" ref={textBoxRef}>

                {arr.map((word, ind) => (

                    <div key={`${word}-x-${ind}-x-${resetCount}`} className="word">
                        {word?.split('')?.map((ch, index) => {
                            return <div key={`${word}-${ch}-${ind}-${index}-${reset}`}>
                                <p className="char"> {ch}</p>
                                {word.length - 1 == index && <span className="char ws" key={"space" + ind}> </span>}
                            </div>
                        })}
                    </div>
                ))}

            </div>
            {/* <button onClick={goSettings}>settings</button> */}
            {/* {done &&
                <>
                    <span>{timer.current.m}</span>
                    :
                    <span>{timer.current.s}</span>
                </>
            } */}
            {/* {<Typos typos={allTypos} reset={reset} />} */}
            {/* <div className="typos-boxes"> */}
            {/* {done && <Typos typos={mergeTypos(typos.current)} />} */}
            {/* </div> */}
            {/* <div className="mistakes">
                {Object.entries(mistakes).map(([key, value]) => {
                    return <div key={key}>
                        <span>{key}</span> <span>{value}</span>
                    </div>
                })}
            </div> */}
            <input type="text" className="hidden-input" ref={hiddenInputRef} autoFocus />
            <KeyBoard currentKey={currentKey} goSettings={goSettings} />
            {done && <p className="info">Press space to try again </p>}

        </motion.div>

    );
}

let alpha = "abcdefghijklmnopqrstuvwxy"
let capAlpha = "ABCDEFGHIJKLMNOPQRSTUVWXY"
let numbers = "0123456789"
let symbols = `~!@#$%^&*-_+="':;,.<>?/()[]{}`


const randAlpha = () => alpha[parseInt(Math.random() * alpha.length)]
const randCapAlpha = () => capAlpha[parseInt(Math.random() * capAlpha.length)]
const randNum = () => numbers[parseInt(Math.random() * numbers.length)]
const randSym = () => symbols[parseInt(Math.random() * symbols.length)]



function mergeTypos(typos) {
    let arr = [];
    typos.forEach(item => {
        let obj = arr.find(nItem => nItem.a == item.a && nItem.b == item.b)
        if (obj) {
            obj.count += 1;
            obj.items.push({ word: item.word, index: item.index })
        } else {
            arr.push(
                { a: item.a, b: item.b, items: [{ word: item.word, index: item.index }], count: 1 }
            )
        }

    })
    return arr;
}



function randomRange(min, max) {
    return parseInt(Math.random() * (max - min)) + min
}

function randomArray(len, min, max) {
    let arr = [];
    let i = 0;
    while (i < len) {
        let elm = parseInt(Math.random() * (max - min)) + min
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
}


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