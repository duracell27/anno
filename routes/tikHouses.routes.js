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


    const tikAmount = await TikResources.find({
      userId: mongoose.Types.ObjectId(userId),
    });

    const resources = await Resources.find({
      userId: mongoose.Types.ObjectId(userId),
    });

    let resourceFish = resources[0].resources.filter((resource) => resource.name === 'Риба')
    let resourceCider = resources[0].resources.filter((resource) => resource.name === 'Сидр')

    // let population = 0

    for (let i = 0; i < housesList.length; i++) {

      const marketplace = await Marketplace.findOne({
        _id: mongoose.Types.ObjectId(housesList[i].marketplaceId),
      });

      let chapelExist =  marketplace.places.filter((place)=>place.name === 'Часовня')
      console.log('chapel', chapelExist)

      if (resourceFish[0].amount >= 0.5) {
        for (var key in housesList[i].needs) {
          if (housesList[i].needs[key].name === 'Риба') {
            housesList[i].needs[key].percent = housesList[i].needs[key].percent + 3
          }
        }
      }
      if (resourceCider[0].amount >= 0.5) {
        for (var key in housesList[i].needs) {
          if (housesList[i].needs[key].name === 'Сидр') {
            housesList[i].needs[key].percent = housesList[i].needs[key].percent + 3
          }
        }
      }
      // доробити перевірку на chapel
      if (resourceCider[0].amount >= 0.5) {
        for (var key in housesList[i].needs) {
          if (housesList[i].needs[key].name === 'Сидр') {
            housesList[i].needs[key].percent = housesList[i].needs[key].percent + 3
          }
        }
      }

      await PeasantHut.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(housesList[i]._id),
      }, { $set: { needs: [...housesList[i].needs] } });
    }

    // console.log('newhouselist1', housesList[0].needs)
    // console.log('newhouselist2', housesList[1].needs)
    // console.log('newhouselist3', housesList[2].needs)
    // console.log('newhouselist4', housesList[3].needs)

    // const updatedResources = [...resourcesList[0].resources]

    // for (let i = 0; i < resourcesList[0].resources.length; i++) {

    //   if (resourcesList[0].resources[i].name === tikAmount[0].tikResources[i].name) {
    //     if(resourcesList[0].resources[i].amount + tikAmount[0].tikResources[i].value > resourcesList[0].resourcesCapacity && resourcesList[0].resources[i].name !== 'Золото'){
    //       updatedResources[i].amount = resourcesList[0].resourcesCapacity
    //     }else{
    //       updatedResources[i].amount = resourcesList[0].resources[i].amount + tikAmount[0].tikResources[i].value
    //     }
    //   }
    // }

    // await Resources.findOneAndUpdate({
    //   userId: mongoose.Types.ObjectId(userId),
    // }, { resources: updatedResources });

    res.json({ ok: true });

  } catch (err) {
    res
      .status(500)
      .json({ message: "Щось пішло не так при отриманні скаладів" });
  }
});

module.exports = router;
