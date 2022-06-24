import { DeleteOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import ApiHandeler from "../apiHandeler";
import { connect } from "react-redux";
import Header from "../components/Header";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import ModifyModuleForm from "../components/ModifyModuleForm";
import appConst from "../constants/appConst";
import message from "../constants/message";

const Modules = (props) => {
  const [ loading, setLoading] = useState(false)
  const [ errorMessage, setErrorMessage ] = useState('')
  const [ search, setSearch ] = useState('');
  const [ modules, setModules ] = useState([]);
  const [ apps, setApps ] = useState([]);
  const [ id, setId ] = useState(null);
  const [ openApiModel, setApiModel ] = useState(false);
  const [ moduleData, setModuleData ] = useState({});

  const onSelectModule = (dId)=>{
    setId(dId);
    if(dId==null||dId=='') {
      setModuleData({})
    }else{
      let moduleData = modules.find(d=>d.id==dId)
      setModuleData(moduleData)
    }
  }
  const fetchModulesData = () => {
    const apiHandeler = new ApiHandeler(props.userStore.token);
    setLoading(true);
    apiHandeler.getAllModuleData().then(res=>res.json()).then(res=>{
      setLoading(false);
      setModules(res.data)
    })
  }
  
  const getAppsData = () => {
    const apiHandeler = new ApiHandeler(props.userStore.token);
    setLoading(true);
    apiHandeler.getAppData().then(res=>res.json()).then(res=>{
      setLoading(false);
      setApps(res.data.map(d=>({label: d.name, value: d.id})));
    });
  }
  const saveOrUpdate = (d) => {
    const apiHandeler = new ApiHandeler(props.userStore.token);
    setLoading(true);
    apiHandeler.createModule(d).then(res=>res.json()).then(res=>{
      if(res.type==appConst.successResponseType){
        setId('');
        fetchModulesData();
        window.notify(message[appConst.lan].successSave, 3000, "default")
      }
    }).catch(e=>{
      window.notify(message[appConst.lan].failedToSave, 3000, "danger")
    })
  }
  const deleteModule = ( e, d )=>{
    e.stopPropagation()
    const apiHandeler = new ApiHandeler(props.userStore.token);
    apiHandeler.deleteModule(d.module_name).then(res=>res.json()).then(res=>{
      fetchModulesData();
    })
  }

  useEffect(()=>{
    fetchModulesData();
    getAppsData();
  },[])

  const filterModules = modules.filter(v=>{
    return (v.title.toLowerCase().includes(search.toLowerCase())||v.module_name.toLowerCase().includes(search.toLowerCase()));
  })
  return (
    <div>
      <Modal show={openApiModel} title={message[appConst.lan].pages.modules.apiList} onClose={()=>setApiModel(false)}>
        <div className="api-doc-card-list">
          {
            message[appConst.lan].pages.modules.apiListDoc.map((d,i)=><ApiDocCard {...d} key={i} moduleData={moduleData}/>)
          }
        </div>
      </Modal>
      <div className="container page">
        <Header title={message[appConst.lan].pages.modules.header.title} description={message[appConst.lan].pages.modules.header.content}/>
        <div className="row" >
          <div className={id?"col-md-12":"col-md-6"}>
            <ModifyModuleForm id={id} apps={apps} submit={saveOrUpdate} cancelEdit={()=>setId(null)} showApiList={()=>setApiModel(true)} token={props.userStore.token}/>
          </div>
          <div className="col-md-6"  style={id?{display:"none"}:{}}>
            <div className="fade-in">
              <h4 className="app-list-title">{message[appConst.lan].pages.modules.moduleList}</h4>
              <div className="pt-10 pb-10">
                <input className="input input-md" value={search} placeholder={message[appConst.lan].pages.modules.searchPlaceholder} onChange={e=>setSearch(e.target.value)}/>
              </div>
            {errorMessage&&<div>
                  <div className='alert alert-danger alert-md'>
                    <p>{errorMessage}</p>
                  </div>
                </div>}
              {loading?<Loader/>:<div className="module-list">
                  {filterModules.length===0?<div className="text-center"><p>{message[appConst.lan].pages.modules.noDataFound}</p></div>:filterModules.map((v,i)=>{
                    return <div className="module-card fade-in" onClick={()=>onSelectModule(v.id)} key={i}>
                      <p className="pb-5"><strong>{message[appConst.lan].pages.modules.form.title}:</strong> {v.title}</p>
                      <p className="pb-5"><strong>{message[appConst.lan].pages.modules.form.name}:</strong> {v.module_name}</p>
                      <span onClick={(e)=>deleteModule(e,v)} className="btn btn-sm btn-danger pull-right"><DeleteOutlined/></span>
                      <p className="clearfix"></p>
                    </div>
                  })}
                </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const ApiDocCard = ({ label, method, api, doc, example, moduleData = {} })=>{

  return <div className="api-doc-card pt-10 pb-10 mt-15">
    <div>
      <p><label className="api-title">{message[appConst.lan].pages.modules.apiDocCard.title}: </label>{label}</p>
    </div>
    <div className="pt-10 pb-5">
      <p><label>{message[appConst.lan].pages.modules.apiDocCard.method}: </label>{method}</p>
    </div>

    <div className="pb-10">
      <label className="d-block pb-10">{message[appConst.lan].pages.modules.apiDocCard.api}</label>
      <textarea disabled className="input" rows={3} value={api.replace("{url}", appConst.apiUrl).replace("{module}", moduleData.module_name)}></textarea>
    </div>

    <div className="pt-10 pb-10">
      <label className="d-block">{message[appConst.lan].pages.modules.apiDocCard.docTitle}</label>
      <pre>{doc.replace("{url}", appConst.apiUrl).replace("{module}", moduleData.module_name)}</pre>
    </div>

    <div className="pt-10 pb-10">
      <label className="d-block">{message[appConst.lan].pages.modules.apiDocCard.exTitle}</label>
      <p>{example}</p>
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
export default connect(mapStateToProps, mapDispatchToProps)(Modules);