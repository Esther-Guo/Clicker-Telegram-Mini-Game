import { createClient } from '@supabase/supabase-js';
import type User from '../backend/models/User';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const initializeUser = async (telegramId: string): Promise<User> => {
  // Check if user exists
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', telegramId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw fetchError;
  }

  if (existingUser) {
    // Update last login
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ updated_at: new Date().toISOString() })
      .eq('telegram_id', telegramId)
      .select()
      .single();

    if (updateError) throw updateError;
    console.log('Updated user:', updatedUser);
    return updatedUser as User;
  }

  // Create new user if doesn't exist
  const { data: newUser, error: createError } = await supabase
    .from('users')
    .insert([{
      telegram_id: telegramId,
      points: 0,
      level: 0,
      wallet_address: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (createError) throw createError;
  console.log('New user created:', newUser);
  return newUser as User;
};

export const updateUserPoints = async (telegramId: string, points: number): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update({ 
      points,
      updated_at: new Date().toISOString()
    })
    .eq('telegram_id', telegramId)
    .single();

  if (error) throw error;
  return data as User;
};

export const updateUserLevel = async (telegramId: string, level: number): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update({ 
      level,
      updated_at: new Date().toISOString()
    })
    .eq('telegram_id', telegramId)
    .single();

  if (error) throw error;
  return data as User;
};

export default supabase; 