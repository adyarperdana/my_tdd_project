const { index, show } = require("../controllers/todos.controller");

const router = require("express").Router();

router.get("/", index);
router.get("/:id", show);

module.exports = router;
