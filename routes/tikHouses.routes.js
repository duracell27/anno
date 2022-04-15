const mongoose = require("mongoose");
const { Router } = require("express");
const Resources = require("../models/resources");
const TikResources = require("../models/tikResources")
const PeasantHut = require("../models/peasantHut");
const Chapel = require("../models/chapel");
const Marketplace = require("../models/marketplace");
const router = new Router();

// прорахунок по будинках
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    const housesList = await PeasantHut.find({
      userId: mongoose.Types.ObjectId(userId),
    });


    const tikResources = await TikResources.find({
      userId: mongoose.Types.ObjectId(userId),
    });

    const resources = await Resources.find({
      userId: mongoose.Types.ObjectId(userId),
    });


    let population = 0
    
    //перерахунок потреб 
    for (let i = 0; i < housesList.length; i++) {

      const marketplace = await Marketplace.findOne({
        _id: mongoose.Types.ObjectId(housesList[i].marketplaceId),
      });
      

      let resourceFish = resources[0].resources.filter((resource) => resource.name === 'Риба')
      let resourceCider = resources[0].resources.filter((resource) => resource.name === 'Сидр')
      let chapelExist = marketplace.places.filter((place) => place.name === 'Часовня')
      let peasantHapiness = 0

      if (resourceFish[0].amount >= 0.5) {
        for (var key in housesList[i].needs) {
          if (housesList[i].needs[key].name === 'Риба') {
            if (housesList[i].needs[key].percent + 3 > 100) {
              housesList[i].needs[key].percent = 100
              peasantHapiness += housesList[i].needs[key].percent
            } else {
              housesList[i].needs[key].percent = housesList[i].needs[key].percent + 3
              peasantHapiness += housesList[i].needs[key].percent
            }
          }
        }
      } else {
        for (var key in housesList[i].needs) {
          if (housesList[i].needs[key].name === 'Риба') {
            if (housesList[i].needs[key].percent + 3 > 100) {
              housesList[i].needs[key].percent = 0
              peasantHapiness += housesList[i].needs[key].percent
            } else {
              housesList[i].needs[key].percent = housesList[i].needs[key].percent - 3
              peasantHapiness += housesList[i].needs[key].percent
            }
          }
        }
      }
      
      if (resourceCider[0].amount >= 0.5) {
        for (var key in housesList[i].needs) {
          if (housesList[i].needs[key].name === 'Сидр') {
            if (housesList[i].needs[key].percent + 3 > 100) {
              housesList[i].needs[key].percent = 100
              peasantHapiness += housesList[i].needs[key].percent
            } else {
              housesList[i].needs[key].percent = housesList[i].needs[key].percent + 3
              peasantHapiness += housesList[i].needs[key].percent
            }
          }
        }
      } else {
        for (var key in housesList[i].needs) {
          if (housesList[i].needs[key].name === 'Сидр') {
            if (housesList[i].needs[key].percent - 3 < 0) {
              housesList[i].needs[key].percent = 0
              peasantHapiness += housesList[i].needs[key].percent
            } else {
              housesList[i].needs[key].percent = housesList[i].needs[key].percent - 3
              peasantHapiness += housesList[i].needs[key].percent
            }
          }
        }
      }

      
      if (chapelExist) {
        for (var key in housesList[i].needs) {
          if (housesList[i].needs[key].name === 'Часовня') {
            if (housesList[i].needs[key].percent < 100) {
              housesList[i].needs[key].percent = housesList[i].needs[key].percent + 100
              peasantHapiness += housesList[i].needs[key].percent
            }
          }
        }
      }
      
      //розрахунок населення
      let peasantHapinessPercent = peasantHapiness / 3
      
      let peasantNow = Math.round(peasantHapinessPercent * housesList[i].peasantMax / 100)
      
      let peasantDiference = peasantNow - housesList[i].peasant
      
      population += peasantNow
      
      // розрахунок tax
      let taxNow = housesList[i].baseTax * (peasantHapinessPercent / 200)
      
      let taxDiference = taxNow - housesList[i].tax

      if (peasantDiference) {
        tikResources[0].tikResources.map((resource) => {
          if (resource.name === 'Риба') {
            resource.value = resource.value - peasantDiference * 0.01
          }
          if (resource.name === 'Сидр') {
            resource.value = resource.value - peasantDiference * 0.0045
          }
        })
        await TikResources.findOneAndUpdate({ userId: mongoose.Types.ObjectId(userId) }, { tikResources: tikResources[0].tikResources });
      }
      
      if (taxDiference) {
        tikResources[0].tikResources.map((resource) => {
          if (resource.name === 'Золото') {
            resource.value = resource.value + taxDiference
          }
        })
        await TikResources.findOneAndUpdate({ userId: mongoose.Types.ObjectId(userId) }, { tikResources: tikResources[0].tikResources });
      }
  
      await PeasantHut.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(housesList[i]._id),
      }, { $set: { needs: [...housesList[i].needs], peasant: peasantNow, tax: taxNow } }, { multi: true });
      
    }
    //перерахунок потреб закінчено


    res.json({ ok: true, population});

  } catch (err) {
    res
      .status(500)
      .json({ message: "Щось пішло не так при отриманні скаладів" });
  }
});

module.exports = router;
