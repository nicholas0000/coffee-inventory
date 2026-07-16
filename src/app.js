const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("node:path");
const itemsRouter = require("./routes/itemsRouter");
const categoriesRouter = require("./routes/categoriesRouter");

const app = express();

app.use(express.static(path.join(__dirname, "..", "public")));

/* set up EJS templating */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* set up EJS layouts */
app.use(expressLayouts);
app.set("layout", "layouts/baseLayout");

/* middleware to parse data in request body */
app.use(express.urlencoded({ extended: true }));

/* routes */
app.use("/items", itemsRouter);
app.use("/categories", categoriesRouter);
app.get("/", (_req, res) => res.redirect("/items"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
	if (error) throw Error;
	console.log(`Listening on port ${PORT}`);
});
