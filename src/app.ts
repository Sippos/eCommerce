import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUI from "swagger-ui-express"

import { swaggerSpec } from "./swagger.ts";
import { connectDB } from "./db/index.ts";
import { errorHandler } from "./middleware/errorHandler.ts"
import categoryRoutes from "./routes/categoryRoutes.ts";
import userRoutes from "./routes/userRoutes.ts"
import productRoutes from "./routes/productRoutes.ts"
import orderRoutes from "./routes/orderRoutes.ts"

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpec),
)

app.use("/categories", categoryRoutes);
app.use("/users", userRoutes)
app.use("/products", productRoutes)
app.use("/orders", orderRoutes)


app.get("/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
  });
});

app.use((_request, response) => {
  response.status(404).json({
    error: "Route not found",
  });
});

app.use(errorHandler)

async function startServer(): Promise<void> {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Could not start the server:", error);
    process.exit(1);
  }
}

void startServer();