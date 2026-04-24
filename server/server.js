require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/config/Database")
const {invokeGeminiAi} = require("./src/services/ai.services")

connectDB();

// invokeGeminiAi()



app.listen(process.env.PORT, ()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})  