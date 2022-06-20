import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import "./chatOnline.css";
import axios from "axios";

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("/users/friends/" + currentId);
      setFriends(res.data);
    };

    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    try {
      const res = await axios.get(
        `/conversations/find/${currentId}/${user._id}`
      );
      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chat-online">
      {onlineFriends.map((o) => (
        <div
          className="chat-online-friend"
          key={o._id}
          onClick={() => handleClick(o)}
        >
          <div className="chat-online-img-container">
            <Avatar src={o.profilePicture && PF + o.profilePicture} />
            <div className="chat-online-badge"></div>
          </div>
          <span className="chat-online-name">{o?.username}</span>
        </div>
      ))}
    </div>
  );
}
