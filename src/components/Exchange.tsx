import React from 'react';
import { dollarCoin, mainCharacter } from '../images';

interface ExchangeProps {
  points: number;
  onCardClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Exchange: React.FC<ExchangeProps> = ({ points, onCardClick }) => {
  return (
    <>
      <div className="px-4 mt-4 flex justify-center">
        <div className="px-4 py-2 flex items-center space-x-2">
          <img src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />
          <p className="text-4xl text-white">{points.toLocaleString()}</p>
        </div>
      </div>

      <div className="px-4 mt-4 flex justify-center">
        <div
          className="w-80 h-80 p-4 rounded-full circle-outer"
          onClick={onCardClick}
        >
          <div className="w-full h-full rounded-full circle-inner">
            <img src={mainCharacter} alt="Main Character" className="w-2/3 h-2/3" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Exchange; 