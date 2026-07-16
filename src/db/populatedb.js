#! /usr/bin/env node
require("dotenv").config();
const { Client } = require("pg");

const CREATE_TABLES_QUERY = `
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(280)
);

CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    sku VARCHAR(24) UNIQUE NOT NULL,
    size_grams DECIMAL NOT NULL,
    roastery VARCHAR(100) NOT NULL,
    description VARCHAR(4000),
    price_cents DECIMAL NOT NULL,
    stock_quantity NUMERIC NOT NULL,
    category_id INTEGER REFERENCES categories(id)
);
`;

const POPULATE_TABLES_QUERY = `
INSERT INTO categories (name, description)
VALUES
    ('Coffee beans', 'Whole coffee beans sourced from renowned coffee-growing regions around the world. Designed for customers who value freshness and prefer grinding their coffee just before brewing for maximum flavour and aroma.'),
    ('Ground coffee', 'Freshly roasted coffee beans that have been professionally ground for convenience. Ideal for drip machines, pour-over brewers, and French presses without sacrificing taste or quality.'),
    ('Coffee capsules', 'Single-serve coffee capsules compatible with popular pod machines. Each capsule is sealed to preserve freshness and delivers consistent flavour with minimal effort.');

INSERT INTO items (name, sku, size_grams, roastery, description, price_cents, stock_quantity, category_id)
VALUES
    ('Ethiopian Yirgacheffe', 'ETH-YIRG-500G', 500, 'The Coffee Company', 'Known around the world as one of the best coffees, prized by connoisseurs for its winey cupping characteristics. This is a great treat in a plunger or through a filter.', 2300, 235, 1),
    ('Ethiopian Yirgacheffe', 'ETH-YIRG-1KG', 1000, 'The Coffee Company', 'Known around the world as one of the best coffees, prized by connoisseurs for its winey cupping characteristics. This is a great treat in a plunger or through a filter.', 4600, 461, 1),
    ('Sacred Grounds Breeze Blend', 'SG-BREEZE-200G', 200, 'Sacred Grounds', 'Sacred Grounds Breezy Blend Ground Coffee specialty coffee. It is a dark roast ground coffee, freshly roasted. Dark chocolate, roasted almond. Do ya thing!', 1700, 172, 2),
    ('Campos Superior Aluminium Coffee Capsules 10 pack', 'CAM-SUP-10PK', 55, 'Campos', 'If you have ordered a cup of Campos coffee in our famous green cup, then you''ve tasted our Campos Superior Blend. Campos Superior is our signature, quintessential specialty coffee cafe blend. It''s what we''ve proudly served in our cafes since day in Newtown, 2002.', 800, 81, 3);
`;

async function main() {
	const databaseUrl = process.env.DATABASE_URL;

	console.log("seeding...");
	const client = new Client({
		connectionString: databaseUrl,
		ssl: {
			rejectUnauthorized: false,
		},
	});

	await client.connect();
	await client.query(CREATE_TABLES_QUERY);
	await client.query(POPULATE_TABLES_QUERY);
	await client.end();
	console.log("done");
}

main();
