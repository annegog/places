import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AdminContext = createContext({});

export function AdminContextProvider({children}) {
    const [admin, setAdmin] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect( () => {
        if (!admin) {
            axios.get('/profile-admin').then( ({data}) => {
                setAdmin(data);
                setReady(true);
            });
        }
    }, []);
    return (
        <AdminContext.Provider value={{admin, setAdmin, ready}}>
            {children}
        </AdminContext.Provider>
        
    );
}