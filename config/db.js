import mongoose from "mongoose";

const connection = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGOURL)
        
        if (connect) {
            console.log("Database is connected")
        } else {
            console.log("Not connected")
        }
    } catch (error) {
        console.log(error)
    }
}

export default connection