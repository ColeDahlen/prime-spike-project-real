const express = require('express');
const bodyParser = require('body-parser');
// npm install multer
const multer = require('multer');
// npm install uuid
const uuid = require('uuid').v4
require('dotenv').config();

const app = express();

const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');
const { s3Uploadv2 } = require('./s3service');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
// naming the file
// Used to uploading files to the disk, not useful for sending it to AWS
// const storage = multer.diskStorage({
//   destination: (req, file, cb) =>{
//     cb(null, "uploads")
//   },
//   filename: (req, file, cb) => {
//     const { originalname } = file;
//     cb(null, `${uuid()}-${originalname}`)
//   }

// })
// filter files

// Uploading a file to the computer's memory so you can send it to AWS
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) =>{
  if(file.mimetype.split('/')[0] === 'image'){
    cb(null, true)
  } else{
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false)
  }
}
const upload = multer({ storage, fileFilter, limits:{fileSize: 104857600} })

app.post('/upload', upload.single("file"), async (req, res)=>{
  // req.file is the file we get from the client
  // console.log(req.file)
  // then we want to send it into s3 AWS
  console.log(req.file)
  
  const result = await s3Uploadv2(req.file)
  res.json({ status: "success", result })
})
//Checking for multer errors
app.use((error, req, res, next) =>{
  if (error instanceof multer.MulterError){
    if( error.code === "LIMIT_FILE_SIZE"){
      return res.status(400).json({
        message: 'file is too large'
      })
    }
    if( error.code === "LIMIT_UNEXPECTED_FILE"){
      return res.status(400).json({
        message: 'Wrong file type'
      })
    }
  }
})
// const upload = multer({ dest: "uploads/"})
// app.post('/upload', upload.single("file"), (req, res)=>{
//   console.log(req.file)
//   res.json({ status: "success"})
// })

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
