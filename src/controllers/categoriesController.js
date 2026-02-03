const { validationResult, matchedData } = require("express-validator");
const db = require("../db/queries");
const { validateCategory } = require("../helpers/validation/validateCategory");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const { formatCurrency } = require("../helpers/formatHelpers");

const getItemsInCategory = async (categoryId) => {
	const itemsInCategory = await db.getItemsInCategory(categoryId);
	const transformedItems = itemsInCategory.map((item) => {
		const { price_cents, ...unchanged } = item;
		return {
			...unchanged,
			price_dollars: formatCurrency(price_cents),
		};
	});

	return transformedItems;
};

exports.getAllCategories = async (_req, res) => {
	const allCategories = await db.getAllCategories();
	const itemCountPerCategory = new Map();
	for (let i = 0; i < allCategories.length; i++) {
		const { id: categoryId } = allCategories[i];
		const numberOfCompositeItems = await db.countItemsInCategory(categoryId);

		itemCountPerCategory.set(categoryId, Number(numberOfCompositeItems));
	}

	res.render("pages/allCategories", {
		title: "All categories",
		categories: allCategories,
		itemCountPerCategory,
	});
};

exports.createCategoryGet = async (_req, res) => {
	res.render("pages/newCategory", { title: "Add new category" });
};

exports.createCategoryPost = [
	validateCategory,
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res
				.status(400)
				.render("pages/newCategory", { errors: errors.array() });

		const formValues = matchedData(req);

		await db.addCategory(formValues);
		res.redirect("/categories");
	},
];

exports.categoryGet = async (req, res) => {
	const { id: categoryId } = req.params;
	const category = await db.getCategoryById(categoryId);
	if (category === null)
		throw new CustomNotFoundError(`Category with id ${categoryId} not found`);

	const allItemsInCategory = await getItemsInCategory(categoryId);

	res.render("pages/category", {
		title: category.name,
		category,
		compositeItems: allItemsInCategory,
	});
};

exports.editCategoryDetailsGet = async (req, res) => {
	const { id: categoryId } = req.params;
	const category = await db.getCategoryById(categoryId);
	if (category === null)
		throw new CustomNotFoundError(`Category with id ${categoryId} not found`);

	res.render("pages/editCategory", {
		title: category.name,
		category,
	});
};

exports.editCategoryDetailsPost = [
	validateCategory,
	async (req, res) => {
		const { id: categoryId } = req.params;
		const fetchedCategory = await db.getCategoryById(categoryId);

		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).render("pages/editCategory", {
				title: fetchedCategory.name,
				category: fetchedCategory,
				errors: errors.array(),
			});

		const categoryFormValues = matchedData(req);

		await db.updateCategoryDetails(categoryId, categoryFormValues);
		res.redirect(`/categories/${categoryId}`);
	},
];

exports.deleteCategoryPost = async (req, res) => {
	const { id: categoryId } = req.params;
	await db.deleteCategoryAndOrphanItems(categoryId);
	res.redirect("/categories");
};
