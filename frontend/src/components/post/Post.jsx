import "./post.css";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import TimeAgo from "react-timeago";
import turkishString from "react-timeago/lib/language-strings/tr";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { toast } from "react-toastify";

import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export const Post = ({ header, bottom, post }) => {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState(false);
  const { user: currentUser } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const formatter = buildFormatter(turkishString);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = async () => {
    try {
      await axios.put("/posts/" + post._id + "/like", {
        userId: currentUser._id,
      });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const deleteHandler = async () => {
    try {
      if (window.confirm("Are you sure?")) {
        const res = await axios.delete("/posts/" + post._id, {
          data: {
            userId: currentUser._id,
          },
        });
        if (res.status === 200) {
          toast.success(res.data);
          window.location.reload();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Material UI Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="post-wrapper">
      {header && (
        <div className="post-header">
          <div className="post-header-left">
            <Link to={`profile/${user.username}`}>
              <Avatar
                src={user.profilePicture && PF + user.profilePicture}
                sx={{ width: 32, height: 32 }}
              />
            </Link>
            <Link to={`profile/${user.username}`} className="profile-username">
              {user.username}
            </Link>
          </div>
          {currentUser._id === post.userId && (
            <div className="post-header-right">
              <button onClick={handleClick}>
                <MoreHorizIcon />
              </button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleClose}>
                  <IconButton color="error" onClick={deleteHandler}>
                    <DeleteIcon />
                  </IconButton>
                </MenuItem>
              </Menu>
            </div>
          )}
        </div>
      )}
      <div className="post-image">
        <img src={post.img && PF + post.img} alt="Post Content" />
      </div>
      {bottom && (
        <div className="post-bottom">
          <div className="post-like">
            <button onClick={likeHandler}>
              <FavoriteIcon
                className={`post-like-icon ${isLiked && "active"}`}
              />
            </button>
          </div>
          <span className="post-like-count">
            {like} {like > 1 ? "likes" : "like"}
          </span>
          <div className="post-content">
            <Link to={`profile/${user.username}`} className="profile-username">
              {user.username}
            </Link>{" "}
            <span className="post-text">{post.desc}</span>
          </div>
          <div className="post-time">
            <TimeAgo date={post.createdAt} formatter={formatter} />
          </div>
        </div>
      )}
    </div>
  );
};
