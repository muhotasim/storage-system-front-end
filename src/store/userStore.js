import { eraseCookie, getCookie, setCookie } from "../utils";

let initialState = {
    id: null,
    name: "",
    email: "",
    permissions: [],
    is_internal: 1,
    token: "",
    logedIn: false,
};
try{
    const getToken = getCookie("tokenData");
    if(getToken){
        initialState = JSON.parse(getToken);
    }
}catch(e){
    console.error(e)
}
if(getCookie("tokenData")){}
const userStore = (state = initialState, action = {})=>{
    let newState;
    switch(action.type){
        case "login":
                action.payload.permissions = JSON.parse(action.payload.permissions);
                newState = {...{}, ...state, ...action.payload,...{logedIn:true}};
                setCookie("tokenData", JSON.stringify(newState), 120);
                return newState;
            break;
        case "logout":
                newState = {
                    id: null,
                    name: "",
                    email: "",
                    permissions: [],
                    is_internal: 1,
                    token: "",
                    logedIn: false,
                };
                eraseCookie("tokenData");
                return newState;
            break;
        default:
            return state;
    }
}
export default userStore;