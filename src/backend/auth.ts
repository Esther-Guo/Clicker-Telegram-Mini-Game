import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;

export const validateTelegramWebAppData = (req: any, res: any, next: any) => {
  const { initData } = req.body;
  
  // Parse the initData
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  
  // Remove hash from data before checking
  urlParams.delete('hash');
  const dataCheckString = urlParams.toString();
  
  // Generate secret key
  const secret = crypto
    .createHmac('sha256', 'WebAppData')
    .update(BOT_TOKEN || '')
    .digest();
    
  // Generate hash
  const calculatedHash = crypto
    .createHmac('sha256', secret)
    .update(dataCheckString)
    .digest('hex');
    
  if (calculatedHash !== hash) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
}; 