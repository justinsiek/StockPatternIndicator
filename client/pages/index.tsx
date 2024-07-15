import React, { useState } from 'react';

function Index() {
  const [symbol, setSymbol] = useState('');
  interface StockInfo {
    longName: string;
  }
  const [stockInfo, setStockInfo] = useState<StockInfo>({longName: ''});
  const getStockInfo = () => {
    fetch(`http://localhost:8080/api/getsi?symbol=${symbol}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        setStockInfo(data)
      });
  };

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      {stockInfo.longName && <p>Stock Name: {stockInfo.longName}</p>}
      <input
        className='border border-gray-400 p-2 w-1/4 rounded-lg mb-4'
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter a Symbol..."
      />
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded' 
        onClick={getStockInfo}>Submit</button>
    </div>
  );
}

export default Index;