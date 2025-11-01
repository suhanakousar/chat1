import React from "react";
import { AvatarChat } from "./ReusableComponents.jsx";
import { IconButton, Input, Badge } from "../ui/ThemeAwareComponents";
import { FaSearch, FaCommentDots, FaTimes } from "react-icons/fa";

const showTime = (timestamp) => {
  if (!timestamp) return "";
  const sentTime = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - sentTime) / 1000);

  if (diffInSeconds < 60) return "now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo`;
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}y`;
};

const FilterTab = ({ text, isActive, onClick, count = 0 }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full text-sm font-semibold font-['Montserrat'] transition-all duration-200
        ${isActive 
          ? 'bg-brand-yellow text-brand-grey-dark shadow-sm' 
          : 'bg-transparent text-brand-grey-600 dark:text-brand-grey-300 hover:bg-brand-grey-100 dark:hover:bg-brand-grey-light'
        }
        focus:outline-none focus:ring-2 focus:ring-brand-yellow/50
      `}
      aria-pressed={isActive}
      aria-label={`Filter by ${text}${count > 0 ? `, ${count} items` : ''}`}
    >
      {text}
      {count > 0 && <span className="ml-1.5 opacity-75">({count})</span>}
    </button>
  );
};

const ChatItem = ({ chat, isActive, onClick }) => {
  const unreadCount = chat.unread_count || 0;
  
  return (
    <div
      onClick={onClick}
      className={`
        card-chat-item group relative
        ${isActive ? 'card-chat-item-active' : ''}
      `}
      role="button"
      tabIndex={0}
      aria-label={`Chat with ${chat.name}, ${unreadCount > 0 ? `${unreadCount} unread messages` : 'no unread messages'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <AvatarChat color={chat.avatar_color} text={chat.avatar_text} />
          {chat.is_online && (
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-success rounded-full border-2 border-brand-white dark:border-brand-grey-medium"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-['Montserrat'] font-semibold text-brand-grey-dark dark:text-brand-white truncate">
              {chat.name}
            </h3>
            <span className="font-['Inter'] text-xs text-brand-grey-500 dark:text-brand-grey-400 flex-shrink-0">
              {showTime(chat.updated_at)}
            </span>
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <p className={`font-['Inter'] text-sm truncate flex-1 ${unreadCount > 0 ? 'font-medium text-brand-grey-dark dark:text-brand-white' : 'text-brand-grey-600 dark:text-brand-grey-400'}`}>
              {chat.last_message || "No messages yet"}
            </p>
            {unreadCount > 0 && (
              <Badge variant="unread" className="flex-shrink-0">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({
  chats = [],
  currentChatId,
  onChatClick,
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  onNewChat,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const filterCounts = React.useMemo(() => {
    return {
      all: chats.length,
      unread: chats.filter(chat => (chat.unread_count || 0) > 0).length,
      pending: chats.filter(chat => chat.status === 'pending').length,
    };
  }, [chats]);

  return (
    <aside
      className={`
        flex flex-col h-full border-r border-brand-grey-200 dark:border-brand-grey-light
        bg-brand-white-soft dark:bg-brand-grey-medium transition-all duration-300
        ${isCollapsed ? 'w-0 overflow-hidden' : 'w-80 lg:w-96'}
      `}
      aria-label="Chat list sidebar"
    >
      {/* Sidebar Header */}
      <div className="px-6 py-4 border-b border-brand-grey-200 dark:border-brand-grey-light flex-shrink-0">
        <div className="flex justify-between items-center">
          <h1 className="text-brand-grey-dark dark:text-brand-white font-['Montserrat'] text-2xl font-bold">
            Chats
          </h1>
          <IconButton 
            icon={<FaCommentDots className="text-xl" />} 
            onClick={onNewChat}
            ariaLabel="Start new chat"
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 flex-shrink-0">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-grey-500 dark:text-brand-grey-400 z-10" />
          <Input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="search"
            className="pl-11 pr-10"
            aria-label="Search chats"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-brand-grey-200 dark:hover:bg-brand-grey-600 rounded-full transition-colors"
              aria-label="Clear search"
            >
              <FaTimes className="text-brand-grey-500 dark:text-brand-grey-400 text-sm" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 pb-3 flex gap-2 flex-shrink-0 overflow-x-auto scrollbar-custom">
        <FilterTab
          text="All"
          isActive={activeFilter === "all"}
          onClick={() => setActiveFilter("all")}
          count={filterCounts.all}
        />
        <FilterTab
          text="Unread"
          isActive={activeFilter === "unread"}
          onClick={() => setActiveFilter("unread")}
          count={filterCounts.unread}
        />
        <FilterTab
          text="Pending"
          isActive={activeFilter === "pending"}
          onClick={() => setActiveFilter("pending")}
          count={filterCounts.pending}
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-custom">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="font-['Montserrat'] font-semibold text-brand-grey-dark dark:text-brand-white mb-2">
              {searchTerm ? 'No chats found' : 'No chats yet'}
            </h3>
            <p className="font-['Inter'] text-sm text-brand-grey-600 dark:text-brand-grey-400 mb-4">
              {searchTerm 
                ? 'Try searching with different keywords' 
                : 'Start a new conversation to get started'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={onNewChat}
                className="btn-primary text-sm"
              >
                Start New Chat
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-1 px-2 py-2">
            {chats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === currentChatId}
                onClick={() => onChatClick(chat.id)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
