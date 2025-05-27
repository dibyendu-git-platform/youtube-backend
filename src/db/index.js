import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}, DB NAME: ${connectionInstance.connection.name}, DB_NAME: ${DB_NAME}, DB PORT: ${connectionInstance.connection.port} \n`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", `${process.env.DB_URL}/${DB_NAME}`, error);
        process.exit(1)
    }
}

export default connectDB;