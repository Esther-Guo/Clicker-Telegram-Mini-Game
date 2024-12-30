interface User {
  id: string;
  telegram_id: string;
  points: number;
  level: number;
  wallet_address?: string;
  created_at?: Date;
  updated_at?: Date;
}

export default User; 