const mongoose = require("mongoose");
const { Router } = require("express");
const Resources = require("../models/resources");
const router = new Router();

// отримати список ресурсів
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    const resourcesList = await Resources.findOne({
      userId: mongoose.Types.ObjectId(userId),
    });

    res.json({resourcesList});
  } catch (err) {
    res
      .status(500)
      .json({ message: "Щось пішло не так при формуванні ресурсів" });
  }
});

module.exports = router;
