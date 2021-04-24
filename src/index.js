import app from "./app";
import "./config/mongoose";
app.listen(app.get("port"));
console.log("Server on port", app.get("port"));
