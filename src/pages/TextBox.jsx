import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { createRoot } from "react-dom/client";

import { DataContext } from "../context/DataContext";
import { motion } from "framer-motion";
import { PiArrowArcLeftFill } from "react-icons/pi";
import Typos from "../components/Typos";
import KeyBoard from "../components/KeyBoard";
import Empty from "../components/Empty";
import { BsGearFill } from "react-icons/bs";
import { speak } from "../utils/speak";
import { getWords, randomWords } from "../utils/words-generate";

export default function TextBox({ goSettings }) {
  const {
    limit,
    setLimit,
    allTypos,
    setAllTypos,
    settState: opt,
    mistakes,
    setMistakes,
  } = useContext(DataContext);

  let [arr, setArr] = useState(
    !opt.random
      ? getWords({ len: limit, opt })
      : randomWords({ len: limit, opt })
  );
  let cc = useRef(0);
  const [resetCount, setResetCount] = useState(0);
  let cw = useRef(0);
  let words = useRef(null);
  let chars = useRef(null);
  let wordsLimits = useRef([8, 15, 30, 45, 60, 80, 100, 120]);
  let mistakesRef = useRef({});
  let newWord = useRef(true);
  const [currentKey, setCurrentKey] = useState();

  const hiddenInputRef = useRef(null);

  let textBoxRef = useRef(null);
  const [inCorrectChars, setInCorrectChars] = useState([]);
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
    localStorage.setItem("limit", val);
  };

  const handleKeyDown = useCallback(
    (e) => {
      // * @backspace  <------
      if (e.key == "Backspace") {
        if (cc.current == 0) return; // prevent backspace upto a word
        chars.current[cc.current].classList.remove("current");
        cc.current -= 1;
        chars.current[cc.current].classList.add("current");
        chars.current[cc.current].classList.remove("wrong");
        chars.current[cc.current].classList.remove("true");
        return;
      }
      // handle Keys
      let key = e.key;

      // * @settings shortcut
      if (e.altKey && e.code == "KeyI") {
        if (e.ctrlKey || e.metaKey) return;
        goSettings();
        return;
      }

      // * return for other keys
      if (key.length > 1 || e.altKey || e.ctrlKey || e.metaKey) {
        return;
      }

      if (doneRef.current) {
        if (key == " ") reset({});
        return;
      }
      if (e.shiftKey) key = e.key.toUpperCase();

      //* @first-Letter of paragraph
      if (cw.current == 0 && cc.current == 0) {
        startTime();
      }

      // * @speak at almost end of word
      if (
        opt.speak &&
        newWord.current &&
        chars.current.length - 4 < cc.current
      ) {
        speechSynthesis.cancel();
        speak(arr[cw.current + 1]);
        newWord.current = false;
      }

      // * @space
      if (chars.current.length - 1 == cc.current) {
        if (key == " ") {
          chars.current[cc.current].classList.remove("current");
          chars.current[cc.current].classList.add("true");
          prvError.current = false;
          newWord.current = true;

          // * @end of paragraph
          if (
            cw.current == arr.length - 1 &&
            cc.current == arr[arr.length - 1].length
          ) {
            setDone(true);
            doneRef.current = true;
            clearInterval(timerRef.current);
            const seconds = timer.current.m * 60 + +timer.current.s;
            setWpm(parseInt(cw.current / (seconds / 60)));
            // addToAllTypos(typos.current);
            // mergeMistakes(mistakesRef.current);
            return;
          }

          cc.current = 0;
          cw.current += 1;
          if (opt.showKeyboard) setCurrentKey(arr[cw.current][cc.current]);
          chars.current = words.current[cw.current].querySelectorAll(".char");
          const nexWordFirstChar =
            words.current?.[cw.current]?.querySelector(".char");
          nexWordFirstChar.classList.add("current");
        }
        return;
      }

      //* @onTrue
      if (arr[cw.current][cc.current] == key) {
        chars.current[cc.current].classList.add("true");
        chars.current[cc.current].classList.remove("current");
        prvError.current = false;

        cc.current += 1;
        chars.current[cc.current].classList.add("current");
        if (opt.showKeyboard) setCurrentKey(arr[cw.current][cc.current]);
      }

      // * @onFalse
      else {
        if (prvError.current) {
          chars.current[cc.current].classList.add("again-error");
          return;
        }
        if (opt.showKeyboard) setCurrentKey(arr[cw.current][cc.current + 1]);

        const curChar = chars.current[cc.current];
        curChar.classList.add("wrong");
        curChar.classList.remove("current");
        prvError.current = true;
        if (arr[cw.current]?.[cc.current + 1] != key && key != " ") {
          typos.current.push({
            a: arr[cw.current][cc.current],
            b: key,
            word: arr[cw.current],
            index: cc.current,
          });
          // addMistake(mistakesRef.current, arr[cw.current][cc.current]);
        }

        const xElm = document.createElement("span");
        xElm.innerHTML = key;
        xElm.className = "wrong-char";
        curChar.appendChild(xElm);

        if (arr[cw.current]?.[cc.current + 1] == key) {
          const xElm = document.createElement("span");
          const arrowIcon = <PiArrowArcLeftFill />;
          const root = createRoot(xElm);
          root.render(arrowIcon);
          xElm.className = "wrong-arrow";
          curChar.appendChild(xElm);
        }
        chars.current[cc.current + 1].classList.add("current");
        cc.current += 1;
      }
    },
    [arr]
  );

  useEffect(() => {
    if (arr == undefined || arr.length == 0) return;
    words.current = document.querySelectorAll(".word");
    chars.current = words.current[0].querySelectorAll(".char");
  }, []);

  useEffect(() => {
    if (arr == undefined || arr.length == 0) return;
    if (opt.speak) speak(arr[0]);
    document.addEventListener("keydown", handleKeyDown);
    document.querySelector(".char").classList.add("current");
    setCurrentKey(arr[0][0]);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, arr]);

  function startTime() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (timer.current.s < 59)
        timer.current = { m: timer.current.m, s: timer.current.s + 1 };
      else timer.current = { m: timer.current.m + 1, s: 0 };
    }, 1000);
  }
  const reset = ({ len, all }) => {
    setArr(
      !opt.random
        ? getWords({ len: len || limit, all: all, opt: opt })
        : randomWords({ len: len || limit, all: all, opt })
    );
    cw.current = 0;
    cc.current = 0;
    typos.current = [];
    setResetCount((prv) => prv + 1);
    mistakesRef.current = {};
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
      hiddenInputRef.current.value = "";
    }

    setDone(false);
    doneRef.current = false;
    setTimeout(() => {
      words.current = document.querySelectorAll(".word");
      chars.current = words.current?.[0]?.querySelectorAll(".char");
      chars.current[0].classList.add("current");
    }, 300);
    timer.current = { m: 0, s: 0 };
  };

  if (arr.length == 0)
    return <Empty goSettings={goSettings} reset={reset} len={limit} />;

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
          {wordsLimits.current.map((len, index) => (
            <div
              key={len}
              className={"word-limit " + (len == limit ? "selected" : "")}
            >
              <p onClick={() => changeLimit(len)}>{len}</p>
              <div className="slash">/</div>
            </div>
          ))}
        </div>
        <div className="spacer"></div>
        <p className="wpm">{done && `WPM: ${wpm}`}</p>
        <div className="gear-icon-outer" title="Alt + I">
          <BsGearFill className="gear-icon" onClick={goSettings} />
        </div>
      </div>
      <div className="box" ref={textBoxRef}>
        {arr.map((word, ind) => (
          <div key={`${word}-x-${ind}-x-${resetCount}`} className="word">
            {word?.split("")?.map((ch, index) => {
              return (
                <div key={`${word}-${ch}-${ind}-${index}-${reset}`}>
                  <p className="char"> {ch}</p>
                  {word.length - 1 == index && (
                    <p className="char ws" key={"space" + ind}>
                      &nbsp;
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {/* {done && (
        <>
          <span>{timer.current.m}</span>:<span>{timer.current.s}</span>
        </>
      )} */}
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
      <input
        type="text"
        className="hidden-input"
        ref={hiddenInputRef}
        autoFocus
      />
      {opt.showKeyboard && (
        <KeyBoard currentKey={currentKey} goSettings={goSettings} />
      )}
      {done && <p className="info">Press space to try again </p>}
    </motion.div>
  );
}
