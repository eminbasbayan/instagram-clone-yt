import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Post } from "../../components/post/Post";
import { Rightbar } from "../../components/rightbar/Rightbar";
import { AuthContext } from "../../context/AuthContext";
import "./home.css";

export const Home = () => {
  const [data, setData] = useState([]);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`posts/timeline/${user._id}`);
      setData(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchData();
  }, [user._id]);

  return (
    <div className="container">
      <div className="home-page">
        <div className="posts">
          {data &&
            data.map((post) => (
              <Post post={post} header bottom key={post._id} />
            ))}
        </div>
        <div className="rightbar-wrapper">
          <Rightbar />
        </div>
      </div>
    </div>
  );
};
