import axios from "axios";
const BASE_URL = import.meta.VITE_API_URL +"auth/loginuser";

const login = ({username,password}) => {

    return axios.post('${BASE_URL}login',
    {
        "username":username,
        "password":password
    },
    {
        headers: {
            "accept":"*"
        
        }
    });
}
export default{
    login
}