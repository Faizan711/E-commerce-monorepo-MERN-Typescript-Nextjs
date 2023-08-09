import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import 'dotenv/config'
export const secret = process.env.SECRET_KEY;

import adminRoutes from "./routes/admin";
import userRoutes from "./routes/user";

const app = express();
const port = 5000;
const MONGO_DB = process.env.MONGO_DB!;

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=> {
    res.json({"Message": "welcome to my server at port 5000!"})
});


app.use("/admin", adminRoutes);
app.use("/user", userRoutes);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});


mongoose.connect(MONGO_DB, { dbName: "courses" });

