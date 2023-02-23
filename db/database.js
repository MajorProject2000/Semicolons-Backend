const mongoose=require('mongoose');
require("dotenv").config({path:'./config.env'});
const DB=process.env.DB_URL
mongoose.connect(DB, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log(`connected`);
}).catch((err)=>{
    console.log(err);
});

