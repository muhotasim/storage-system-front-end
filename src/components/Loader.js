import React from "react";
import appConst from "../constants/appConst";
import message from "../constants/message";
const Loader = ()=>{
    return <div className="loader">
        <div className="text-center">
            <div className="loader-circle"></div>
            <p className="message">{message[appConst.lan].loading}</p>
        </div>
    </div>
}
export default Loader;