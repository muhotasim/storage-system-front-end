import React, { Fragment, useEffect, useState } from "react";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import Header from "../components/Header";
import appConst from "../constants/appConst";
import message from "../constants/message";
import Datatable from "../components/Datatable";
import ApiHandeler from "../apiHandeler";
const molduleName  = "tokens";
const columns = [
  { columnName: "name", displayName: "Name", fieldType: "data" },
  { columnName: "token", displayName: "Token", fieldType: "data" },
  { columnName: "created_at", displayName: "Created At", fieldType: "data" },
  { columnName: "expiry_date", displayName: "Expiry Date", fieldType: "data" },
  { columnName: "action", displayName: "Action", fieldType: "node" },
];
const limit = 20;
const Tokens = (props) => {
  const [ data, setData ] = useState(0); 
  const [ page, setPage ] = useState(1);
  const [ totalPages, setTotalPage ] = useState(1);
  const [ loading, setLoading ] = useState(false);
  const navigate = useNavigate();
  const editData = d =>{
    ///roles/modify/
    navigate("/tokens/modify/"+d.id)

  }
  const deleteData = d =>{
    const apiHandeler =  new ApiHandeler(props.userStore.token);
    confirmModel({ message: message[appConst.lan].confirmation.delete,confirmCallback:()=>{
      apiHandeler.deleteSystem(molduleName,d.id).then(res=>res.json()).then(res=>{
        if(res.type == appConst.successResponseType){
  
          window.notify(message[appConst.lan].deletedSuccess,3000,"success");
          loadData()
        }else{
          window.notify(message[appConst.lan].failedToRemove,3000,"danger");
          loadData()
        }
      })
    }})
    
  }

  useEffect(()=>{
    loadData();
  },[ page ])

  const loadData = ()=>{
    const apiHandeler = new ApiHandeler(props.userStore.token);
    setLoading(true)
    apiHandeler.countSystem(molduleName, { limit: limit, skip: (page-1)*limit }).then(res=>res.json()).then(Cres=>{
      if(appConst.successResponseType==Cres.type){
        const countData = Cres.data.count;
        apiHandeler.querySystem(molduleName, { limit: limit, skip: (page-1)*limit, 
          select: JSON.stringify(["id","name","token","created_at","concat(REPLACE(concat(expiry_date),' ','T'),'Z') as expiry_date"]), }).then(res=>res.json()).then(res=>{
          if(appConst.successResponseType==res.type){
            const data = res.data.map(d=>{
              d.action = [<button className="btn btn-sm btn-primary mr-5" onClick={(e)=>{
                e.stopPropagation()
                e.preventDefault();
                editData(d);
              }}><EditOutlined/></button>, <button className="btn btn-sm btn-danger" onClick={(e)=>{
                e.stopPropagation()
                e.preventDefault();
                deleteData(d);
              }}><DeleteOutlined/></button>];
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
        <Header title={message[appConst.lan].pages.roles.header.title} description={message[appConst.lan].pages.permissions.header.content}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(Tokens);