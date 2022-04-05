const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth.routes")
const resourcesRouter = require("./routes/resources.routes")
const buildRouter = require("./routes/build.routes")
const residentialIndustrial = require("./routes/residentialIndustrial.routes")
const getBuildingsForBuild = require("./routes/getBuildingsForBuild.routes")

const app = express()
const PORT = 5000

app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/resources', resourcesRouter)
app.use('/api/build', buildRouter)
app.use('/api/buildings', residentialIndustrial)
app.use('/api/buildingsforbuild', getBuildingsForBuild)
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

