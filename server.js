import express from "express";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcrypt-nodejs";
import register from "./controllers/register.js";
import signIn from "./controllers/signIn.js";

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

app.get("/profile/:id", );

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.json("unable to get entries"));
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
