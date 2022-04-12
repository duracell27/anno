const mongoose = require("mongoose");
const { Router } = require("express");
const Resources = require("../models/resources");
const TikResources = require("../models/tikResources")
const router = new Router();

// отримати список скадів
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    const resourcesList = await Resources.find({
      userId: mongoose.Types.ObjectId(userId),
    });

  

    const tikAmount = await TikResources.find({
      userId: mongoose.Types.ObjectId(userId),
    });

    const updatedResources = [...resourcesList[0].resources]
    
    for (let i = 0; i < resourcesList[0].resources.length; i++) {

      if (resourcesList[0].resources[i].name === tikAmount[0].tikResources[i].name) {
        if(resourcesList[0].resources[i].amount + tikAmount[0].tikResources[i].value > resourcesList[0].resourcesCapacity && resourcesList[0].resources[i].name !== 'Золото'){
          updatedResources[i].amount = resourcesList[0].resourcesCapacity
        }else{
          updatedResources[i].amount = resourcesList[0].resources[i].amount + tikAmount[0].tikResources[i].value
        }
      }
    }

    await Resources.findOneAndUpdate({
      userId: mongoose.Types.ObjectId(userId),
    }, { resources: updatedResources });

    res.json({ ok: true, tikAmount: tikAmount[0]});

  } catch (err) {
    res
      .status(500)
      .json({ message: "Щось пішло не так при отриманні скаладів" });
  }
});

module.exports = router;
