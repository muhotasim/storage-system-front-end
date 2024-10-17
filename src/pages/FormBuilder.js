import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import appConst from "../constants/appConst";
import { connect } from "react-redux";
import message from "../constants/message";
import ApiHandeler from "../apiHandeler";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteOutlined, EditOutlined, SaveOutlined, EyeOutlined } from "@ant-design/icons";
import formElements from "../constants/formElements";
import Modal from "../components/Modal";
import Select from "../components/Select";
const roles = "roles";

const FormBuilder = (props) => {
  let { id } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState([])
  const [errorMessage, setError] = useState("");
  const [formMasterConfig, setFormMasterConfig] = useState({
    formName: '',
    module_id: '',
    redirectAfterUpdate: false,
    redirectTo: '',
  })
  const [editFormJson, setEditFormJson] = useState(null);
  const [fromJson, setFromJson] = useState([]);
  const [fromNestedJson, setFromNestedJson] = useState([]);
  const [openLivePreview, setOpenLivePreview] = useState(false)
  const [dragingElement, setDragingElement] = useState({
    dragging: false,
    elementName: null,
    elementType: null,
  });
  const fetchModulesData = () => {
    const apiHandeler = new ApiHandeler(props.userStore.token);
    apiHandeler.getAllModuleData().then(res=>res.json()).then(res=>{
      // console.log({res})
      setModules(res.data.map(d=>(
        {
          label: d.module_name,
          value: d.id
        }
      )))
    })
  }
  const onChangeFormConfig = (key, value)=>setFormMasterConfig({...formMasterConfig, [key]: value})
  const onChangeEditFormJson = (e) =>
    setEditFormJson({
      ...editFormJson,
      [e.target.name]:
        e.target.type == "checkbox"
          ? e.target.checked
            ? 1
            : 0
          : e.target.value,
    });
  const removeFormElement = (d_id) => {
    const tempFromJson = [...fromJson];
    let removeDids = [];
    let parentObj = {};
    let rootObjects = [];
    tempFromJson.forEach((elm) => {
      if (elm.type == "container") {
        parentObj[elm.d_id] = { ...elm, childrens: [] };
      } else {
        parentObj[elm.d_id] = { ...elm };
      }
    });

    tempFromJson.forEach((elm) => {
      if (parentObj[elm.m_id]) {
        parentObj[elm.m_id].childrens.push(parentObj[elm.d_id]);
      }
    });
    let obj = parentObj[d_id];
    const updateRemoveIds = (element) => {
      removeDids.push(element.d_id);
      if (element?.childrens?.length) {
        element.childrens.forEach((elm) => {
          updateRemoveIds(elm);
        });
      }
    };
    updateRemoveIds(obj);

    for (let id of removeDids) {
      let index = tempFromJson.findIndex((d) => d.d_id == id);
      tempFromJson.splice(index, 1);
    }
    setFromJson(tempFromJson);
    setEditFormJson(null);
  };
  const editFormElement = (d_id) => {
    const editData = fromJson.find((d) => d.d_id == d_id);
    setEditFormJson(editData);
  };

  const onDragStart = (event) => {
    const target = event.target;

    const name = target.dataset.name;
    setDragingElement({
      dragging: true,
      elementName: name,
      d_id: null,
      m_id: null,
    });
  };
  const onDragEnd = () => {
    setDragingElement({
      dragging: false,
      elementName: null,
    });
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };
  const onDrop = (event) => {
    event.preventDefault();
    const data = event.target.dataset;
    let mid = data.name == "container" ? data.d_id : data.m_id;
    const tempFromJson = [...fromJson];
    const dropTarget = event.target;
    const targetRect = dropTarget.getBoundingClientRect();
    let nextSiblingOfDropTarget = dropTarget.nextSibling;
    const middleY = targetRect.top + targetRect.height / 2;
    let masterElement = formElements.find(
      (d) => d.type == dragingElement.elementName
    );
    if( data.name == "container" ){

      let containerIndex = tempFromJson.findIndex((d) => d.d_id == data.d_id);
      if((event.clientY-targetRect.top)<=8){
        mid =  data.m_id;
        if (containerIndex != -1) {
          tempFromJson.splice(containerIndex, 0, {
            type: masterElement.type,
            name: masterElement.name,
            d_id: tempFromJson.length + 1,
            m_id: mid,
            input_name: "",
            input_class: "",
            input_style: "",
            required: false,
            placeholder: '',
            default_value: '',
            options: "[]",
          });
        }
        console.log('place before container');
        
        setFromJson(tempFromJson);
        return;
      }else if(((targetRect.top + targetRect.height )-event.clientY)<=8){
        mid =  data.m_id;
        console.log('place after container');
        if (!nextSiblingOfDropTarget) {
          tempFromJson.push({
            type: masterElement.type,
            name: masterElement.name,
            d_id: tempFromJson.length + 1,
            placeholder: '',
            m_id: mid,
            input_name: "",
            input_class: "",
            input_style: "",
            required: false,
            default_value: '',
            options: "[]",
          });
        } else {
          let containerIndex = tempFromJson.findIndex(
            (d) => d.d_id == nextSiblingOfDropTarget.dataset.d_id
          );
          if (dropTargetIndex != -1) {
            tempFromJson.splice(containerIndex, 0, {
              type: masterElement.type,
              name: masterElement.name,
              d_id: tempFromJson.length + 1,
              placeholder: '',
              m_id: mid,
              input_name: "",
              input_class: "",
              input_style: "",
              required: false,
              default_value: '',
              options: "[]",
            });
          } 
        }
        setFromJson(tempFromJson);
        return;
      }
    }
    if (event.clientY < middleY) {
      let dropTargetIndex = tempFromJson.findIndex((d) => d.d_id == data.d_id);
      if (dropTargetIndex != -1) {
        tempFromJson.splice(dropTargetIndex, 0, {
          type: masterElement.type,
          name: masterElement.name,
          d_id: tempFromJson.length + 1,
          m_id: mid,
          input_name: "",
          input_class: "",
          input_style: "",
          required: false,
          placeholder: '',
          default_value: '',
          options: "[]",
        });
      } else {
        tempFromJson.push({
          type: masterElement.type,
          name: masterElement.name,
          d_id: tempFromJson.length + 1,
          m_id: mid,
          input_name: "",
          input_class: "",
          input_style: "",
          placeholder: '',
          required: false,
          default_value: '',
          options: "[]",
        });
      }
    } else {
      if (!nextSiblingOfDropTarget) {
        tempFromJson.push({
          type: masterElement.type,
          name: masterElement.name,
          d_id: tempFromJson.length + 1,
          placeholder: '',
          m_id: mid,
          input_name: "",
          input_class: "",
          input_style: "",
          required: false,
          default_value: '',
          options: "[]",
        });
      } else {
        let dropTargetIndex = tempFromJson.findIndex(
          (d) => d.d_id == nextSiblingOfDropTarget.dataset.d_id
        );
        if (dropTargetIndex != -1) {
          tempFromJson.splice(dropTargetIndex, 0, {
            type: masterElement.type,
            name: masterElement.name,
            d_id: tempFromJson.length + 1,
            placeholder: '',
            m_id: mid,
            input_name: "",
            input_class: "",
            input_style: "",
            required: false,
            default_value: '',
            options: "[]",
          });
        } else {
          tempFromJson.push({
            type: masterElement.type,
            name: masterElement.name,
            d_id: tempFromJson.length + 1,
            placeholder: '',
            m_id: mid,
            input_name: "",
            input_class: "",
            input_style: "",
            required: false,
            default_value: '',
            options: "[]",
          });
        }
      }
    }
    setFromJson(tempFromJson);
  };

  const onSaveEdit = () => {
    const index = fromJson.findIndex((d) => d.d_id == editFormJson.d_id);
    let tempJson = [...fromJson];
    tempJson[index] = editFormJson;
    setFromJson(tempJson);
    setEditFormJson(null);
  };
  const buildTree = (json = []) => {
    let parentObj = {};
    let rootObjects = [];
    json.forEach((elm) => {
      if (elm.type == "container") {
        parentObj[elm.d_id] = { ...elm, childrens: [] };
      } else {
        parentObj[elm.d_id] = { ...elm };
      }
    });

    json.forEach((elm) => {
      if (parentObj[elm.m_id]) {
        parentObj[elm.m_id].childrens.push(parentObj[elm.d_id]);
      } else {
        rootObjects.push(parentObj[elm.d_id]);
      }
    });
    setFromNestedJson(rootObjects);
  };

  const onSaveForm = () => {
    const data = {
      formData: formMasterConfig,
      formJson: fromJson
    }
    console.log(data);
  };
  useEffect(() => {
    buildTree(fromJson);
  }, [fromJson]);

  useEffect(()=>{
    fetchModulesData();
  },[])

  return (
    <div className="container page">
      <Header
        title={
          id
            ? message[appConst.lan].pages.formBuilder.header.title
            : message[appConst.lan].pages.formBuilder.header.title
        }
        description={message[appConst.lan].pages.formBuilder.header.content}
      />

      <div>
        <div>
          {errorMessage && (
            <div className="mt-5 pt-15">
              <div className="alert alert-danger alert-md">
                <p>{errorMessage}</p>
              </div>
            </div>
          )}
          <button
            className="btn btn-md btn-primary pull-right"
            onClick={onSaveForm}
          >
            <SaveOutlined /> Save Form
          </button>
          <button
            className="btn btn-md btn-primary pull-right mr-5"
            onClick={()=>{setOpenLivePreview(true)}}
          >
          <EyeOutlined/>  Live Preview
          </button>
          <p className="clearfix"></p>
          {/* <button className="btn btn-md btn-primary mt-15 pull-right" onClick={()=>{}}><SaveOutlined/> {id?message[appConst.lan].form.update:message[appConst.lan].form.save} </button> */}
          <div className="mb-15 mt-15">
            <div className="form-builder__container">
              <div className="form-element__container">
                {formElements.map((element, index) => {
                  return (
                    <DraggableComponent
                      element={element}
                      key={index}
                      onDragStart={onDragStart}
                      onDragEnd={onDragEnd}
                    />
                  );
                })}
              </div>
              <div
                className="form-editor__page"
                data-name={"container"}
                data-d_id={0}
                style={{
                  border: "1px solid",
                  borderColor: dragingElement.dragging ? "#1975df" : "lightgray",
                }}
                onDragOver={onDragOver}
                onDrop={onDrop}
              >
                {fromNestedJson.map((element, index) => {
                  return (
                    <BuilderRenderer
                      element={element}
                      key={element.d_id}
                      removeFormElement={removeFormElement}
                      editFormElement={editFormElement}
                    />
                  );
                })}
              </div>
              <div className="form-element__container">
                <div  className="px-5">
                <label className="bold">Default Form Values</label>
                <div className="mt-10 mb-10">
                  <label>Form Name</label>
                  <input className="input input-md" value={formMasterConfig.formName} onChange={e=>onChangeFormConfig('formName',e.target.value)}/>
                </div>
                <div className="mt-10 mb-10">
                  <label>Module Name</label>
                  <Select options={modules} value={formMasterConfig.module_id} onSelect={val=>{
                    console.log(val);
                    
                    onChangeFormConfig('module_id',val)
                  }}/>
                </div>
                <div className="mt-10 mb-10">
                  <label>
                  <input  type="checkbox" value={formMasterConfig.redirectAfterUpdate} onChange={e=>onChangeFormConfig('redirectAfterUpdate',e.target.checked)}/> Redirect After Update
                  </label>
                </div>
                {formMasterConfig.redirectAfterUpdate&&<div className="mt-10 mb-10">
                  <label>Redirect to</label>
                  <input className="input input-md" value={formMasterConfig.redirectTo} onChange={e=>onChangeFormConfig('redirectTo',e.target.value)}/>
                </div>}

                </div>
                {editFormJson && (
                  <div className="px-5">
                    <div className="mb-5 pb-5">
                      <label className="bold">Element Edit Options</label>
                    </div>
                    {[
                      "Text Input",
                      "Textarea",
                      "Checkbox",
                      "Radio List",
                      "Datepicker",
                      "DateRange",
                      "Drop Down",
                      "Multiple Input Container",
                    ].includes(editFormJson.name) && (
                      <div className="mt-5">
                        <label>Name</label>
                        <input
                          className="input input-md"
                          name="input_name"
                          value={editFormJson.input_name}
                          onChange={onChangeEditFormJson}
                        />
                      </div>
                    )}
                    {[
                      "Text Input",
                      "Textarea",
                      "Datepicker",
                      "DateRange",
                      "Drop Down",
                    ].includes(editFormJson.name) && (
                      <div className="mt-5">
                        <label>Placeholder</label>
                        <input
                          className="input input-md"
                          name="placeholder"
                          value={editFormJson.placeholder}
                          onChange={onChangeEditFormJson}
                        />
                      </div>
                    )}
                    <div className="mt-5 mb-5">
                      <label>Class</label>
                      <input
                        className="input input-md"
                        name="input_class"
                        value={editFormJson.input_class}
                        onChange={onChangeEditFormJson}
                      />
                    </div>
                    <div className="mt-5 mb-5">
                      <label>Default Value</label>
                      <input
                        className="input input-md"
                        name="default_value"
                        value={editFormJson.default_value}
                        onChange={onChangeEditFormJson}
                      />
                    </div>
                    <div className="mt-5 mb-5">
                      <label>Style</label>
                      <input
                        className="input input-md"
                        name="input_style"
                        value={editFormJson.input_style}
                        onChange={onChangeEditFormJson}
                      />
                    </div>
                    {[
                      "Text Input",
                      "Textarea",
                      "Checkbox",
                      "Radio List",
                      "Datepicker",
                      "DateRange",
                      "Drop Down",
                      "Multiple Input Container",
                    ].includes(editFormJson.name) && (
                      <div className="mt-5 mb-5">
                        <label>
                          <input
                            checked={editFormJson.required}
                            type="checkbox"
                            name="required"
                            onChange={onChangeEditFormJson}
                          />{" "}
                          Required
                        </label>
                      </div>
                    )}
                    {[
                      "Radio List",
                      "Drop Down",
                    ].includes(editFormJson.name) && (
                      <div className="mt-5 mb-5">
                        <label>
                            Options
                        </label>
                          <textarea
                            type="options"
                            className="input input-md"
                            name="options"
                            onChange={onChangeEditFormJson}
                          >
                            {editFormJson.options}
                          </textarea>
                      </div>
                    )}
                    {/* <div className="mt-5 mb-5">
                                    <label>Dropdown Options</label>
                                    <input className="input input-md"  name="input_name" value={editFormJson.input_name}/>
                                </div> */}

                    <div>
                      <button
                        className="btn btn-sm btn-primary mx-5"
                        onClick={onSaveEdit}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          setEditFormJson(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal title={"Live Preview"} show={openLivePreview} onClose={()=>{setOpenLivePreview(false)}}>
        <div>
            {openLivePreview&&<LivePreview formJson={fromJson}/>}
        </div>  
        </Modal>
    </div>
  );
};

const LivePreview = ({ formJson = [] })=>{

    const [nestedFormJson, setNestedFormJson] = useState([])
    const [formState, setFormState] = useState([])
    const buildTree = (json = []) => {
        let parentObj = {};
        let rootObjects = [];
        json.forEach((elm) => {
          if (elm.type == "container") {
            parentObj[elm.d_id] = { ...elm, childrens: [] };
          } else {
            parentObj[elm.d_id] = { ...elm };
          }
        });
    
        json.forEach((elm) => {
          if (parentObj[elm.m_id]) {
            parentObj[elm.m_id].childrens.push(parentObj[elm.d_id]);
          } else {
            rootObjects.push(parentObj[elm.d_id]);
          }
        });

        return rootObjects
      };

      useEffect(()=>{
        let formStateObj = {};
        let formElm = [
            "text",
            "textarea",
            "checkbox",
            "radiolist",
            "datepicker",
            "daterange",
            "dropdown",
            "multi_input_container"
        ]
        for(let elm of formJson){
            if(formElm.includes(elm.type)){
                formStateObj[elm.input_name] = elm.default_value;
            }
        }
        const treeData = buildTree(formJson);
        setNestedFormJson(treeData)
        setFormState(formStateObj)
      },[formJson])
      const onChangeFormState = (key, value)=>{
        setFormState({...formState, [key]: value})
      }
      

    return <>
        <div>
            {nestedFormJson.map(((data, index)=><FormRenderer treeData={data} key={index} formState={formState} onChangeFormState={onChangeFormState}/>))}
        </div>
    </>
}

const FormRenderer = ({treeData, formState, onChangeFormState})=>{

    switch(treeData.type){
        case "container":
            return <div className={treeData.input_class}>
                 {treeData.childrens.map(((data, index)=><FormRenderer treeData={data} key={index}  formState={formState} onChangeFormState={onChangeFormState}/>))}
            </div>
        break;
        case "label":
            return <label  className={treeData.input_class}>{treeData.default_value}</label>

        break;
        case "text":
        return  <input  className={treeData.input_class}  name={treeData.input_name} placeholder={treeData.placeholder} value={formState[treeData.input_name]} onChange={(e)=>{onChangeFormState(treeData.input_name, e.target.value)}}/>
        break;
        case "textarea":

        return  <textarea  className={treeData.input_class}  name={treeData.input_name} placeholder={treeData.placeholder} value={formState[treeData.input_name]}  onChange={(e)=>{onChangeFormState(treeData.input_name, e.target.value)}}></textarea>
        break;
        case "checkbox":

        return  <input  className={treeData.input_class}  name={treeData.input_name} checked={formState[treeData.input_name]} type="checkbox"  onChange={(e)=>{onChangeFormState(treeData.input_name, e.target.checked?1:0)}}/>
        break;
        case "radiolist":

        return  <input  className={treeData.input_class}  name={treeData.input_name} checked={formState[treeData.input_name]} type="radio"  onChange={(e)=>{onChangeFormState(treeData.input_name, e.target.value)}}/>
        break;  
        case "datepicker":

        return  <input  className={treeData.input_class}  name={treeData.input_name} placeholder={treeData.placeholder?? 'YYYY-MM-DD'} value={formState[treeData.input_name]} type="date"  onChange={(e)=>{onChangeFormState(treeData.input_name, e.target.value)}}/>
        break;
        case "dropdown":

        return  <select  className={treeData.input_class}  name={formState.input_name} placeholder={treeData.placeholder} value={formState[treeData.input_name]}  onChange={(e)=>{onChangeFormState(treeData.input_name, e.target.value)}}>
            <option></option>
        </select>
        break;
        case "multi_input_container":

        return  <div></div>
        break;
    }
    return <>

    </>
}

const DraggableComponent = ({ onDragStart, element, onDragEnd }) => (
  <div
    draggable
    className="form-element"
    data-name={element.type}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
  >
    <p>{element.name}</p>
  </div>
);

const BuilderRenderer = ({ element, removeFormElement, editFormElement }) => {
  return (
    <>
      <div
        draggable
        className="form-element"
        data-name={element.type}
        data-d_id={element.d_id}
        data-m_id={element.m_id}
      >
        <p>
          {element.name}{" "}
          {element.input_name ? "( " + element.input_name + " )" : ""}
          <button
            style={{ pointerEvents: "all", cursor: "pointer" }}
            className="btn-xs btn-danger pull-right element-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              removeFormElement(element.d_id);
            }}
          >
            <DeleteOutlined />
          </button>
          <button
            style={{ pointerEvents: "all", cursor: "pointer" }}
            className="btn-xs btn-primary pull-right mr-5 element-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              editFormElement(element.d_id);
            }}
          >
            <EditOutlined />
          </button>
        </p>
        {element?.childrens?.map((element, index) => {
          return (
            <BuilderRenderer
              element={element}
              key={element.d_id}
              removeFormElement={removeFormElement}
              editFormElement={editFormElement}
            />
          );
        })}
       
      </div>

    </>
  );
};
const mapStateToProps = (state) => {
  return {
    userStore: state.userStore,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(FormBuilder);
