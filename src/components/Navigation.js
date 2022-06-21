import { DownOutlined, LogoutOutlined } from "@ant-design/icons";
import React from "react";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
const Navigation = ({ menu = [], logout }) => {
  const { pathname } = useLocation();
  return (
    <nav>
      <div className="container">
        <ul>
          {menu.map((menuItem, index) =>(<li key={index}  className={pathname===menuItem.link?"active":""}><Link to={menuItem.link}>{menuItem.label} {menuItem.menu.length?<DownOutlined/>:null}</Link>
          {menuItem.menu.length?<ul className="sub-menu">
            {menuItem.menu.map((submenuItem, subIndex) =>(<li key={index+"_sub_"+subIndex} className={pathname===submenuItem.link?"active":""}><Link to={submenuItem.link} >{submenuItem.label}</Link></li>))}
          </ul>:null}
          </li>))}
          <li className="logout"><a onClick={logout}> <LogoutOutlined/> Logout</a></li>
        </ul>
      </div>
    </nav>
  );
};
const mapStateToProps = (state)=>{
  return {
      userStore: state.userStore
  }
}
const mapDispatchToProps = (dispatch)=>{
  return {
    logout: ()=>{
      dispatch({ type: "logout" })
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Navigation)