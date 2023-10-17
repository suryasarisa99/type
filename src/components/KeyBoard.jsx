import { useEffect, useContext, useCallback, useState, useRef } from 'react'
import "./kb.scss";

import leftHome1 from "../images/left-home-row-1.webp"
import leftHome2 from "../images/left-home-row-2.webp"
import leftHome3 from "../images/left-home-row-3.webp"
import leftHome4 from "../images/left-home-row-4.webp"
import leftHome5 from "../images/left-home-row-5.webp"
import leftTop1 from "../images/left-top-row-1.webp"
import leftTop2 from "../images/left-top-row-2.webp"
import leftTop3 from "../images/left-top-row-3.webp"
import leftTop4 from "../images/left-top-row-4.webp"
import leftTop5 from "../images/left-top-row-5.webp"
import leftBottom1 from "../images/left-bottom-row-1.webp"
import leftBottom2 from "../images/left-bottom-row-2.webp"
import leftBottom3 from "../images/left-bottom-row-3.webp"
import leftBottom4 from "../images/left-bottom-row-4.webp"
import leftBottom5 from "../images/left-bottom-row-5.webp"
import rightHome1 from "../images/right-home-row-1.webp"
import rightHome2 from "../images/right-home-row-2.webp"
import rightHome3 from "../images/right-home-row-3.webp"
import rightHome4 from "../images/right-home-row-4.webp"
import rightHome5 from "../images/right-home-row-5.webp"
import rightTop1 from "../images/right-top-row-1.webp"
import rightTop2 from "../images/right-top-row-2.webp"
import rightTop3 from "../images/right-top-row-3.webp"
import rightTop4 from "../images/right-top-row-4.webp"
import rightTop5 from "../images/right-top-row-5.webp"
import rightBottom1 from "../images/right-bottom-row-1.webp"
import rightBottom2 from "../images/right-bottom-row-2.webp"
import rightBottom3 from "../images/right-bottom-row-3.webp"
import rightBottom4 from "../images/right-bottom-row-4.webp"
import rightBottom5 from "../images/right-bottom-row-5.webp"
import leftRest from "../images/left-resting-hand.webp";
import rightRest from "../images/right-resting-hand.webp";
import spaceHand from "../images/space.webp";
import leftShiftHand from "../images/left-bottom-row-6.png"
import rightShiftHand from "../images/right-bottom-row-6.webp"

// numbers

import leftNum7 from "../images/left-num-row-7.webp";
import leftNum6 from "../images/left-num-row-6.webp";
import leftNum5 from "../images/left-num-row-5.webp";
import leftNum4 from "../images/left-num-row-4.webp";
import leftNum3 from "../images/left-num-row-3.webp";
import leftNum2 from "../images/left-num-row-2.webp";
import rightNum1 from "../images/right-num-row-1.webp";
import rightNum2 from "../images/right-num-row-2.webp";
import rightNum3 from "../images/right-num-row-3.webp";
import rightNum4 from "../images/right-num-row-4.webp";
import rightNum5 from "../images/right-num-row-5.webp";
import rightNum6 from "../images/right-num-row-6.webp";
import rightNum7 from "../images/right-num-row-7.png";

