import express from 'express';
import { initializeUser, updateUserPoints } from '../../lib/supabase';

const apiRoutes = express.Router();

apiRoutes.post('/auth', async (req, res) => {
  try {
    const { user } = req.body.initData;
    const dbUser = await initializeUser(user.id.toString());
    res.json(dbUser);
  } catch (error) {
    console.error('Error in /auth:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

apiRoutes.post('/updatePoints', async (req, res) => {
  try {
    const { telegramId, points } = req.body;
    const updatedUser = await updateUserPoints(telegramId.toString(), points);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error in /updatePoints:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default apiRoutes;