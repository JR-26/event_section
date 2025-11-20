import React from 'react';

const PastEventCard = ({ title, date, time, type }) => {
  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-6 border border-gray-300">
      <h3 className="text-xl font-semibold text-gray-600 mb-3">{title}</h3>
      <p className="text-gray-500 mb-1">{date} {time}</p>
      <p className="text-gray-400 mb-4">{type}</p>
      <button className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition">
        More
      </button>
    </div>
  );
};

export default PastEventCard;