import { AiFillWindows } from 'react-icons/ai'
export default function KeyBoard({ currentKey, goSettings }) {

    const keyboardRef = useRef(null);
    // const keysRef = useRef([]);
    const leftShiftKeyRef = useRef(null);
    const rightShiftKeyRef = useRef(null);
    const spaceKeyRef = useRef(null);
    const prvKeyRef = useRef(null);
    const shiftLeftAphaCharsRef = useRef("AESDRBGFCTWVXQZ")
    const shiftRightAphaCharsRef = useRef("IJOPHMNKLUY")
    const shiftLeftCharsRef = useRef("~!@#$%")
    const shiftRightCharsRef = useRef("^&*()_+{}|:\"<>?")
    const [leftHandImage, setLeftHandImage] = useState(leftTop1);
    const [rightHandImage, setRightHandImage] = useState(rightHome5);
    const keysRef = useRef({});
    const n = {
        ...addAttributes(leftNum7, ["`", "`"]),
        ...addAttributes(leftNum6, ["!", "1"]),
        ...addAttributes(leftNum5, ["@", "2"]),
        ...addAttributes(leftNum4, ["#", "3"]),
        ...addAttributes(leftNum3, ["$", "4"]),
        ...addAttributes(leftNum2, ["%", "5"]),
        ...addAttributes(rightNum1, ["^", "6"]),
        ...addAttributes(rightNum2, ["&", "7"]),
        ...addAttributes(rightNum3, ["*", "8"]),
        ...addAttributes(rightNum4, ["(", "9"]),
        ...addAttributes(rightNum5, [")", "0"]),
        ...addAttributes(rightNum6, ["_", "-"]),
        ...addAttributes(rightNum7, ["+", "="]),
        "Space": spaceHand,
        a: leftHome5, s: leftHome4, d: leftHome3, f: leftHome2, g: leftHome1,
        q: leftTop5, w: leftTop4, e: leftTop3, r: leftTop2, t: leftTop1,
        z: leftBottom5, x: leftBottom4, c: leftBottom3, v: leftBottom2, b: leftBottom1,
        // right
        p: rightTop5, o: rightTop4, i: rightTop3, u: rightTop2, y: rightTop1,
        l: rightHome4, k: rightHome3, j: rightHome2, h: rightHome1,
        m: rightBottom2, n: rightBottom1,
        ...addAttributes(rightHome5, [":", ";"]),
        ...addAttributes(rightBottom5, ["?", "/"]),
        ...addAttributes(rightBottom3, ["<", ","]),
        ...addAttributes(rightBottom4, [">", "."]),
    }
    console.log(n);

    function addAttributes(value, keys) {
        let obj = {}
        for (let key of keys)
            obj[key] = value
        return obj;
    }

    useEffect(() => {
        const rawKeys = keyboardRef.current.querySelectorAll('.key');
        rawKeys.forEach(key => {
            if (key.classList.contains('dbl')) {
                let childNodes = key.childNodes;
                const keyName0 = childNodes[0].getAttribute('value')
                const keyName1 = childNodes[1].getAttribute('value')
                keysRef.current[keyName0] = { key, shiftReq: true, isAlpha: false, hand: n[keyName0] }
                keysRef.current[keyName1] = { key, shiftReq: false, isAlpha: false, hand: n[keyName1] }
            } else {
                const keyName = key.getAttribute('value');
                if (key.getAttribute('value'))
                    keysRef.current[keyName] = { key, shiftReq: undefined, isAlpha: true, hand: n[keyName] }
            }
        })
        console.log(keysRef);
        leftShiftKeyRef.current = keyboardRef.current.querySelector('.shift');
        rightShiftKeyRef.current = keyboardRef.current.querySelector('.right-shift');
        spaceKeyRef.current = keyboardRef.current.querySelector('.space');
    }, [])
    // localStorage.clear();

    useEffect(() => {
        if (!('1' in keysRef.current)) return;

        // reset
        console.log("currentKey: " + " " + currentKey)
        keysRef.current['Space'].key.classList.remove('heighlight');
        keysRef.current['left-shift'].key.classList.remove('heighlight');
        keysRef.current['right-shift'].key.classList.remove('heighlight');
        if (prvKeyRef.current)
            keysRef.current[prvKeyRef.current].key.classList.remove('heighlight');

        // handlespace
        if (currentKey == undefined) {
            keysRef.current['Space'].key.classList.add('heighlight');
            setRightHandImage(spaceHand);
            setLeftHandImage(leftRest)
            return;
        }

        const currentPressedChar = currentKey.toLowerCase();
        const cKey = keysRef.current[currentPressedChar];
        cKey.key.classList.add("heighlight");
        prvKeyRef.current = currentPressedChar;

        console.log(cKey.hand);
        // if (shiftLeftAphaCharsRef.current.toLowerCase().includes(currentPressedChar)) {
        if (cKey.hand?.includes('left')) {

            setLeftHandImage(cKey.hand);
            setRightHandImage(rightRest);
        }
        else {
            setRightHandImage(cKey.hand);
            setLeftHandImage(leftRest);
        }


        if (cKey.shiftReq) {
            // nonAlphaChar and ShiftKeyREq
            if (shiftLeftCharsRef.current.includes(currentKey)) {
                setRightHandImage(rightShiftHand)
                keysRef.current['right-shift'].key.classList.add('heighlight');
            }
            else {
                keysRef.current['left-shift'].key.classList.add('heighlight');
                setLeftHandImage(leftShiftHand)
            }
        }
        else if (cKey.isAlpha && currentKey != currentPressedChar) {
            // alphachar and shiftKeyReq
            if (shiftLeftAphaCharsRef.current.includes(currentKey)) {
                setRightHandImage(rightShiftHand)
                keysRef.current['right-shift'].key.classList.add('heighlight');
            }
            else {
                keysRef.current['left-shift'].key.classList.add('heighlight');
                setLeftHandImage(leftShiftHand)
            }
        }

    }, [currentKey, keysRef.current])


    return (
        <div className='keyboard-outer'>
            <img src={leftHandImage} alt="" className='left-hand' />
            <img src={rightHandImage} alt="" className='right-hand' />
            <div className="keyboard" ref={keyboardRef}>
                <div className="row number-row">
                    <div className="key num special dbl tidle">
                        <div className="top" value="~">~</div>
                        <div className="bt" value="`">`</div>
                    </div>
                    <div className="key num normal dbl">
                        <div className="top" value="!">!</div>
                        <div className="bt" value="1">1</div>
                    </div>
                    <div className="key num normal dbl">
                        <div className="top" value="@">@</div>
                        <div className="bt" value="2">2</div>
                    </div>
                    <div className="key num normal dbl">
                        <div className="top" value="#">#</div>
                        <div className="bt" value="3">3</div>
                    </div>
                    <div className="key num normal dbl">
                        <div className="top" value="$">$</div>
                        <div className="bt" value="4">4</div>
                    </div>
                    <div className="key num normal dbl">
                        <div className="top" value="%">%</div>
                        <div className="bt" value="5">5</div>
                    </div>
                    <div className="key num normal dbl">
                        <div className="top" value="^">^</div>
                        <div className="bt" value="6">6</div>
                    </div>
                    <div className="key num normal dbl">
                        <div className="top" value="&">&</div>
                        <div className="bt" value="7">7</div>
                    </div>
                    <div className="key num normal dbl">
                        <div className="top" value="*">*</div>
                        <div className="bt" value="8">8</div>
                    </div>
                    <div className="key num normal dbl">
                        <div className="top" value="(">(</div>
                        <div className="bt" value="9">9</div>
                    </div>
                    <div className="key num normal dbl">
                        <div className="top" value=")">)</div>
                        <div className="bt" value="0">0</div>
                    </div>
                    <div className="key normal dbl">
                        <div className="top" value="_">_</div>
                        <div className="bt" value="-">-</div>
                    </div>
                    <div className="key normal dbl">
                        <div className="top" value="+">+</div>
                        <div className="bt" value="=">=</div>
                    </div>
                    <div className="key special backspace" value="Backspace">Backspace</div>
                </div>
                <div className="row">
                    <div className="key special tab" value="Tab">Tab</div>
                    <div className="key alpha normal" value="q">Q</div>
                    <div className="key alpha normal" value="w">W</div>
                    <div className="key alpha normal" value="e">E</div>
                    <div className="key alpha normal" value="r">R</div>
                    <div className="key alpha normal" value="t">T</div>
                    <div className="key alpha normal" value="y">Y</div>
                    <div className="key alpha normal" value="u">U</div>
                    <div className="key alpha normal" value="i">I</div>
                    <div className="key alpha normal" value="o">O</div>
                    <div className="key alpha normal" value="p">P</div>
                    <div className="key alpha normal dbl">
                        <div className="top" value="{"></div>
                        <div className="bt" value="[">[</div>
                    </div>
                    <div className="key normal dbl">
                        <div className="top" value="}"></div>
                        <div className="bt" value="]">]</div>
                    </div>
                    <div className="key normal dbl">
                        <div className="top" value="|">|</div>
                        <div className="bt" value="\">\</div>
                    </div>
                </div>
                <div className="row">
                    <div className="key special capslock" value="CapsLock">Caps Lock</div>
                    <div className="key alpha normal" value="a">A</div>
                    <div className="key alpha normal" value="s">S</div>
                    <div className="key alpha normal" value="d">D</div>
                    <div className="key alpha normal" value="f">F</div>
                    <div className="key alpha normal" value="g">G</div>
                    <div className="key alpha normal" value="h">H</div>
                    <div className="key alpha normal" value="j">J</div>
                    <div className="key alpha normal" value="k">K</div>
                    <div className="key alpha normal" value="l">L</div>
                    <div className="key normal dbl">
                        <div className="top" value=":">:</div>
                        <div className="bt" value=";">;</div>
                    </div>
                    <div className="key normal dbl">
                        <div className="top" value='"'>&quot;</div>
                        <div className="bt" value="'">&apos;</div>
                    </div>
                    <div className="key special enter" value="Enter">Enter</div>

                </div>
                <div className="row">
                    <div className="key special shift left-shift" value="left-shift">Shift</div>
                    <div className="key alpha normal" value="z">Z</div>
                    <div className="key alpha normal" value="x">X</div>
                    <div className="key alpha normal" value="c">C</div>
                    <div className="key alpha normal" value="v">V</div>
                    <div className="key alpha normal" value="b">B</div>
                    <div className="key alpha normal" value="n">N</div>
                    <div className="key alpha normal" value="m">M</div>
                    <div className="key alpha normal dbl">
                        <div className='top' value="<">&lt;</div>
                        <div className='bt' value=",">,</div>
                    </div>
                    <div className="key alpha normal dbl">
                        <div className="top" value=">">&gt;</div>
                        <div className="bt" value=".">.</div>
                    </div>
                    <div className="key alpha normal dbl">
                        <div className="top" value="?">?</div>
                        <div className="bt" value="/">/</div>
                    </div>
                    <div className="key alpha special shift right-shift" value="right-shift">Shift</div>

                </div>
                <div className="row space-row">
                    <div className="key alpha special ctrl">Ctrl</div>
                    <div className="key alpha special fn">Fn</div>
                    <div className="key alpha special windows">
                        <AiFillWindows onClick={goSettings} />
                    </div>
                    <div className="key alpha special alt">Alt</div>

                    <div className="key space" value="Space"> </div>
                    <div className="key alpha special alt">Alt</div>

                    <div className="key alpha special fn" onClick={goSettings}>Ctrl</div>
                </div>
            </div>
        </div>
    )
}
