import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import appConst from "../constants/appConst";
import { connect } from "react-redux"
import message from "../constants/message";
import ApiHandeler from "../apiHandeler";
import { useNavigate, useParams } from "react-router-dom";
import { SaveOutlined } from "@ant-design/icons";
const tokens = "tokens";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const ModifyToken= props => {
    let { id } = useParams();
    const navigate = useNavigate();
    const [ name, setName ] = useState('')
    const [ expiryDate, setExpiryDate ] = useState('');
    const [ modules, setModules ] = useState([]);
    const [ permissions, setPermissions ] = useState([])
    const [ selectedPermissions, setSelectedPermissions ] = useState([])
    const [ errorMessage, setError ] = useState('')
    const [ selectedTokenPermission, setSelectedTokenPermission ] = useState({});

    
  const setSystemPermission = (system, permission)=>{
    const tempselectedTokenPermission = {...selectedTokenPermission};
    if(tempselectedTokenPermission[system.id]){
      let permissionIndex = tempselectedTokenPermission[system.id].findIndex(per=>per==permission.id)
      if(permissionIndex==-1){
        tempselectedTokenPermission[system.id].push(permission.id)
      }else{
        tempselectedTokenPermission[system.id].splice(permissionIndex, 1);
      }
    }else{
      tempselectedTokenPermission[system.id] = [ permission.id ]
    }
    if(tempselectedTokenPermission[system.id].length==0){
      delete tempselectedTokenPermission[system.id];
    }
    setSelectedTokenPermission(tempselectedTokenPermission);
  }

    useEffect(()=>{
        
        const apiHandeler = new ApiHandeler(props.userStore.token)
        setName('')
        
        apiHandeler.getAllModuleData().then(res=>res.json()).then(moduleRes=>{
          setModules(moduleRes.data)
          apiHandeler.querySystem("permissions",{ 
            condition: JSON.stringify([{ field: "type", condition: "=", value: `'system'` }]), }).then(res=>res.json()).then(permissionRes=>{
            if(permissionRes.type==appConst.successResponseType){
                
                setPermissions(permissionRes.data)
                if(id){
                    apiHandeler.querySystem("tokens",{ select: JSON.stringify(["id","name","token","created_at","concat(REPLACE(concat(expiry_date),' ','T'),'Z') as expiry_date"]), condition: JSON.stringify([{ field: "id", condition: "=", value: `'${id}'` }])  }).then(res=>res.json()).then(tokenRes=>{
                        let tokenData = tokenRes.data[0];
                        
                        setName(tokenData.name)
                        setExpiryDate(new Date(tokenData.expiry_date))
                        apiHandeler.querySystem("token_system_permission",{  condition: JSON.stringify([{ field: "token_id", condition: "=", value: `'${id}'` }]) }).then(res=>res.json()).then(res=>{
                            let systemPermissionObj = {};
                            res.data.forEach(permission=>{
                              if(systemPermissionObj[permission.system_id]){
                                systemPermissionObj[permission.system_id].push(permission.permission_id)
                              }else{
                                systemPermissionObj[permission.system_id] = [ permission.permission_id ]
                              }
                            })
                            setSelectedTokenPermission(systemPermissionObj)
                        })
                    })
                    
                }
               
            }else{
                    
                window.notify(message[appConst.lan].failToLoad,3000,"danger")
            }
          })

        })
       
       
        
    }, [])
    const onSubmit = ()=>{
       
        const apiHandeler = new ApiHandeler(props.userStore.token)
        let newPermissions = [];
        Object.keys(selectedTokenPermission).forEach(systemId=>{
            selectedTokenPermission[systemId].forEach(permission_id=>{
              newPermissions.push({ system_id:systemId,permission_id:permission_id })
            })
        })
        if(id){
            
          apiHandeler.updateSystem(id,"tokens",{
            name: name,
            expiry_date: expiryDate.toISOString(),
            permissions: JSON.stringify(newPermissions)
          }).then(res=>res.json()).then((res)=>{
            debugger
          })
        }else{
            
          apiHandeler.insertSystem("tokens",{
            name: name,
            expiry_date: expiryDate.toISOString(),
            permissions: JSON.stringify(newPermissions)
          }).then(res=>res.json()).then((res)=>{
            afterSubmit();
          })
          
        }
    }
    const afterSubmit = ()=>{
        navigate("/tokens")
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
         {/* <Header title={id?message[appConst.lan].pages.modifySystem.header.title:message[appConst.lan].pages.createSystem.header.title} description={message[appConst.lan].pages.modifySystem.header.content}/> */}

        <div className="row">
            <div className="col-md-6">
            {errorMessage&&<div className="mt-5 pt-15">
                <div className='alert alert-danger alert-md'>
                  <p>{errorMessage}</p>
                </div>
              </div>}
                <div className="mt-10 mb-15">
                    <label>{message[appConst.lan].pages.systems.form.name}</label>
                    <input className="input input-md" value={name} onChange={e=>setName(e.target.value)}/>
                </div>
                <div className="mt-10 mb-15">
                    <label>{message[appConst.lan].pages.systems.form.expiry}</label>
                    <DatePicker selected={expiryDate} showTimeSelect onChange={v=>{setExpiryDate(v)}} dateFormat="Pp" className="input input-md"/>
                    {/* <input className="input input-md" type="date" defaultValue={expiryDate} checked={expiryDate} value={expiryDate} onChange={e=>setExpiryDate(e.target.value)}/> */}
                </div>
  
                <div className="mb-15 mt-15">
                    <label className="d-label pb-15">{message[appConst.lan].pages.systems.form.permissions}</label>

                    {modules.map((module,index)=>{
                        return <div key={index} className="mt-15 mb-15 pb-15 pt-15">
                            <label className="d-block pb-15">{module.title} ( {module.module_name} )</label>
                            <p className="clearfix"></p>
                            {permissions.map((permission,index2)=>(<div key={index+"_"+index2} className="col-md-4">
            
                                <label className="d-block pb-5 fade-in"><input type="checkbox" checked={selectedTokenPermission[module.id]?.includes(permission.id)?true:false} onChange={()=>{setSystemPermission(module, permission)}}/> {permission.label}</label>
                            </div>))}
                        </div>
                    })}

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
export default connect(mapStateToProps, mapDispatchToProps)(ModifyToken);