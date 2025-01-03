import React, { useEffect, useState } from 'react';
import type User from '../models/User';
import { fetchUsers } from '../lib/supabase';

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch leaderboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, []);

  if (loading) return <div>Loading leaderboard...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col items-center p-4 rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold text-white mb-4">Leaderboard</h2>
      <ul className="w-full max-w-md bg-white text-black rounded-lg shadow-md">
        {users.map((user, index) => (
          <li key={user.id} className={`flex justify-between items-center p-4 border-b ${index < 3 ? 'font-bold' : ''}`}>
            <span className="flex items-center">
              {index === 0 && <span className="text-gold pr-2">🥇</span>}
              {index === 1 && <span className="text-silver pr-2">🥈</span>}
              {index === 2 && <span className="text-bronze pr-2">🥉</span>}
              {index > 2 && <span>{index+1}</span>} {user.telegram_id}

            </span>
            <span className="text-lg">{user.points}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard; 