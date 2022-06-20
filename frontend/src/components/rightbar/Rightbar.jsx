import "./rightbar.css";
import { Avatar, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import axios from "axios";

export const Rightbar = () => {
  const { user } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axios.get(`/users/friends/${user._id}`);
        setFriends(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className="rightbar">
      <div className="account">
        <Link to={`/profile/${user.username}`}>
          <Avatar
            src={user.profilePicture && PF + user.profilePicture}
            sx={{ width: 56, height: 56 }}
          />
        </Link>
        <div className="account-titles">
          <Link to="/">{user.username}</Link>
          <span>{user.fullName}</span>
        </div>
      </div>
      <span className="friends-title">My Friends</span>
      <ul className="friends-list">
        {friends &&
          friends.map((friend) => (
            <li className="friend-item" key={friend._id}>
              <div className="friend-item-left">
                <Link to={`/profile/` + friend.username}>
                  <Avatar
                    src={friend.profilePicture && PF + friend.profilePicture}
                  />
                </Link>
                <div className="friend-usermame">
                  <Link to={`/profile/` + friend.username}>
                    {friend.username}
                  </Link>
                  <span>{friend.username}</span>
                </div>
              </div>
              <div className="friend-item-right">
                <Button
                  component={Link}
                  to={`/profile/${friend.username}`}
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowCircleRightOutlinedIcon />}
                  size="small"
                >
                  Profile Git
                </Button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};
