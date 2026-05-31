const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
const { connectDB } = require("./config/connDB");
const { checkAuth } = require("./middleware/checkAuth");
const { applySecurity } = require("./middleware/security");
const { applyLogger } = require("./middleware/logger");
require("dotenv").config();


const authRouter = require("./router/authRouter");
const userRouter = require("./router/userRouter");
const profileRouter = require("./router/profileRouter");
const tracksRouter = require("./router/tracksRouter");
const coursesRouter = require("./router/coursesRouter");
const lessonsRouter = require("./router/lessonsRouter");
const enrollmentRouter = require("./router/enrollmentRouter");
const dashboardRouter = require("./router/dashboardRouter");

// Middlewares
/*
    TODO: Don't Forget Add CORS, Rate Limit,Helmet, morgan (logs), CSRF Protection, XSS Protection 
    * sanitizeHtml Protection (Extra Security with Zod) 
*/
const app = express();
app.disable('etag'); //prevent the error 304... instead of the middleware: res.set("Cache-Control", 'no-store)
app.use(express.json());
app.use(cors()); // Don't Forget in Production level add Front End IP
connectDB();

applySecurity(app);

applyLogger(app);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true, // protect against XSS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === "production", // secure only in prod
      sameSite: "strict", // prevent CSRF
    },
  })
);


app.use("/auth", authRouter);
app.use("/users", checkAuth, userRouter);
app.use("/profile", checkAuth, profileRouter);
app.use("/tracks", checkAuth, tracksRouter);
app.use("/courses", checkAuth, coursesRouter);
app.use("/lessons", checkAuth, lessonsRouter);
app.use("/enrollments", checkAuth, enrollmentRouter);
app.use("/dashboard", checkAuth, dashboardRouter);

const paymentRoutes = require(
  "./router/paymentRouter"
);

app.use(
  "/api/payment",
  paymentRoutes
);

mongoose.connection.once("connected", () => {
  console.log("Connected to MongoDB");
  app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
