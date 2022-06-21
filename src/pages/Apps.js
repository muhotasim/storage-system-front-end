import { DeleteOutlined } from "@ant-design/icons";
import React, { Fragment, useEffect, useState } from "react";
import ApiHandeler from "../apiHandeler";
import { connect } from "react-redux"
import Header from "../components/Header";
import Loader from "../components/Loader";
import ModifyApp from "../components/ModifyApp";
import appConst from "../constants/appConst";
import message from "../constants/message";
const Apps = (props) => {
  const [apps, setApps] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [selected,setSelected] = useState({
    id:"",
    defaultName: "",
    defaultPrefix: "",
    defaultStatus: false,
  });
  const [ loading, setLoading] = useState(false)
  const onSaveOrUpdate = (data)=>{
   
    if(!data.name || !data.prefix){
      setErrorMessage(message[appConst.lan].pages.apps.errors.validation);
      return;
    }else{
      setErrorMessage('')
    }
    if(!data.id && apps.findIndex(d=>d.prefix==data.prefix)!=-1){
      
      setErrorMessage(message[appConst.lan].pages.apps.errors.uniquePrefix);
      return;
    }
    const apiHandeler = new ApiHandeler(props.userStore.token)
    setLoading(true);
   
    if(data.id){
      apiHandeler.modifyApp(data.id,{
        appName: data.name,
        appPrefix: data.prefix,
        status: data.status?1:0
      }).then((res)=>{
        setSelected({
          id:"",
          defaultName: "",
          defaultPrefix: "",
          defaultStatus: false,
        })
        getAppsData();
      }).catch((e)=>{
        setErrorMessage(e.toString());
      })
    }else{
      apiHandeler.createApp({
        appName: data.name,
        appPrefix: data.prefix,
        status: data.status?1:0
      }).then((res)=>{
        setSelected({
          id:null,
          defaultName: "",
          defaultPrefix: "",
          defaultStatus: false,
        })
        getAppsData();
      }).catch((e)=>{
        setErrorMessage(e.toString());
      })
    }
    if(data.id){
      setSelected({
        id:"",
        defaultName: "",
        defaultPrefix: "",
        defaultStatus: false,
      })
    }else{
      setSelected({
        id:"",
        defaultName: "",
        defaultPrefix: "",
        defaultStatus: false,
      })
    }
    
    
    setLoading(false);
  }
  const onSelect = (data)=>{
    window.scrollTo(
      {
        top: 0,
        left: 0,
        behavior: 'smooth'
      }
    )
    setSelected({
      id:data.id,
      defaultName: data.name,
      defaultPrefix: data.prefix,
      defaultStatus: data.status,
    })
  }
  const onDelete = (id) =>{
    const apiHandeler = new ApiHandeler(props.userStore.token);
    setLoading(true);
    apiHandeler.deleteApp(id).then(res=>res.json()).then(res=>{
      getAppsData();
    }).catch(err=>{
      setErrorMessage(message[appConst.lan].pages.apps.errors.loadFailed);
    })
  }
 const onCancel = ()=>{
    setSelected({
      id:"",
      defaultName: "",
      defaultPrefix: "",
      defaultStatus: false,
    })
  }
  const getAppsData = () => {
    const apiHandeler = new ApiHandeler(props.userStore.token);
    setLoading(true);
    apiHandeler.getAppData().then(res=>res.json()).then(res=>{
      setErrorMessage('')
      setLoading(false);
      setApps(res.data);
    }).catch(err=>{
      setErrorMessage(message[appConst.lan].pages.apps.errors.loadFailed);
    })
  }
  useEffect(()=>{
    getAppsData()
  },[])
  return (<div className="container page">
        <Header title={message[appConst.lan].pages.apps.header.title} description={message[appConst.lan].pages.apps.header.content}/>
        {errorMessage&&<div className="mt-5 pt-15">
                <div className='alert alert-danger alert-md'>
                  <p>{errorMessage}</p>
                </div>
              </div>}
        <div className="row">
          <div className="col-md-6">
            <div>
              <ModifyApp  {...selected} onSaveOrUpdate={onSaveOrUpdate} onCancel={onCancel} loading={loading} token={props.userStore.token}/>
            </div>
          </div>
         {!selected.id?<div className="col-md-4">

            <h4 className="app-list-title pt-15">{message[appConst.lan].pages.apps.appList}</h4>
           
            <div className="app-list">
              {loading?<Loader/>:apps.length==0?<p style={{textAlign: "center"}}>{message[appConst.lan].noDataFound}</p>:apps.map((val,index)=><AppCard key={index} {...val} onClick={onSelect} onDelete={onDelete}/>)}
            </div>
          </div>:null}
        </div>
      </div>);
};
const AppCard = ({ onClick, id, name, prefix, status = 0, onDelete })=>(<div className="app-card" onClick={()=>{onClick({id,name, prefix, status})}}>
  <p className="app-card-title"><strong>{message[appConst.lan].form.modifyApp.name}:</strong> {name}</p>
  <p className="app-card-title"><strong>{message[appConst.lan].form.modifyApp.appPrefix}:</strong> {prefix}</p>
  <p className="app-card-status"><strong>{message[appConst.lan].form.modifyApp.status}:</strong> {status?message[appConst.lan].statusText.active:message[appConst.lan].statusText.inactive}</p>

  <button className="btn btn-sm pull-right btn-danger" onClick={(e)=>{
    e.stopPropagation();
    onDelete(id)
  }}><DeleteOutlined/></button>
  <p className="clearfix"></p>
</div>)

const mapStateToProps = (state)=>{
  return {
      userStore: state.userStore
  }
}
const mapDispatchToProps = (dispatch)=>{
  return {
  }    
}
export default connect(mapStateToProps, mapDispatchToProps)(Apps);