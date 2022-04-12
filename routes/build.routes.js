const mongoose = require("mongoose");
const { Router } = require("express");
const Resources = require("../models/resources");
const Werehouse = require("../models/werehouse");
const Marketplace = require("../models/marketplace");
const BuildingCost = require("../models/buildingCost");
const LumberjackHut = require("../models/lumberjackHut");
const FishermanHut = require("../models/fishermanHut");
const Cider = require("../models/cider");
const TikResources = require("../models/tikResources");
const Chapel = require("../models/chapel");
const PeasantHut = require("../models/peasantHut");
const router = new Router();

// побудувати склад
router.get("/werehouse", async (req, res) => {
  try {
    const { userId } = req.query;

    const buildCost = await BuildingCost.findOne();
    const tikResources = await TikResources.findOne({userId: mongoose.Types.ObjectId(userId)});

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
    
    tikResources.tikResources.map((resource)=>{
      if(resource.name === 'Золото'){
        return resource.value = resource.value - buildCost.buildings[0].expenses
      }
    })

    await TikResources.findOneAndUpdate({userId: mongoose.Types.ObjectId(userId)}, {tikResources: tikResources.tikResources});
    await werehouse.save();

    res.json({ bought: true, message: `Склад побудовано` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Щось пішло не так при формуванні ресурсів" });
  }
});
// побудувати маркет
router.get("/marketplace", async (req, res) => {
  try {
    const { userId } = req.query;

    const buildCost = await BuildingCost.findOne();
    const tikResources = await TikResources.findOne({userId: mongoose.Types.ObjectId(userId)});

    const needForBuild = buildCost.buildings.filter(
      (build) => build.name === "РинковаПлоща"
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


    const marketplace = new Marketplace({
      userId: mongoose.Types.ObjectId(userId),
      places: [],
      residentPlaces: []
    })
    
    tikResources.tikResources.map((resource)=>{
      if(resource.name === 'Золото'){
        return resource.value = resource.value - buildCost.buildings[3].expenses
      }
    })

    await TikResources.findOneAndUpdate({userId: mongoose.Types.ObjectId(userId)}, {tikResources: tikResources.tikResources});
    await marketplace.save();

    res.json({ bought: true, message: `Ринкова Площа побудовано` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Щось пішло не так при будуванні ринкової площі" });
  }
});
// побудувати ХижинаЛісниика
router.get("/lumberjackHut", async (req, res) => {
  try {
    const { userId, werehouseId } = req.query;

    const buildCost = await BuildingCost.findOne();
    const tikResources = await TikResources.findOne({userId: mongoose.Types.ObjectId(userId)});
    const lumberjackHutProduce = await LumberjackHut.findOne({userId: mongoose.Types.ObjectId(userId)});
    
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

  

    tikResources.tikResources.map((resource)=>{
      if(resource.name === 'Золото'){
        resource.value = resource.value - buildCost.buildings[1].expenses
      }
      if(resource.name === 'Дерево'){
        console.log('дерево')
        resource.value = resource.value + lumberjackHutProduce.produceSpeed
      }
    })

    await TikResources.findOneAndUpdate({userId: mongoose.Types.ObjectId(userId)}, {tikResources: tikResources.tikResources});

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
    const tikResources = await TikResources.findOne({userId: mongoose.Types.ObjectId(userId)});
    const fishermanHutProduce = await FishermanHut.findOne({userId: mongoose.Types.ObjectId(userId)});

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

    // tikResources.tikResources.map((resource)=>{
    //   if(resource.name === 'Золото'){
    //     return resource.value = resource.value - buildCost.buildings[2].expenses
    //   }
    // })

    tikResources.tikResources.map((resource)=>{
      if(resource.name === 'Золото'){
        resource.value = resource.value - buildCost.buildings[2].expenses
      }
      if(resource.name === 'Риба'){
        resource.value = resource.value + fishermanHutProduce.produceSpeed
      }
    })

    await TikResources.findOneAndUpdate({userId: mongoose.Types.ObjectId(userId)}, {tikResources: tikResources.tikResources});

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
    const tikResources = await TikResources.findOne({userId: mongoose.Types.ObjectId(userId)});
    const ciserProduce = await Cider.findOne({userId: mongoose.Types.ObjectId(userId)});

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

    // tikResources.tikResources.map((resource)=>{
    //   if(resource.name === 'Золото'){
    //     return resource.value = resource.value - buildCost.buildings[4].expenses
    //   }
    // })

    tikResources.tikResources.map((resource)=>{
      if(resource.name === 'Золото'){
        resource.value = resource.value - buildCost.buildings[4].expenses
      }
      if(resource.name === 'Сидр'){
        resource.value = resource.value + ciserProduce.produceSpeed
      }
    })

    await TikResources.findOneAndUpdate({userId: mongoose.Types.ObjectId(userId)}, {tikResources: tikResources.tikResources});

    res.json({ bought: true, message: `СидроВарня побудовано` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Щось пішло не так при будуванні СидроВарня" });
  }
});

// побудувати Часовня
router.get("/chapel", async (req, res) => {
  try {
    const { userId, marketplaceId } = req.query;

    const buildCost = await BuildingCost.findOne();
    const tikResources = await TikResources.findOne({userId: mongoose.Types.ObjectId(userId)});

    const needForBuild = buildCost.buildings.filter(
      (build) => build.name === "Часовня"
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

    const chapel = new Chapel({
      userId: mongoose.Types.ObjectId(userId),
      marketplaceId: mongoose.Types.ObjectId(marketplaceId),
    })
    await chapel.save();

    const places = [];
    places.push({
      name: chapel.name,
      expenses: chapel.expenses,
      size: chapel.size,
    })
    await Marketplace.findOneAndUpdate({
      _id: mongoose.Types.ObjectId(marketplaceId),
    }, {$push: {places: places }});

    tikResources.tikResources.map((resource)=>{
      if(resource.name === 'Золото'){
        return resource.value = resource.value - buildCost.buildings[5].expenses
      }
    })

    await TikResources.findOneAndUpdate({userId: mongoose.Types.ObjectId(userId)}, {tikResources: tikResources.tikResources});

    res.json({ bought: true, message: `СидроВарня побудовано` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Щось пішло не так при будуванні СидроВарня" });
  }
});

// побудувати СелянськаХата
router.get("/peasantHut", async (req, res) => {
  try {
    const { userId, marketplaceId } = req.query;

    const buildCost = await BuildingCost.findOne();

    const needForBuild = buildCost.buildings.filter(
      (build) => build.name === "СелянськаХата"
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

    const peasantHut = new PeasantHut({
      userId: mongoose.Types.ObjectId(userId),
      marketplaceId: mongoose.Types.ObjectId(marketplaceId),
      needs: [
        {
          name: 'Риба', 
          percent: 0
        },{
          name: 'Сидр', 
          percent: 0
        },{
          name: 'Часовня', 
          percent: 0
        }
      ]
    })
    await peasantHut.save();

    const places = [];
    places.push({
      name: peasantHut.name,
      size: peasantHut.size,
    })
    await Marketplace.findOneAndUpdate({
      _id: mongoose.Types.ObjectId(marketplaceId),
    }, {$push: {residentPlaces: places }});


    res.json({ bought: true, message: `СидроВарня побудовано` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Щось пішло не так при будуванні СидроВарня" });
  }
});

module.exports = router;
