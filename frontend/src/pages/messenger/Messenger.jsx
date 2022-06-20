import { useContext, useEffect, useRef, useState } from "react";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import "./messenger.css";
import { io } from "socket.io-client";
import { Button } from "@mui/material";

export const Messenger = () => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const socket = useRef(io("https://instagram-clone-yt.herokuapp.com/"));
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io("https://instagram-clone-yt.herokuapp.com/");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        user.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat?._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    try {
      const res = await axios.get("/users/list/");
      setReceiver(res.data.filter((u) => u._id === receiverId));
    } catch (err) {
      console.log(err);
    }

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messenger">
      <div className="chat-menu">
        <div className="chat-menu-wrapper">
          <input placeholder="Search for friends" className="chat-menu-input" />
          {conversations.map((c) => (
            <div onClick={() => setCurrentChat(c)} key={c._id}>
              <Conversation conversation={c} currentUser={user} />
            </div>
          ))}
        </div>
      </div>
      <div className="chat-box">
        <div className="chat-box-wrapper">
          {currentChat ? (
            <>
              <div className="chat-box-top">
                {messages.map((m, index) => (
                  <div ref={scrollRef} key={index}>
                    <Message
                      message={m}
                      own={m.sender === user._id}
                      user={user}
                      receiver={receiver}
                    />
                  </div>
                ))}
              </div>
              <div className="chat-box-bottom">
                <textarea
                  className="chat-message-input"
                  placeholder="write something..."
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                ></textarea>
                <Button
                  color="success"
                  variant="contained"
                  className="chat-submit-button"
                  onClick={handleSubmit}
                >
                  Send
                </Button>
              </div>
            </>
          ) : (
            <span className="no-conversation-text">Start a Chat.</span>
          )}
        </div>
      </div>
      <div className="chat-online">
        <div className="chat-online-wrapper">
          <ChatOnline
            onlineUsers={onlineUsers}
            currentId={user._id}
            setCurrentChat={setCurrentChat}
          />
        </div>
      </div>
    </div>
  );
};
