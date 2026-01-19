const { QuickDB, JSONDriver } = require("quick.db")
const express = require("express")
const port = 8888;

const db = new QuickDB({ driver: new JSONDriver() })

const app = express();

// app.set("view engine", "html");
// app.set('views', './views');

// app.use(express.static('./views'));
// app.use(app.router);

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.json());
app.use(express.static(__dirname + "/public"));

const fs = require("fs")

// Load all pages from ./pages
fs.readdirSync("./pages")
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => {
        const fileCode = require(`./pages/${file}`)

        fileCode(app, db)
    })

app.get("*", (req, res) => {
    res.redirect("/404")
})

app.listen(
    port,

    (e) => {
        console.log('App started:', `http://localhost:${port}`);
    }
)