import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import AlertsList from '@/components/AlertsList';

const Chart = dynamic(() => import('../components/Chart'), {
  ssr: false,
});

function Index() {
  const [symbol, setSymbol] = useState("");
  const [stockInfo, setStockInfo] = useState([]);
  const [trackList, setTrackList] = useState(["MSFT", "MU", "NVDA", "AAPL", "TSLA"]);
  const patternList = ["Bull Flag", "Bear Flag"]
  const [checkedPatterns, setCheckedPatterns] = useState(new Set(patternList));
  const [submitted, setSubmitted] = useState(false);
  const [alerts, setAlerts] = useState([]);
  
  const getStockInfo = useCallback((sym) => {
    fetch(`http://localhost:8080/api/getsi?symbol=${sym}`)
      .then(response => response.json())
      .then(data => {
        setStockInfo(data);
        setSubmitted(true);
      });
  }, []);

  const getAllAlerts = useCallback(() => {
    const symbols = trackList.join(',');
    fetch(`http://localhost:8080/api/getallalerts?symbols=${symbols}`)
      .then(response => response.json())
      .then(data => {
        setAlerts(data);
      });
  }, [trackList]);

  useEffect(() => {
    getAllAlerts();
  }, [getAllAlerts]);

  useEffect(() => {
    const interval = setInterval(() => {
      getAllAlerts();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [getAllAlerts]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (symbol) {
        getStockInfo(symbol);
      }
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [symbol, getStockInfo]);

  const handleSubmit = (e) => {
    e.preventDefault(); 
    getStockInfo(symbol);
  };

  const handleTickerClick = (ticker) => {
    setSymbol(ticker);
    getStockInfo(ticker);
  };

  const handleTrackButtonClick = (ticker) => {
    if (trackList.includes(ticker)) {
      setTrackList(trackList.filter(t => t !== ticker));
    } else if (ticker !== '') {
      setTrackList([...trackList, ticker]);
    }
  };

  const handlePatternToggle = (pattern) => {
    setCheckedPatterns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pattern)) {
        newSet.delete(pattern);
      } else {
        newSet.add(pattern);
      }
      return newSet;
    });
  };

  const isTracked = trackList.includes(symbol);

  return (
    <div className='flex flex-col items-center w-screen h-screen'>
      <h1 className='text-4xl font-bold my-4'>Stock Pattern Indicator</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className='mb-4 p-2 border rounded'
          placeholder="Enter Symbol"
        />
        <div className='flex gap-2'>
          <button
            type="submit"
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded'>
            Submit
          </button>
          {submitted && (
            <button
              type="button"
              onClick={() => handleTrackButtonClick(symbol)}
              className={`${isTracked ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'} text-white font-bold py-2 px-4 rounded`}>
              {isTracked ? 'Untrack' : 'Track'}
            </button>
          )}
        </div>
      </form>
      <div className='w-[95%]'>
        <Chart stockInfo={stockInfo[0]} bullflags={stockInfo[1]} bearflags={stockInfo[2]} />
      </div>
      <div className='w-screen flex justify-center items-center gap-4'> 
        <h1>Tracked Stocks:</h1>
        {trackList.map((ticker) => (
          <a 
            key={ticker}
            href="#" 
            onClick={() => handleTickerClick(ticker)} 
            className='cursor-pointer text-blue-500'>
            {ticker}
          </a>
        ))}
      </div>
      <div className='w-screen mb-6 flex justify-center items-center gap-4'>
        <h1>Tracked Patterns:</h1>
        <div className='flex gap-2'>
          {patternList.map((pattern) => (
            <div key={pattern} className='flex items-center gap-2'>
              <input 
                type="checkbox" 
                checked={checkedPatterns.has(pattern)} 
                onChange={() => handlePatternToggle(pattern)} 
              />
              <label>{pattern}</label>
            </div>
          ))}
        </div>
      </div>
      <div className='w-screen items-center justify-center flex w-full h-1/3'>
        <AlertsList alerts={alerts} onClickAlert={handleTickerClick} checkedPatterns={checkedPatterns} />
      </div>
    </div>
  );
}

export default Index;