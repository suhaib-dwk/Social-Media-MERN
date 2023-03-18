import express from "express";
import { login } from "../controllers/auth.js";

/* identify that these routes will all be and it allows us to have
these in separate files to keep us */
const router = express.Router();

router.post("login", login);

export default router;