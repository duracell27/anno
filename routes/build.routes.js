const mongoose = require("mongoose");
const { Router } = require("express");
const Resources = require("../models/resources");
const Werehouse = require("../models/werehouse");
const BuildingCost = require("../models/buildingCost");
const router = new Router();

// побудувати склад
router.get("/werehouse", async (req, res) => {
  try {
    const { userId } = req.query;

    const buildCost = await BuildingCost.findOne();

    const needForBuild = buildCost.buildings.filter(
      (build) => build.name === "Склад"
    )[0].resources;

    const resources = await Resources.findOne({
      userId: mongoose.Types.ObjectId(userId),
    });

    const updatedResources = [...resources.resources]

    for(let i = 0; i<needForBuild.length; i++){
      if(resources.resources[i].amount - needForBuild[i].amount <= 0){
        return res.json({ bought: false,message: `У вас не достаньо ${resources.resources[i].name}`});
      }
      updatedResources[i].amount = resources.resources[i].amount - needForBuild[i].amount
    }

    await Resources.findOneAndUpdate({
      userId: mongoose.Types.ObjectId(userId),
    }, {resources: updatedResources});

    const werehouse = new Werehouse({
      userId: mongoose.Types.ObjectId(userId)
    })

    await werehouse.save();

    res.json({ bought: true, message: `Склад побудовано`});
  } catch (err) {
    res
      .status(500)
      .json({ message: "Щось пішло не так при формуванні ресурсів" });
  }
});

module.exports = router;
