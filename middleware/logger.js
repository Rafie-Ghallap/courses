// Logging (use winston if you want advanced logs)
const morgan = require("morgan");

const applyLogger = (app) => {
    if (process.env.NODE_ENV === "development") { // if false use dev mode
        app.use(morgan("dev")); // pretty logs
    } else {
        app.use(morgan("combined")); // detailed Apache style logs
    }
};

module.exports = { applyLogger };
