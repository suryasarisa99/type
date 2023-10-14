import { createContext, useState, useEffect } from 'react'


const DataContext = createContext();
export default function DataProvider({ children }) {
    const [limit, setLimit] = useState(JSON.parse(localStorage.getItem('limit')) || 45)

    return (
        <DataContext.Provider value={{
            limit, setLimit
        }}>
            {children}
        </DataContext.Provider>
    )
}

export { DataContext };