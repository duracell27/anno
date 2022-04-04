const mongoose = require("mongoose");
const { Router } = require("express");
const Resources = require("../models/resources");
const Werehouse = require("../models/werehouse");
const LumberjackHut = require("../models/lumberjackHut");
const router = new Router();

// отримати список скадів
router.get("/werehouse", async (req, res) => {
  try {
    const { userId } = req.query;

    const werehouseList = await Werehouse.find({
      userId: mongoose.Types.ObjectId(userId),
    });

    //const werebuild = await LumberjackHut.find({_id : werehouseList.places[0].buiId});
    console.log('werebild', werehouseList)

    res.json({werehouseList});
  } catch (err) {
    res
      .status(500)
      .json({ message: "Щось пішло не так при отриманні скаладів" });
  }
});

module.exports = router;
