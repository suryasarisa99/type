import React from 'react'

export default function Themes({ back }) {
    const themes = ["gray", "monokai", "burgundy", "dots"]
    return (
        <div className='themes-page'>
            <button onClick={back}>back</button>
            {themes.map((theme) => {
                return <div className={'theme ' + theme} key={theme} onClick={() => {
                    document.documentElement.className = "";
                    document.documentElement.classList.add(theme);
                }}>
                    <p>{theme}</p>
                </div>
            })}
        </div>
    )
}
