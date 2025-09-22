import httpServer from "./app.js";
import dotenv from 'dotenv'
dotenv.config({})

const port = process.env.PORT || 4000;

httpServer.listen(port, ()=>{
    console.log(`Server is running on Port ${port}`)
})