import { useContext, useEffect, useState } from "react";
import { Logo } from "../logo/Logo";
import { Link } from "react-router-dom";
import { Avatar, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import { AuthContext } from "../../context/AuthContext";
import "./header.css";
import axios from "axios";

export const Header = ({ handleOpen }) => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [userFilter, setUserFilter] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const getAllUsers = async () => {
      const res = await axios.get(`/users/list`);
      setUsers(res.data);
    };
    getAllUsers();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setUserFilter(
      users.filter((user) => user.username.includes(e.target.value))
    );
  };
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <header className="header-wrapper">
      <div className="container">
        <div className="header">
          <Logo />
          <ClickAwayListener onClickAway={handleClickAway}>
            <Box sx={{ position: "relative" }}>
              <div className="search">
                <SearchIcon className="search-icon" />
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={handleSearch}
                  onClick={handleClick}
                />
                {open ? (
                  <Box className="search-result-wrapper">
                    <div className="search-result">
                      {userFilter.length > 0 ? (
                        userFilter.slice(0, 3).map((user) => (
                          <div key={user._id}>
                            <Link
                              to={`/profile/${user.username}`}
                              onClick={() => setOpen(false)}
                              className="search-result-link"
                            >
                              <Avatar
                                src={
                                  user.profilePicture &&
                                  PF + user.profilePicture
                                }
                                sx={{ width: 28, height: 28 }}
                              />
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  lineHeight: "1",
                                  fontSize: "12px",
                                }}
                              >
                                <b>{user.username}</b>
                                <span>{user.username}</span>
                              </div>
                            </Link>
                          </div>
                        ))
                      ) : (
                        <div className="search-result-text">
                          {search.length > 0
                            ? "Aradığın kullanıcı bulanamadı."
                            : "Kullanıcı Ara..."}
                        </div>
                      )}
                    </div>
                  </Box>
                ) : null}
              </div>
            </Box>
          </ClickAwayListener>
          <div className="header-links">
            <Link to="/">
              <HomeOutlinedIcon className="icon" />
            </Link>
            <Link to="/messenger">
              <ChatOutlinedIcon className="icon" to="/messenger" />
            </Link>
            <AddBoxOutlinedIcon className="icon" onClick={handleOpen} />
            <Link to={`profile/${user.username}`}>
              <Avatar
                src={user.profilePicture && PF + user.profilePicture}
                sx={{ width: 28, height: 28 }}
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
