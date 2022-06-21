import React, { Fragment, useEffect, useState } from "react";
import Header from "../components/Header";
import appConst from "../constants/appConst";
import message from "../constants/message";
import Datatable from "../components/Datatable";
import ApiHandeler from "../apiHandeler";
import { connect } from "react-redux";
import { DataForm } from "../components/ModuleDataView";
import Modal from "../components/Modal";
import { DeleteFilled, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const molduleName  = "permissions";
const columns = [
  { columnName: "label", displayName: "Permission Label", fieldType: "data" },
  { columnName: "key", displayName: "Permission Key", fieldType: "data" },
  { columnName: "action", displayName: "Action", fieldType: "node" },
];
const limit = 20;
const Permissions = (props) => {
  const [ data, setData ] = useState(0); 
  const [ page, setPage ] = useState(1);
  const [ totalPages, setTotalPage ] = useState(1);
  const [ loading, setLoading ] = useState(false);
  const [ editModelData, setEditModelData ] = useState({show: false, id: null})
  const [ fields, setFields ] = useState([])
  const navigate = useNavigate();
  const editData = d =>{
    navigate("/permissions/modify/"+d.id)

  }
  const deleteData = d =>{
    const apiHandeler =  new ApiHandeler(props.userStore.token);
    apiHandeler.deleteSystem(molduleName,d.id).then(res=>res.json()).then(res=>{
      if(res.type == appConst.successResponseType){

        window.notify(message[appConst.lan].deletedSuccess,3000,"success");
        loadData()
      }else{
        window.notify(message[appConst.lan].failedToRemove,3000,"danger");
        loadData()
      }
    })
  }
  useEffect(()=>{

    setFields(columns.filter(d=>d.fieldType=="data").map(c=>({label: c.displayName, value: c.columnName})))

  },[])
  useEffect(()=>{
    loadData();
  },[ page ])
  const loadData = ()=>{
    const apiHandeler = new ApiHandeler(props.userStore.token);
    setLoading(true)
    apiHandeler.countSystem(molduleName, { limit: limit, skip: (page-1)*limit }).then(res=>res.json()).then(Cres=>{
      if(appConst.successResponseType==Cres.type){
        const countData = Cres.data.count;
        apiHandeler.querySystem(molduleName, { limit: limit, skip: (page-1)*limit }).then(res=>res.json()).then(res=>{
          if(appConst.successResponseType==res.type){
            const data = res.data.map((d)=>{
              if(!(d.id<=9)){
                d.action = [<button className="btn btn-sm btn-primary mr-5" onClick={(e)=>{
                  e.stopPropagation()
                  e.preventDefault();
                  editData(d);
                }}><EditOutlined/></button>, <button className="btn btn-sm btn-danger" onClick={(e)=>{
                  e.stopPropagation()
                  e.preventDefault();
                  deleteData(d);
                }}><DeleteFilled/></button>];
              }else{
                
              d.action = []
              }
              return d;
            });
            setTotalPage(Math.ceil(countData/limit))
            setData(data)
            setLoading(false)
          }
        })
      }
    })
  }
  return (
    <Fragment>
      <div className="container page">
        <Header title={message[appConst.lan].pages.permissions.header.title} description={message[appConst.lan].pages.permissions.header.content}/>
        <div >
          <button className="btn btn-sm btn-primary pull-right" onClick={(e)=>{
            e.preventDefault(); 
            navigate("/permissions/create")
          }}><PlusOutlined/> {message[appConst.lan].pages.modules.form.add}</button>
          <p className="clearfix"></p>
        </div>
        <div className="pt-15 pb-15">
          <Datatable columns={columns} totalPage={totalPages} currentPage={page} data={data} loading={loading} onPageChange={p=>setPage(p)}/>
        </div>
        
      </div>
    </Fragment>
  );
};
const mapStateToProps = (state)=>{
  return {
      userStore: state.userStore
  }
}
const mapDispatchToProps = (dispatch)=>{
  return {
  }    
}
export default connect(mapStateToProps, mapDispatchToProps)(Permissions);
