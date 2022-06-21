import { SaveOutlined,DeleteOutlined } from "@ant-design/icons";
import React from "react";
import appConst from "../constants/appConst";
import message from "../constants/message";
import { convertToSlug } from "../utils";
import Select from "./Select";
export const fieldsTypes = [
         { label: "VARCHAR", value: "VARCHAR"},
          { label: "INT", value: "INT" },
          { label: "FLOAT", value: "FLOAT" },
          { label: "TINYINT", value: "TINYINT" },
          { label: "TEXT", value: "TEXT" },
          { label: "DATE", value: "DATE" },
          { label: "ENUM", value: "ENUM" }
];
const FieldCard = ({id, name, type, length, options = [], newData, onRemove, changeFieldValue, updateField})=>{
    return <div className="field-card fade-in">
               <div className="row">
        <div className="col-md-4 col-sm-12">
            <input value={name}  onChange={e=>changeFieldValue("name", convertToSlug(e.target.value))} placeholder={message[appConst.lan].pages.modules.form.fieldCard.name} className="input input-md"/>
        </div>
        <div className="col-md-3 col-sm-12">
            <Select options={fieldsTypes} onSelect={v=>{changeFieldValue("type", v)}} 
            placeholder={message[appConst.lan].pages.modules.form.fieldCard.dataType} value={type} /></div>
        {(type.value=="VARCHAR"||type.value=="INT"||type.value=="FLOAT")&&<div className="col-md-2 col-sm-12">
            <input value={length} onChange={e=>changeFieldValue("length", e.target.value)} placeholder={message[appConst.lan].pages.modules.form.fieldCard.length} className="input input-md"/>
        </div>}
        <div className="col-md-3 col-sm-12">
        {id?<button onClick={(e)=>{
            e.preventDefault();
            updateField();
        }} className="btn btn-sm btn-primary mr-5"><SaveOutlined/></button>:null}
            <button onClick={(e)=>{
            e.preventDefault();
            onRemove();
        }} className="btn btn-sm btn-danger"><DeleteOutlined/></button></div>
    </div> 
        {type.value=="ENUM"&&<div>
            <p className="pt-15 pb-10 mt-15 pl-15">{message[appConst.lan].pages.modules.form.fieldCard.options} <button
            onClick={(e)=>{
                e.preventDefault();
                let tempOptions = options;
                tempOptions.push("");
                changeFieldValue("options", tempOptions)
            }}
            className="btn btn-sm btn-primary pull-right">{message[appConst.lan].pages.modules.form.fieldCard.addOption}</button>  </p>
            <div className="pt-15 mt-15">
                <div className="row">
                {options.map((val,key)=>{
                    return <div className="col-md-4" key={key}>
                        <div className="option fade-in">
                        <input className="input input-md mb-15" value={val} onChange={e=>{
                            let tempOptions = options;
                            tempOptions[key] = e.target.value
                            changeFieldValue("options", tempOptions)
                        }}/>
                        <span className="px-5 mx-5 close" onClick={()=>{
                            let tempOptions = options;
                            tempOptions.splice(key,1);
                            changeFieldValue("options", tempOptions)
                        }}>&times;</span>
                        </div>
                    </div>
                })}
                </div>
            </div>
        </div>}
    </div>
}
export default FieldCard;