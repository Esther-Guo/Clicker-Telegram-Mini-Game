import mongoose from 'mongoose';

import dotenv from 'dotenv'; // Load environment variables
dotenv.config();
const uri = process.env.MONGODB_URI;

console.log(uri)


async function verifyConnection() {
    try {
        // Connect to MongoDB cluster
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Successfully connected to MongoDB Atlas!");

        // Optionally list the databases in the cluster
        const admin = mongoose.connection.db.admin();
        const databases = await admin.listDatabases();
        console.log("Databases in the cluster:");
        databases.databases.forEach(db => console.log(`- ${db.name}`));
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas:", error.message);
    } finally {
        // Close the connection
        mongoose.connection.close();
    }
}

verifyConnection();