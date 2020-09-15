const router = require("express").Router();
const bcryptjs = require("bcryptjs");

const Auth = require("./auth-model");
const Users = require("../users/users-model");

router.post("/register", (req, res) => {
  const userInfo = req.body;
  const isValid = Auth.validateUser(userInfo);
  console.log(isValid);

  if (isValid) {
    const rounds = process.env.BCRYPT_ROUNDS || 4;
    const hash = bcryptjs.hashSync(userInfo.password, rounds);
    userInfo.password = hash;

    Users.add(userInfo)
      .then((inserted) => {
        res.status(201).json({ data: inserted });
      })
      .catch((err) => res.status(500).json({ err: err.message }));
  } else {
    res.status(400).json({ error: "uh oh" });
  }
});

router.post("/login", (req, res) => {
  const creds = req.body;
  const isValid = Auth.validateCreds(creds);
  if (isValid) {
    Users.findBy({ username: creds.username })
      .then(([user]) => {
        if (user && bcryptjs.compareSync(creds.password, user.password)) {
          req.session.role = user.role;
          req.session.username = user.username;

          res.status(200).json({ message: `welcome ${creds.username}` });
        } else {
          res.status(401).json({ message: "you shall not pass!" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res
      .status(400)
      .json({ message: "Invalid info, please verify and try again" });
  }
});

module.exports = router;
