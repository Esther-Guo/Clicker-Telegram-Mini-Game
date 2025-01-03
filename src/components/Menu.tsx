import React from 'react';
import { binanceLogo, hamsterCoin } from '../images';
import Mine from '../icons/Mine';
import Leaderboard from '../icons/Leaderboard';
import Coins from '../icons/Coins';

interface MenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Menu: React.FC<MenuProps> = ({ activeTab, setActiveTab }) => {
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">
      <div className={`text-center text-[#85827d] w-1/5 m-1 p-2 rounded-2xl ${activeTab === 'Exchange' ? 'bg-[#1c1f24]' : ''}`} onClick={() => handleTabClick('Exchange')}>
        <img src={binanceLogo} alt="Exchange" className="w-8 h-8 mx-auto" />
        <p className="mt-1">Exchange</p>
      </div>
      <div className={`text-center text-[#85827d] w-1/5 m-1 p-2 rounded-2xl ${activeTab === 'Mine' ? 'bg-[#1c1f24]' : ''}`} onClick={() => handleTabClick('Mine')}>
        <Mine className="w-8 h-8 mx-auto" />
        <p className="mt-1">Mine</p>
      </div>
      <div className={`text-center text-[#85827d] w-1/5 m-1 p-2 rounded-2xl ${activeTab === 'Leaderboard' ? 'bg-[#1c1f24]' : ''}`} onClick={() => handleTabClick('Leaderboard')}>
        <Leaderboard className="w-8 h-8 mx-auto" />
        <p className="mt-1">Leaderboard</p>
      </div>
      <div className={`text-center text-[#85827d] w-1/5 m-1 p-2 rounded-2xl ${activeTab === 'Earn' ? 'bg-[#1c1f24]' : ''}`} onClick={() => handleTabClick('Earn')}>
        <Coins className="w-8 h-8 mx-auto" />
        <p className="mt-1">Earn</p>
      </div>
      <div className={`text-center text-[#85827d] w-1/5 m-1 p-2 rounded-2xl ${activeTab === 'Airdrop' ? 'bg-[#1c1f24]' : ''}`} onClick={() => handleTabClick('Airdrop')}>
        <img src={hamsterCoin} alt="Airdrop" className="w-8 h-8 mx-auto" />
        <p className="mt-1">Airdrop</p>
      </div>
    </div>
  );
};

export default Menu;
