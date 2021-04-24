import path from "path";
import morgan from "morgan";
import express from "express";
import errorHandler from "errorhandler";
import multer from "multer";
import exphbs from "express-handlebars";
import flash from "connect-flash";
import session from "express-session";
import passport from "passport";
import Handlebars from "handlebars";
import "./config/passport";
import routes from "./routes";
import * as helpers from "./helpers";
import config from "./config";
const app = express();
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
app.set("port", config.port);
app.set("views", path.join(__dirname, "./views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    helpers,
    extname: ".hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", ".hbs");
app.use(multer({ dest: "./uploads" }).single("image"));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "somesecretkey",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  app.locals.user = req.user || null;
 app.locals.success = req.flash("success");
  app.locals.error = req.flash("error");
  next();
});
app.use(routes);
app.use("/public", express.static(path.join(__dirname, "./public")));
app.use("/uploads", express.static("./uploads"));
if ("development" === app.get("env")) {
  app.use(errorHandler());
}
export default app;
