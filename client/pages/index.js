import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('../components/Chart'), {
  ssr: false,
});

function Index() {
  const [symbol, setSymbol] = useState("");
  const [stockInfo, setStockInfo] = useState([]);

  const getStockInfo = (e) => {
    e.preventDefault(); 
    fetch(`http://localhost:8080/api/getsi?symbol=${symbol}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        setStockInfo(data);
      });
  };

  return (
    <div className='flex flex-col justify-center items-center h-full w-screen'>
      <form onSubmit={getStockInfo} className="flex flex-col items-center">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className='mb-4 p-2 border rounded'
          placeholder="Enter Symbol"
        />
        <button
          type="submit"
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded'>
          Submit
        </button>
      </form>
      <div className='w-4/5'>
        <Chart stockInfo={stockInfo} />
      </div>
    </div>
  );
}

export default Index;