import { useState } from "react";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

export const Register = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain !== password) {
      alert("Passwords do not match");
    } else {
      const user = {
        fullName,
        username,
        email,
        password,
        bio,
      };

      if (profilePicture) {
        const data = new FormData();
        const fileName = Date.now() + profilePicture.name;
        data.append("name", fileName);
        data.append("file", profilePicture);
        user.profilePicture = fileName;
        try {
          await axios.post("/upload", data);
        } catch (err) {
          console.log(err);
        }
      }
      try {
        const res = await axios.post("/auth/register", user);
        if (res.status === 200) {
          navigate("/login");
          toast.success("Registration successful!");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="auth-page">
      <h1>Welcome to Social Media App</h1>
      <form onSubmit={handleClick} className="form">
        <h2>Register</h2>
        <div className="form-input">
          <TextField
            required
            type="text"
            label="Full Name"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            variant="outlined"
          />
        </div>
        <div className="form-input">
          <TextField
            required
            type="text"
            label="Username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            variant="outlined"
          />
        </div>
        <div className="form-input">
          <TextField
            required
            type="email"
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            variant="outlined"
          />
        </div>
        <div className="form-input">
          <TextField
            required
            type="password"
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            variant="outlined"
          />
        </div>
        <div className="form-input">
          <TextField
            required
            type="password"
            label="Password Confirm"
            onChange={(e) => setPasswordAgain(e.target.value)}
            value={passwordAgain}
            variant="outlined"
          />
        </div>
        <div className="form-input">
          <TextField
            required
            type="file"
            onChange={(e) => setProfilePicture(e.target.files[0])}
            variant="outlined"
          />
        </div>
        <div className="form-input">
          <TextField
            required
            multiline
            label="Biography"
            onChange={(e) => setBio(e.target.value)}
            variant="outlined"
            value={bio}
          />
        </div>
        <Link to="/login" className="back-login">
          Back to Login
        </Link>
        <Button type="submit" variant="contained" color="success">
          Register
        </Button>
      </form>
    </div>
  );
};
