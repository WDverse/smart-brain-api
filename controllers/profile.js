const getProfile = (req, res) => {
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
};

export default getProfile;
