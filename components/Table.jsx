import css from "./table.module.css";
import RenderUser from "./RenderUser";
import { Fragment, memo } from "react";
import { columns } from "./fetcher";

export default function Table({ data, editedID, children }) {
  console.log("Table render");
  //console.log(editedID);
  if (data) {
    return (
      <table className={css.table}>
        <thead>
          <tr>
            {columns.map(({ title }) =>
              title !== "del" && title !== "ed" ? (
                <th id={title} key={title}>
                  <button id="sortUp" className="btnSort">
                    ▲
                  </button>
                  {title}
                  <button id="sortDown" className="btnSort">
                    ▼
                  </button>
                </th>
              ) : (
                false
              )
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <Fragment key={user.id}>
              {user.id == editedID ? (
                <>{children}</>
              ) : (
                <RenderUser user={user} />
              )}
            </Fragment>
          ))}
        </tbody>
        {!editedID && <tfoot>{children}</tfoot>}
      </table>
    );
  }
};
