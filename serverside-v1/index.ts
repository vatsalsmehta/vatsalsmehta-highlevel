import express, { Application, Request, Response } from "express";
// required to read variables from env file
import dotenv from "dotenv";
dotenv.config();

const app: Application = express();
const port = process.env.PORT;

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try {
    app.listen(port, (): void => {
        console.log(`Connected successfully on port ${port}`);
    });

    // route for sign in and signup authentication
    const initialiseRoute = require("./handlers/initialiseHandler");
    app.use('/initialise', initialiseRoute);

    const walletRoute = require("./handlers/walletHandler");
    app.use('/wallet', walletRoute)

    const transactionRoute = require("./handlers/transactHandler");
    app.use('/transact', transactionRoute)

    
    // TODO: route for signup
} catch (error:any) {
    console.error(`Error occured: ${error.message}`);
}