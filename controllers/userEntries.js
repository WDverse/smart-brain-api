const handleEntries = (req, res, db) => {
    const { id } = req.body;
    db("users")
      .where("id", "=", id)
      .increment("entries", 1)
      .returning("entries")
      .then((entries) => {
        res.json(entries[0].entries);
      })
      .catch((err) => res.json("unable to get entries"));
  }


  export default handleEntries;