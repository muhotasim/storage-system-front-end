import React, { Fragment, useEffect, useState } from "react";
import appConst from "../constants/appConst";
import message from "../constants/message";
import ToggleSwitch from "./ToggleSwitch";

const ModifyApp = ({
  id,
  defaultName = "",
  defaultPrefix = "",
  defaultStatus = false,
  onSaveOrUpdate,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [prefix, setPrefix] = useState('');
  const [status, setStatus] = useState('');

  useEffect(()=>{
    setName(defaultName)
    setPrefix(defaultPrefix)
    setStatus(defaultStatus)
  },[id,defaultName,defaultPrefix,defaultStatus])
  const onSubmit = (e) => {
    e.preventDefault();
    onSaveOrUpdate({  
      id:id,
      name,
      prefix,
      status,
    });
  };
  return (
    <Fragment>
      <form
        onSubmit={onSubmit}
        className="mt-15 mb-15 pb-15"
      >
        <p className="clearfix"></p>
        <div className="mb-15">
          <label className="d-block">
            {message[appConst.lan].form.modifyApp.name}
          </label>
          <input
            className="input input-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-15">
          <label className="d-block">
            {message[appConst.lan].form.modifyApp.appPrefix}
          </label>
          <input
            disabled={id?true:false}
            className="input input-md"
            value={prefix}
            onChange={(e) => {
              let val = e.target.value;
              if(val==""){
                setPrefix(val);
                return;
              }
              if(/^[A-Z-a-z0-9_.]+$/.test(val)){
                setPrefix(val);
              }
            }}
          />
        </div>
        <div className="mt-15 pb-15">
          <p>
            <ToggleSwitch
              checked={status}
              onChange={(v) => setStatus(v)}
            /><span className="pl-5">{message[appConst.lan].pages.apps.changeStatus}</span>
          </p>
        </div>
        {id&&<button className="btn btn-md btn-danger pull-right ml-10" onClick={(e)=>{
            e.preventDefault();
            onCancel();
        }}>{message[appConst.lan].form.cancel}</button>}
        <button type="submit" className="btn btn-md btn-primary pull-right">
          {id
            ? message[appConst.lan].form.update
            : message[appConst.lan].form.save}
        </button>
        <p className="clearfix"></p>
      </form>
    </Fragment>
  );
};
export default ModifyApp;
