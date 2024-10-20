import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import appConst from "../constants/appConst";
import { connect } from "react-redux";
import message from "../constants/message";
import ApiHandeler from "../apiHandeler";
import { useNavigate, useParams } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import reportElements from "../constants/reportElement";
import Modal from "../components/Modal";
import Select from "../components/Select";
import { Formik } from "formik";
import { v4 as uuidv4 } from 'uuid';
const roles = "roles";
import * as Yup from 'yup';
const ReportBuilder = (props) => {
  let { id } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [errorMessage, setError] = useState("")
  const formRef = useRef();
  const [formMasterConfig, setFormMasterConfig] = useState({
    form_name: "",
    app_id: null,
    module_id: null,
    redirect_after_update: 0,
    redirect_to: "",
  });
  const [editFormJson, setEditFormJson] = useState(null);
  const [fromJson, setFromJson] = useState([]);
  
  const [fromNestedJson, setFromNestedJson] = useState([]);
  const [openLivePreview, setOpenLivePreview] = useState(false);
  const [dragingElement, setDragingElement] = useState({
    dragging: false,
    elementName: null,
    elementType: null,
  });

  const onChangeFormConfig = (key, value) =>
    setFormMasterConfig({ ...formMasterConfig, [key]: value });
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
    const tempReportJson = [...fromJson];
    let removeDids = [];
    let parentObj = {};
    let rootObjects = [];
    tempReportJson.forEach((elm) => {
      if (["mainquery", "subquery"].includes(elm.type)) {
        parentObj[elm.d_id] = { ...elm, childrens: [] };
      } else {
        parentObj[elm.d_id] = { ...elm };
      }
    });

    tempReportJson.forEach((elm) => {
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
      let index = tempReportJson.findIndex((d) => d.d_id == id);
      tempReportJson.splice(index, 1);
    }
    setFromJson(tempReportJson);
    setEditFormJson(null);
  };
  const editFormElement = (d_id) => {
    const editData = fromJson.find((d) => d.d_id == d_id);
    setEditFormJson(editData);
  };

  const onDragStart = (event) => {
    const target = event.target;
    const name = target.dataset.name;
    const d_id = target.dataset.d_id;
    const m_id = target.dataset.m_id;
    let obj = {
      dragging: true,
      elementName: name,
      d_id,
      m_id,
    }
    setDragingElement(obj);
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
    let mid = (["mainquery", "subquery"].includes(data.name))? data.d_id : data.m_id;
    const tempReportJson = [...fromJson];
    const dropTarget = event.target;
     
    const targetRect = dropTarget.getBoundingClientRect();
    let nextSiblingOfDropTarget = dropTarget.nextSibling;
    const middleY = targetRect.top + targetRect.height / 2;
    let masterElement = reportElements.find(
      (d) => d.type == dragingElement.elementName
    );
    let existedIndex = tempReportJson.findIndex(d=>d.d_id==dragingElement.d_id)
    let existedComponent = existedIndex!=-1?{...tempReportJson[existedIndex]}:null;
    if(existedIndex!=-1)tempReportJson.splice(existedIndex,1);
    if(existedComponent){
      masterElement = existedComponent;
    }
    if (["mainquery", "subquery"].includes(data.name)) {
      let containerIndex = tempReportJson.findIndex((d) => d.d_id == data.d_id);
      if (event.clientY - targetRect.top <= 8) {
        mid = data.m_id;
        if (containerIndex != -1) {
          tempReportJson.splice(containerIndex, 0, {
            type: masterElement.type,
            name: masterElement.name,
            d_id: existedComponent?existedComponent.d_id:uuidv4(),
            m_id: mid,
            input_name: existedComponent?existedComponent.input_name:"",
            input_class: existedComponent?existedComponent.input_class:"",
            input_style: existedComponent?existedComponent.input_style:"",
            required: existedComponent?existedComponent.required:false,
            placeholder: existedComponent?existedComponent.placeholder:"",
            default_value: existedComponent?existedComponent.default_value:"",
            options: existedComponent?existedComponent.options:"[]",
          });
        }

        setFromJson(tempReportJson);
        return;
      } else if (targetRect.top + targetRect.height - event.clientY <= 8) {
        mid = data.m_id;
        if (!nextSiblingOfDropTarget) {
          tempReportJson.push({
            type: masterElement.type,
            name: masterElement.name,
            d_id: existedComponent?existedComponent.d_id:uuidv4(),
            m_id: mid,
            input_name: existedComponent?existedComponent.input_name:"",
            input_class: existedComponent?existedComponent.input_class:"",
            input_style: existedComponent?existedComponent.input_style:"",
            required: existedComponent?existedComponent.required:false,
            placeholder: existedComponent?existedComponent.placeholder:"",
            default_value: existedComponent?existedComponent.default_value:"",
            options: existedComponent?existedComponent.options:"[]",
          });
        } else {
          let containerIndex = tempReportJson.findIndex(
            (d) => d.d_id == nextSiblingOfDropTarget.dataset.d_id
          );
          if (containerIndex != -1) {
            tempReportJson.splice(containerIndex, 0, {
              type: masterElement.type,
              name: masterElement.name,
              d_id: existedComponent?existedComponent.d_id:uuidv4(),
              m_id: mid,
              input_name: existedComponent?existedComponent.input_name:"",
              input_class: existedComponent?existedComponent.input_class:"",
              input_style: existedComponent?existedComponent.input_style:"",
              required: existedComponent?existedComponent.required:false,
              placeholder: existedComponent?existedComponent.placeholder:"",
              default_value: existedComponent?existedComponent.default_value:"",
              options: existedComponent?existedComponent.options:"[]",
            });
          }
        }
        setFromJson(tempReportJson);
        return;
      }
    }
    if (event.clientY < middleY) {
      let dropTargetIndex = tempReportJson.findIndex((d) => d.d_id == data.d_id);
      if (dropTargetIndex != -1) {
        tempReportJson.splice(dropTargetIndex, 0, {
          type: masterElement.type,
          name: masterElement.name,
          d_id: existedComponent?existedComponent.d_id:uuidv4(),
          m_id: mid,
          input_name: existedComponent?existedComponent.input_name:"",
          input_class: existedComponent?existedComponent.input_class:"",
          input_style: existedComponent?existedComponent.input_style:"",
          required: existedComponent?existedComponent.required:false,
          placeholder: existedComponent?existedComponent.placeholder:"",
          default_value: existedComponent?existedComponent.default_value:"",
          options: existedComponent?existedComponent.options:"[]",
        });
      } else {
        tempReportJson.push({
          type: masterElement.type,
          name: masterElement.name,
          d_id: existedComponent?existedComponent.d_id:uuidv4(),
          m_id: mid,
          input_name: existedComponent?existedComponent.input_name:"",
          input_class: existedComponent?existedComponent.input_class:"",
          input_style: existedComponent?existedComponent.input_style:"",
          required: existedComponent?existedComponent.required:false,
          placeholder: existedComponent?existedComponent.placeholder:"",
          default_value: existedComponent?existedComponent.default_value:"",
          options: existedComponent?existedComponent.options:"[]",
        });
      }
    } else {
      if (!nextSiblingOfDropTarget) {
        tempReportJson.push({
          type: masterElement.type,
          name: masterElement.name,
          d_id: existedComponent?existedComponent.d_id:uuidv4(),
          m_id: mid,
          input_name: existedComponent?existedComponent.input_name:"",
          input_class: existedComponent?existedComponent.input_class:"",
          input_style: existedComponent?existedComponent.input_style:"",
          required: existedComponent?existedComponent.required:false,
          placeholder: existedComponent?existedComponent.placeholder:"",
          default_value: existedComponent?existedComponent.default_value:"",
          options: existedComponent?existedComponent.options:"[]",
        });
      } else {
        let dropTargetIndex = tempReportJson.findIndex(
          (d) => d.d_id == nextSiblingOfDropTarget.dataset.d_id
        );
        if (dropTargetIndex != -1) {
          tempReportJson.splice(dropTargetIndex, 0, {
            type: masterElement.type,
            name: masterElement.name,
            d_id: existedComponent?existedComponent.d_id:uuidv4(),
            m_id: mid,
            input_name: existedComponent?existedComponent.input_name:"",
            input_class: existedComponent?existedComponent.input_class:"",
            input_style: existedComponent?existedComponent.input_style:"",
            required: existedComponent?existedComponent.required:false,
            placeholder: existedComponent?existedComponent.placeholder:"",
            default_value: existedComponent?existedComponent.default_value:"",
            options: existedComponent?existedComponent.options:"[]",
          });
        } else {
          tempReportJson.push({
            type: masterElement.type,
            name: masterElement.name,
            d_id: existedComponent?existedComponent.d_id:uuidv4(),
            m_id: mid,
            input_name: existedComponent?existedComponent.input_name:"",
            input_class: existedComponent?existedComponent.input_class:"",
            input_style: existedComponent?existedComponent.input_style:"",
            required: existedComponent?existedComponent.required:false,
            placeholder: existedComponent?existedComponent.placeholder:"",
            default_value: existedComponent?existedComponent.default_value:"",
            options: existedComponent?existedComponent.options:"[]",
          });
        }
      }
    }
    setFromJson(tempReportJson);
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
      if (["mainquery", "subquery"].includes(elm.type)) {
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

  const onSaveForm = (values, setSubmitting) => {
    setSubmitting(true);
   
  };
  useEffect(() => {
    buildTree(fromJson);
  }, [fromJson]);

  const getFormEditData = () => {
    
  };

  useEffect(() => {
    if (id) {
      getFormEditData();
    }
  }, []);

  return (
    <div className="container page">
      <Header
        title={
          id
            ? message[appConst.lan].pages.reportBuilder.header.title
            : message[appConst.lan].pages.reportBuilder.header.title
        }
        description={message[appConst.lan].pages.reportBuilder.header.content}
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
      
          {/* <button className="btn btn-md btn-primary mt-15 pull-right" onClick={()=>{}}><SaveOutlined/> {id?message[appConst.lan].form.update:message[appConst.lan].form.save} </button> */}
          <Formik
            initialValues={formMasterConfig}
            enableReinitialize
            validationSchema={Yup.object({
              form_name: Yup.string().required('Required'),
            })}
            onSubmit={(values, { setSubmitting }) => {
              onSaveForm(values,setSubmitting);
            }}
          >
            
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit} className="mt-15">

                    <button
                      className="btn btn-md btn-primary pull-right ml-5"
                      // onClick={onSaveForm}
                      disabled={isSubmitting}
                      type="submit"
                    >
                      <SaveOutlined /> Save Report
                    </button>
                 
          <button
            className="btn btn-md btn-primary pull-right mr-5" type="button"
            onClick={() => {
              setOpenLivePreview(true);
            }}
          >
            <EyeOutlined /> Live Preview
          </button>
          <p className="clearfix"></p>
                <div className="mb-15 mt-15">
                  <div className="form-builder__container">
                    <div className="form-element__container">
                      <div className="form-element__holder">
                        {reportElements.map((element, index) => {
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
                    </div>
                    <div
                      className="form-editor__page"
                      data-name={"container"}
                      data-d_id={0}
                      style={{
                        ...(dragingElement.dragging?{border: "1px solid"}:{}),
                        borderColor: dragingElement.dragging
                          ? "#1975df"
                          : "lightgray",
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
                            
                            onDragStart={onDragStart}
                            onDragEnd={onDragEnd}
                          />
                        );
                      })}
                    </div>
                    <div className="form-element__container">
                      <div className="px-5">
                        <div className="mt-10 mb-10">
                          <label>Report Name</label>
                          <input
                            className="input input-md"
                            value={values.form_name}
                            name="form_name"
                            onBlur={handleBlur}
                            onChange={handleChange
                              // handleChange("form_name", e.target.value)
                            }
                          />
                          {errors.form_name && touched.form_name && errors.form_name}
                        </div>
                        
                       
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
                            "Repeater",
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
                            "Repeater",
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
                          {["Radio List", "Drop Down"].includes(
                            editFormJson.name
                          ) && (
                            <div className="mt-5 mb-5">
                              <label>Options</label>
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
              </form>
            )}
          </Formik>
        </div>
      </div>
      <Modal
        title={"Live Preview"}
        show={openLivePreview}
        onClose={() => {
          setOpenLivePreview(false);
        }}
      >
        <div>{openLivePreview && <LivePreview reportJson={fromJson} />}</div>
      </Modal>
    </div>
  );
};

const LivePreview = ({ reportJson = [] }) => {
  const [nestedFormJson, setNestedFormJson] = useState([]);
  const [formState, setFormState] = useState([]);
  const buildTree = (json = []) => {
    let parentObj = {};
    let rootObjects = [];
    json.forEach((elm) => {
      if (["mainquery", "subquery"].includes(elm.type)) {
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

    return rootObjects;
  };

  useEffect(() => {
    let formStateObj = {};
    let formElm = [
      "text",
      "textarea",
      "checkbox",
      "radiolist",
      "datepicker",
      "daterange",
      "dropdown",
      "repeater",
    ];
    for (let elm of reportJson) {
      if (formElm.includes(elm.type)) {
        formStateObj[elm.input_name] = elm.default_value;
      }
    }
    const treeData = buildTree(reportJson);
    setNestedFormJson(treeData);
    setFormState(formStateObj);
  }, [reportJson]);
  const onChangeFormState = (key, value) => {
    setFormState({ ...formState, [key]: value });
  };

  return (
    <>
      <div>
        {nestedFormJson.map((data, index) => (
          <FormRenderer
            treeData={data}
            key={index}
            formState={formState}
            onChangeFormState={onChangeFormState}
          />
        ))}
      </div>
    </>
  );
};

const FormRenderer = ({ treeData, formState, onChangeFormState }) => {
  switch (treeData.type) {
    case "container":
      return (
        <div className={treeData.input_class}>
          {treeData.childrens.map((data, index) => (
            <FormRenderer
              treeData={data}
              key={index}
              formState={formState}
              onChangeFormState={onChangeFormState}
            />
          ))}
        </div>
      );
      break;
      case "row":
        return (
          <div className={'row '+treeData.input_class}>
            {treeData.childrens.map((data, index) => (
              <FormRenderer
                treeData={data}
                key={index}
                formState={formState}
                onChangeFormState={onChangeFormState}
              />
            ))}
          </div>
        );
        break;
      case "column":
        return (
          <div className={'col-md-6 '+treeData.input_class}>
            {treeData.childrens.map((data, index) => (
              <FormRenderer
                treeData={data}
                key={index}
                formState={formState}
                onChangeFormState={onChangeFormState}
              />
            ))}
          </div>
        );
        break;
    case "label":
      return (
        <label className={treeData.input_class}>{treeData.default_value}</label>
      );

      break;
    case "text":
      return (
        <input
          className={treeData.input_class}
          name={treeData.input_name}
          placeholder={treeData.placeholder}
          value={formState[treeData.input_name]}
          onChange={(e) => {
            onChangeFormState(treeData.input_name, e.target.value);
          }}
        />
      );
      break;
    case "textarea":
      return (
        <textarea
          className={treeData.input_class}
          name={treeData.input_name}
          placeholder={treeData.placeholder}
          value={formState[treeData.input_name]}
          onChange={(e) => {
            onChangeFormState(treeData.input_name, e.target.value);
          }}
        ></textarea>
      );
      break;
    case "checkbox":
      return (
        <input
          className={treeData.input_class}
          name={treeData.input_name}
          checked={formState[treeData.input_name]}
          type="checkbox"
          onChange={(e) => {
            onChangeFormState(treeData.input_name, e.target.checked ? 1 : 0);
          }}
        />
      );
      break;
    case "radiolist":
      return (
        <input
          className={treeData.input_class}
          name={treeData.input_name}
          checked={formState[treeData.input_name]}
          type="radio"
          onChange={(e) => {
            onChangeFormState(treeData.input_name, e.target.value);
          }}
        />
      );
      break;
    case "datepicker":
      return (
        <input
          className={treeData.input_class}
          name={treeData.input_name}
          placeholder={treeData.placeholder ?? "YYYY-MM-DD"}
          value={formState[treeData.input_name]}
          type="date"
          onChange={(e) => {
            onChangeFormState(treeData.input_name, e.target.value);
          }}
        />
      );
      break;
    case "dropdown":
      return (
        <select
          className={treeData.input_class}
          name={formState.input_name}
          placeholder={treeData.placeholder}
          value={formState[treeData.input_name]}
          onChange={(e) => {
            onChangeFormState(treeData.input_name, e.target.value);
          }}
        >
          <option></option>
        </select>
      );
      break;
    case "repeater":
      return <div></div>;
      break;
  }
  return <></>;
};

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

const BuilderRenderer = ({ element, removeFormElement, editFormElement, onDragStart, onDragEnd }) => {
  return (
    <>
      <div
        draggable
        className="form-element"
        data-name={element.type}
        data-d_id={element.d_id}
        data-m_id={element.m_id}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
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
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
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
export default connect(mapStateToProps, mapDispatchToProps)(ReportBuilder);
