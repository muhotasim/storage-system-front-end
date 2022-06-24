import React, { lazy, Suspense, useEffect, useState } from 'react';
import {connect} from "react-redux"
import './styles/main.scss';
const menu = require('./menu.json');
import {
    HashRouter as Router,
    Routes as Switch,
    Route, useNavigate
  } from "react-router-dom";
import Navigation from './components/Navigation';
import Loader from './components/Loader';
const Apps = lazy(()=>import('./pages/Apps'));
const Users = lazy(()=>import('./pages/Users'));
const Home = lazy(()=>import('./pages/Modules'));
const Permissions = lazy(()=>import('./pages/Permissions'));
const Roles = lazy(()=>import('./pages/Roles'));
const ModifyUser = lazy(()=>import('./pages/ModifyUser'));
const ModifyRole = lazy(()=>import('./pages/ModifyRole'));
const ModifyPermission =lazy(()=>import('./pages/ModifyPermission'));

const LoginBox = lazy(()=>import("./components/LoginBox"));

const App = props=>{
    const [ notifyData, setNotifyData ] = useState({ show: false, message: "", type: "dark" })
    const [ confirmData, setConfirmData ] = useState({ 
        show: false,
        message: "",
        type: "light",
        confirmText:"Yes",
        cancelText:"No",
        showConfirmBtn: true,
        showCancelBtn: true,
        confirmCallback: null,
        cancelCallback: null })
    useEffect(()=>{
        window.notify = (message, timer, type = "default") => {
            setNotifyData({ show: true, message: message, type })
            setTimeout(()=>{
                if(window.notify) clearTimeout(window.notify); 
                setNotifyData({ show: false, message: "",type: "default" })
            },timer)
        }
        window.confirmModel = ({ message, type = "light", confirmText = "Yes", cancelText = "No", showConfirmBtn = true, showCancelBtn = true, confirmCallback = null, cancelCallback = null}) => {
            setConfirmData({ 
                show: true,
                message: message,
                type: type,
                confirmText:confirmText,
                cancelText:cancelText,
                confirmCallback,
                cancelCallback: cancelCallback,showConfirmBtn, showCancelBtn })
        }
    },[])
    const clearNotifier = ()=>{
        if(window.notify) clearTimeout(window.notify); 
        setNotifyData({ show: false, message: "", type: "default" })
    }

    if(!props.userStore.logedIn){
        return <Suspense fallback={<Loader/>}>
            <LoginBox login={props.login}/>
        </Suspense>
    }
    return <Suspense fallback={<Loader/>}>
        <Router>
            <div>
                {notifyData.show&&<div className={'right-to-left notification-box '+notifyData.type}>
                    <span className='close pull-right' onClick={clearNotifier}>&times;</span>
                    <p className='clearfix'></p>
                    <p>{notifyData.message}</p>
                </div>}
                
                {confirmData.show&&<div className={'right-to-left notification-box '+confirmData.type}>
                    <p className='confirm-message'>{confirmData.message}</p>
                    <div className='action-holder pt-15'>
                        {confirmData.showConfirmBtn&&<button className='btn btn-sm btn-primary mr-10' onClick={()=>{
                            confirmData.confirmCallback();
                            setConfirmData({  show: false, message: "", type: "light", confirmText:"", cancelText:"", confirmCallback: null,cancelCallback: null })

                        }}>{confirmData.confirmText}</button>}
                        {confirmData.showCancelBtn&&<button className='btn btn-sm btn-light' onClick={()=>{
                            if(confirmData.cancelCallback) confirmData.cancelCallback()
                            setConfirmData({  show: false, message: "", type: "light", confirmText:"", cancelText:"", confirmCallback: null,cancelCallback: null })
                        }}>{confirmData.cancelText}</button>}
                    </div>
                </div>}
            <Navigation menu={menu} history={history}/>

            <Switch>
                <Route exact path="/" element={<Apps/>}/>
                <Route exact path="/modules" element={<Home/>}/>
                <Route exact path="/users" element={<Users/>}/>
                <Route exact path="/users/create" key="user-create" element={<ModifyUser/>}/>
                <Route exact path="/users/modify/:id" key="user-edit" element={<ModifyUser/>}/>
                <Route exact path="/roles" element={<Roles/>}/>
                <Route exact path="/roles/create" key="role-create" element={<ModifyRole/>}/>
                <Route exact path="/roles/modify/:id" key="role-edit" element={<ModifyRole/>}/>

                <Route exact path="/permissions" element={<Permissions/>}/>
                <Route exact path="/permissions/create" key="role-create" element={<ModifyPermission/>}/>
                <Route exact path="/permissions/modify/:id" key="role-edit" element={<ModifyPermission/>}/>
            </Switch>
            </div>
        </Router>
    </Suspense>
}
const mapStateToProps = (state)=>{
    return {
        userStore: state.userStore
    }
}
const mapDispatchToProps = (dispatch)=>{
    return {
        login: (data)=>{
            dispatch({ type: "login", payload: data })
        }
    }    
}
export default connect(mapStateToProps, mapDispatchToProps)(App);