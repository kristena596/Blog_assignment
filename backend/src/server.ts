import "reflect-metadata";
import "module-alias/register.js";

import express, { Request, Response } from "express";
const app = express();
import dotenv from "dotenv";
import sequelize from "@/config/db.config";
import env from "@/config/env.config";
import { ApiError } from "@/utils";
import { errorHandlerMiddleware } from "@/middlewares";
dotenv.config();
import cors from "cors";

import Routes from "@/routes";
import { uploadsDir } from "./middlewares/multer.middleware";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// serve static files
app.use("/uploads", express.static(uploadsDir));

app.use("/api/v1", Routes);

// catch 404 and forward to error handler
app.use((req: Request, res: Response) => {
  // if error occurs while accessing files, send 404 without json
  if (req.originalUrl.startsWith("/uploads")) {
    res.status(404).end();
    return;
  }

  throw new ApiError({
    status: 404,
    message: "Not Found",
    errors: [
      {
        message: `Cannot ${req.method} ${req.originalUrl}`,
      },
    ],
  });
});

//handle all errors
app.use(errorHandlerMiddleware);

app.listen(env.PORT, async () => {
  console.log(`Server is running on port: ${env.PORT}`);
  try {
    await sequelize.authenticate();
    await sequelize.sync({
      alter: false,
    });
    console.log("Connection to db success.");
  } catch (error) {
    console.log(`Connection to db failed: ${error}`);
  }
});
