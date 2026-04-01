const {
    QuickDB,
    JSONDriver
} = require("quick.db");
const express = require("express");
const fs = require("fs")
const db = new QuickDB({
    driver: new JSONDriver()
})

const port = 8888;

const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Use json in express get and post
app.use(express.json());

// Load static files path
app.use(express.static(__dirname + "/public"));


// Load all pages from ./pages
[
    "./pages",
    "./api"
].forEach((dir) => {
    fs.readdirSync(dir)
        .filter((file) => file.endsWith(".js"))
        .forEach((file) => {
            const fileCode = require(`./${dir}/${file}`)

            fileCode(app, db)
        })
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