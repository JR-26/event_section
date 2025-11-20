import React, { useState } from 'react';
import { Search } from 'lucide-react';
import UpcomingEventCard from '../components/UpcomingEventCard';
import PastEventCard from '../components/PastEventCard';
import EventCalendar from '../components/EventCalendar';

const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  // Sample event data - this should come from your backend/API
  const upcomingEvents = [
    { id: 1, title: 'Intro to ML', date: '11 Nov 2025', time: '10:00AM', type: 'Workshop' },
    { id: 2, title: 'CodeEnigma', date: '12 Nov 2025', time: '8:00PM', type: 'Competition' },
    { id: 3, title: 'IAC', date: '15 Nov 2025', time: '9:00AM', type: 'Conference' },
  ];

  const pastEvents = [
    { id: 4, title: 'Web Dev Bootcamp', date: '05 Oct 2025', time: '2:00PM', type: 'Workshop' },
    { id: 5, title: 'Hackathon 2025', date: '20 Sep 2025', time: '9:00AM', type: 'Competition' },
    { id: 6, title: 'AI Summit', date: '15 Aug 2025', time: '10:00AM', type: 'Conference' },
  ];

  const currentEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div className="flex flex-col h-full">
      {/* Page Title */}
      <div className="bg-white shadow-sm px-6 py-4 rounded-xl mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Events</h2>
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-hidden">
        <div className="flex gap-6 h-full">
          {/* Left Section - Events */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Search Bar */}
            <div className="mb-4 flex-shrink-0">
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 mb-4 border-b border-gray-300 flex-shrink-0">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`pb-3 px-2 font-medium transition ${
                  activeTab === 'upcoming'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`pb-3 px-2 font-medium transition ${
                  activeTab === 'past'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Past
              </button>
            </div>

            {/* Events Grid - Scrollable */}
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-4">
                {currentEvents
                  .filter(event => 
                    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    event.type.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(event => (
                    activeTab === 'upcoming' ? (
                      <UpcomingEventCard key={event.id} {...event} />
                    ) : (
                      <PastEventCard key={event.id} {...event} />
                    )
                  ))}
              </div>
            </div>
          </div>

          {/* Right Section - Calendar */}
          <div className="w-80 flex-shrink-0 overflow-hidden">
            <EventCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;