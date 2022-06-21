import React, { useState } from "react";
import ApiHandeler from "../apiHandeler";
import appConst from "../constants/appConst";
const LoginBox = props=>{
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const onLogin = ()=>{
        const apiHandeler = new ApiHandeler();
        if(email&&password){
            apiHandeler.login(email, password).then(res=>res.json()).then(res=>{
                if(res.type==appConst.successResponseType){
                    props.login({token: res.token,...res.user})
                }
            })
        }
    }
    return <div className="login-box-holder">
        <div className="login-box">
            <h3>Login</h3>
            <div className="pb-5 mb-15">
                <label>Email</label>
                <input className="input input-md" value={email} onChange={e=>setEmail(e.target.value)}/>
            </div>
            <div className="pb-5 mb-15">
                <label>Password</label>
                <input className="input input-md" value={password} onChange={e=>setPassword(e.target.value)}/>
            </div>
            <div>
                <button className="btn btn-md btn-primary pull-right" onClick={onLogin}>Login</button>
            </div>
        </div>
    </div>
}
export default LoginBox;