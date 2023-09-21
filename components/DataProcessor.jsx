import { useState } from "react";
import Table from "./Table";
import { columns, API } from "./fetcher";
import { fetcher } from "./fetcher";
import ItemsFetcher from "./ItemsFetcher";
import RenderInfo from "./RenderInfo";
import Dialog from "./Dialog";
import RenderPosts from "./RenderPosts";
import Form from "./Form";
import toast from "react-hot-toast";
import useSWR from "swr";

export default function DataProcessor() {
  //console.log("DataProcessor render");

  const { data, error, isLoading, isValidating, mutate } = useSWR(API, fetcher),
    //[data, setData] = useState(null),
    [filterStr, setFilterStr] = useState(""),
    [info, setInfo] = useState(null),
    [posts, setPosts] = useState([]),
    [openDialogUserID, setOpenDialogUserID] = useState(null),
    [openDialogPosts, setOpenDialogPosts] = useState(null),
    [editedID, setEditedID] = useState(null),
    [values, setValues] = useState(columns.map(() => ""));

  function filterObjects(el) {
    if (!filterStr) return true;
    return columns
      .map(({ getVal }) => getVal(el))
      .filter((item) => "string" === typeof item)
      .some((item) => item.toLowerCase().includes(filterStr.toLowerCase()));
  }

  function sortItems(btn, head) {
    let direction = btn === "sortUp" ? 1 : -1;

    setData(
      data
        .sort((a, b) => (a[head] > b[head] ? direction : direction * -1))
        .map((item) => item)
    );
  }

  async function onClick(event) {
    const tr = event.target.closest("tr");
    let optimisticData;

    if (event.target.id === "btnCloseInfo") {
      setOpenDialogUserID(null);
      setOpenDialogPosts(null);
    }

    if (event.target.id === "btnClosePosts") {
      setOpenDialogPosts(null);
    }

    const promise = (() => {
      if (event.target.id === "delUser") {
        optimisticData = data.filter((item) => item.id != tr.id);
        return fetch(API + tr.id, { method: "DELETE" });
      }
      if (event.target.id === "ok") {
        if (editedID) {
          const ind = data.findIndex(
            (obj) => String(obj.id) === String(editedID)
          );

          const newObj = data[ind];
          columns.forEach(({ setVal }, index) =>
            Object.assign(newObj, setVal?.(values[index]))
          );
          optimisticData = data.with(ind, newObj);
          setEditedID(null);
          setValues(columns.map(() => ""));
          return fetch(API + editedID, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newObj),
          });
        } else {
          const newObj = {
            id: Math.max(...data.map((item) => +item.id)) + 1,
            address: {},
          };
          columns.forEach(({ setVal }, index) =>
            Object.assign(newObj, setVal?.(values[index]))
          );
          optimisticData = data.concat(newObj);
          setValues(columns.map(() => ""));
          return fetch(API, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newObj),
          });
        }
      }
    })();

    if (promise)
      await mutate(promise.then(fetcher), {
        optimisticData,
        populateCache: true,
        revalidate: false,
      });

    // if (event.target.id === "delUser") {
    //   setData(data.filter((item) => item.id != tr.id));
    //   const result = fetch(API + tr.id, {
    //     method: "DELETE",
    //   });
    //   setOpenDialogUserID(null);
    //   setOpenDialogPosts(null);
    // }
    if (event.target.id !== "delUser" && event.target.tagName === "TD") {
      setOpenDialogUserID(tr.id);
      setOpenDialogPosts(null);
    }
    if (event.target.id === "getPosts") {
      setOpenDialogPosts(openDialogUserID + "/posts");
    }
    if (event.target.id === "sortUp" || event.target.id === "sortDown") {
      const th = event.target.closest("th");
      sortItems(event.target.id, th.id.toLowerCase());

      setOpenDialogUserID(null);
      setOpenDialogPosts(null);
    }
    if (event.target.id === "editUser") {
      setEditedID(tr.id);
      const index = data.findIndex((obj) => String(obj.id) === String(tr.id));
      setValues(
        columns.map(({ setVal, getVal }) => (setVal ? getVal(data[index]) : ""))
      );
      setOpenDialogUserID(null);
      setOpenDialogPosts(null);
    }
    if (event.target.id === "cancel") {
      setEditedID(null);
      setValues(columns.map(() => ""));
    }
    //   if (event.target.id === "ok") {
    //     if (editedID) {
    //       const ind = data.findIndex(
    //         (obj) => String(obj.id) === String(editedID)
    //       );
    //       const newObj = data[ind];
    //       columns.forEach(({ setVal }, index) =>
    //         Object.assign(newObj, setVal?.(values[index]))
    //       );
    //       setData((old) => old.with(ind, newObj));
    //     } else {
    //       const newObj = {
    //         id: Math.max(...data.map((item) => +item.id)) + 1,
    //         address: {},
    //       };
    //       columns.forEach(({ setVal }, index) =>
    //         Object.assign(newObj, setVal?.(values[index]))
    //       );
    //       setData(data.concat(newObj));
    //     }
    //     setEditedID(null);
    //     setValues(columns.map(() => ""));
    //   }
  }

  return (
    <div onClick={() => onClick(event)}>
      <div className="inputHolder">
        <input
          value={filterStr}
          placeholder="Поиск..."
          onInput={(event) => setFilterStr(event.target.value)}
        />
      </div>
      <div style={{ position: "absolute", fontSize: "xxx-large" }}>
        {isLoading && <>⏳</>}
        {isValidating && <>👀</>}
      </div>
      {error && <>Error {error.toString()}</>}
      {data && (
        <Table
          data={data?.filter(filterObjects)}
          columns={columns}
          editedID={editedID}
        >
          <Form columns={columns} values={values} setValues={setValues} />
        </Table>
      )}

      {openDialogUserID && (
        <ItemsFetcher onLoadCallback={setInfo} value={openDialogUserID}>
          <Dialog class_name="popupInfo">
            <RenderInfo info={info} />
            <button id="btnCloseInfo" className="buttonClose">
              ❌
            </button>
            <button id="getPosts">Post</button>
          </Dialog>
        </ItemsFetcher>
      )}

      {openDialogPosts && (
        <ItemsFetcher onLoadCallback={setPosts} value={openDialogPosts}>
          {posts.length > 0 ? (
            <Dialog class_name="popupPost">
              {posts.map((post) => (
                <RenderPosts key={post.id} post={post} />
              ))}
              <button id="btnClosePosts" className="buttonClose">
                ❌
              </button>
            </Dialog>
          ) : (
            <Dialog class_name="popupPost">
              <p style={{fontSize: "xxx-large"}}>Нет данных</p>
              <button id="btnClosePosts" className="buttonClose">
                ❌
              </button>
            </Dialog>
          )}
        </ItemsFetcher>
      )}
    </div>
  );
}
