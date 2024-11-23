// if live server nhi hota, then isko use krte

const express=require('express');

const app=express();

app.get("/",(req,res)=>{
    res.sendFile(__dirname + '/index.html');
})

app.listen(5500,()=> {
    console.log(`Server is listening`);
})