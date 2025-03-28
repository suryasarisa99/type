import { useEffect, useState, useContext } from "react";
import { FaChevronCircleLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import { DataContext } from "../context/DataContext";
import Themes from "./Themes";

export default function Settings({ back }) {
  const { settState: opt, dSett } = useContext(DataContext);

  const [min, setMin] = useState(opt.min);
  const [max, setMax] = useState(opt.max);
  const [all, setAll] = useState(opt.all.join(""));
  const [any, setAny] = useState(opt.any.join(""));
  const [none, setNone] = useState(opt.none.join(""));
  const [data, setData] = useState(opt.data);
  const [only, setOnly] = useState(opt.only.join(""));
  const [complexity, setComplexity] = useState(opt.complexity);
  const [showKeyboard, setShowKeyboard] = useState(opt.showKeyboard);
  const [speak, setSpeak] = useState(opt.speak);
  let [random, setRandom] = useState(opt.random);
  let [randoms, setRandoms] = useState(opt.randoms);

  function setNonRandom(e) {
    setRandom(false);
    setData(e.target.value);
  }

  useEffect(() => {
    document.addEventListener("keydown", onBackSpace);
    return () => {
      document.removeEventListener("keydown", onBackSpace);
    };
  }, []);

  const onBackSpace = (e) => {
    console.log(e.key);
    if (e.key == "Escape") back();
    if (e.target.tagName == "INPUT") return;
    console.log(e.target);
    if (e.key == "Backspace") back();
  };

  return (
    <motion.div
      className="settings"
      initial={{ y: 100, x: 0 }}
      animate={{ y: 0, x: 0 }}
      exit={{ y: 100, x: 0 }}
      // transition={{ delay: 0.3 }}
      // whileInView={()=>{}}
    >
      <FaChevronCircleLeft className="back" onClick={back} title="Escape" />

      <div className="forms">
        <form
          onSubmit={(e) => {
            e.preventDefault();

            let options = {
              min: +e.target.min.value,
              max: +e.target.max.value,
              all: all.split(""),
              any: any.split(""),
              none: none.split(""),
              data,
              random,
              complexity: +complexity,
              randoms,
              only: only.split(""),
              showKeyboard,
              speak,
            };

            dSett({
              type: "",
              payload: options,
            });

            localStorage.setItem("options", JSON.stringify(options));
            back();
          }}
        >
          <div className="form-boxes">
            <div className="form-box">
              <div className="field">
                <p> No of characters per word</p>
                <div className="row">
                  <div className="row-sb">
                    <p>Min</p>{" "}
                    <input
                      type="text"
                      className="small-input"
                      value={min}
                      name="min"
                      onChange={(e) => setMin(e.target.value)}
                    />
                  </div>
                  <div className="row-sb">
                    <p>Max</p>{" "}
                    <input
                      type="text"
                      className="small-input"
                      value={max}
                      name="max"
                      onChange={(e) => setMax(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="field">
                <p>Must Contain All These Characters</p>
                <input
                  type="text"
                  name="all"
                  value={all}
                  onChange={(e) => setAll(e.target.value)}
                />
              </div>

              <div className="field">
                <p>Contain Any one of these Character</p>
                <input
                  type="text"
                  name="any"
                  value={any}
                  onChange={(e) => setAny(e.target.value)}
                />
              </div>
              <div className="field">
                <p>Contain only from these Character</p>
                <input
                  type="text"
                  name="only"
                  value={only}
                  onChange={(e) => setOnly(e.target.value)}
                />
              </div>
              <div className="field">
                <p>Does Not Contain Any of These</p>
                <input
                  type="text"
                  name="none"
                  value={none}
                  onChange={(e) => setNone(e.target.value)}
                />
              </div>
            </div>
            <div className="form-boxes-col">
              <div className="form-box">
                <div className="radio-row">
                  <div className="row-sb">
                    <input
                      type="radio"
                      checked={data == "200"}
                      name="data"
                      value="200"
                      id="200"
                      onChange={(e) => setNonRandom(e)}
                    />
                    <label htmlFor="200">200 Words</label>
                  </div>
                  {/* <div className="row-sb">
                                        <input type="radio" checked={data == "1k"} name="data" value="1k" onChange={(e) => setNonRandom(e)} />
                                        <p>1k Words</p>
                                    </div> */}
                  <div className="row-sb">
                    <input
                      type="radio"
                      name="data"
                      checked={data == "meanings"}
                      value="meanings"
                      id="meanings"
                      onChange={(e) => setNonRandom(e)}
                    />
                    <label htmlFor="meanings">Meanings</label>
                  </div>
                  <div className="row-sb">
                    <input
                      type="radio"
                      name="data"
                      id="facts"
                      checked={data == "facts"}
                      value="facts"
                      onChange={(e) => setNonRandom(e)}
                    />
                    <label htmlFor="facts">Facts</label>
                  </div>
                </div>
                <div className="radio-">
                  <div className="lable-3l">
                    <input
                      type="radio"
                      checked={data == "3l"}
                      name="data"
                      value="3l"
                      id="3l"
                      onChange={(e) => setNonRandom(e)}
                    />
                    <label htmlFor="3l">3 Lack+ Words</label>
                  </div>
                  <div className="range-3l">
                    <span>frequent</span>
                    <input
                      type="range"
                      min={0}
                      max={19}
                      value={complexity}
                      disabled={data != "3l"}
                      onChange={(e) => {
                        setRandom(false);
                        setComplexity(e.target.value);
                      }}
                    />{" "}
                    <span>Infrequent</span>
                  </div>
                </div>
              </div>
              <div className="form-box">
                <div className="radio-input">
                  <input
                    type="radio"
                    checked={random}
                    name="data"
                    onChange={(e) => {
                      setRandom(true);
                      setData("random");
                    }}
                  />
                  <p className="random-chr">Random Characters</p>
                </div>
                {
                  <div className="range-row">
                    <div className="row-sb">
                      <p>chars</p>
                      <input
                        type="range"
                        disabled={!random}
                        name="randomType"
                        value={randoms.char}
                        min={0}
                        max={20}
                        onChange={(e) =>
                          setRandoms((prv) => ({
                            ...prv,
                            char: +e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="row-sb">
                      <p>capital</p>
                      <input
                        type="range"
                        disabled={!random}
                        name="cap"
                        value={randoms.cap}
                        min={0}
                        max={20}
                        onChange={(e) =>
                          setRandoms((prv) => ({
                            ...prv,
                            cap: +e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="row-sb">
                      <p>numbers</p>
                      <input
                        type="range"
                        disabled={!random}
                        name="randomtype"
                        value={randoms.num}
                        min={0}
                        max={20}
                        onChange={(e) =>
                          setRandoms((prv) => ({
                            ...prv,
                            num: +e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="row-sb">
                      <p>symbols</p>
                      <input
                        type="range"
                        disabled={!random}
                        name="randomtype"
                        value={randoms.sym}
                        onChange={(e) =>
                          setRandoms((prv) => ({
                            ...prv,
                            sym: +e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                }
              </div>
              <form action="" className="form-box">
                <div className="radio-row">
                  <div className="row-sb">
                    <label htmlFor="showKeyboard">Show Keyboard</label>
                    <input
                      type="checkbox"
                      name="showKeyboard"
                      id="showKeyboard"
                      checked={showKeyboard}
                      onChange={(e) => setShowKeyboard(e.target.checked)}
                    />
                  </div>
                  <div className="row-sb">
                    <label htmlFor="speak">Lets Speak</label>
                    <input
                      id="speak"
                      type="checkbox"
                      name="speak"
                      checked={speak}
                      onChange={(e) => setSpeak(e.target.checked)}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="right">
            <button>Save</button>
          </div>

          <Themes />
        </form>
      </div>
    </motion.div>
  );
}
