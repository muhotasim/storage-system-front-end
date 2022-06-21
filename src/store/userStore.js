const initialState = {
    id: null,
    name: "",
    email: "",
    permissions: [],
    is_internal: 1,
    token: "",
    logedIn: false,
};
const userStore = (state = initialState, action = {})=>{

    switch(action.type){
        case "login":
            action.payload.permissions = JSON.parse(action.payload.permissions);
            return {...{}, ...state, ...action.payload,...{logedIn:true}}
            break;
        default:
            return state;
    }
}
export default userStore;