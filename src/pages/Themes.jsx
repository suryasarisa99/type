import { useEffect } from 'react'
import { FaChevronCircleLeft } from 'react-icons/fa'
export default function Themes({ back }) {
    const themes = ["gray", "monokai", "burgundy", "dots", "arora"]

    return (
        <div className='themes-page'>
            <h4>Themes</h4>
            <div className='themes'>

                {themes.map((theme) => {
                    return <div className={'theme ' + theme} key={theme} onClick={() => {
                        document.documentElement.className = "";
                        document.documentElement.classList.add(theme);
                        localStorage.setItem('theme', theme)
                    }}>
                        <p>{theme}</p>
                    </div>
                })}
            </div>
        </div>
    )
}
