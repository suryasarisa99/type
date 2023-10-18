import { useContext, useState } from 'react'
import { DataContext } from '../context/DataContext'
import "./empty.scss"
export default function Empty({ goSettings, reset, len }) {
    const { dSett } = useContext(DataContext)
    const [showRefresh, setShowR] = useState(false)
    const defaultValues = {
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
    }
    function handleReset() {
        console.log("reset settings")
        localStorage.setItem('options', JSON.stringify(defaultValues))
        dSett({
            type: '',
            payload: defaultValues
        })
        reset({ len: len })
    }
    return (
        <div className='on-empty'>
            <h1>Empty</h1>
            <h4>As Per Settings 0 Words Found</h4>
            <div className="row">
                <button onClick={goSettings}>Change Settings</button>
                <p className='or'>Or</p>
                {!showRefresh ?
                    < button onClick={handleReset}>Double click to Reset Settings</button>
                    :
                    <p className='refresh'>Refresh Now</p>
                }
            </div>
        </div >
    )
}
