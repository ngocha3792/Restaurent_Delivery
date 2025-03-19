const express = require("express");
const connectDB = require("./config/db");

const menuItemRouter = require("./routes/menuItemRouter")
const ingredientRouter = require("./routes/ingredientRouter");
const inventoryLogRouter = require("./routes/inventoryLogRouter")

require("dotenv").config();

const app = express();
app.use(express.json());

connectDB();

app.use("/api/menu-items", menuItemRouter)
app.use("/api/ingredients", ingredientRouter);
app.use("/api/inventory-log", inventoryLogRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));