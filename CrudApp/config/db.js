import mongoose from "mongoose";
import dotEnv from 'dotenv';
import express from 'express';

dotEnv.config();

const app = express();

const PORT = process.env.PORT;
const DBURL = process.env.DB_URL;

const connectDB = mongoose
  .connect(DBURL)
    .then(() => {
      console.log('Db connection succeed');
      app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.log('Database connection error:', err);
    });

export default connectDB;