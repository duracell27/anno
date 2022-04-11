const mongoose = require("mongoose");
const { Router } = require("express");
const BuildingCost = require("../models/buildingCost");
const router = new Router();

// отримати список ресурсів
router.get("/", async (req, res) => {
  try {
    const { industrial } = req.query;

    const buildingsForBuild = await BuildingCost.find();
    let buildingsArray = []


    if (industrial === 'industrial') {
      buildingsArray = buildingsForBuild[0].buildings.filter(
        (building) =>
          building.name === "ХижинаРибака" ||
          building.name === "ХижинаЛісниика" ||
          building.name === "СидроВарня"
      );
    }


    if (industrial === 'residential') {
      buildingsArray = buildingsForBuild[0].buildings.filter(
        (building) =>
          building.name === "Часовня"
      );
    }

    if (industrial === 'house') {
      buildingsArray = buildingsForBuild[0].buildings.filter(
        (building) =>
          building.name === "СелянськаХата"
      );
    }


    res.json({ buildingsArray });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Щось пішло не так при формуванні списку цін" });
  }
});

module.exports = router;
