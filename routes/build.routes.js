const mongoose = require("mongoose");
const { Router } = require("express");
const Resources = require("../models/resources");
const Werehouse = require("../models/werehouse");
const BuildingCost = require("../models/buildingCost");
const LumberjackHut = require("../models/lumberjackHut");
const FishermanHut = require("../models/fishermanHut");
const Cider = require("../models/cider");
const TikResources = require("../models/tikResources");
const router = new Router();

// побудувати склад
router.get("/werehouse", async (req, res) => {
  try {
    const { userId } = req.query;

    const buildCost = await BuildingCost.findOne();
    // const tikResources = await TikResources.findOne({userId: mongoose.Types.ObjectId(userId)});

    const needForBuild = buildCost.buildings.filter(
      (build) => build.name === "Склад"
    )[0].resources;

    const resources = await Resources.findOne({
      userId: mongoose.Types.ObjectId(userId),
    });

    const updatedResources = [...resources.resources]

    for (let i = 0; i < needForBuild.length; i++) {
      if (resources.resources[i].amount - needForBuild[i].amount <= 0) {
        return res.json({ bought: false, message: `У вас не достаньо ${resources.resources[i].name}` });
      }
      updatedResources[i].amount = resources.resources[i].amount - needForBuild[i].amount
    }

    await Resources.findOneAndUpdate({
      userId: mongoose.Types.ObjectId(userId),
    }, { resources: updatedResources });

    const werehouse = new Werehouse({
      userId: mongoose.Types.ObjectId(userId),
      places: []
    })

    await TikResources.findOneAndUpdate({userId: mongoose.Types.ObjectId(userId), 'tikResources.name': 'Золото'}, {'tikResources[0].value': 10});
    await werehouse.save();

    res.json({ bought: true, message: `Склад побудовано` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Щось пішло не так при формуванні ресурсів" });
  }
});
// побудувати ХижинаЛісниика
router.get("/lumberjackHut", async (req, res) => {
  try {
    const { userId, werehouseId } = req.query;

    const buildCost = await BuildingCost.findOne();

    const needForBuild = buildCost.buildings.filter(
      (build) => build.name === "ХижинаЛісниика"
    )[0].resources;

    const resources = await Resources.findOne({
      userId: mongoose.Types.ObjectId(userId),
    });

    const updatedResources = [...resources.resources]

    for (let i = 0; i < needForBuild.length; i++) {
      if (resources.resources[i].amount - needForBuild[i].amount <= 0) {
        return res.json({ bought: false, message: `У вас не достаньо ${resources.resources[i].name}` });
      }
      updatedResources[i].amount = resources.resources[i].amount - needForBuild[i].amount
    }

    await Resources.findOneAndUpdate({
      userId: mongoose.Types.ObjectId(userId),
    }, { resources: updatedResources });

    const lumberjackHut = new LumberjackHut({
      userId: mongoose.Types.ObjectId(userId),
      werehouseId: mongoose.Types.ObjectId(werehouseId),
    })
    await lumberjackHut.save();

    const places = [];
    places.push({
      produceSpeed: lumberjackHut.produceSpeed,
      produceName: lumberjackHut.produceName,
      name: lumberjackHut.name,
      expenses: lumberjackHut.expenses,
      size: lumberjackHut.size,
    })
    await Werehouse.findOneAndUpdate({
      _id: mongoose.Types.ObjectId(werehouseId),
    }, {$push: {places: places }});

    res.json({ bought: true, message: `Хижину Лісника побудовано` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Щось пішло не так при будуванні хижини лісника" });
  }
});

// побудувати ХижинаРибака
router.get("/fishermanHut", async (req, res) => {
  try {
    const { userId, werehouseId } = req.query;

    const buildCost = await BuildingCost.findOne();

    const needForBuild = buildCost.buildings.filter(
      (build) => build.name === "ХижинаРибака"
    )[0].resources;

    const resources = await Resources.findOne({
      userId: mongoose.Types.ObjectId(userId),
    });

    const updatedResources = [...resources.resources]

    for (let i = 0; i < needForBuild.length; i++) {
      if (resources.resources[i].amount - needForBuild[i].amount <= 0) {
        return res.json({ bought: false, message: `У вас не достаньо ${resources.resources[i].name}` });
      }
      updatedResources[i].amount = resources.resources[i].amount - needForBuild[i].amount
    }

    await Resources.findOneAndUpdate({
      userId: mongoose.Types.ObjectId(userId),
    }, { resources: updatedResources });

    const fishermanHut = new FishermanHut({
      userId: mongoose.Types.ObjectId(userId),
      werehouseId: mongoose.Types.ObjectId(werehouseId),
    })
    await fishermanHut.save();

    const places = [];
    places.push({
      produceSpeed: fishermanHut.produceSpeed,
      produceName: fishermanHut.produceName,
      name: fishermanHut.name,
      expenses: fishermanHut.expenses,
      size: fishermanHut.size,
    })
    await Werehouse.findOneAndUpdate({
      _id: mongoose.Types.ObjectId(werehouseId),
    }, {$push: {places: places }});

    res.json({ bought: true, message: `Хижину Рибака побудовано` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Щось пішло не так при будуванні хижини рибака" });
  }
});

// побудувати СидроВарня
router.get("/cider", async (req, res) => {
  try {
    const { userId, werehouseId } = req.query;

    const buildCost = await BuildingCost.findOne();

    const needForBuild = buildCost.buildings.filter(
      (build) => build.name === "СидроВарня"
    )[0].resources;

    const resources = await Resources.findOne({
      userId: mongoose.Types.ObjectId(userId),
    });

    const updatedResources = [...resources.resources]

    for (let i = 0; i < needForBuild.length; i++) {
      if (resources.resources[i].amount - needForBuild[i].amount <= 0) {
        return res.json({ bought: false, message: `У вас не достаньо ${resources.resources[i].name}` });
      }
      updatedResources[i].amount = resources.resources[i].amount - needForBuild[i].amount
    }

    await Resources.findOneAndUpdate({
      userId: mongoose.Types.ObjectId(userId),
    }, { resources: updatedResources });

    const cider = new Cider({
      userId: mongoose.Types.ObjectId(userId),
      werehouseId: mongoose.Types.ObjectId(werehouseId),
    })
    await cider.save();

    const places = [];
    places.push({
      produceSpeed: cider.produceSpeed,
      produceName: cider.produceName,
      name: cider.name,
      expenses: cider.expenses,
      size: cider.size,
    })
    await Werehouse.findOneAndUpdate({
      _id: mongoose.Types.ObjectId(werehouseId),
    }, {$push: {places: places }});

    res.json({ bought: true, message: `СидроВарня побудовано` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Щось пішло не так при будуванні СидроВарня" });
  }
});


module.exports = router;
