import React from 'react';

const getTimeDifference = (date) => {
  const now = new Date();
  const alertDate = new Date(date);
  const diffInMs = now - alertDate; 
  const diffInMinutes = Math.floor(diffInMs / 60000); 
  const diffInHours = Math.floor(diffInMs / (60000 * 60)); 
  const diffInDays = Math.floor(diffInMs / (60000 * 60 * 24)); 

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes === 1) return '1 minute ago';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours === 1) return '1 hour ago';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInDays === 1) return '1 day ago';
  return `${diffInDays} days ago`;
};

const Alert = ({ sym, pattern, date, color, onClick }) => {
  const timeAgo = getTimeDifference(date);

  const bgColorClass = color === 'green' ? 'bg-green' : color === 'red' ? 'bg-red' : 'bg-slate-700';

  return (
    <div className={`${bgColorClass}-500 hover:${bgColorClass}-700 px-8 py-2 rounded cursor-pointer`} onClick={onClick}>
      <h1 className='text-white font-bold text-md'>{sym} : {pattern} Confirmation</h1>
      <h1 className='text-white text-sm'>{timeAgo}</h1>
    </div>
  );
};

export default Alert;