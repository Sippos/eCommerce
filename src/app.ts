import "dotenv/config"
import express from "express"
import cors from "cors"

import { connectDB } from "./db/index.ts"
import { start } from "repl"

const app = express()
const port = Number(process.env.PORT) || 3000

app.use(cors())
app.use(express.json)

app.get("/health", (_request, response) => {
    response.status(200).json({
        status:"ok"
    })
})

async function startServer(): Promise<void> {
    try {
        await connectDB()

        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`)
        })
    } catch (error) {
        console.error("Could not start the server:", error)
        process.exit(1)
    }
}

startServer()