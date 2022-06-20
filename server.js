const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
//tarayıcı güvenlik sistemi
const cors = require("cors");
//log tutar
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");

dotenv.config();

mongoose.connect(
  process.env.MONGO_URI,
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("MongoDB connected!");
    }
  },
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(cors());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/conversations", conversationRoute);
app.use("/messages", messageRoute);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(`${__dirname1}/frontend/build/`));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

const port = process.env.PORT || 5000;

const server = app.listen(
  port,
  console.log(`Server running on PORT ${port}...`)
);

//socket
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://instagram-clone-yt.herokuapp.com/",
  },
});
let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({
      userId,
      socketId,
    });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when a user connects
  console.log("a user connected.");

  //take userID and socketId from the client
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    });
    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected.");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
});
