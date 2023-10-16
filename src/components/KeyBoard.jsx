import { useEffect, useContext, useCallback, useState, useRef } from 'react'
import "./kb.scss";
import { AiFillWindows } from 'react-icons/ai'
export default function KeyBoard({ currentKey }) {

    const keyboardRef = useRef(null);
    const keysRef = useRef([]);
    const leftShiftKeyRef = useRef(null);
    const rightShiftKeyRef = useRef(null);
    const prvKeyRef = useRef(null);
    const shiftLeftAphaCharsRef = useRef("AESDRBGFCTWVXQZ")
    const shiftRightAphaCharsRef = useRef("IJOPHMNKLUY")
    const shiftLeftCharsRef = useRef("~!@#$%")
    const shiftRightCharsRef = useRef("^&*()_+{}|:\"<>?")

    useEffect(() => {
        const rawKeys = keyboardRef.current.querySelectorAll('.key');
        rawKeys.forEach(key => {
            // if (key.classList.contains('dbl')) {
            //     keysRef.current.push(key.querySelector('.top'))
            //     keysRef.current.push(key.querySelector('.bt'))
            // } else
            keysRef.current.push(key)
        })
        leftShiftKeyRef.current = keyboardRef.current.querySelector('.shift');
        rightShiftKeyRef.current = keyboardRef.current.querySelector('.right-shift');

    }, [])

    useEffect(() => {
        console.log(`currentkey: ${currentKey}`)
        prvKeyRef.current?.classList?.remove('heighlight');
        leftShiftKeyRef.current?.classList.remove('heighlight');
        rightShiftKeyRef.current?.classList.remove('heighlight');
        console.log(keysRef.current)
        if (currentKey == undefined) currentKey = " ";
        keysRef.current.forEach(key => {
            console.log(`${key} ---- ${currentKey}`)

            if (key.textContent == currentKey.toUpperCase()) {
                console.log(key)
                key.classList.add('heighlight')
                prvKeyRef.current = key;

                if (shiftLeftAphaCharsRef.current.includes(currentKey))
                    rightShiftKeyRef.current.classList.add('heighlight')
                else if (shiftRightAphaCharsRef.current.includes(currentKey)) {
                    leftShiftKeyRef.current.classList.add('heighlight')
                }
                return;
            }
            if (key.classList.contains('dbl')) {
                let [top, bottom] = key.childNodes;
                if (
                    bottom.textContent == currentKey ||
                    top.textContent == currentKey
                ) {
                    prvKeyRef.current = key;
                    key.classList.add('heighlight')
                    if (shiftLeftCharsRef.current.includes(currentKey))
                        rightShiftKeyRef.current.classList.add('heighlight')
                    else if (shiftRightCharsRef.current.includes(currentKey))
                        leftShiftKeyRef.current.classList.add('heighlight')

                    return;
                }
            }
        })
    }, [currentKey, keysRef.current])


    return (
        <div className='keyboard-outer'>
            <div className="keyboard" ref={keyboardRef}>
                <div className="row number-row">
                    <div className="key num special dbl tidle">
                        <div className="top">~</div>
                        <div className="bt">`</div>
                    </div>
                    <div className="key num normal dbl">
                        <div className="top">!</div>
                        <div className="bt">1</div>
                    </div>
                    <div className="key num normal dbl">
                        <div className="top">@</div>
                        <div className="bt">2</div>
                    </div>
                    <div className="key num normal dbl">
                        <div className="top">#</div>
                        <div className="bt">3</div>
                    </div>
                    <div className="key num normal dbl">
                        <div className="top">$</div>
                        <div className="bt">4</div>
                    </div>
                    <div className="key num normal dbl">
                        <div className="top">%</div>
                        <div className="bt">5</div>
                    </div>
                    <div className="key num normal dbl">
                        <div className="top">^</div>
                        <div className="bt">6</div>
                    </div>
                    <div className="key num normal dbl">
                        <div className="top">&</div>
                        <div className="bt">7</div>
                    </div>
                    <div className="key num normal dbl">
                        <div className="top">*</div>
                        <div className="bt">8</div>
                    </div>
                    <div className="key num normal dbl">
                        <div className="top">(</div>
                        <div className="bt">9</div>
                    </div>
                    <div className="key num normal dbl">
                        <div className="top">)</div>
                        <div className="bt">0</div>
                    </div>
                    <div className="key normal dbl">
                        <div className="top">_</div>
                        <div className="bt">-</div>
                    </div>
                    <div className="key normal dbl">
                        <div className="top">+</div>
                        <div className="bt">=</div>
                    </div>
                    <div className="key special backspace">Backspace</div>
                </div>
                <div className="row">
                    <div className="key special tab">Tab</div>
                    <div className="key alpha normal">Q</div>
                    <div className="key alpha normal">W</div>
                    <div className="key alpha normal">E</div>
                    <div className="key alpha normal">R</div>
                    <div className="key alpha normal">T</div>
                    <div className="key alpha normal">Y</div>
                    <div className="key alpha normal">U</div>
                    <div className="key alpha normal">I</div>
                    <div className="key alpha normal">O</div>
                    <div className="key alpha normal">P</div>
                    <div className="key alpha normal dbl">
                        <div className="top"></div>
                        <div className="bt">[</div>
                    </div>
                    <div className="key normal dbl">
                        <div className="top"></div>
                        <div className="bt">]</div>
                    </div>
                    <div className="key normal dbl">
                        <div className="top">|</div>
                        <div className="bt">\</div>
                    </div>
                </div>
                <div className="row">
                    <div className="key special capslock">Caps Lock</div>
                    <div className="key alpha normal">A</div>
                    <div className="key alpha normal">S</div>
                    <div className="key alpha normal">D</div>
                    <div className="key alpha normal">F</div>
                    <div className="key alpha normal">G</div>
                    <div className="key alpha normal">H</div>
                    <div className="key alpha normal">J</div>
                    <div className="key alpha normal">K</div>
                    <div className="key alpha normal">L</div>
                    <div className="key normal dbl">
                        <div className="top">:</div>
                        <div className="bt">;</div>
                    </div>
                    <div className="key normal dbl">
                        <div className="top">&quot;</div>
                        <div className="bt">&apos;</div>
                    </div>
                    <div className="key special enter">Enter</div>

                </div>
                <div className="row">
                    <div className="key special shift">Shift</div>
                    <div className="key alpha normal">Z</div>
                    <div className="key alpha normal">X</div>
                    <div className="key alpha normal">C</div>
                    <div className="key alpha normal">V</div>
                    <div className="key alpha normal">B</div>
                    <div className="key alpha normal">N</div>
                    <div className="key alpha normal">M</div>
                    <div className="key alpha normal dbl">
                        <div className='top'>&lt;</div>
                        <div className='bt'>,</div>
                    </div>
                    <div className="key alpha normal dbl">
                        <div className="top">&gt;</div>
                        <div className="bt">.</div>
                    </div>
                    <div className="key alpha normal dbl">
                        <div className="top">?</div>
                        <div className="bt">/</div>
                    </div>
                    <div className="key alpha special right-shift">Shift</div>

                </div>
                <div className="row space-row">
                    <div className="key alpha special ctrl">Ctrl</div>
                    <div className="key alpha special fn">Fn</div>
                    <div className="key alpha special windows">

                        <AiFillWindows />
                    </div>
                    <div className="key alpha special alt">Alt</div>

                    <div className="key space"> </div>
                    <div className="key alpha special alt">Alt</div>
                    <div className="key alpha special fn">Ctrl</div>
                </div>
            </div>
        </div>
    )
}
