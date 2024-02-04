import { useContext, useState, useEffect } from 'react'
import { DataContext } from '../context/DataContext';

export default function Typos({ typos, reset }) {
    const { dSett } = useContext(DataContext);
    const limit = 5;
    console.log(typos)
    if (typos.length == 0 || typos[0].count < limit) return;
    return (
        <div className='typos'>
            {typos.filter(item => item.count >= limit).map((typo) => {
                return (
                    <div key={`${typo.a}-${typo.b}-${typo.word}-${typo.index}`}>
                        <p className='true'>{typo.a}</p>
                        <p className='false'>{typo.b}</p>
                        <p className='count'>+{typo.count}</p>
                        {/* <Expand items={typo.items} /> */}
                        <button onClick={(e) => {
                            // dSett({ type: 'all', payload: (typo.a + typo.b).split('') });
                            // setTimeout(() =>
                            //     reset(), 1000
                            // )
                            reset({ all: (typo.a + typo.b).split('') })
                        }}>practice</button>
                    </div>
                );

            })}
        </div>
    )
}

function Expand({ items }) {
    return <div className='typo-array'>
        {items.map((item, index) => {
            return <>
                {index == 0 && <span className='open-brace brace'>[</span>}
                <div key={`${item.word}-${index}`} className="typo-word">
                    {
                        item.word.split('').map((ch, chIndex) => {
                            if (chIndex == item.index)
                                return <span key={`${item.word}-${index}-${ch}-${chIndex}`} className='false'> {ch} </span>
                            return <span key={`${item.word}-${index}-${ch}-${chIndex}`} className='true'> {ch} </span>
                        })
                    }

                </div>
                {
                    index != items.length - 1 ? <span className='comma'>,</span> :
                        <span className='close-brace brace'>]</span>
                }
            </>
        })}
    </div >
}