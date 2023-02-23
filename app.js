const express=require('express');
const app=express();

require("./db/database.js")
require("./db/mail")
const cors=require('cors');
app.use(cors())

app.use(require('./routes/auth'))

app.listen(3800,()=>{
    console.log(`running at port 3800`);
})  