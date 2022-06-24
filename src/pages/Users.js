import React, { Fragment, useEffect, useState, } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { connect } from "react-redux";
import appConst from "../constants/appConst";
import message from "../constants/message";
import Datatable from "../components/Datatable";
import ApiHandeler from "../apiHandeler";
import { DeleteFilled, EditOutlined, RestOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
const molduleName  = "users";
const columns = [
  { columnName: "name", displayName: "Name", fieldType: "data" },
  { columnName: "email", displayName: "Email", fieldType: "data" },
  { columnName: "is_internal", displayName: "Is Internal", fieldType: "data" },
  { columnName: "status", displayName: "Status", fieldType: "data" },
  { columnName: "action", displayName: "Action", fieldType: "node" },
];
const limit = 20;
let filterObj = null;
const Users = (props) => {
  const navigate = useNavigate();
  const [ data, setData ] = useState(0); 
  const [ page, setPage ] = useState(1);
  const [ totalPages, setTotalPage ] = useState(1);
  const [ loading, setLoading ] = useState(false);
  const [ searchVal, setCondition ] = useState({ name: "",email: "" })

  
  const editData = d =>{
    navigate("/users/modify/"+d.id)
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
    const q = filterObj?{...filterObj,...{ limit: limit, skip: (page-1)*limit }}:{ limit: limit, skip: (page-1)*limit }
    setLoading(true)
    apiHandeler.countSystem(molduleName, q).then(res=>res.json()).then(Cres=>{
      if(appConst.successResponseType==Cres.type){
        const countData = Cres.data.count;
        apiHandeler.querySystem(molduleName, q).then(res=>res.json()).then(res=>{
          if(appConst.successResponseType==res.type){
            const data = res.data.map((d)=>{
              d.action = [<button className="btn btn-sm btn-primary mr-5" onClick={(e)=>{
                e.stopPropagation()
                e.preventDefault();
                editData(d);
              }}><EditOutlined/></button>, <button className="btn btn-sm btn-danger" onClick={(e)=>{
                e.stopPropagation()
                e.preventDefault();
                deleteData(d);
              }}><DeleteFilled/></button>];
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
  const changeVal = (key,val)=>{
    let tempVal = {...searchVal,...{ [key]:val }};
    
    setCondition(tempVal);
  }
  const onSearch = () =>{
    let condition = [ ]

    if(searchVal.name){
      condition.push({ orWhere: false,andWhere: false,field: 'name', condition: 'LIKE', value: `'%${searchVal.name}%'` })
    }

    if(searchVal.email){
      condition.push({ orWhere: true,andWhere: false,field: 'email', condition: 'LIKE', value: `'${searchVal.email}'` })
    }
    const q = { condition: JSON.stringify(condition) }
    filterObj = q;
    loadData();
  }
  const onReset = ()=>{
    setCondition({ name: "",email: "" })
    filterObj = null;
    loadData();
  }
  return (
    <Fragment>
      <div className="container page">
        <Header title={message[appConst.lan].pages.users.header.title} description={message[appConst.lan].pages.users.header.content}/>
        <div className="pt-15 pb-15">
          <div className="row">
            <div className="col-md-3">
              <label>Name</label>
              <input className="input input-md" value={searchVal.name} onChange={e=>{changeVal("name",e.target.value)}}/>
            </div>
            <div className="col-md-3">
              <label>Email</label>
              <input className="input input-md" value={searchVal.email} onChange={e=>{changeVal("email",e.target.value)}}/>
            </div>
            <div className="col-md-4">
              <div className="mt-5">
              <button className="btn btn-md btn-primary mt-15 mr-5" onClick={onSearch}><SearchOutlined/> Search</button>
              <button className="btn btn-md btn-primary mt-15" onClick={onReset}><SyncOutlined/> Reset</button>
              </div>
            </div>
          </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(Users);
