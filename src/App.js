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

const LoginBox = lazy(()=>import("./components/LoginBox"));

const App = props=>{
    const [ notifyData, setNotifyData ] = useState({ show: false, message: "", type: "dark" })
    useEffect(()=>{
        window.notify = (message, timer, type = "default") => {
            setNotifyData({ show: true, message: message, type })
            setTimeout(()=>{
                if(window.notify) clearTimeout(window.notify); 
                setNotifyData({ show: false, message: "",type: "default" })
            },timer)
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