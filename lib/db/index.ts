import mongoose from "mongoose";

export default async function connect() {
    const DATABASE_URI = process.env.DATABASE_URI;
    const connection_state = mongoose.connection.readyState;

    switch(connection_state) {
        case 1:
            console.log("Already connected");
            break;
        case 2:
            console.log("Connecting...");
            await mongoose.connection.asPromise();
            break;
        default:
            try {
                await mongoose.connect(DATABASE_URI!, {
                    dbName: "vaultiq",
                    bufferCommands: true
                });
            } catch (err: any) {
                console.log(`MongoDB connection error: ${err}`);
                throw new Error(`MongoDB connection error: ${err}`);
            }
            break;
    }
}