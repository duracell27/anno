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
            return res.json({ errors: errors.array(), message: 'Некоректно заповнені дані'})
        }

        const { email, password, name } = req.body
        const checkExistsUser = await User.findOne({ email: email })
        if (checkExistsUser) {
            return res.json({ message: 'Такий користувач вже існує' })
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({ email, password: hashedPassword, name })
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
            return res.json({ errors: errors.array(), message: 'Некоректно заповнені дані при вході' })
        }
        const { email, password } = req.body

        const checkExistsUser = await User.findOne({ email: email })
        if (!checkExistsUser) {
            res.json({ message: 'Такого користувача немає' })
        }

        const isPasswordMatch = await bcrypt.compare(password, checkExistsUser.password)
        if (!isPasswordMatch) {
            res.json({ message: 'Не правильний пароль' })
        }

        const token = await jwt.sign({ userId: checkExistsUser.id }, 'my anno aplication', { expiresIn: '1h' })

        res.json({ token, userId: checkExistsUser.id, message: 'Реєстрація успішна' })
    } catch (err) {
        res.status(500).json({ message: 'Щось пішло не так при логіні' })
    }
})

module.exports = router