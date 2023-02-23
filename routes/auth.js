const express = require("express");
const router = express.Router();
router.use(express.json());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const user = require("../models/userschema");

const cookieParser = require("cookie-parser");
const project = require("../models/getProject");
router.use(cookieParser());

// const multer = require('multer')
// const upload = multer({ dest: './public/uploads/' })

// Routes
// User sign up

router.post("/signUpUser", async (req, res) => {
  console.log(req.body);
  const { name, phone, email, password, cpassword, bu, gender, employee_id } =
    req.body;
  const image = req.file;
  if (
    !name ||
    !phone ||
    !email ||
    !password ||
    !cpassword ||
    !bu ||
    !gender ||
    !employee_id
  ) {
    return res.status(422).json({ error: "Please fill the fields properly" });
  }
  if (password != cpassword) {
    return res
      .status(422)
      .json({ error: "Password and Confirm Password does not match!!" });
  }
  try {
    const userlogin = await user.findOne({ email });
    if (userlogin) {
      console.log("already exist");
      res.json({ message: "User already exist" });
      res.status(201);
    } else {
      const userr = new user({
        name,
        phone,
        email,
        password,
        cpassword,
        bu,
        gender,
        employee_id,
      });
      await userr.save();
      res.json({ message: "User Signup successfully" });
      res.status(200);
    }
  } catch (err) {
    console.log(err);
  }
});

// User login
router.post("/loginUser", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please fill the fields properly" });
  }

  try {
    const userlogin = await user.findOne({ email });
    console.log(userlogin);
    if (userlogin) {
      const isMatch = await bcrypt.compare(password, userlogin.password);
      if (isMatch) {
        const token = await userlogin.generatetoken();
        console.log(token);
        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 543333333333),
          httpOnly: true,
        });
        res.json({
          message: "User login successfully",
          token: token,
          userdata: userlogin,
        });
      } else {
        res.status(201).json({ error: "Password does not match" });
      }
    } else {
      res.status(201).json({ error: "No such user" });
    }
  } catch (err) {
    console.log(err);
  }
});

// Logout
router.get("/logout", (req, res) => {
  console.log("logout");
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("User logout");
  res.send("logout");
});

router.get("/home", (req, res) => {});

router.post("/contact_us", (req, res) => {});

router.get("/v/project_view/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const proj = await project.findById(id);
    if (proj) {
      console.log(proj);
      return res.status(200).json(proj);
    } else {
      return res.status(201).json({ error: "No such project" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

router.post("/v/project_invite", (req, res) => {
  console.log(req.body);
  const { user_details, project_title, project_id } = req.body;
  res.status(200).json({ message: "joined successfully" });
});

router.get("/userDetails/:token", async (req, res) => {
  try {
    const { token } = req.params;
    console.log(token);
    const proj = await project.findBy(token);
    if (proj) {
      console.log(proj);
      return res.status(200).json(proj);
    } else {
      return res.status(201).json({ error: "No such project" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});
router.get("/getcookie", function (req, res) {
  res.send(req.cookies);
});

router.get("/getallProjects", async (req, res, next) => {
  try {
    const project = await project.find();
    return res.status(200).json(project);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});
module.exports = router;
