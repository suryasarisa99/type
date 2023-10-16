import { useEffect } from 'react'
import { FaChevronCircleLeft } from 'react-icons/fa'
export default function Themes({ back }) {
    const themes = ["gray", "monokai", "burgundy", "dots", "arora"]
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        return () =>
            document.addEventListener('keydown', handleKeyDown)
    })
    function handleKeyDown(e) {
        if (e.key == "Backspace")
            back();
    }
    return (
        <div className='themes-page'>
            <FaChevronCircleLeft className="back" onClick={back} />

            <div className='themes'>

                {themes.map((theme) => {
                    return <div className={'theme ' + theme} key={theme} onClick={() => {
                        document.documentElement.className = "";
                        document.documentElement.classList.add(theme);
                        back();
                        localStorage.setItem('theme', theme)
                    }}>
                        <p>{theme}</p>
                    </div>
                })}
            </div>
        </div>
    )
}
