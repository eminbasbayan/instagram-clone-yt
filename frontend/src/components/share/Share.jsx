import { Avatar, Button, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ShortTextIcon from "@mui/icons-material/ShortText";
import SendIcon from "@mui/icons-material/Send";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import "./share.css";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const Share = ({ open, handleClose }) => {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      try {
        await axios.post("/upload", data);
      } catch (err) {
        console.log(err);
      }
    }
    try {
      const res = await axios.post("/posts", newPost);
      if (res.status === 200) {
        toast.success(res.data);
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modal"
    >
      <Box className="modal-box">
        <div className="modal-head">
          <Typography variant="span">Crete New Post</Typography>
        </div>
        <form className="modal-body" onSubmit={submitHandler}>
          <div className="modal-body-top">
            <Avatar
              sx={{ width: 46, height: 46 }}
              src={user && PF + user.profilePicture}
            />
            <input
              className="modal-text-input"
              type="text"
              placeholder="Write a post."
              ref={desc}
            />
            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              height="10px"
            >
              Paylaş
            </Button>
          </div>
          <div className="modal-buttons">
            <label htmlFor="file" style={{ cursor: "pointer" }}>
              <button type="button" style={{ pointerEvents: "none" }}>
                <AddAPhotoOutlinedIcon />
                <b>Fotoğraf</b>
              </button>
            </label>
            <input
              type="file"
              id="file"
              accept=".png,.jpeg,.jpg"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
            />
            <button>
              <VideoLibraryOutlinedIcon />
              <b>Video</b>
            </button>
            <button>
              <CalendarMonthOutlinedIcon />
              <b>Etkinlik</b>
            </button>
            <button>
              <ShortTextIcon />
              <b>Yazı Yaz</b>
            </button>
          </div>
          {file && (
            <div className="shareImgContainer">
              <img
                className="shareImg"
                src={URL.createObjectURL(file)}
                alt=""
                style={{ height: "300px", margin: "10px 0" }}
              />
              <CancelOutlinedIcon
                className="shareCancelImg"
                color="error"
                onClick={() => setFile(null)}
              />
            </div>
          )}
        </form>
      </Box>
    </Modal>
  );
};
