import React from "react";
import appConst from "../constants/appConst";
import message from "../constants/message";
import Loader from "./Loader";
const Datatable = ({
  columns = [],
  data = [],
  totalPage,
  currentPage,
  onPageChange,
  loading = false,
}) => {
  return (
    <div>
      <div className="datatable-holder">
        <table className="datatable">
          <thead>
            <tr>
              {columns.map((d, i) => (
                <th key={i}>{d.displayName}</th>
              ))}
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={columns.length}>
                  <Loader />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {data.length ? (
                data.map((d, i) => (
                  <tr key={i}>
                    {columns.map((c, ci) =>
                      c.fieldType == "node" ? (
                        <td key={ci + "_" + i}>
                          {d[c.columnName].map((action, ai) => (
                            <span key={ci + "_" + i + "_" + ai}>{action}</span>
                          ))}
                        </td>
                      ) : (
                        <td key={ci + "_" + i}>{d[c.columnName]}</td>
                      )
                    )}
                  </tr>
                ))
              ) : (
                <tr><td colSpan={columns.length} style={{ textAlign: "center" }}>
                    {message[appConst.lan].noDataFound}
                  </td></tr>
              )}
            </tbody>
          )}
        </table>
      </div>
      <Pager
        totalPage={totalPage}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};
const Pager = ({ totalPage, currentPage, onPageChange }) => {
  let pages = [];
  for (let i = 1; i <= totalPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <ul>
        {pages.map((page, index) => (
          <li className={currentPage == page ? "active" : ""} key={index}>
            <a
              onClick={(e) => {
                e.preventDefault();
                onPageChange(page);
              }}
            >
              {page}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Datatable;
