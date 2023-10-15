import { useEffect, useState, useContext } from 'react'
import { FaChevronCircleLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { DataContext } from '../context/DataContext';

export default function Settings({ back }) {
    const { settState: opt, dSett } = useContext(DataContext)

    const [min, setMin] = useState(opt.min);
    const [max, setMax] = useState(opt.max);
    const [all, setAll] = useState(opt.all.join(''));
    const [any, setAny] = useState(opt.any.join(''));
    const [none, setNone] = useState(opt.none.join(''));
    const [data, setData] = useState(opt.data);
    const [complexity, setComplexity] = useState(opt.complexity);

    let [random, setRandom] = useState(opt.random);
    function setNonRandom(e) {
        setRandom(false);
        setData(e.target.value);
    }

    function setRandomType(e) {
        setRandom(true);
        setData(e.target.value);
    }
    useEffect(() => {
        document.addEventListener('keydown', onBackSpace)
        return () => {
            document.removeEventListener('keydown', onBackSpace)
        }
    }, [])

    const onBackSpace = (e) => {
        if (e.target.tagName == "INPUT") return;
        console.log(e.target)
        if (e.key == "Backspace")
            back()
    }


    return (

        <motion.div className='settings'
            initial={{ y: 800, x: 0 }}
            animate={{ y: 0, x: 0 }}
            exit={{ y: 800, x: 0 }}
        // transition={{ delay: 0.3 }}
        // whileInView={()=>{}}
        >
            {/* <button type="button" className='back-outer' onClick={back}>
                <FaChevronCircleLeft className="back" />
            </button> */}
            <FaChevronCircleLeft className="back" onClick={back} />


            <div className="forms">


                <form onSubmit={(e) => {

                    e.preventDefault();

                    let options = {
                        min: +e.target.min.value,
                        max: +e.target.max.value,
                        all: all.split(''),
                        any: any.split(''),
                        none: none.split(''),
                        data,
                        random,
                        complexity: +complexity
                    }

                    dSett({
                        type: '',
                        payload: options
                    })

                    localStorage.setItem('options', JSON.stringify(options))

                    back();
                }}>
                    <div className="field">
                        <p> No of characters per word</p>
                        <div className="row">
                            <div className="row-sb">
                                <p>Min</p> <input type="text" className="small-input" value={min} name="min" onChange={e => setMin(e.target.value)} />
                            </div>
                            <div className='row-sb'>
                                <p>Max</p> <input type="text" className="small-input" value={max} name="max" onChange={e => setMax(e.target.value)} />
                            </div>
                        </div>
                    </div>


                    <div className="field">

                        <p>Must Contain All These Characters</p>
                        <input type="text" name="all" value={all} onChange={e => setAll(e.target.value)} />
                    </div>

                    <div className="field">

                        <p>Contain Any one of these Character</p>
                        <input type="text" name="any" value={any} onChange={e => setAny(e.target.value)} />
                    </div>

                    <div className="field">
                        <p>Does Not Contain Any of These</p>
                        <input type="text" name="none" value={none} onChange={e => setNone(e.target.value)} />
                    </div>

                    <div className="radio-row">
                        <div className="row-sb">
                            <input type="radio" checked={data == "200"} name="data" value="200" onChange={(e) => setNonRandom(e)} />
                            <p>200 Words</p>
                        </div>
                        <div className="row-sb">
                            <input type="radio" checked={data == "1k"} name="data" value="1k" onChange={(e) => setNonRandom(e)} />
                            <p>1k Words</p>
                        </div>
                        <div className="row-sb">
                            <input type="radio" name="data" checked={data == "meanings"} value="meanings" onChange={e => setNonRandom(e)} />
                            <p>meanings</p>
                        </div>
                        <div className="row-sb">
                            <input type="radio" name="data" checked={data == "names"} value="names" onChange={e => setNonRandom(e)} />
                            <p>Names</p>
                        </div>
                        <div className="row-sb">
                            <input type="radio" name="data" checked={data == "facts"} value="facts" onChange={e => setNonRandom(e)} />
                            <p>Facts</p>
                        </div>

                    </div>
                    <div className="radio-row">
                        <input type="radio" checked={data == "3l"} name="data" value="3l" onChange={(e) => setNonRandom(e)} />
                        <p>3 lack+ Words</p>
                        <div className="row">
                            <span>frequent</span> <input type="range" min={0} max={19} value={complexity} disabled={data != "3l"} onChange={e => setComplexity(e.target.value)} /> <span>Infrequent</span>
                        </div>
                    </div>
                    <div className="radio-row">


                    </div>
                    <p className='radio-row'>Random</p>
                    <div className="radio-row">
                        <div className="row-sb">
                            <input type="radio" checked={data == "char"} name="data" value="char" onChange={(e) => setRandomType(e)} />
                            <p>chars</p>
                        </div>
                        {/* <div className="row-sb">
                            <input type="radio" checked={data == "cap"} name="data" value="cap" onChange={(e) => setRandomType(e)} />
                            <p>capital</p>
                        </div> */}
                        <div className="row-sb">
                            <input type="radio" checked={data == "num"} name="data" value="num" onChange={(e) => setRandomType(e)} />
                            <p>numbers</p>
                        </div>
                        <div className="row-sb">
                            <input type="radio" checked={data == "sym"} name="data" value="sym" onChange={(e) => setRandomType(e)} />
                            <p>symbols</p>
                        </div>
                    </div>

                    <div className="right">
                        <button>Save</button>
                    </div>
                </form>


            </div>
        </motion.div>

    )
}
