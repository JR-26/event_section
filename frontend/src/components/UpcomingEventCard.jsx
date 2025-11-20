import React from 'react';

const UpcomingEventCard = ({ title, date, time, type }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 mb-1">{date} {time}</p>
      <p className="text-gray-500 mb-4">{type}</p>
      <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
        More
      </button>
    </div>
  );
};

export default UpcomingEventCard;