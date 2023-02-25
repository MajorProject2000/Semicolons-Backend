 const express = require('express');
const router = express.Router();
router.use(express.json());
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const user = require('../models/userschema');

const cookieParser = require("cookie-parser");
const project = require('../models/getProject');
const contactData = require('../models/contactMsgSchema');
const projectvolunteerSchema = require('../models/projectvolunteerSchema')
router.use(cookieParser())

const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now());
    },
  });
  
 
var upload = multer({ storage: storage });

// Routes
// User sign up

router.post('/signUpUser', async (req, res) => {
    console.log(req.body);
    const { name, phone, email, password, cpassword , bu, gender, employee_id } = req.body;
    if (!name || !phone || !email || !password || !cpassword || !bu || !gender || !employee_id) {
        return res.status(422).json({ error: "Please fill the fields properly" })
    }
    if (password != cpassword) {
        return res.status(422).json({ error: "Password and Confirm Password does not match!!" })
    }
    try {

        const userlogin = await user.findOne({ email });
        if (userlogin) {
            console.log('already exist')
            res.json({ message: "User already exist" });
            res.status(201);
        }
        else {
            const userr = new user({ name, phone, email, password, cpassword, bu, gender, employee_id })
            await userr.save();
            res.json({ message: "User Signup successfully" });
            res.status(200);
        }
    } catch (err) {
        console.log(err)
    }

});

router.post('/loginUser', async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Please fill the fields properly" })
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
                    expires: new Date(Date.now() + 23333333333),
                    httpOnly: true
                })
                res.json({ message: "User login successfully", token: token, userdata: userlogin })
            }
            else {
                res.status(201).json({ error: "Password does not match" });
            }
        }
        else {            
            res.status(201).json({ error: "No such user" });
        }
    } catch (err) {
        console.log(err)
    }
});

// Logout
router.get('/logout', (req, res) => {
    console.log("logout");
    res.clearCookie('jwtoken', { path: '/' });
    res.status(200).send('User logout');
});

router.get('/v/project_view/:id', async (req, res) => {
        try {
          const { id } = req.params;
          console.log(id);
          const proj = await project.findById(id);
          if (proj){
            console.log(proj);
            return res.status(200).json(proj);
          }
          else{
            return res.status(201).json({error:"No such project"});
          }
        } catch (err) {
          console.log(err);
          res.status(500).json({ error: "server error" });
        }
     
});

router.get('/v/project_view_all', async (req, res) => {
  try {
    
    const proj = await project.find();
    if (proj){
      console.log(proj);
      return res.status(200).json(proj);
    }
    else{
      return res.status(201).json({error:"No such project"});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }

});

router.post('/v/project_invite', (req, res) => {
    console.log(req.body)
    const {user_details,project_title,project_id}=req.body;
    res.status(200).json({message:"joined successfully"})
});

router.get('/userDetails/:token', async (req, res) => {
    try {
    const token = req.cookies.jwtoken;
    console.log(token)
    const verifyt = jwt.verify(token, 'persistent');
    const rootUser = await user.findOne({ _id: verifyt._id, "tokens.token": token });
    if(!rootUser){
        return res.status(500).json({err:"Unauthorized user"})
    }
    else{
        res.status(200).json(rootUser)
    }
    
}
 catch (err) {
     res.status(500).json(err)
}
});

router.post('/addProject', upload.single("images"), async (req, res) => {
    console.log(req.body);
    const { project_name,description,location,date,timing,type_of_activity,hours_required,images} = req.body;
    if (!project_name || !description || !location || !date || !timing || !type_of_activity || !hours_required || !images) {
        return res.status(422).json({ error: "Please fill the fields properly" })
    }
    try {
            const projectt = new project({ project_name,description,location,date,timing,type_of_activity,hours_required,images})
            await projectt.save();
            res.json({ message: project_name + " project added successfully" });
            res.status(200);
    } catch (err) {
        res.status(500).json({ error: err});
    }

});

// router.post("/uploadphoto", upload.single("img"), (req, res, next) => {
//     var obj = {
//       name: req.body.name,
//       detail: req.body.detail,
//       img: req.body.img,
//     };
//     ImagePost.create(obj, (err, item) => {
//       if (err) {
//         console.log(err);
//       } else {
//         // item.save();
//         res.redirect("/");
//       }
//     });
//   });


router.post('/contactUs/contactDetails', async (req, res) => {
    console.log(req.body);
    const { name , email, msg } = req.body;
    if (!name || !email || !msg) {
        return res.status(422).json({ error: "Please fill the fields properly" })
    }
    try {
            const contact = new contactData({ name , email, msg })
           
            await contact.save();
            res.json({ message: "Message added successfully" });
            res.status(200);
    } catch (err) {
        console.log(err)
    }

});

router.post('/v/project_invite', async (req, res) => {
  console.log(req.body);
  const { name , email, bu, phone,project_name,project_id,empid,gender} = req.body;
  if (!gender || !empid || !project_id || !project_name || !phone || !bu || !email || !name) {
      return res.status(422).json({ error: "Please fill the fields properly" })
  }
  try {
          const projectinvite = new projectvolunteerSchema({ name , email, bu, phone,project_name,project_id,empid,gender})
          await projectinvite.save();
          res.status(200).json({message:"joined successfully"})
  } catch (err) {
      res.status(500).json({ error: err});
  }
});


module.exports = router;