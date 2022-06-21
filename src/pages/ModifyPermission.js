import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import appConst from "../constants/appConst";
import { connect } from "react-redux"
import message from "../constants/message";
import ApiHandeler from "../apiHandeler";
import { useNavigate, useParams } from "react-router-dom";
import { SaveOutlined } from "@ant-design/icons";
const permissions = "permissions";
const ModifyPermission = props=>{
    let { id } = useParams();
    const navigate = useNavigate();
    const [ label, setLabel ] = useState('')
    const [ key, setKey ] = useState('')
    const [ errorMessage, setError ] = useState('')

    useEffect(()=>{
        
        const apiHandeler = new ApiHandeler(props.userStore.token)
        
        apiHandeler.querySystem(permissions,{ condition: JSON.stringify([{ field: "id", condition: "=", value: id }]), }).then(res=>res.json()).then(permissionRes=>{
            if(permissionRes.type == appConst.successResponseType){
                const data = permissionRes.data[0]
                setLabel(data.label)
                setKey(data.key)
            }
        })
    },[])
    const onSubmit = ()=>{
        if(!label||!key){
            setError(message[appConst.lan].pages.apps.errors.validation)
            return
        }
        setError('')
        const apiHandeler = new ApiHandeler(props.userStore.token)
        const dataObj = {label,key}
        if(id){
            apiHandeler.updateSystem(id,permissions,dataObj).then(res=>res.json()).then(res=>{
                if(res.type==appConst.successResponseType){
                    window.notify(message[appConst.lan].updatedSave,3000,"default")
                    afterSubmit();
                }else{
                    window.notify(message[appConst.lan].failedToUpdate,3000,"danger")
                }
            })
        }else{
            
            apiHandeler.insertSystem(permissions,dataObj).then(res=>res.json()).then(res=>{
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
        navigate("/permissions")
    }
    return  <div className="container page">
         <Header title={id?message[appConst.lan].pages.modifyPermission.header.title:message[appConst.lan].pages.createPermission.header.title} description={message[appConst.lan].pages.modifyRole.header.content}/>


   <div className="row">
       <div className="col-md-6">
       {errorMessage&&<div className="mt-5 pt-15">
           <div className='alert alert-danger alert-md'>
             <p>{errorMessage}</p>
           </div>
         </div>}
           <div className="mt-10 mb-15">
               <label>Permission Label</label>
               <input className="input input-md" value={label} onChange={e=>setLabel(e.target.value)}/>
           </div>
           <div className="mt-10 mb-15">
               <label>Permission Key</label>
               <input className="input input-md" value={key} onChange={e=>setKey(e.target.value)}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(ModifyPermission);