// frontend/src/services/BackendGenerator.js

/**
 * BackendGenerator.js
 * -------------------
 * Generates a minimal but real backend for the exported app.
 * Output format: Node.js + Express (stable, deterministic)
 *
 * Produces:
 *  - server.js
 *  - routes/
 *  - models/
 *
 * This backend is intentionally simple and file-based so it runs anywhere.
 */

export function generateBackendCode(blueprint) {
    return {
        "package.json": generateBackendPackageJson(blueprint),
        "server.js": generateServerFile(),
        ...generateRoutes(blueprint),
        ...generateModels(blueprint)
    };
}

/**
 * Generate backend package.json
 */
function generateBackendPackageJson(blueprint) {
    return JSON.stringify(
        {
            name: slugify(blueprint.name) + "-backend",
            version: "1.0.0",
            private: true,
            scripts: {
                start: "node server.js"
            },
            dependencies: {
                express: "^4.18.0",
                cors: "^2.8.5",
                bodyParser: "^1.20.0"
            }
        },
        null,
        2
    );
}

/**
 * Generate server.js
 */
function generateServerFile() {
    return `
/**
 * Auto-generated backend server
 */
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Load all routes
require("./routes/pages")(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log("Backend running on port " + PORT);
});
`;
}

/**
 * Generate routes/pages.js
 */
function generateRoutes(blueprint) {
    return {
        "routes/pages.js": `
/**
 * Auto-generated API routes for pages
 */
module.exports = function(app) {
    const pages = ${JSON.stringify(blueprint.pages, null, 2)};

    // GET all pages
    app.get("/api/pages", (req, res) => {
        res.json(pages);
    });

    // GET single page by ID
    app.get("/api/pages/:id", (req, res) => {
        const page = pages.find(p => p.id === req.params.id);
        if (!page) return res.status(404).json({ error: "Page not found" });
        res.json(page);
    });
};
`
    };
}

/**
 * Generate models (future expansion)
 */
function generateModels(blueprint) {
    return {
        "models/README.txt": `
This folder is reserved for future data models.
Blue Lotus will generate real database schemas here.
`
    };
}

/**
 * Helpers
 */
function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
