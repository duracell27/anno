const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const Resources = require("../models/resources");
const BuildingCost = require("../models/buildingCost");
const router = new Router();

// Реєстрація
router.post(
  "/registr",
  [
    check("email", "Не правильний email").isEmail(),
    check("password", "Довжина має бути більше 6 символів").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req, res);
      if (!errors.isEmpty()) {
        return res.json({
          errors: errors.array(),
          message: "Некоректно заповнені дані",
        });
      }

      const { email, password } = req.body;
      const checkExistsUser = await User.findOne({ email: email });
      if (checkExistsUser) {
        return res.json({ message: "Такий користувач вже існує" });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword });
      console.log("user ", user);
      await user.save();
      const resources = new Resources({
        userId: user._id,
        resources: [
          {
            name: "Золото",
            amount: 20000,
          },
          {
            name: "Дерево",
            amount: 25,
          },
          {
            name: "Інструменти",
            amount: 20,
          },
          {
            name: "Камінь",
            amount: 0,
          },
          {
            name: "Скло",
            amount: 0,
          },
          {
            name: "Сидр",
            amount: 0,
          },
          {
            name: "Риба",
            amount: 10,
          },
        ],
      });
      // const buildingCosts = new BuildingCost({
      //   buildings: [
      //     {
      //       name: "Склад",
      //       resources: [
      //         {
      //           name: "Золото",
      //           amount: 200,
      //         },
      //         {
      //           name: "Дерево",
      //           amount: 2,
      //         },
      //         {
      //           name: "Інструменти",
      //           amount: 3,
      //         },
      //       ],
      //       expenses: 10,
      //     },
      //     {
      //       name: "ХижинаЛісниика",
      //       resources: [
      //         {
      //           name: "Золото",
      //           amount: 50,
      //         },
      //         {
      //           name: "Дерево",
      //           amount: 2,
      //         },
      //       ],
      //       expenses: 5,
      //     },
      //     {
      //       name: "ХижинаРибака",
      //       resources: [
      //         {
      //           name: "Золото",
      //           amount: 100,
      //         },
      //         {
      //           name: "Дерево",
      //           amount: 3,
      //         },
      //         {
      //           name: "Інструменти",
      //           amount: 2,
      //         },
      //       ],
      //       expenses: 15,
      //     },
      //     {
      //       name: "РинковоПлоща",
      //       resources: [
      //         {
      //           name: "Золото",
      //           amount: 400,
      //         },
      //         {
      //           name: "Дерево",
      //           amount: 5,
      //         },
      //         {
      //           name: "Інструменти",
      //           amount: 3,
      //         },
      //       ],
      //       expenses: 10,
      //     },
      //     {
      //       name: "СидроВарня",
      //       resources: [
      //         {
      //           name: "Золото",
      //           amount: 400,
      //         },
      //         {
      //           name: "Дерево",
      //           amount: 5,
      //         },
      //         {
      //           name: "Інструменти",
      //           amount: 1,
      //         },
      //       ],
      //       expenses: 15,
      //     },
      //     {
      //       name: "Часовня",
      //       resources: [
      //         {
      //           name: "Золото",
      //           amount: 1500,
      //         },
      //         {
      //           name: "Дерево",
      //           amount: 12,
      //         },
      //         {
      //           name: "Інструменти",
      //           amount: 5,
      //         },
      //       ],
      //       expenses: 15,
      //     },
      //     {
      //       name: "СелянськаХата",
      //       resources: [
      //         {
      //           name: "Золото",
      //           amount: 0,
      //         },
      //         {
      //           name: "Дерево",
      //           amount: 2,
      //         },
      //       ],
      //       expenses: 0,
      //     },
      //   ],
      // });
      
      await resources.save();
      // одноразове отримати список цін на будівлі
      // await buildingCosts.save();
      res.status(201).json({ message: "Реєстрація успішна" });
    } catch (err) {
      res.status(500).json({ message: "Щось пішло не так при реєстрації" });
    }
  }
);

// логін
router.post(
  "/login",
  [
    check("email", "Не правильний email").normalizeEmail().isEmail(),
    check("password", "Введіть пароль").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req, res);
      if (!errors.isEmpty()) {
        return res.json({
          errors: errors.array(),
          message: "Некоректно заповнені дані при вході",
        });
      }
      const { email, password } = req.body;

      const checkExistsUser = await User.findOne({ email: email });
      if (!checkExistsUser) {
        res.json({ message: "Такого користувача немає" });
      }

      const isPasswordMatch = await bcrypt.compare(
        password,
        checkExistsUser.password
      );
      if (!isPasswordMatch) {
        res.json({ message: "Не правильний пароль" });
      }

      const token = await jwt.sign(
        { userId: checkExistsUser.id },
        "my anno aplication",
        { expiresIn: "1h" }
      );

      res.json({
        token,
        userId: checkExistsUser.id,
        message: "Реєстрація успішна",
      });
    } catch (err) {
      res.status(500).json({ message: "Щось пішло не так при логіні" });
    }
  }
);

module.exports = router;
