const db = require("../data/connection");

module.exports = {
  find,
  findBy,
  findById,
  add,
};

function find() {
  return db("users").select("id", "username", "role").orderBy("id");
}

async function add(user) {
  try {
    const [id] = await db("users").insert(user, "id");
    return findById(id);
  } catch (error) {
    throw error;
  }
}

function findById(id) {
  return db("users").where({ id }).first();
}

function findBy(filter) {
  return db("users").where(filter).orderBy("id");
}
