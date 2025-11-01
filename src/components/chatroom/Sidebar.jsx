import { AvatarChat, AvatarPerson } from "./ReusableComponents.jsx";
import { TabButton } from "./ReusableComponents.jsx";
import { IconButton } from "./ReusableComponents.jsx";
import { FaSearch, FaCommentDots } from "react-icons/fa";
import { useEffect } from "react";

const showTime = (timestamp) => {
  const sentTime = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - sentTime) / 1000);

  if (diffInSeconds < 60) return "now"; // Less than 1 minute
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m`; // Less than 1 hour
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`; // Less than 1 day
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d`; // Less than 1 month
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}m`; // Less than 1 year
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} y`; // More than 1 year
};

const Sidebar = ({
  chats,
  currentChatId,
  onChatClick,
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  onNewChat,
}) => {
  
  return (
    <div
      className={`xl:pt-18 lg:pt-16 md:pt-12 sm:pt-8 pt-6 mt-10 lg:mt-2 w-80 border-r border-border bg-surface dark:bg-surface flex flex-col`}
    >
      {/* Sidebar header */}
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h1 className="text-text-primary dark:text-text-primary font-['Montserrat'] text-[1.75rem] font-bold">
          Chats
        </h1>
        {/* New chat button */}
      </div>
      
      {/* Search and other sidebar elements */}
    </div>
  );
};

export default Sidebar;
