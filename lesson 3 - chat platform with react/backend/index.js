const websocket = require("./websocket");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");

dotenv.config();

const port = 8888;
const app = express();

// CORS
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"]
}));

// Use json in express get and post
app.use(express.json());

fs.readdirSync("./api")
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => {
        const fileCode = require(`./api/${file}`)
        const fileName = file.split(".")[0];

        app.use(`/api/${fileName}`, fileCode)
    })

// Redirect all invalid url to /404
app.get("*", (req, res) => {
    res.redirect("/api/404")
})

app.listen(
    port,

    (e) => {
        console.log("App started:", `http://localhost:${port}`);
    }
)

websocket(app);