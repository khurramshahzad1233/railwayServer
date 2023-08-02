import app from "./app.js"
import dotenv from "dotenv"

// if(process.env.NODE_ENV!=="PRODUCTION"){
    dotenv.config({path:"backend/config.env"})
// };

const port=1234 || process.env.port

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})