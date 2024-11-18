import express from 'express';
import bodyParser from "body-parser";
import dotEnv from 'dotenv';
import mongoose from 'mongoose';
import { name } from 'ejs';
import User from './models/user.js';
import CryptoJS from 'crypto-js';
import Project from './models/project.js';
import session from 'express-session';

import projectController from './controller/projectController.js'
import skillController from './controller/skillController.js'


//file upload
import multer from 'multer';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/assets/img')
  },
  filename: function (req, file, cb) {
    const _fileName = Date.now() + file.originalname
    req._fileName = _fileName;
    cb(null, file.fieldname + '-' + _fileName)
  }
})
const upload = multer({ storage })
//end file upload

const app = express()

//session
// app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

//end session

app.use(bodyParser.json())
app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(express.json());

dotEnv.config()
const PORT = process.env.PORT;
const DBURL = process.env.DB_URL;
const CryptoKEY = process.env.CryptoKEY;

mongoose
  .connect(DBURL)
  .then(() => {
    console.log('Db connection succeed');
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('Database connection error:', err);
  });

app.post('/login', async (req, res) => {
  try {
    const checkUser = await User.findOne({ email: req.body.email });
    if (checkUser) {
      req.session.user = checkUser;
      return res.status(200).send('Logged In '+req.session.email);
    } else {
      return res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});


app.use((req, res, next) => {
  if (req.session && req.session.authenticated) {
    return next();
  } else {
    return res.render('pages/login');
  }
})

app.get('/login', (req, res) => {
  res.render('pages/login')
})




app.get('/file', (req, res) => {
  res.render('pages/fileUpload')
})
// Set up a route for file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { title, description, liveLink } = req.body;
    const image = 'assets/img/file-' + req._fileName;

    const project = new Project({
      title: title || 'CCTV Camera',
      image: image || 'image',
      description: description || 'blablablabla',
      liveLink: liveLink || 'https://www.appneti.com'
    });

    const savedProject = await project.save();

    if (!savedProject) {
      return res.status(400).send({ message: "Something went wrong" });
    }

    res.json({ message: 'File uploaded successfully!' });
    // res.render('pages/projects');

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

//project
app.post('/project', upload.single('file'), projectController.createProject);
app.get('/projects', projectController.getProjects);
app.delete('/projects', projectController.deleteAll);
app.get('/preview/:id', projectController.preview);

//skills
app.post('/skill', skillController.createSkills);
app.get('/skill', skillController.getSkills);

//Home
app.get('/', (req, res) => {
  res.render('pages/index')
})

//Hiring
app.get('/hire-me', (req, res) => {
  res.render('pages/hire-me')
})

//CV
app.get('/cv', (req, res) => {
  res.render('pages/cv')
})

//form
app.get('/form', (req, res) => {
  res.render('pages/form')
})

// Create a new user
app.post('/user', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send({
      message: "name, email, and password are required"
    });
  }
  try {
    var encryptedPWD = await CryptoJS.AES.encrypt(password, CryptoKEY).toString();
    const user = new User({ name, email, password: encryptedPWD });
    await user.save();
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Get all user
app.get('/user', async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ users });

  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Get a user
app.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  // Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid ID format" });
  }
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.send(user)
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Update a user
app.put('/user/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid ID format" });
  }
  const { name, email, password } = req.body;
  try {
    var encryptedPWD = await CryptoJS.AES.encrypt(password, CryptoKEY).toString();
    const user = await User.findByIdAndUpdate(id, { name, email, password: encryptedPWD }, { new: true });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Delete a user
app.delete('/user/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid ID format" });
  }
  try {
    const user = await User.findByIdAndDelete(id);
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});
