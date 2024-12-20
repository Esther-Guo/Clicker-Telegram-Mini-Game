import express from 'express';
import { User } from '../models/User';

const apiRoutes = express.Router();

apiRoutes.post('/auth', async (req, res) => {
  const { user } = req.body.initData;
  
  let dbUser = await User.findOne({ telegramId: user.id });
  if (!dbUser) {
    dbUser = await User.create({
      telegramId: user.id,
      username: user.username,
      points: 0,
      level: 0
    });
  }
  
  res.json(dbUser);
});

apiRoutes.post('/updatePoints', async (req, res) => {
  const { telegramId, points } = req.body;
  
  await User.findOneAndUpdate(
    { telegramId },
    { points }
  );
  
  res.json({ success: true });
});

export default apiRoutes;