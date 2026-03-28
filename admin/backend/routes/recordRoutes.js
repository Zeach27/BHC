const express = require("express");
const router = express.Router();
const recordController = require("../controllers/recordController");

router.get("/", recordController.getRecords);
router.post("/add", recordController.addRecord);
router.put("/:id", recordController.updateRecord);
router.delete("/:id", recordController.deleteRecord);

module.exports = router;
