import {
  ApiFilled,
  ApiOutlined,
  DatabaseOutlined,
  LeftOutlined,
  TableOutlined,
  KeyOutlined,
  LockOutlined
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import ApiHandeler from "../apiHandeler";
import appConst from "../constants/appConst";
import message from "../constants/message";
import { convertToSlug } from "../utils";
import FieldCard, { fieldsTypes } from "./FieldCard";
import ModuleDataView from "./ModuleDataView";
import Select from "./Select";
import ToggleSwitch from "./ToggleSwitch";
const ModifyModuleForm = (props) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [app, setApp] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [fields, setFields] = useState([]);
  const [openDataTable, setOpenDatatable] = useState(false);
  const [openModulePermission, setOpenModulePermission] = useState(false);

  useEffect(() => {
    const apiHandeler = new ApiHandeler(props.token);
    if (props.id) {
      apiHandeler
        .getModule({
          select: JSON.stringify([
            "apps.id as app_id",
            "JSON_OBJECT('value', apps.id, 'label', apps.name, 'id', apps.id) as app",
            "system.id as id",
            "system.fields as  fields",
            "system.module_name as module_name",
            "system.title as title",
            "system.status as status",
          ]),
          condition: JSON.stringify([
            { field: "system.id", condition: "=", value: props.id },
          ]),
          join: JSON.stringify([
            {
              type: "LEFT",
              table: "apps",
              conditions: [
                { condition: "=", field: "apps.id", value: "system.app_id" },
              ],
            },
          ]),
        })
        .then((res) => res.json())
        .then((res) => {
          const data = res.data[0];
          setName(data.module_name);
          setTitle(data.title);
          setStatus(data.status ? true : false);
          setApp(JSON.parse(data.app));
          setFields(
            JSON.parse(data.fields).map((d) => {
              d.old_name = d.name;
              d.old_type = d.type;
              d.type = fieldsTypes.find((cv) => cv.value == d.type);
              return d;
            })
          );
        });
    } else {
      setErrorMessage("");
      setName("");
      setApp("");
      setTitle("");
      setStatus("");
      setFields([]);
    }
  }, [props.id]);

  const validate = (tfs) => {
    let isValid = true;
    for (let index in tfs) {
      if (!tfs[index].name || !tfs[index].type) {
        isValid = false;
        break;
      }
    }
    return isValid;
  };
  const onSubmit = (e) => {
    e.preventDefault();
    let dataObj = {
      tableName: name,
      title: title,
      fields: JSON.stringify(
        fields.map((d) => ({
          name: d.name,
          type: d.type.value,
          length: d.length,
          options: d.options,
        }))
      ),
      status: status ? 1 : 0,
      app_id: app.value,
    };
    if (!name || !title || !fields.length || !app || !validate(fields)) {
      setErrorMessage(message[appConst.lan].pages.modules.form.validate);
      return;
    }
    props.submit(dataObj);
  };

  const addField = (e) => {
    e.preventDefault();
    let obj = { name: "", type: "", length: "1", options: [""] };
    if (props.id) {
      obj.newData = true;
    }
    setFields([...fields, obj]);
  };
  const removeField = (index) => {
    let tempField = fields;
    if (props.id) {
      const apiHandeler = new ApiHandeler(props.token);
      if (tempField[index].newData) {
        tempField.splice(index, 1);
        setFields([...tempField]);
      } else {
        apiHandeler
          .removeField(name, tempField[index].name)
          .then((res) => res.json())
          .then((res) => {
            if (res.type == appConst.successResponseType) {
              tempField.splice(index, 1);
              setFields([...tempField]);
              window.notify(
                message[appConst.lan].deletedSuccess,
                3000,
                "default"
              );
            } else {
              window.notify(
                message[appConst.lan].failedToRemove,
                3000,
                "danger"
              );
            }
          });
      }
    } else {
      tempField.splice(index, 1);
      setFields([...tempField]);
    }
  };
  const updateField = (index) => {
    let tempField = fields[index];
    if (!tempField.name || !tempField.type) {
      return;
    }
    const apiHandeler = new ApiHandeler(props.token);
    if (tempField.newData) {
      delete tempField.newData;
      if (tempField.old_name) {
        delete tempField.old_name;
      }
      if (tempField.old_type) {
        delete tempField.old_type;
      }
      apiHandeler
        .addField(
          name,
          Object.assign({}, tempField, { type: tempField.type.value })
        )
        .then((res) => res.json())
        .then((res) => {
          if (res.type == appConst.successResponseType) {
            changeFieldValue(index, "old_name", tempField.name);
            changeFieldValue(index, "old_type", tempField.type.value);
            changeFieldValue(index, "newData", false);
            window.notify(message[appConst.lan].successSave, 3000, "default");
          } else {
            window.notify(message[appConst.lan].failedToRemove, 3000, "danger");
          }
        });
    } else {
      if (
        tempField.name == tempField.old_name &&
        tempField.type.value == tempField.old_type
      ) {
        return;
      }
      apiHandeler
        .renameField(
          name,
          tempField.old_name,
          Object.assign({}, tempField, { type: tempField.type.value })
        )
        .then((res) => res.json())
        .then((res) => {
          if (res.type == appConst.successResponseType) {
            changeFieldValue(index, "newData", false);
            window.notify(message[appConst.lan].updatedSave, 3000, "default");
          } else {
            window.notify(message[appConst.lan].failedToUpdate, 3000, "danger");
          }
        });
    }
  };
  const changeFieldValue = (index, key, newValue) => {
    let tempField = fields;
    tempField[index][key] = newValue;
    setFields([...tempField]);
  };

  return (
    <div>
      <div className={props.id ? "row" : ""}>
        <div className={props.id ? "col-md-6" : ""}>
          {props.id ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                setName("");
                setTitle("");
                setStatus(false);
                setApp("");
                setFields([]);
                setOpenDatatable(false)
                setOpenModulePermission(false)
                props.cancelEdit();
              }}
              className="btn btn-md btn-primary ml-5 pull-right mt-15"
            >
              <LeftOutlined />
            </button>
          ) : null}
          {props.id ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                props.showApiList();
              }}
              className="btn btn-md btn-primary ml-5 pull-right mt-15"
            >
              <ApiOutlined />
            </button>
          ) : null}
          {props.id ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                setOpenDatatable(!openDataTable);
                setOpenModulePermission(false)
              }}
              className="btn btn-md btn-primary ml-5 pull-right mt-15"
            >
              {openDataTable ? <TableOutlined /> : <DatabaseOutlined />}
            </button>
          ) : null}
          {props.id ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                setOpenModulePermission(!openModulePermission)
              }}
              className="btn btn-md btn-primary ml-5 pull-right mt-15"
            >
              <LockOutlined />
            </button>
          ) : null}
          <form onSubmit={onSubmit} className="mt-15 mb-15 pb-15">
            <p className="clearfix"></p>
            {errorMessage && (
              <div>
                <div className="alert alert-danger alert-md">
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}
            <div className="mb-15">
              <label className="d-block">
                {message[appConst.lan].pages.modules.form.title}
              </label>
              <input
                className="input input-md"
                value={title}
                disabled={props.id}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={(e) => {
                  const slug = appConst.module_prefix + convertToSlug(title);
                  setName(slug);
                }}
              />
            </div>
            <div className="mb-15">
              <label className="d-block">
                {message[appConst.lan].pages.modules.form.name}
              </label>
              <input disabled className="input input-md" value={name} />
            </div>
            <div className="mb-15">
              <label className="d-block">
                {message[appConst.lan].pages.modules.form.appName}
              </label>
              <Select
                disabled={props.id}
                options={props.apps}
                value={app}
                onSelect={(v) => {
                  setApp(v);
                }}
              />
            </div>

            {/* <div className="mb-15">
        <label className="d-block">
            <ToggleSwitch
              checked={status}
              onChange={(v) => setStatus(v)}
            />
            <span className="pl-15">{message[appConst.lan].pages.modules.form.status}</span>
          </label>
        </div> */}
            {(!openDataTable&&!openModulePermission) && (
              <div>
                <div className="field-list">
                  <p className="mb-15 mt-15 pt-15">
                    {message[appConst.lan].pages.modules.form.fieldList}{" "}
                    <button
                      className="btn btn-sm btn-primary pull-right"
                      onClick={addField}
                    >
                      {message[appConst.lan].pages.modules.form.add}
                    </button>
                  </p>

                  <div className="field-card-holder">
                    {fields.map((field, index) => (
                      <FieldCard
                        {...field}
                        id={props.id}
                        key={"f_card" + index}
                        changeFieldValue={(key, value) =>
                          changeFieldValue(index, key, value)
                        }
                        onRemove={() => removeField(index)}
                        updateField={() => updateField(index)}
                      />
                    ))}
                  </div>
                </div>
                <p className="clearfix"></p>
                {props.id ? null : (
                  <button className="btn btn-md btn-primary pull-right mt-15">
                    {message[appConst.lan].pages.modules.form.create}
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
      {(openDataTable&&!openModulePermission) && (
        <ModuleDataView fields={fields} name={name} title={title} token={props.token}/>
      )}
      {openModulePermission&&<div className="mb-15 mt-5"><ModulePermissions systemId={props.id} token={props.token}/></div>}
    </div>
  );
};

const ModulePermissions = (props)=>{
  const [ roles, setRoles ] = useState([])
  const [ permissions, setPermission ] = useState([])
  const [ selectedRolePermission, setSelectedRolePermission ] = useState({});

  const setRolePermission = (role, permission)=>{
    const tempSelectedRolePermission = {...selectedRolePermission};
    if(tempSelectedRolePermission[role.id]){
      let permissionIndex = tempSelectedRolePermission[role.id].findIndex(per=>per==permission.id)
      if(permissionIndex==-1){
        tempSelectedRolePermission[role.id].push(permission.id)
      }else{
        tempSelectedRolePermission[role.id].splice(permissionIndex, 1);
      }
    }else{
      tempSelectedRolePermission[role.id] = [ permission.id ]
    }
    if(tempSelectedRolePermission[role.id].length==0){
      delete tempSelectedRolePermission[role.id];
    }
    setSelectedRolePermission(tempSelectedRolePermission);
  }

  const onSaveSystemPermission = ()=>{
    let newPermissions = [];
    Object.keys(selectedRolePermission).forEach(role=>{
      selectedRolePermission[role].forEach(permission_id=>{
        newPermissions.push({ system_id:props.systemId,role_id:role,permission_id })
      })
    })
    const apiHandeler = new ApiHandeler(props.token)
    apiHandeler.applyPermission(props.systemId,JSON.stringify(newPermissions)).then(res=>res.json()).then(res=>{
      if(res.type==appConst.successResponseType){
        window.notify(
          message[appConst.lan].successSave, 3000, "default");
      }else{
            window.notify(message[appConst.lan].failedToUpdate, 3000, "danger");
      }
    })
  }

  useEffect(()=>{
    
    const apiHandeler = new ApiHandeler(props.token)
    apiHandeler.querySystem("roles",{  }).then(res=>res.json()).then(roleRes=>{
      if(roleRes.type==appConst.successResponseType){
          setRoles(roleRes.data)
          apiHandeler.querySystem("permissions",{ limit: 9 }).then(res=>res.json()).then(permissionRes=>{
            if(permissionRes.type==appConst.successResponseType){
              setPermission(permissionRes.data)
              apiHandeler.querySystem("system_role_permission",{  condition: JSON.stringify([{ field: "system_id", condition: "=", value: props.systemId }]) }).then(res=>res.json()).then(systemPermission=>{
                if(systemPermission.type==appConst.successResponseType){
                  let systemPermissionObj = {};
                  systemPermission.data.forEach(permission=>{
                    if(systemPermissionObj[permission.role_id]){
                      systemPermissionObj[permission.role_id].push(permission.permission_id)
                    }else{
                      systemPermissionObj[permission.role_id] = [ permission.permission_id ]
                    }
                  })
                  setSelectedRolePermission(systemPermissionObj)
                }else{
                    window.notify(message[appConst.lan].failToLoad,3000,"danger")
                }
            })
            }else{
                window.notify(message[appConst.lan].failToLoad,3000,"danger")
            }
        })
      }else{
          window.notify(message[appConst.lan].failToLoad,3000,"danger")
      }
  })
  },[])
  return <div>
    <h3>Permissions</h3>
    {roles.map((role,index)=>{
      return <div key={index} className="mb-15 pb-15">
        <label className="d-block pb-5 fade-in">{role.name}</label>
        <div className="row">
          {permissions.map((permission,index2)=>(<div key={index+"_"+index2} className="col-md-2">
            
            <label className="d-block pb-5 fade-in"><input type="checkbox" checked={selectedRolePermission[role.id]?.includes(permission.id)?true:false} onChange={()=>{setRolePermission(role, permission)}}/> {permission.label}</label>
          </div>))}
        </div>
      </div>
    })}
  <button className="btn btn-md btn-primary pull-right" onClick={onSaveSystemPermission}>Apply</button>
  </div>
}
export default ModifyModuleForm;
