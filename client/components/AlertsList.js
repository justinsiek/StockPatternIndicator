import React from 'react';
import Alert from './Alert';

const AlertsList = ({ alerts, checkedPatterns, onClickAlert }) => {
  const filteredAlerts = alerts.filter(alert => checkedPatterns.has(alert.pattern));
  const sortedAlerts = filteredAlerts.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

  return (
    <div className='text-center justify-center w-2/3 h-full'>
      <div className='grid grid-cols-3 gap-1'>
        {sortedAlerts.map((alert, index) => (
          <Alert key={index} sym={alert.symbol} pattern={alert.pattern} date={alert.date} color={alert.color} onClick={() => onClickAlert(alert.symbol)} />
        ))}
      </div>
    </div>
  );
};

export default AlertsList;