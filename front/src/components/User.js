import React, { useEffect, useContext } from "react";
import axios from "axios";
import AppContext from "../contexts/AppContext";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";

import { Link } from "react-router-dom";

import Posts from "./Posts";
import ProfileEdit from "./ProfileEdit";
import FollowList from "./FollowList";
import FollowBtn from "./FollowBtn";

import { READ_POSTS, TOKEN_KEY } from "../actions";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(16),
    height: theme.spacing(16),
    marginRight: 60,
  },
  editButton: {
    display: "inline-block",
  },
}));

const User = () => {
  const { state, dispatch } = useContext(AppContext);
  const classes = useStyles();
  const [user, setUser] = React.useState("");
  const [posts_num, setPosts_num] = React.useState("");
  const [following, setFollowing] = React.useState("");
  const [followers, setFollowers] = React.useState("");
  const [followersNum, setFollowersNum] = React.useState(followers.length);
  const [follow, setFollow] = React.useState("");
  const [followList, setFollowList] = React.useState("");
  const [isLloding, setIsLoding] = React.useState(true);

  const id = useLocation().pathname.slice(6);

  useEffect(() => {
    const f = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/personal/${id}`
      );
      dispatch({ type: READ_POSTS, data: res.data });

      const res_user_data = await axios.get(
        `${process.env.REACT_APP_API_URL}/user_data/${id}`
      );
      setUser(res_user_data.data.user);
      setPosts_num(res_user_data.data.posts_num);
      setFollowing(res_user_data.data.following);
      setFollowers(res_user_data.data.followers);
      setFollowersNum(res_user_data.data.followers.length);

      const res_current = await axios.get(
        `${process.env.REACT_APP_API_URL}/current`,
        {
          headers: JSON.parse(localStorage.getItem(TOKEN_KEY)),
        }
      );

      setFollow(
        res_user_data.data.followers.find(
          (x) => x.id === res_current.data.id
        ) !== undefined
      );
      setIsLoding(false);
    };
    f();

    return () => dispatch({ type: READ_POSTS, data: "loding" });
  }, [dispatch, id]);

  if (followList === "") {
    if (isLloding === true) {
      return (
        <div style={{ width: 50, marginLeft: "auto", marginRight: "auto" }}>
          <CircularProgress color="primary" />
        </div>
      );
    } else {
      return (
        <>
          <div className="mainContent userProfile">
            {user.image ? (
              <Avatar
                aria-label="recipe"
                src={user.image}
                className={classes.large}
              />
            ) : (
              <Avatar
                aria-label="recipe"
                src="/images/defaultUser.png"
                className={classes.large}
              />
            )}
            <div className="profileContent">
              <div className="profileTop">
                <h2 className="profileName">{user.name}</h2>
                {state.currentUser.id === user.id ? (
                  <ProfileEdit />
                ) : (
                  <FollowBtn
                    id={user.id}
                    followersNum={followersNum}
                    setFollowersNum={setFollowersNum}
                    follow={follow}
                    setFollow={setFollow}
                  />
                )}
              </div>
              <div>
                投稿{posts_num}件　
                <Link
                  to="#"
                  onClick={() => setFollowList("followers")}
                  style={{ textDecoration: "none", color: "#2b2b2b" }}
                >
                  フォロワー{followersNum}人　
                </Link>
                <Link
                  to="#"
                  onClick={() => setFollowList("following")}
                  style={{ textDecoration: "none", color: "#2b2b2b" }}
                >
                  フォロー中{following.length}人
                </Link>
              </div>
            </div>
          </div>

          <Posts url={`${process.env.REACT_APP_API_URL}/personal/${id}`} />
        </>
      );
    }
  } else {
    return (
      <FollowList
        followList={followList}
        setFollowList={setFollowList}
        following={following}
        followers={followers}
        user={user}
      />
    );
  }
};

export default User;
