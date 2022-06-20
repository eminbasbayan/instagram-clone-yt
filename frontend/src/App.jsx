import { Header } from "./components/header/Header";
import { Home } from "./pages/home/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Profile } from "./pages/profile/Profile";
import "./index.css";
import { useContext, useState } from "react";
import { Share } from "./components/share/Share";
import { Register } from "./pages/register/Register";
import { Login } from "./pages/login/Login";
import { AuthContext } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Messenger } from "./pages/messenger/Messenger";

function App() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { user } = useContext(AuthContext);

  return (
    <div className="App">
      <ToastContainer />
      <Share open={open} handleClose={handleClose} />
      <Router>
        {user && <Header handleOpen={handleOpen} />}
        <Routes>
          <Route path="/" element={user ? <Home /> : <Login />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/messenger"
            element={!user ? <Login /> : <Messenger />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
