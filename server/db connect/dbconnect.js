import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
async function connect() {
    try{ await mongoose.connect(`${process.env.DATABASE_URL}`, {
        useNewUrlParser: true,})
    console.log("Connected to MongoDB");}
    catch(err) {
        console.error("Error connecting to MongoDB:", err);
    }
   
}
export default connect
;  