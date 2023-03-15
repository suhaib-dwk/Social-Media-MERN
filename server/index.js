import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cros";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

/* CONFIGURATIONS  */