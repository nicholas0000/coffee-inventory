const { Router } = require("express");
const categoriesController = require("../controllers/categoriesController");

const categoriesRouter = Router();

categoriesRouter.get("/", categoriesController.getAllCategories);

categoriesRouter.get("/new", categoriesController.createCategoryGet);
categoriesRouter.post("/new", categoriesController.createCategoryPost);

categoriesRouter.get("/:id", categoriesController.categoryGet);

categoriesRouter.get(
	"/:id/edit-details",
	categoriesController.editCategoryDetailsGet,
);
categoriesRouter.post(
	"/:id/edit-details/save",
	categoriesController.editCategoryDetailsPost,
);
categoriesRouter.get(
	"/:id/edit-items",
	categoriesController.editItemsInCategoryGet,
);
categoriesRouter.post(
	"/:id/edit-items/save",
	categoriesController.editItemsInCategoryPost,
);

categoriesRouter.post("/:id/delete", categoriesController.deleteCategoryPost);

module.exports = categoriesRouter;
