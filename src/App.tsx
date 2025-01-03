import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import Hamster from './icons/Hamster';
import { binanceLogo, dailyCipher, dailyCombo, dailyReward, dollarCoin, hamsterCoin, mainCharacter } from './images';
import Info from './icons/Info';
import Settings from './icons/Settings';
import Menu from './components/Menu';
import Leaderboard from './components/Leaderboard';
import Exchange from './components/Exchange';
import type User from './models/User';
import { initializeUser, updateUserPoints } from './lib/supabase';

declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    }
  }
}

const App: React.FC = () => {
  const levelNames = [
    "Bronze",    // From 0 to 4999 coins
    "Silver",    // From 5000 coins to 24,999 coins
    "Gold",      // From 25,000 coins to 99,999 coins
    "Platinum",  // From 100,000 coins to 999,999 coins
    "Diamond",   // From 1,000,000 coins to 2,000,000 coins
    "Epic",      // From 2,000,000 coins to 10,000,000 coins
    "Legendary", // From 10,000,000 coins to 50,000,000 coins
    "Master",    // From 50,000,000 coins to 100,000,000 coins
    "GrandMaster", // From 100,000,000 coins to 1,000,000,000 coins
    "Lord"       // From 1,000,000,000 coins to ∞
  ];

  const levelMinPoints = [
    0,        // Bronze
    5000,     // Silver
    25000,    // Gold
    100000,   // Platinum
    1000000,  // Diamond
    2000000,  // Epic
    10000000, // Legendary
    50000000, // Master
    100000000,// GrandMaster
    1000000000// Lord
  ];

  const [levelIndex, setLevelIndex] = useState(0);
  const [points, setPoints] = useState(0);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const pointsToAdd = 11;
  const profitPerHour = 18000;

  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
  const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [telegramUser, setTelegramUser] = useState<{
    id: number;
    first_name: string;
    username?: string;
    photo_url?: string;
  } | null>({
    id: 0,
    first_name: 'test user',
    username: 'test-user',
    photo_url: ''
  });

  const [activeTab, setActiveTab] = useState('Exchange');

  const calculateTimeLeft = (targetHour: number) => {
    const now = new Date();
    const target = new Date(now);
    target.setUTCHours(targetHour, 0, 0, 0);

    if (now.getUTCHours() >= targetHour) {
      target.setUTCDate(target.getUTCDate() + 1);
    }

    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');

    return `${paddedHours}:${paddedMinutes}`;
  };

  useEffect(() => {
    const updateCountdowns = () => {
      setDailyRewardTimeLeft(calculateTimeLeft(0));
      setDailyCipherTimeLeft(calculateTimeLeft(19));
      setDailyComboTimeLeft(calculateTimeLeft(12));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    
    const mockTGUserData = {
      id: 12345,
      first_name: 'John',
      username: 'john_doe',
      photo_url: 'https://example.com/photo.jpg'
    };
    const telegramUserData = tg.initDataUnsafe?.user || mockTGUserData;

    if (telegramUserData) {
      console.log('Attempting auth at:', new Date().toISOString());
      
      // Update Telegram display data immediately
      setTelegramUser({
        id: telegramUserData.id,
        first_name: telegramUserData.first_name,
        username: telegramUserData.username,
        photo_url: telegramUserData.photo_url
      });

      // Direct Supabase call instead of API call
      initializeUser(telegramUserData.id.toString())
        .then(userData => {
          console.log('Auth data processed:', userData);
          setUser(userData);
          setPoints(userData.points);
          setLevelIndex(userData.level);
        })
        .catch(err => {
          console.error('Auth error at:', new Date().toISOString(), err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

  }, []);

  const handleCardClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
    setTimeout(() => {
      card.style.transform = '';
    }, 100);

    const newPoints = points + pointsToAdd;
    setPoints(newPoints);

    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  const calculateProgress = () => {
    if (levelIndex >= levelNames.length - 1) {
      return 100;
    }
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress = ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };

  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else if (points < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  }, [points, levelIndex, levelMinPoints, levelNames.length]);

  const formatProfitPerHour = (profit: number) => {
    if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  };

  const savePointsToDatabase = async (points: number) => {
    try {
      console.log('savePointsToDatabase called with points:', points); // Debug log
      if (user?.telegram_id) {
        await updateUserPoints(user.telegram_id.toString(), points);
        console.log('Points saved successfully:', points); // Debug log
      } else {
        console.log('No user.telegram_id found'); // Debug log
      }
    } catch (error) {
      console.error('Failed to save points:', error);
    }
  };

// const throttledSave =  throttle((points: number) => {
//     console.log('throttledSave executing with points:', points);
//     savePointsToDatabase(points);
//   }, 5000); // Will save at most once every 5 seconds


//   // Effect for saving points when they change
//   useEffect(() => {
//     console.log('Points changed to:', points);
//     throttledSave(points);
//     return () => {
//       console.log('Cleanup - cancelling throttledSave'); // Debug log
//       throttledSave.cancel();
//     };
//   }, [points, throttledSave]);
  
  // Separate effect for points auto-increment (passive income)
  useEffect(() => {
    const pointsPerSecond = Math.floor(profitPerHour / 3600);
    const interval = setInterval(() => {
      setPoints(prevPoints => prevPoints + pointsPerSecond);
    }, 1000);
    return () => clearInterval(interval);
  }, [profitPerHour]);

  // Memoize handlers outside of useEffect
  const handleVisibilityChange = React.useCallback(() => {
    if (document.hidden) {
      savePointsToDatabase(points);
    }
  }, [points]);

  const handleClose = React.useCallback(() => {
    savePointsToDatabase(points);
  }, [points]);

  const handleBeforeUnload = React.useCallback((e: BeforeUnloadEvent) => {
    savePointsToDatabase(points);
    e.preventDefault();
  }, [points]);

  // Use the memoized handlers in useEffect
  useEffect(() => {
    const tg = window.Telegram.WebApp;

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    tg.onEvent('viewportChanged', handleClose);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      tg.offEvent('viewportChanged', handleClose);
    };
  }, [handleVisibilityChange, handleBeforeUnload, handleClose]); // Dependencies are now the memoized handlers

  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <div className="px-4 z-10">
          <div className="flex items-center space-x-2 pt-4">
            <div className="p-1 rounded-lg bg-[#1d2025]">
              {telegramUser?.photo_url ? (
                <img 
                  src={telegramUser.photo_url} 
                  alt="Profile" 
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <Hamster size={24} className="text-[#d4d4d4]" />
              )}
            </div>
            <div>
              <p className="text-sm">
                {telegramUser?.first_name || 'Loading...'}
                {telegramUser?.username && ` (@${telegramUser.username})`}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between space-x-4 mt-1">
            <div className="flex items-center w-1/3">
              <div className="w-full">
                <div className="flex justify-between">
                  <p className="text-sm">{levelNames[levelIndex]}</p>
                  <p className="text-sm">{levelIndex + 1} <span className="text-[#95908a]">/ {levelNames.length}</span></p>
                </div>
                <div className="flex items-center mt-1 border-2 border-[#43433b] rounded-full">
                  <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
                    <div className="progress-gradient h-2 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64">
              <img src={binanceLogo} alt="Exchange" className="w-8 h-8" />
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
              <div className="flex-1 text-center">
                <p className="text-xs text-[#85827d] font-medium">Profit per hour</p>
                <div className="flex items-center justify-center space-x-1">
                  <img src={dollarCoin} alt="Dollar Coin" className="w-[18px] h-[18px]" />
                  <p className="text-sm">{formatProfitPerHour(profitPerHour)}</p>
                  <Info size={20} className="text-[#43433b]" />
                </div>
              </div>
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
              <Settings className="text-white" />
            </div>
          </div>
        </div>

        <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
            <div className="px-4 mt-6 flex justify-between gap-2">
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                <div className="dot"></div>
                <img src={dailyReward} alt="Daily Reward" className="mx-auto w-12 h-12" />
                <p className="text-[10px] text-center text-white mt-1">Daily reward</p>
                <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyRewardTimeLeft}</p>
              </div>
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                <div className="dot"></div>
                <img src={dailyCipher} alt="Daily Cipher" className="mx-auto w-12 h-12" />
                <p className="text-[10px] text-center text-white mt-1">Daily cipher</p>
                <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyCipherTimeLeft}</p>
              </div>
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                <div className="dot"></div>
                <img src={dailyCombo} alt="Daily Combo" className="mx-auto w-12 h-12" />
                <p className="text-[10px] text-center text-white mt-1">Daily combo</p>
                <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyComboTimeLeft}</p>
              </div>
            </div>

            
            <div className="content">
              {activeTab === 'Exchange' && <Exchange points={points} onCardClick={handleCardClick} />}
              {activeTab === 'Mine' && <div>Mine Content</div>}
              {activeTab === 'Leaderboard' && <Leaderboard />}
              {activeTab === 'Earn' && <div>Earn Content</div>}
              {activeTab === 'Airdrop' && <div>Airdrop Content</div>}
            </div>
          </div>
        </div>
        <Menu activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default App;
