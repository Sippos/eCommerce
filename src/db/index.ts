import mongoose from "mongoose"

export async function connectDB(): Promise<void> {
    const mongoURI = process.env.MONGODB_URI

    if (!mongoURI) {
        throw new Error("MongoDB_URI is missing")
    }

    await mongoose.connect(mongoURI)

    console.log("MongoDB connected")
}