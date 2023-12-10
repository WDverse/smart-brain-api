import express from "express";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcrypt-nodejs";
import register from "./controllers/register.js";
import signIn from "./controllers/signIn.js";
import profile from './controllers/profile.js';
import userEntries from './controllers/userEntries.js';

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "wdappiagyei",
    password: "",
    database: "smart-brain",
  },
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.post("/register", (req, res) => {
  register(req, res, db, bcrypt);
});

app.post("/signin", (req, res) => {
  signIn(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile (req, res);
});

app.put("/image", (req, res) => {
  userEntries(req, res, db)
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
