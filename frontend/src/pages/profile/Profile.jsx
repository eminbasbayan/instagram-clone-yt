import { useContext, useEffect, useState } from "react";
import { Post } from "../../components/post/Post";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Avatar, Button } from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import { toast } from "react-toastify";
import axios from "axios";
import "./profile.css";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  const [followed, setFollowed] = useState();
  const username = useParams().username;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
    setFollowed(currentUser.followings.includes(user?._id));
  }, [username, currentUser.followings, user?._id]);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/posts/profile/${username}`);
      setData(res.data);
    };
    fetchUser();
  }, [username]);

  const createConversation = async () => {
    try {
      await axios.post("/conversations/", {
        senderId: currentUser._id,
        receiverId: user._id,
      });
      navigate("/messenger");
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOutClick = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch({ type: "LOGOUT" });
      navigate("/login");
      toast.success("Logged out successfully");
    }
  };

  return (
    <div className="container">
      <div className="profile-page">
        <div className="profile-head">
          <div className="head-left">
            <Avatar
              sx={{ width: 150, height: 150 }}
              src={user.profilePicture && PF + user.profilePicture}
            />
          </div>
          <div className="head-right">
            <div className="head-right-top">
              <span className="profile-page-username">{user.username}</span>
              <div className="profile-page-buttons">
                {user.username !== currentUser.username ? (
                  <Button
                    variant="contained"
                    color={`${followed ? "error" : "success"}`}
                    size="small"
                    endIcon={followed ? <RemoveIcon /> : <AddIcon />}
                    onClick={handleClick}
                  >
                    {followed ? "Takipten Çıkar" : "Takip Et"}
                  </Button>
                ) : (
                  <Button variant="contained" size="small">
                    Düzenle
                  </Button>
                )}
                {user.username !== currentUser.username ? (
                  <button onClick={createConversation}>
                    <MailOutlineOutlinedIcon />
                  </button>
                ) : (
                  <button>
                    <SettingsOutlinedIcon />
                  </button>
                )}
                {user.username === currentUser.username && (
                  <button onClick={handleOutClick}>
                    <LogoutIcon color="error" />
                  </button>
                )}
              </div>
            </div>
            <div className="head-right-center">
              <div className="post-count">
                <b>{data.length}</b>
                <span>posts</span>
              </div>
              <div className="follower-count">
                <b>{user.followers ? user.followers.length : ""}</b>
                <span>followers</span>
              </div>
              <div className="following-count">
                <b>{user.followings ? user.followings.length : ""}</b>
                <span>following</span>
              </div>
            </div>
            <div className="head-right-bottom">
              <b>{user.fullName}</b>
              <span>{user.bio}</span>
            </div>
          </div>
        </div>
        <div className="profile-body">
          <div className="profile-nav-tabs">
            <button className="active">
              <GridOnOutlinedIcon />
              <span>POSTS</span>
            </button>
            <button>
              <VideoLibraryOutlinedIcon />
              <span>VIDEOS</span>
            </button>
            <button>
              <BookmarkAddOutlinedIcon />
              <span>SAVE</span>
            </button>
            <button>
              <AccountBoxOutlinedIcon />
              <span>TAGGED</span>
            </button>
          </div>
          <div className="profile-post-grid">
            {data.map((post) => (
              <div className="grid-post" key={post._id}>
                <Post post={post} />
                <div className="like-icon-wrapper">
                  <FavoriteIcon className="like-icon" />
                  <b>{post.likes && post.likes.length}</b>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
