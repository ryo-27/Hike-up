import React, { useEffect, useContext } from "react";
import axios from "axios";

import Posts from "./Posts";

import AppContext from "../contexts/AppContext";
import { READ_POSTS } from "../actions";
const url = `${process.env.REACT_APP_API_URL}/post`;

const All = () => {
  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    const f = async () => {
      const res = await axios.get(url);

      dispatch({ type: READ_POSTS, data: res.data });
    };
    f();

    return () => dispatch({ type: READ_POSTS, data: "loding" });
  }, [dispatch]);

  return (
    <>
      <div className="pageTitle">全投稿</div>

      <Posts url={url} />
    </>
  );
};

export default All;
