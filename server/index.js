const express = require("express");
const mongoose = require("mongoose");
const enquiryRouter = require('./App/routes/web/enquiryRoutes');
require('dotenv').config();
let app = express();
const cors = require("cors");


app.use(cors());

app.use(express.json());

//Routes
app.use('/api/website/enquiry',enquiryRouter);

//connect to mongodb
mongoose.connect(process.env.DBURL).then(()=>{
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT || 3000,()=>{
    console.log('Server is running');
  })
}).catch((err)=>{
  console.log(err)
})  