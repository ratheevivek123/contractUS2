import express from 'express';
import connect from './db connect/dbconnect.js';
import usersroutes from './routes/usersroutes.js';
import contractorroutes from './routes/contractorroutes.js';
import bookingroutes from './routes/bookingroutes.js';// ✅ Import the contractor routes
import serviceRoutes from './routes/serviceroutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import adminroutes from './routes/adminroutes.js';
import passport from "passport";
import "./config/passport.js"; // 🔥 VERY IMPORTANT

dotenv.config();


const app = express();
app.use(cookieParser());
app.use(passport.initialize());


app.use(express.json());
const PORT = process.env.PORT ;
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST' , 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

connect();

app.listen(PORT,() =>{

    console.log("Server is running on port "+PORT);
});

app.get("/",(req,res) => {
    res.send("Hello World");
});
app.use('/api/auth', usersroutes);
app.use('/api/contractors',contractorroutes);
app.use('/api/booking',bookingroutes);
app.use("/api/services", serviceRoutes);
app.use("/api/admin",adminroutes);// ✅ Use the usersroutes for authentication-related routes

