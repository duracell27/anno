const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth.routes")

const app = express()
const PORT = 5000

app.use(express.json())
app.use('/api/auth', authRouter)
const start = async () => {
    try {
        await mongoose.connect("mongodb+srv://shmidt:27071996ua@cluster0.2jpsu.mongodb.net/anno?retryWrites=true&w=majority",
            { useNewUrlParser: true })
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        })
    } catch (err) {
        console.log(err)
    }
}
start()

