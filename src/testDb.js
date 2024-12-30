import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function testConnection() {
    try {
        // Test the connection
        const { data: { user } } = await supabase.auth.getUser();
        console.log("Successfully connected to Supabase!");

        // Create a test table if it doesn't exist
        // Note: This needs to be done in Supabase's SQL editor
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .limit(1);

        if (error) throw error;
        console.log("Successfully queried users table!");
        console.log("First user (if any):", data);

    } catch (error) {
        console.error("Connection error:", error.message);
    }
}

// Test basic CRUD operations
async function testCRUD() {
    try {
        // Create
        const { data: insertedUser, error: insertError } = await supabase
            .from('users')
            .insert([
                {
                    telegram_id: '12345',
                    points: 1000,
                    level: 1,
                }
            ])
            .select();

        if (insertError) throw insertError;
        console.log("Created user:", insertedUser);

        // Read
        const { data: users, error: readError } = await supabase
            .from('users')
            .select('*');

        if (readError) throw readError;
        console.log("All users:", users);

    } catch (error) {
        console.error("CRUD error:", error.message);
    }
}

testConnection();
testCRUD();
  
  