import React, { useState, useEffect } from 'react';
import { FaCircle, FaUsers, FaGlobe, FaPlus, FaComments } from 'react-icons/fa';

const ActivityDashboard = () => {
  const [activeChats, setActiveChats] = useState(10234);
  const [activeUsers, setActiveUsers] = useState(10234);
  const [languages] = useState(143);
  const [newRooms] = useState(15);
  const [displayUsers, setDisplayUsers] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveChats((prev) => prev + Math.floor(Math.random() * 21) - 10);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = activeUsers / steps;
    let currentStep = 0;

    const counterInterval = setInterval(() => {
      currentStep++;
      setDisplayUsers(Math.floor(increment * currentStep));
      
      if (currentStep >= steps) {
        clearInterval(counterInterval);
        setDisplayUsers(activeUsers);
      }
    }, duration / steps);

    return () => clearInterval(counterInterval);
  }, [activeUsers]);

  const languageCodes = ['EN', 'ES', 'FR', 'DE', 'ZH', 'JA', 'AR', 'PT', 'RU', 'IT', 'KO', 'NL'];

  return (
    <div className="section-container py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Live Chats Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <FaComments className="text-red-600 dark:text-red-400 text-2xl" />
            </div>
            <div className="flex items-center space-x-2">
              <FaCircle className="text-red-500 text-xs animate-pulse" />
              <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase">LIVE</span>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {activeChats.toLocaleString()}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Chats Active</p>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <FaUsers className="text-primary-600 dark:text-primary-400 text-2xl" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {displayUsers.toLocaleString()}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Active Users</p>
          </div>
          <div className="flex -space-x-2 mt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs text-white font-semibold"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
        </div>

        {/* Languages Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-xl">
              <FaGlobe className="text-accent-600 dark:text-accent-400 text-2xl" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{languages}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Languages</p>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {languageCodes.slice(0, 9).map((code, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-neutral-100 dark:bg-slate-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold rounded-md group-hover:bg-accent-100 dark:group-hover:bg-accent-900/30 group-hover:text-accent-700 dark:group-hover:text-accent-300 transition-colors"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {code}
              </span>
            ))}
          </div>
        </div>

        {/* New Rooms Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-success-100 dark:bg-success-900/30 rounded-xl">
              <FaPlus className="text-success-600 dark:text-success-400 text-2xl" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{newRooms}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">New Rooms</p>
          </div>
          <div className="mt-4">
            <div className="text-xs text-neutral-600 dark:text-neutral-400">Created in last hour</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDashboard;
