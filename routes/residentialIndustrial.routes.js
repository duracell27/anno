const mongoose = require("mongoose");
const { Router } = require("express");
const Resources = require("../models/resources");
const Werehouse = require("../models/werehouse");
const Marketplace = require("../models/marketplace");
const LumberjackHut = require("../models/lumberjackHut");
const router = new Router();

// отримати список скадів
router.get("/werehouse", async (req, res) => {
  try {
    const { userId } = req.query;

    const werehouseList = await Werehouse.find({
      userId: mongoose.Types.ObjectId(userId),
    });

    res.json({werehouseList});

  } catch (err) {
    res
      .status(500)
      .json({ message: "Щось пішло не так при отриманні скаладів" });
  }
});

// отримати список Ринкових площ
router.get("/marketplace", async (req, res) => {
  try {
    const { userId } = req.query;

    const marketplaceList = await Marketplace.find({
      userId: mongoose.Types.ObjectId(userId),
    });

    res.json({marketplaceList});

  } catch (err) {
    res
      .status(500)
      .json({ message: "Щось пішло не так при отриманні Ринкових площ" });
  }
});

module.exports = router;
