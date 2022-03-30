const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator')
const User = require('../models/user');
const user = require('../models/user');
const router = new Router();

// Реєстрація
router.post('/registr', [
    check('email', 'Не правильний email').isEmail(),
    check('password', 'Довжина має бути більше 6 символів').isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req, res);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: 'Некоректно заповнені дані' })
        }

        const { email, password } = req.body
        const checkExistsUser = await User.findOne({ email: email })
        if (checkExistsUser) {
            return res.status(400).json({ message: 'Такий користувач вже існує' })
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({ email, password: hashedPassword })
        await user.save()
        res.status(201).json({ message: 'Реєстрація успішна' })
    } catch (err) {
        res.status(500).json({ message: 'Щось пішло не так при реєстрації' })
    }
})

// логін
router.post('/login', [
    check('email', 'Не правильний email').normalizeEmail().isEmail(),
    check('password', 'Введіть пароль').exists()
], async (req, res) => {
    try {
        const errors = validationResult(req, res);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: 'Некоректно заповнені дані при вході' })
        }

        const { email, password } = req.body

        const checkExistsUser = await User.findOne({ email: email })
        if (!checkExistsUser) {
            res.status(400).json({ message: 'Такого користувача немає' })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            res.status(400).json({ message: 'Не правильний пароль' })
        }

        const token = jwt.sign({ userId: user.id }, 'my anno aplication', { expiresIn: '1h' })

        res.json({ token, userId, message: 'Реєстрація успішна' })
    } catch (err) {
        res.status(500).json({ message: 'Щось пішло не так при логіні' })
    }
})

module.exports = router