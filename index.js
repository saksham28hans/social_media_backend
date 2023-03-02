const express = require('express');
const app = express();
const mongoose = require('mongoose')
const helmet = require('helmet')
const dotenv = require('dotenv')
const morgan = require('morgan')
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

dotenv.config()

mongoose.set('strictQuery', false)
mongoose.connect('mongodb+srv://sak28hans:square1234@cluster0.ejqwpkx.mongodb.net/social',(err)=>{
    if(err)
    console.log(err);
    else
    console.log("Connected to Mongo");
});


//middleware
app.use(express.json());
app.use(helmet())
app.use(morgan("common"));
app.use('/api/users',userRoute)
app.use('/api/auth',authRoute)
app.use('/api/posts',postRoute)


app.get("/",(req,res)=>{
    res.send("Welcome to homepage")
})

app.get("/user",(req,res)=>{
    res.send("Welcome to User Page")
})

app.listen(8800,()=>{
    console.log("Backend server is ready and running");
})