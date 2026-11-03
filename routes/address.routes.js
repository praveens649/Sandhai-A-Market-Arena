const express = require("express");
const router = express.Router();
const addressController = require("../controllers/address.controller");
const authMiddleware = require("../middleware/auth.middleware");

// All address operations require authentication
router.use(authMiddleware);

router.get("/", (req, res) => addressController.getAll(req, res));
router.post("/", (req, res) => addressController.create(req, res));
router.put("/:id", (req, res) => addressController.update(req, res));
router.delete("/:id", (req, res) => addressController.delete(req, res));

module.exports = router;

