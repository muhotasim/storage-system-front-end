import React, { useState } from "react";
const Select =({ options =  [],disabled, value =  null, onSelect,isClearable, style = {},onChangeText = null, placeholder = "", noItemFoundText ="" })=>{
    const [ search, setSearch ] = useState('')
    const [ focused, setFocused ] = useState(false)

    const filteredOptions = options.filter(v=>v.label.toLowerCase().includes(search.toLowerCase()));
    return <div className={"select "+(disabled?"select-disabled":"")} data-value={search?"":value?.label}>
        <input disabled={disabled} className="input input-md" placeholder={value?"":placeholder} style={style} value={search} onBlur={()=>{
            setTimeout(()=>{
                setFocused(false);
                setSearch('')
            },200)
            }} onFocus={()=>{setFocused(true)}} onChange={e=>{
                setSearch(e.target.value);
                if(onChangeText) onChangeText(e.target.value)
                }}/>
        {focused&&<div className="options fade-in">
            {
                filteredOptions.length?filteredOptions.map((mValue,index)=>{
                    return (<div
                     className={"item "+(mValue.value==value.value?"active":"")}
                     key={index} onClick={(e)=>{
                        onSelect(mValue)
                        }}>
                    <p>{mValue.label}</p>
                </div>)
                }):<p>{noItemFoundText}</p>
            }
        </div>}
        {(isClearable&&value)&&<button style={{minWidth:"30px"}} onClick={e=>{
            e.preventDefault();
            onSelect('');
        }} className="btn btn-md">&times;</button>}
    </div>
}
export default Select;