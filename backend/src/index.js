import {httpServer} from "./app.js";
import dotenv from 'dotenv'
import { connectDB } from "./services/db.js";
dotenv.config({})

const port = process.env.PORT || 4000;

httpServer.listen(port, ()=>{
    connectDB()
    console.log(`Server is running on Port ${port}`)
})