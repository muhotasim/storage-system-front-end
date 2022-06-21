import React from 'react';
const ToggleSwitch = ({checked, onChange}) => {
    return <label className="toggle-switch toggle-switch-sm">
    <input type="checkbox" checked={checked} onChange={()=>{onChange(!checked)}}/>
    <span className="slider"></span>
</label>
}
export default ToggleSwitch