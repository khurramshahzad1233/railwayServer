import app from "./app.js"
import dotenv from "dotenv"

if(process.env.NODE_ENV!=="PRODUCTION"){
    dotenv.config({path:"backend/config.env"})
};

const port=process.env.port || 1234

app.listen(PORT,"0.0.0.0",()=>{
    console.log(`server is running on port ${PORT}`)
})