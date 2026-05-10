const websocket = require("./websocket");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");

dotenv.config();

const port = 8888;
const app = express();

// CORS
const FRONT_URL = process.env.FRONT_URL;

if (!FRONT_URL) {
    throw "You didn't add FRONT_URL to .env file."
}

app.use(cors({
    origin: [FRONT_URL]
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