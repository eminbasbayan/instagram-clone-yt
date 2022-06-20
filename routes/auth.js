const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

//register
router.post("/register", async (req, res) => {
  try {
    const { fullName, username, email, password, bio, profilePicture } =
      req.body;
    //Generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //Create new user
    const newUser = new User({
      fullName: fullName,
      username: username,
      email: email,
      password: hashedPassword,
      bio: bio,
      profilePicture: profilePicture,
    });
    //save user
    const user = await newUser.save();
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).send("User not found!");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(403).send("Invalid password!");
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
