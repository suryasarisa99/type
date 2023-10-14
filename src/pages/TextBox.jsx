import { useState, useEffect, useRef, useContext, useCallback } from "react";
import w10k from "../words.json";
import w200 from "../w-200.json";
import w1000 from "../w-1000.json";
import meanings from "../merge.json"
import { DataContext } from "../context/DataContext";
import { motion } from 'framer-motion'
export default function TextBox({ settState: opt, goSettings }) {
    const { limit, setLimit } = useContext(DataContext)

    let [arr, setArr] = useState(!opt.random ? getWords(limit) : randomWords(limit))
    // let [arr, setArr] = useState(randomWords(35, "char"))
    let cc = useRef(0)
    let cw = useRef(0)
    let words = useRef(null);
    let chars = useRef(null);
    let charLen = useRef(null);
    let wordsLen = useRef(null);
    let wordsLimits = useRef([15, 30, 45, 60, 80, 100, 150])

    let textBoxRef = useRef(null);
    const [inCorrectChars, setInCorrectChars] = useState([])
    const timer = useRef({ m: 0, s: 0 });
    const timerRef = useRef(null);
    let [wpm, setWpm] = useState(0);
    let prvError = useRef(false);
    // let [startTimer, setStartTimer] = useState(false)
    let [done, setDone] = useState(false);
    let doneRef = useRef(false);

    const changeLimit = (val) => {
        setLimit(val);
        reset(val);
        localStorage.setItem('limit', val);
    }


    const handleKeyDown = useCallback((e) => {
        const nexWordFirstchar = words.current?.[cw.current + 1]?.querySelector('.char');

        // handle Keys
        if (e.key == "Alt" || e.key == "Shift" || e.ctrlKey || e.key == "CapsLock") return;
        let key = e.key;
        if (e.altKey && e.key == 'i') {
            goSettings();
            return;
        }
        if (doneRef.current) {
            if (e.key == " ")
                reset();
            return;
        }
        if (e.shiftKey)
            key = e.key.toUpperCase();

        // * @backspace  <------
        if (e.key == 'Backspace') {
            if (cc.current == 0) return;
            chars[cc.current].classList.remove('current')
            cc.current -= 1;
            chars[cc.current].classList.add('current')
            chars[cc.current].classList.remove('wrong')
            chars[cc.current].classList.remove('true')
            return;
        }

        // @first-Letter
        if (cw.current == 0 && cc.current == 0) {
            startTime();
        }

        // * @newWord or @space
        if (chars.current.length - 1 == cc.current) {
            chars.current[cc.current].classList.remove('current');
            chars.current[cc.current].classList.add('true')

            if (cw.current == arr.length - 1 && cc.current == arr[arr.length - 1].length) {
                setDone(true);
                doneRef.current = true;
                clearInterval(timerRef.current)
                const seconds = (timer.current.m * 60) + (+timer.current.s);
                setWpm(parseInt(cw.current / (seconds / 60)))
                return;
            }

            cc.current = 0;
            cw.current += 1;
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
        }

        // * @onFalse
        else {
            if (prvError.current) {
                chars.current[cc.current].classList.add('again-error');
                return;
            }
            const curChar = chars.current[cc.current]
            curChar.classList.add('wrong');
            curChar.classList.remove('current');
            prvError.current = true;

            const xElm = document.createElement('span');
            xElm.textContent = key;
            xElm.className = "wrong-char";
            curChar.appendChild(xElm)

            chars.current[cc.current + 1].classList.add("current")
            cc.current += 1;
        }

    }, [arr])

    useEffect(() => {
        words.current = document.querySelectorAll('.word');
        chars.current = words.current[0].querySelectorAll('.char');
        wordsLen.current = arr.length;
        charLen.current = arr.map(w => w.length);
    }, [])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        document.querySelector('.char').classList.add('current')
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown])

    function startTime() {
        timerRef.current = setInterval(() => {
            if (timer.current.s < 59)
                timer.current = { m: timer.current.m, s: timer.current.s + 1 }
            else
                timer.current = { m: timer.current.m + 1, s: 0 }
        }, 1000)
    }
    const reset = (val) => {
        setArr(!opt.random ? getWords(val || limit) : randomWords(val || limit))
        cw.current = 0;
        cc.current = 0;
        setDone(false);
        doneRef.current = false;
        setTimeout(() => {
            words.current = document.querySelectorAll('.word');
            chars.current = words.current[0].querySelectorAll('.char');
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
    function getWords(len) {
        let data;
        switch (opt.data) {
            case '10k': data = w10k; break;
            case '200': data = w200; break;
            case '1k': data = w1000; break;
            case "meanings": data = meanings.map(item => item.name); break;
        }
        const smallWords = data.filter(word =>

            !word.includes('z')
            && word.length >= opt.min
            && word.length <= opt.max
            && (opt.any.length > 0 ? opt.any.some(ch => word.includes(ch)) : true)
            && opt.all.every(ch => word.includes(ch))
            && opt.none.every(ch => !word.includes(ch))

        )
        const limit = smallWords.length;
        let i = 0;
        const randomWords = []
        while (i < len) {
            randomWords.push(smallWords[parseInt(Math.random() * limit)]?.toLowerCase());
            i++;
        }
        return randomWords;
    }
    function randomWords(len, type) {

        let i = 0;
        let list = []
        while (i < len) {
            list.push(makeWord(type))
            i++;
        }
        return list;
    }

    function makeWord(type) {
        let word = opt.all.join('');

        if (opt.any.length > 0) {
            let randomIndex = randomRange(0, opt.any.length);
            word += opt.any[randomIndex]
        }

        let wordLen = randomRange(opt.min, opt.max + 1);
        let randFun;

        switch (opt.data) {
            case "char": randFun = randAlpha; break;
            case "cap": randFun = randCapAlpha; break;
            case "num": randFun = randNum; break;
            case "sym": randFun = randSym; break;
        }

        while (word.length < wordLen) {
            let randomValue = randFun();
            if (!opt.none.includes(randomValue))
                word += randomValue;
        }

        return word.shuffle();
    }

    return (
        <motion.div
            initial={{ y: -1000 }}
            animate={{ y: 0 }}
            exit={{ y: 1000 }}
        >
            <div className="top-row">
                <div className="word-limits">
                    {
                        wordsLimits.current.map(len => (
                            <div key={len} className="word-limit">
                                <p onClick={() => changeLimit(len)} >{len}</p>
                                <div className="slash">/</div>
                            </div>
                        ))
                    }
                </div>
                <p >{done && `wpm: ${wpm}`}</p>

            </div>
            <div className="box" ref={textBoxRef}>

                {arr.map((word, ind) => (

                    <div key={`${word}-x-x-${ind}`} className="word">
                        {word.split('').map((ch, index) => {
                            return <div key={`${word}-${ch}-${ind}-${index}`}>
                                <p className="char"> {ch}</p>
                                {word.length - 1 == index && <span className="char ws" key={"space" + ind}> </span>}
                            </div>
                        })}
                    </div>
                ))}

            </div>
            {done && <p className="info">Press space to try again </p>}
            {/* <button onClick={goSettings}>settings</button> */}
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