const handleSignIn = (req, res, db, bcrypt) => {
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
};

export default handleSignIn;
