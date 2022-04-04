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

    // for(let i = 0; i < werehouseList.length; i++) {
    //   let oneWerehouseBuildIdInfo = []
    //   for(let j = 0; j < werehouseList[i].places.length; j++){
    //     let lumberjackHutInfo = await LumberjackHut.find({_id : werehouseList[i].places[j].buildId}, {_id: 0})
    //     console.log('info',lumberjackHutInfo)
    //     oneWerehouseBuildIdInfo.push(...lumberjackHutInfo)

    //   }
    //   console.log('готовий масив для копіювання',oneWerehouseBuildIdInfo)
    //   werehouseList[i].places.splice(0, werehouseList[i].places.length)
    //   werehouseList[i].places.push('lol')
    //   werehouseList[i].places.push('lol')
    //   console.log('places', werehouseList[i].places)
      
      // console.log('oneWerehouseBuildIdInfo',oneWerehouseBuildIdInfo)
      // werehouseList[i].places.push(oneWerehouseBuildIdInfo[i])
      // console.log(werehouseList[i].places)
    //}

    // let lumberjackHutInfo = await LumberjackHut.findOne({_id : werehouseList[0].places[0].buildId})
    // console.log('test', lumberjackHutInfo)

    // const werebuild = await LumberjackHut.find({_id : werehouseList[0].places[0].buiId});
    // console.log('werebild', werebuild[0])
    // werehouseList[0].places[0].delete()
    // werehouseList[0].places[0].push(werebuild[0])
    // console.log('ready', werehouseList)
    res.json({werehouseList});

  } catch (err) {
    res
      .status(500)
      .json({ message: "Щось пішло не так при отриманні скаладів" });
  }
});

module.exports = router;
