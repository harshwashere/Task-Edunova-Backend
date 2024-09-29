import express from "express";
import getUsers from "../controllers/user-controller.js";

const route = express.Router()

route.get('/users', getUsers)

export default route