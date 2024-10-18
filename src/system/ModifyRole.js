import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import appConst from "../constants/appConst";
import { connect } from "react-redux"
import message from "../constants/message";
import ApiHandeler from "../apiHandeler";
import { useNavigate, useParams } from "react-router-dom";
import { SaveOutlined } from "@ant-design/icons";
const roles = "roles";
const ModifyRole= props => {
    let { id } = useParams();
    const navigate = useNavigate();
    const [ name, setName ] = useState('')
    const [ permissions, setPermissions ] = useState([])
    const [ selectedPermissions, setSelectedPermissions ] = useState([])
    const [ errorMessage, setError ] = useState('')

    useEffect(()=>{
        
        const apiHandeler = new ApiHandeler(props.userStore.token)
        setName('')
        apiHandeler.querySystem("permissions",{ 
            condition: JSON.stringify([{ field: "type", condition: "=", value: `'view'` }]), }).then(res=>res.json()).then(permissionRes=>{
            if(permissionRes.type==appConst.successResponseType){
                
                setPermissions(permissionRes.data)
                if(id){

                    apiHandeler.getSystem(roles,id).then(res=>res.json()).then(res=>{
                        if(res.type==appConst.successResponseType){
                            const user = res.data[0]
                            setName(user.name)
                            
                            apiHandeler.querySystem("role_permission",{ 
                                select: JSON.stringify(['permission_id']),
                                condition: JSON.stringify([{ field: "role_id", condition: "=", value: `'${id}'` }]),
                                
                            })
                            .then(res=>res.json()).then(permissionRes=>{
                               
                                if(permissionRes.type==appConst.successResponseType){
                                    
                                    setSelectedPermissions(permissionRes.data.map(permission=>permission.permission_id))
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
        if(!roles){
            setError(message[appConst.lan].pages.apps.errors.validation)
            return
        }
        setError('')
        const apiHandeler = new ApiHandeler(props.userStore.token)
        if(id){
            apiHandeler.updateSystem(id,roles,{
                name, permissions: selectedPermissions.join(",") 
            }).then(res=>res.json()).then(res=>{
                if(res.type==appConst.successResponseType){
                    window.notify(message[appConst.lan].updatedSave,3000,"default")
                    afterSubmit();
                }else{
                    window.notify(message[appConst.lan].failedToUpdate,3000,"danger")
                }
            })
        }else{
            
            apiHandeler.insertSystem(roles,{
                name, permissions: selectedPermissions.join(",") 
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
        navigate("/roles")
    }
    const permissionCheckUncheck = (id)=>{
        
        let selectedPermissionsData = [...selectedPermissions]
        if(!selectedPermissions.includes(id)){
            selectedPermissionsData.push(id)
        }else{
            selectedPermissionsData.splice(selectedPermissions.findIndex(d=>d==id),1)
        }
        setSelectedPermissions(selectedPermissionsData);
    }
    return <div className="container page">
         <Header title={id?message[appConst.lan].pages.modifyRole.header.title:message[appConst.lan].pages.createRole.header.title} description={message[appConst.lan].pages.modifyRole.header.content}/>

        <div className="row">
            <div className="col-md-6">
            {errorMessage&&<div className="mt-5 pt-15">
                <div className='alert alert-danger alert-md'>
                  <p>{errorMessage}</p>
                </div>
              </div>}
                <div className="mt-10 mb-15">
                    <label>{message[appConst.lan].pages.roles.form.name}</label>
                    <input className="input input-md" value={name} onChange={e=>setName(e.target.value)}/>
                </div>
  
                <div className="mb-15 mt-15">
                    <label className="d-label pb-15 mb-15 pt-15">{message[appConst.lan].pages.roles.form.permissions}</label>
                    {permissions.length?<div className="row">
                        {permissions.map((permission,index)=>(<div key={'perm_'+index} className="col-md-4"><label className="d-block pt-5"><input type={"checkbox"} checked={selectedPermissions.includes(permission.id)} onChange={()=>permissionCheckUncheck(permission.id)}/>  {permission.label}</label></div>))}
                    </div>:<p className="pt-15 pb-15 text-center">{message[appConst.lan].pages.roles.form.noPermission}</p>}
                </div>
                <button className="btn btn-md btn-primary mt-15 pull-right" onClick={onSubmit}><SaveOutlined/> {id?message[appConst.lan].form.update:message[appConst.lan].form.save} </button>
        
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
export default connect(mapStateToProps, mapDispatchToProps)(ModifyRole);