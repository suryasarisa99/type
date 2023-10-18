import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { render } from 'react-dom';

// import w1000 from "../w-1000.json";
// import names from "../names.json"
import { DataContext } from "../context/DataContext";
import { motion } from 'framer-motion'
import { PiArrowArcLeftFill } from 'react-icons/pi';
import Typos from "../components/Typos";
import KeyBoard from '../components/KeyBoard';
export default function TextBox({ goSettings }) {
    const { limit, setLimit, allTypos, setAllTypos, opt, mistakes, setMistakes, getWords, arr, setArr } = useContext(DataContext)
    // localStorage.clear();
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

                render(arrowIcon, xElm); // Render the arrow icon into the span element
                xElm.className = "wrong-arrow";
                curChar.appendChild(xElm);
            }
            chars.current[cc.current + 1].classList.add("current")
            cc.current += 1;
        }

    }, [arr])

    useEffect(() => {
        if (arr == undefined) return;
        words.current = document.querySelectorAll('.word');
        chars.current = words.current?.[0]?.querySelectorAll('.char');
        wordsLen.current = arr.length;
        // charLen.current = arr.map(w => w.length);
    }, [arr])

    useEffect(() => {
        console.log(arr);
        if (arr == undefined || arr.length == 0) return;
        document.addEventListener('keydown', handleKeyDown)
        document.querySelector('.char')?.classList.add('current')
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
        setArr(getWords())
        cw.current = 0;
        cc.current = 0;
        typos.current = [];
        setResetCount(prv => prv + 1);
        mistakesRef.current = {};
        hiddenInputRef.current.focus();
        hiddenInputRef.current.value = ""
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

    if (arr == undefined || arr.length == 0)
        return <h1>Empty <button onClick={goSettings}>settings</button></h1>


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


