import express from "express";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcrypt-nodejs";

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
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash,
        email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            name,
            email: loginEmail[0].email,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("Unable to register"));
});

app.post("/signin", (req, res) => {
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => {
            res.json("Unable to signin");
          });
      } else {
        res.status(404).json("user not found");
      }
    })
    .catch((err) => {
      res.json("user not found");
    });
});

app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    db.select("*")
      .from("users")
      .where({ id })
      .then((user) => {
        if (user.length) {
          res.json(user[0]);
        } else {
          res.status(404).json("No user found");
        }
      })
      .catch((err) => res.json("error getting user"));
  });

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
