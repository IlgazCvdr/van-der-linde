import axios from "axios";
import { createContext, useState } from "react";
import { apiUrl } from "../config/Constants";

const AuthContext = createContext(null);

export function AuthProvider(props) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    if(token == null && localStorage.getItem("token") != null){
        setToken(localStorage.getItem("token"));

        axios.get(apiUrl + "/user/whoami", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(response => {
            setUser(response.data);
        }).catch(err => {
            console.log(err);
        })
    }

    return <AuthContext.Provider value={{user, setUser, token, setToken}}>{props.children}</AuthContext.Provider>
}

export default AuthContext;