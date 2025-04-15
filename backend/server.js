const express = require("express");
const connectDB = require("./config/db");
const cors = require('cors');


const  KitchenService = require("./service/KitchenScheduler")
const menuItemRouter = require("./routes/menuItemRouter")
const ingredientRouter = require("./routes/ingredientRouter");
const inventoryLogRouter = require("./routes/inventoryLogRouter")
const employeeRouter = require("./routes/employeeRouter")
const contractRouter = require("./routes/contractRouter")
const leaveRequestRouter = require("./routes/leaveRequestRouter")
const userRouter = require("./routes/userRouter")
const tableOrderRouter = require("./routes/tableOrderRouter")
const taskRouter = require("./routes/taskRouter")
const authRouter = require("./routes/authRouter")

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());  

connectDB();

app.use("/api/menu-items", menuItemRouter)
app.use("/api/ingredients", ingredientRouter);
app.use("/api/inventory-logs", inventoryLogRouter);
app.use("/api/employee", employeeRouter)
app.use("/api/contract", contractRouter)
app.use("api/leaverequest", leaveRequestRouter)
app.use("/api/order", tableOrderRouter)
app.use("/api/tasks", taskRouter)
app.use("/api/users", userRouter)
app.use("/api/auth", authRouter)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));