import { DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import ApiHandeler from "../apiHandeler";
import appConst from "../constants/appConst";
import message from "../constants/message";
import Datatable from "./Datatable";
import Header from "./Header";
import Select from "./Select";
import Modal from "./Modal"
import { uuidv4, pressFilterTableBtn } from "../utils";
let filterObj = {};
const ModuleDataView = (props) => {
  const [selectFieldOptions, setSelectFieldOptions] = useState([]);
  const [count, setCount] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [openEditOrUpdateData, setOpenEditOrUpdateData] = useState({
    showForm: false,
    id: null
  });
  // const [filterObj, setFilterObj] = useState(null);
  const onMount = () => {
    let tempColumns = [];
    setSelectFieldOptions(
      props.fields.map((d) => ({ label: d.name, value: d.name, type: d?.type?.value, options: d?.options }))
    );
    props.fields.forEach((c) => {
      tempColumns.push({ columnName: c.name, displayName: c.name, fieldType: "data" });
    });
    tempColumns.push({ columnName: "action", displayName: "Action", fieldType: "node" })
    setColumns([
      { displayName: "id", columnName: "id", fieldType: "data" },
      { displayName: "created_at", columnName: "created_at", fieldType: "data" },
      { displayName: "updated_at", columnName: "updated_at", fieldType: "data" },...tempColumns]);
      setTimeout(()=>{
        pressFilterTableBtn()
      },400)
  };
  useEffect(() => {
    // did mount
    onMount();
  
  }, []);

  const deleteData =(d)=>{
    const apiHandeler = new ApiHandeler(props.token);
    confirmModel({ message: message[appConst.lan].confirmation.delete,confirmCallback:()=>{
      let newQueryObj = {...filterObj,...{skip: 0 * parseInt(filterObj.limit)}}
      apiHandeler.delete(props.name,d.id).then(res=>res.json()).then(res=>{
        if(res.type == appConst.successResponseType){
  
          window.notify(message[appConst.lan].deletedSuccess,3000,"default");
          reloadData(newQueryObj);
          setCurrentPage(1)
          filterObj = newQueryObj
          // setFilterObj(newQueryObj);
  
        }
      }).catch(e=>{
        window.notify(message[appConst.lan].failedToRemove,3000,"danger");
      })
    }})
   
  }
  const editData =(d)=>{
    setOpenEditOrUpdateData({ id: d.id,showForm: true });
  }
  const reloadData = (query) => {
    const apiHandeler = new ApiHandeler(props.token);
    setLoading(true);
    apiHandeler
      .count(props.name, query)
      .then((res) => res.json())
      .then((countRes) => {
        if (countRes.type == appConst.successResponseType) {
          apiHandeler
            .query(props.name, query)
            .then((res) => res.json())
            .then((result) => {
              if (result.type == appConst.successResponseType) {
                setCount(countRes.data.count);
                setTotalPages(
                  Math.ceil(countRes.data.count / parseInt(query.limit))
                );
                setTableData(result.data.map(d=>{
                  d.action = [<button className="btn btn-sm btn-primary mr-5" onClick={(e)=>{
                    e.stopPropagation()
                    e.preventDefault();
                    editData(d);
                  }}><EditOutlined/></button>, <button className="btn btn-sm btn-danger" onClick={(e)=>{
                    e.stopPropagation()
                    e.preventDefault();
                    deleteData(d);
                  }}><DeleteOutlined/></button>]
                  return d;
                }));
                setLoading(false);
              }else{
                
                window.notify(message[appConst.lan].failToLoad, 3000, "danger");
                setLoading(false);
              }
            });
        }else{
          
          window.notify(message[appConst.lan].failToLoad, 3000, "danger");
          setLoading(false);
        }
      });
  };

  const onFilter = (query) => {
    query.skip = (parseInt(currentPage) - 1) * parseInt(query.limit);
    let tempColumns = [];
    query.select.forEach((c) => {
      tempColumns.push({ columnName: c, displayName: c, fieldType: "data" });
    });
    query.select = JSON.stringify(query.select);
    tempColumns.push({ columnName: "action", displayName: "Action", fieldType: "node" })
    setColumns(tempColumns);
    filterObj  = query
    // setFilterObj(query);
    reloadData(query);
  };

  return (
    <div>
      <Header title={props.title} />
      <Modal show={openEditOrUpdateData.showForm} onClose={()=>{
        setOpenEditOrUpdateData({ id: null,showForm: false });
      }}>
        {openEditOrUpdateData.showForm&&<div>
            <DataForm id={openEditOrUpdateData.id} tableName={props.name} fields={selectFieldOptions} afterSaveOrUpdateCallback={()=>{
                pressFilterTableBtn();
                setOpenEditOrUpdateData({ id: null,showForm: false });
            }} token={props.token}/>
          </div>}
      </Modal>
      <div className="pb-15 mb-15">
        <div className="row">
          <div className="col-md-6">
            <SearchBox
              selectFieldOptions={selectFieldOptions}
              onFilter={onFilter}
            />
          </div>
        </div>
      </div>
      <div className="pt-15 pb-15">
        <button className="btn btn-sm btn-primary pull-right" onClick={()=>{
           setOpenEditOrUpdateData({ id: null,showForm: true });
        }}><PlusOutlined/> {message[appConst.lan].pages.modules.form.add}</button>
        <p className="clearfix"></p>
      </div>

      <Datatable
        loading={loading}
        columns={columns}
        data={tableData}
        totalPage={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => {
            let newQueryObj = {...filterObj,...{skip: (parseInt(page) - 1) * parseInt(filterObj.limit)}}
            reloadData(newQueryObj);
            setCurrentPage(page)
        }}
      />
    </div>
  );
};
const SearchBox = (props) => {
  const def_selectFieldOption = [
    { label: "id", value: "id" },
    { label: "created_at", value: "created_at" },
    { label: "updated_at", value: "updated_at" },
    ...props.selectFieldOptions,
  ];
  const [fields, setFields] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [orderBy, setOrderBy] = useState("");
  const [groupBy, setGroupBy] = useState("");
  const [limit, setLimit] = useState({ label: 20, value: 20 });
  const [sortBy, setSortBy] = useState({ label: "DESC", value: "DESC" });

  useEffect(() => {
    setFields(def_selectFieldOption);
    setOrderBy(def_selectFieldOption.length ? def_selectFieldOption[0] : "");
  }, [props.selectFieldOptions]);

  const selectField = (index, v) => {
    let tempFields = [...fields];
    tempFields[index] = v;
    setFields(tempFields);
  };
  const removeField = (index) => {
    let tempFields = [...fields];
    tempFields.splice(index, 1);
    setFields(tempFields);
  };
  const filter = () => {
    let selected = fields.map((field) => field.value);
    let s_groupBy = groupBy ? groupBy.value : "";
    let s_sortBy = sortBy.value;
    let s_orderBy = orderBy.value;
    let s_limit = limit.value;
    
    props.onFilter({
      select: selected,
      condition: JSON.stringify(conditions.map(d=>({andWhere: d.andWhere?1:0,orWhere: d.orWhere?1:0,condition: d.condition.value,field: d.field.value, value: `'${d.value}'`}))),
      groupBy: s_groupBy,
      sortBy: s_orderBy,
      orderBy: s_sortBy,
      limit: s_limit,
      countField: "id",
    });
  };
  return (
    <div className="search-box">
      <div className="pt-15 pb-15">
        <div className="mb-5 pb-5">
          <label>
            {message[appConst.lan].pages.modules.searchbox.select}{" "}
            <button
              className="btn btn-sm btn-primary pull-right mb-15"
              onClick={() => setFields([...fields, ""])}
            >
              {" "}
              <PlusOutlined />
            </button>
          </label>
          <p className="clearfix"></p>
          <div className="row">
            {fields.map((field, index) => {
              return (
                <div className="col-md-4" key={index}>
                  <div className="mb-15" style={{ position: "relative" }}>
                    <Select
                      options={def_selectFieldOption}
                      value={field}
                      onSelect={(v) => selectField(index, v)}
                    />
                    {field.value!="id"&&<button
                      className="btn btn-sm btn-default"
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        height: "30px",
                      }}
                      onClick={() => removeField(index)}
                    >
                      &times;
                    </button>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mb-5 pb-5">
          <label>
            {message[appConst.lan].pages.modules.searchbox.conditions}
            <button
              className="btn btn-sm btn-primary pull-right mb-15"
              onClick={() => setConditions([...conditions, { field: '',orWhere: false, andWhere: false,  condition:"", value: '' }])}
            >
              {" "}
              <PlusOutlined />
            </button>
          </label>
          <p className="clearfix"></p>
          <div>
            {conditions.map((condition,index)=>{
              return <>
                <div className="pb-10">
                <div className="row">
                
                {index>0&&<div className="col-md-2">
                  <label><input type="checkbox" checked={condition.andWhere} onChange={()=>{
                    
                    let temp = [...conditions];
                    temp[index].andWhere = !condition.andWhere;
                    setConditions(temp)
                  }}/> {message[appConst.lan].pages.modules.searchbox.and}</label>
                </div>}
               {index>0&&<div className="col-md-2">
                  
                <label><input type="checkbox" checked={condition.orWhere} onChange={()=>{
                    
                    let temp = [...conditions];
                    temp[index].orWhere = !condition.orWhere;
                    setConditions(temp)
                  }}/>  {message[appConst.lan].pages.modules.searchbox.or}</label>
                </div>}
                <div className="col-md-3">
                <Select
                        placeholder="field"
                        options={def_selectFieldOption}
                        value={condition.field}
                        onSelect={(v) => {
                          let temp = [...conditions];
                          temp[index].field = v;
                          setConditions(temp)
                        }}
                      />
                </div>
                <div className="col-md-2">
                <Select
                        placeholder="condition"
                        options={[
                          {label:"=", value:"="},
                          {label:">", value:">"},
                          {label:"<", value:"<"},
                          {label:"<>", value:"<>"},
                          {label:"LIKE", value:"LIKE"}
                        ]}
                        value={condition.condition}
                        onSelect={(v) => {
                          let temp = [...conditions];
                          temp[index].condition = v;
                          setConditions(temp)
                        }}
                      />
                </div>
                
                <div className="col-md-2">
                  <input
                        placeholder="value" value={condition.value} className="input input-md" onChange={e=>{
                          let temp = [...conditions];
                          temp[index].value = e.target.value;
                          setConditions(temp)
                  }}/>
                </div>
                <div className="col-md-1"><button className="btn btn-sm btn-danger" onClick={()=>{
                  let temp = [...conditions];
                  temp.splice(index,1);
                  setConditions(temp)
                }}>&times;</button></div>
                </div>
                </div>
              </>
            })}
          </div>


        </div>
        <div className="mb-5 pb-5">
          <label>{message[appConst.lan].pages.modules.searchbox.order} </label>
          <p className="clearfix"></p>
          <div className="row">
            <div className="col-md-6">
              <Select
                options={def_selectFieldOption}
                value={orderBy}
                onSelect={(v) => setOrderBy(v)}
              />
            </div>
            <div className="col-md-6">
              <Select
                options={[
                  { label: "DESC", value: "DESC" },
                  { label: "ASC", value: "ASC" },
                ]}
                value={sortBy}
                onSelect={(v) => setSortBy(v)}
              />
            </div>
          </div>
        </div>
        <div className="mb-5 pb-5">
          <label>{message[appConst.lan].pages.modules.searchbox.group} </label>
          <p className="clearfix"></p>
          <div className="row">
            <div className="col-md-6">
              <Select
                options={def_selectFieldOption}
                isClearable
                value={groupBy}
                onSelect={(v) => setGroupBy(v)}
              />
            </div>
          </div>
        </div>
        <div className="mb-5 pb-5">
          <label>{message[appConst.lan].pages.modules.searchbox.limit} </label>
          <p className="clearfix"></p>
          <div className="row">
            <div className="col-md-6">
              <Select
                options={[
                  { label: "20", value: "20" },
                  { label: "50", value: "50" },
                  { label: "100", value: "100" },
                  { label: "500", value: "500" },
                ]}
                value={limit}
                onSelect={(v) => setLimit(v)}
              />
            </div>
          </div>
        </div>
        <button
          className="btn btn-md btn-primary pull-right"
          id="table-filter-btn"
          onClick={(e) => {
            e.preventDefault();
            filter();
          }}
        >
          {message[appConst.lan].pages.modules.searchbox.filter}
        </button>
      </div>
    </div>
  );
};

export const DataForm = ({ tableName ,fields, id = null, afterSaveOrUpdateCallback, token })=>{
  let defValues = {};
  fields.forEach(field=>{
    defValues[field.value] = ""
  })
  const [ fieldsData, setFieldsData ] = useState(defValues)

  useEffect(()=>{
    const apiHandeler = new ApiHandeler(token)
    
    if(id){
      apiHandeler.get(tableName,id).then(res=>res.json()).then(res=>{
        if(res.type==appConst.successResponseType){
          const data = res.data[0]
          let newFieldData = {}
          fields.forEach(field=>{
            newFieldData[field.value] = data[field.value] 
          })
          setFieldsData(newFieldData);
          window.notify(message[appConst.lan].successLoad, 3000, "default");
        }else{
          window.notify(message[appConst.lan].failToLoad, 3000, "danger");
        }
        
      })
    }
  },[])
  const onSaveOrUpdate = (e)=>{
    e.preventDefault();
    const apiHandeler = new ApiHandeler(token)
    if(id){
      apiHandeler.update(id,tableName,fieldsData).then(res=>res.json()).then(res=>{
        
        if(res.type==appConst.successResponseType){

          window.notify(message[appConst.lan].updatedSave, 3000, "default");
          afterSaveOrUpdateCallback()
        }else{
          
          window.notify(message[appConst.lan].failedToUpdate, 3000, "danger");
        }
        

      })
    }else{
      apiHandeler.insert(tableName,fieldsData).then(res=>res.json()).then(res=>{
        
        if(res.type==appConst.successResponseType){

          window.notify(message[appConst.lan].successSave, 3000, "default");
          afterSaveOrUpdateCallback()
        }else{
          
          window.notify(message[appConst.lan].failedToSave, 3000, "danger");
        }
        

      })
    }

  }

  return <div className="px-15 data-form">
    <Header title={tableName}/>
    <div className="row">
      <div className="col-md-6 col-sm-8 col-xs-12">
        <div className="data-form-fields">
        {fields.map((field,index)=>{
        if(field.type=="ENUM"){
            let inputId = uuidv4()
            return <div className="mt-15 mb-5 pt-5 field-holder" key={index}>
              <label className="d-block pb-5 field-title">{field.label}</label>
              <div className="row">
               {field.options.map((option,index)=><div key={index} className="col-md-4"> <label className="d-block pb-5"> <input checked={fieldsData[field.value]==option} value={option} onChange={(e)=>{
                let newFieldData = {...fieldsData,...{ [field.value]: e.target.value }}
                setFieldsData(newFieldData);
               }} name={inputId} type={"radio"} /> {option}</label> </div>)}
              </div>
          </div>
        }
      return <div className="mt-15 mb-5 pt-5 field-holder" key={index}>

        <label className="d-block pb-5 field-title">{field.label}</label>
        <input className="input input-md" value={fieldsData[field.value]} placeholder={field.type=='DATE'?'YYYY-MM-DD':field.type} onChange={e=>{
          let newFieldData = {...fieldsData,...{ [field.value]: e.target.value }}
          setFieldsData(newFieldData);
        }}/>
      </div>
    })}
        </div>

      <div className="pt-15">
        <button className="btn btn-md btn-primary pull-right mt-15" onClick={onSaveOrUpdate}> <SaveOutlined/> {id?message[appConst.lan].form.update:message[appConst.lan].form.save}</button>
      </div>
      <p className="clearfix"></p>
      </div>
    </div>
  </div>
}

export default ModuleDataView;
