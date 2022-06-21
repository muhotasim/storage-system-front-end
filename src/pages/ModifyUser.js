import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { connect } from "react-redux";
import appConst from "../constants/appConst";
import message from "../constants/message";
import ApiHandeler from "../apiHandeler";
import { useNavigate, useParams } from "react-router-dom";
import { SaveOutlined } from "@ant-design/icons";
const users = "users";
const ModifyUser= props => {
    let { id } = useParams();
    const navigate = useNavigate();
    const [ name, setName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ isInternal, setIsInternal ] = useState(false)
    const [ status, setStatus ] = useState(true)
    const [ roles, setRoles ] = useState([])
    const [ selectedRoles, setSelectedRoles ] = useState([])
    const [ errorMessage, setError ] = useState('')

    useEffect(()=>{

        const apiHandeler = new ApiHandeler(props.userStore.token)
        setEmail('')
        setName('')
        setPassword('')
        setStatus(true)
        setIsInternal(false)
        apiHandeler.querySystem("roles",{  }).then(res=>res.json()).then(roleRes=>{
            if(roleRes.type==appConst.successResponseType){
                setRoles(roleRes.data)
                if(id){

                    apiHandeler.getSystem(users,id).then(res=>res.json()).then(res=>{
                        if(res.type==appConst.successResponseType){
                            const user = res.data[0]
                            setEmail(user.email)
                            setName(user.name)
                            setPassword(user.password)
                            setStatus(user.status?true:false)
                            setIsInternal(user.is_internal?true:false)
                            
                            apiHandeler.querySystem("user_role",{ 
                                select: JSON.stringify(['role_id']),
                                condition: JSON.stringify([{ field: "user_id", condition: "=", value: id }]) 
                            })
                            .then(res=>res.json()).then(roleRes=>{
                               
                                if(roleRes.type==appConst.successResponseType){
                                    
                                    setSelectedRoles(roleRes.data.map(role=>role.role_id))
                                }
                            })
                            window.notify(message[appConst.lan].successLoad,3000,"default")
                        }else{
            
                            window.notify(message[appConst.lan].failToLoad,3000,"danger")
                        }
                    })
                }
            }else{
                    
                window.notify(message[appConst.lan].failToLoad,3000,"danger")
            }
        })
       
        
    }, [])
    const onSubmit = ()=>{
        if(!name||!email||!password){
            setError(message[appConst.lan].pages.apps.errors.validation)
            return
        }
        setError('')
        
        const apiHandeler = new ApiHandeler(props.userStore.token)
        if(id){
            apiHandeler.updateUser(id,users,{
                name, email, password,is_internal:isInternal?1:0,status:status?1:0, roles: selectedRoles.join(",") 
            }).then(res=>res.json()).then(res=>{
                if(res.type==appConst.successResponseType){
                    window.notify(message[appConst.lan].updatedSave,3000,"default")
                    afterSubmit();
                }else{
                    window.notify(message[appConst.lan].failedToUpdate,3000,"danger")
                }
            })
        }else{
            
            apiHandeler.insertUser(users,{
                name, email, password,is_internal:isInternal?1:0,status:status?1:0, roles: selectedRoles.join(",") 
            }).then(res=>res.json()).then(res=>{
                if(res.type==appConst.successResponseType){
                    window.notify(message[appConst.lan].successSave,3000,"default")
                   afterSubmit()
                }else{
                    window.notify(message[appConst.lan].failedToSave,3000,"danger")
                }
            })
        }
    }
    const afterSubmit = ()=>{
        navigate("/users")
    }
    const roleCheckUncheck = (id)=>{
        
        let selectedRolesData = [...selectedRoles]
        if(!selectedRoles.includes(id)){
            selectedRolesData.push(id)
        }else{
            selectedRolesData.splice(selectedRoles.findIndex(d=>d==id),1)
        }
        setSelectedRoles(selectedRolesData);
    }
    return <div className="container page">
         <Header title={message[appConst.lan].pages.createUser.header.title} description={message[appConst.lan].pages.createUser.header.content}/>

        <div className="row">
            <div className="col-md-6">
            {errorMessage&&<div className="mt-5 pt-15">
                <div className='alert alert-danger alert-md'>
                  <p>{errorMessage}</p>
                </div>
              </div>}
                <div className="mt-10 mb-15">
                    <label>{message[appConst.lan].pages.users.form.name}</label>
                    <input className="input input-md" value={name} onChange={e=>setName(e.target.value)}/>
                </div>
                <div className="mt-10 mb-15">
                    <label>{message[appConst.lan].pages.users.form.email}</label>
                    <input className="input input-md"  value={email} onChange={e=>setEmail(e.target.value)}/>
                </div>
                <div className="mt-10 mb-15">
                    <label>{message[appConst.lan].pages.users.form.password}</label>
                    <input className="input input-md"  value={password} onChange={e=>setPassword(e.target.value)}/>
                </div>
                <div className="mt-10 mb-15">
                    <label>  <input type={"checkbox"} checked={isInternal} onChange={e=>setIsInternal(!isInternal)}/> {message[appConst.lan].pages.users.form.internal}</label>
                </div>
                <div className="mt-10 mb-15">
                    <label>  <input type={"checkbox"} checked={status} onChange={e=>setStatus(!status)}/> {message[appConst.lan].pages.users.form.status}</label>
                </div>
                <div className="pt-15">
                    <label className="d-block pb-5">{message[appConst.lan].pages.users.form.roles}</label>
                </div>
                <div className="mb-15 mt-15">
                    {roles.length?<div className="row">
                        {roles.map((role,index)=>(<div key={'role_'+index} className="col-md-4"><label className="d-block pt-5"><input type={"checkbox"} checked={selectedRoles.includes(role.id)} onChange={()=>roleCheckUncheck(role.id)}/>  {role.name}</label></div>))}
                    </div>:<p className="pt-15 pb-15 text-center">{message[appConst.lan].pages.users.form.noRole}</p>}
                </div>
                <button className="btn btn-md btn-primary pull-right" onClick={onSubmit}><SaveOutlined/> {id?message[appConst.lan].form.update:message[appConst.lan].form.save} </button>
        
            </div>
        </div>
         
    </div>
}
const mapStateToProps = (state)=>{
    return {
        userStore: state.userStore
    }
}
const mapDispatchToProps = (dispatch)=>{
    return {
    }    
}
export default connect(mapStateToProps, mapDispatchToProps)(ModifyUser);