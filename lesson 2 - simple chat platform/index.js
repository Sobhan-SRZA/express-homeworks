const express = require("express");
const fs = require("fs");
const websocket = require("./websocket");

const port = 8888;
const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Use json in express get and post
app.use(express.json());

// Load static files path
app.use(express.static(__dirname + "/public"));

fs.readdirSync("./api")
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => {
        const fileCode = require(`./api/${file}`)
        const fileName = file.split(".")[0];

        app.use(`/api/${fileName}`, fileCode)
    })

// Load all pages from ./pages
fs.readdirSync("./pages")
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => {
        const fileCode = require(`./pages/${file}`)

        fileCode(app)
    })

// Redirect all invalid url to /404
app.get("*", (req, res) => {
    res.redirect("/404")
})

app.listen(
    port,

    (e) => {
        console.log('App started:', `http://localhost:${port}`);
    }
)

websocket(app);