// Room.jsx
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/chatroom/Sidebar.jsx";
import ChatWindow from "../components/chatroom/ChatWindow.jsx";
import ChatInfo from "../components/chatroom/ChatInfo.jsx";
import NavBar from "../components/NavBar.jsx";
import { FaTimes, FaWifi } from "react-icons/fa";
import axios from "axios";
import io from "socket.io-client";
import { showToastError, showToastSuccess } from "../components/common/ShowToast";
import RequestJoin from "../components/chatroom/RequestJoin.jsx";
import WaitingApproval from "../components/chatroom/WaitingApproval.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import { useMessagePersistence } from "../hooks/useMessagePersistence";

const ChatRoom = () => {
  const EmptyState = () => {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 transition-colors">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Welcome to Chat!
          </h2>
          <p className="text-gray-500 mb-6">
            Select a conversation or start a new one
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition shadow-md"
            onClick={() => setIsNewChatModalOpen(true)}
          >
            Start New Chat
          </button>
        </div>
      </div>
    );
  };

  const NewChatModal = ({ isOpen, onClose, onCreateChat }) => {
    const [chatName, setChatName] = useState("");
    const [description, setDescription] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!chatName.trim()) return;

      onCreateChat({
        name: chatName,
        description: description,
      });

      setChatName("");
      setDescription("");
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-lg">
          <div className="font-['Inter'] p-4 border-b flex justify-between items-center relative">
            <h2 className="text-xl font-bold text-gray-900">New Chat</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 absolute right-4 top-4"
            >
              <FaTimes size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-4">
              <label className="font-['Inter'] text-gray-900 block text-sm font-bold mb-2">
                Chat Name
              </label>
              <input
                type="text"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                className="placeholder-gray-500 shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter chat name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="font-['Inter'] text-gray-900 block text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="placeholder-gray-500 shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a description (optional)"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="font-['Inter'] font-semibold bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="font-['Inter'] font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
              >
                Create Chat
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const { chatId: urlChatId } = useParams();
  const navigate = useNavigate();

  const userId = localStorage.getItem("user_id");

  // Instead of a single [messages], we store a dictionary: { [roomId]: [msg, msg, ...], ... }
  const [roomMessages, setRoomMessages] = useState({});
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(urlChatId);
  const [lastScrollChatId, setLastScrollChatId] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  // UI states
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [isPrepending, setIsPrepending] = useState(false);
  const [messagePagination, setMessagePagination] = useState({}); // { [chatId]: { cursor, hasMore } }

  const [showJoinRequest, setShowJoinRequest] = useState(false);
  const [showWaitingApproval, setShowWaitingApproval] = useState(false);
  const [invitedChatDetails, setInvitedChatDetails] = useState({});

  // const [isMessagesLoaded, setIsMessagesLoaded] = useState(false);

  const messageContainerRef = useRef(null);

  useEffect(() => {
    const checkMembership = async () => {
      if (currentChatId) {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/chatroom/${currentChatId}/isMember/${userId}`
          );

          console.log("check mem:", res.data, currentChatId, userId);

          if (res.data.isMember) {
            // User is a member, load the chat
            setCurrentChatId(currentChatId);
          } else if (res.data.status === 'pending') {
            const chatroom = res.data.chatroom;

            const invitedChat = {
              id: currentChatId,
              name: chatroom.name,
              avatarColor: chatroom.avatar_color,
              avatarText: chatroom.avatar_text,
              lastMessage: chatroom.last_message,
              time: new Date(),
              unread: true,
              messages: [],
              status: "pending",
            };

            setInvitedChatDetails(invitedChat);
            setShowWaitingApproval(true);
            navigate("/Chat");
          } else {
            const chatroom = res.data.chatroom;

            const invitedChat = {
              id: currentChatId,
              name: chatroom.name,
              avatarColor: chatroom.avatar_color,
              avatarText: chatroom.avatar_text,
              lastMessage: chatroom.last_message,
              time: new Date(),
              unread: true,
              messages: [],
              status: "invited",
            };

            setInvitedChatDetails(invitedChat);
            setShowJoinRequest(true);
            navigate("/Chat");
          }
        } catch (err) {
          console.error("Failed to check membership:", err);
          if (err.response?.status === 404) {
            showToastError("Chat room not found");
            navigate("/Chat");
          } else if (err.response?.status === 403) {
            showToastError("You are not a member of this chat room");
            navigate("/Chat");
          } else {
            showToastError("Failed to check membership");
          }
        }
      }
    };

    checkMembership();
  }, [currentChatId, userId, chats, navigate]);

  // Single socket
  const [socket, setSocket] = useState(null);
  
  const {
    isOnline,
    persistMessages,
    loadPersistedMessages,
  } = useMessagePersistence(currentChatId, socket);

  useEffect(() => {
    if (currentChatId) {
      const persisted = loadPersistedMessages(currentChatId);
      if (persisted && persisted.length > 0 && !roomMessages[currentChatId]) {
        setRoomMessages(prev => ({
          ...prev,
          [currentChatId]: persisted
        }));
      }
    }
  }, [currentChatId, loadPersistedMessages]);

  useEffect(() => {
    if (currentChatId && roomMessages[currentChatId]) {
      persistMessages(currentChatId, roomMessages[currentChatId]);
    }
  }, [roomMessages, currentChatId, persistMessages]);

  useEffect(() => {
    const loadInitialMessages = async () => {
      if (currentChatId && !roomMessages[currentChatId] && currentChat && currentChat.status !== "pending") {
        console.log("Enter function fetch initial messages.");
        console.log(`${API_BASE_URL}/chatroom/${currentChatId}/messages`);

        try {
          const res = await axios.get(
            `${API_BASE_URL}/chatroom/${currentChatId}/messages`,
            {
              params: {
                cursor: null,
              },
            }
          );

          setRoomMessages((prev) => ({
            ...prev,
            [currentChatId]: res.data.messages
              .filter((message) => message.chat_id === currentChatId)
              .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
          }));

          setMessagePagination((prev) => ({
            ...prev,
            [currentChatId]: {
              cursor: res.data.cursor,
              hasMore: res.data.hasMore,
            },
          }));

        } catch (err) {
          console.error("Error loading initial messages:", err);
          if (err.response?.status === 404) {
            showToastError("Chat room not found");
          } else if (err.response?.status === 403) {
            showToastError("You are not a member of this chat room");
          } else {
            showToastError("Failed to load messages");
          }
        }
        console.log(11111);
      }
    };

    loadInitialMessages();
    const container = messageContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight - container.clientHeight;
    }
  }, [currentChatId]);

  useEffect(() => {
    const socketInstance = io(`${API_BASE_URL}`, {
      transports: ["websocket"],
      auth: { userId: userId },
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected successfully");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      showToastError("Failed to connect to chat server");
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socketInstance.on("join-request-handled", (data) => {
      console.log("Received join-request-handled:", data);
      if (data.userId === userId) {
        if (data.action === 'approved') {
          showToastSuccess("Your join request has been approved!");
          // Refresh chats
          fetchChats();
          // Navigate to the chat
          navigate(`/Chat/${data.chatId}`);
        } else {
          showToastError("Your join request has been rejected.");
        }
      }
    });

    setSocket(socketInstance);

    return () => socketInstance.disconnect();
  }, [userId]);

  useEffect(() => {
    if (!socket || !currentChatId) return;
    const handleReceiveMessage = (incomingMessage) => {
      console.log("Received via socket:", incomingMessage);
      setRoomMessages((prev) => {
        const existing = prev[currentChatId] || [];
        return {
          ...prev,
          [currentChatId]: [
            ...existing,
            { ...incomingMessage, fromUser: false },
          ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
        };
      });
    };
    socket.on("receive-message", handleReceiveMessage);
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket, currentChatId]);

  // For the currently selected chat, we show that chat's messages or an empty array
  const currentChatMessages = roomMessages[currentChatId] || [];
  const currentChat = chats.find((c) => c.id === currentChatId) || null;

  // 1. Load all chats for the sidebar (no GET for messages, just for chats)
  const fetchChats = async () => {
    try {
      const allChats = await axios.get(
        `${API_BASE_URL}/chatroom/user/${userId}`
      );
      const newChats =
        allChats.data?.chatRooms.map((chat) => chat.chatRoom) || [];

      console.log("Chats from server:", newChats);
      // Mark unread
      const statuses = await Promise.all(
        newChats.map((chat) =>
          axios.get(
            `${API_BASE_URL}/chatroom/${chat.id}/readStatus/${userId}`
          )
        )
      );

      newChats.forEach((chat, index) => {
        chat.unread = statuses[index].data.unread;
      });

      setChats(newChats);

      // Set currentChatId based on urlChatId if valid, else first chat or null
      if (urlChatId && newChats.some(chat => chat.id === urlChatId)) {
        setCurrentChatId(urlChatId);
      } else if (urlChatId) {
        // If urlChatId is specified, set it even if not in chats (for invite)
        setCurrentChatId(urlChatId);
      } else if (newChats.length > 0) {
        setCurrentChatId(newChats[0].id);
      } else {
        setCurrentChatId(null);
      }
    } catch (err) {
      showToastError(err.response?.data?.message || "Failed to load chats");
      setCurrentChatId(null);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [userId, urlChatId, navigate]);

  // 2. Filter chats for sidebar

  const [filteredChats, setFilteredChats] = useState(chats);
  useEffect(() => {
    let filtered = [...chats];

    if (searchTerm) {
      filtered = filtered.filter(
        (chat) =>
          chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilter === "unread") {
      filtered = filtered.filter((chat) => chat.unread);
    }

    setFilteredChats(filtered);
  }, [chats, activeFilter, searchTerm]);

  // 4. Send message => POST to the server, but also emit via socket
  const handleSendMessage = async () => {
    //console.log("handleSendMessage was called, currentChatId=", currentChatId);
    if (!newMessage.trim() || !currentChatId) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/rooms/${currentChatId}/messages`,
        { text: newMessage, userId: userId }
      );
      console.log(response.status, response.data);

      const savedMessage = response.data;
      savedMessage.fromUser = true;
      savedMessage.created_at = new Date();

      setRoomMessages((prev) => {
        const existingArray = prev[currentChatId] || [];
        return {
          ...prev,
          [currentChatId]: [...existingArray, savedMessage].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          ),
        };
      });

      const messageToSend = {
        content: savedMessage.content,
        sender: userId || "Unknown",
        senderColor: savedMessage.senderColor || "#ccc",
        created_at: new Date(),
      };

      if (!socket) {
        console.log("No socket reference, cannot emit!");
      } else {
        socket.emit("send-message", messageToSend, currentChatId);
      }

      setNewMessage("");

      const updated = chats.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, lastMessage: `You: ${newMessage}`, time: "now" }
          : chat
      );
      setChats(updated);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 404) {
        showToastError("Chat room not found");
      } else if (error.response?.status === 403) {
        showToastError("You are not a member of this chat room");
      } else {
        showToastError(error.response?.data?.error || "Error sending message");
      }
    }
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!currentChatId) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadResponse = await axios.post(`${API_BASE_URL}/chatroom/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { fileUrl, fileType, originalName } = uploadResponse.data;

      // Send message with file URL
      const response = await axios.post(
        `${API_BASE_URL}/rooms/${currentChatId}/messages`,
        {
          text: fileType === 'image' ? `Image: ${originalName}` : `File: ${originalName}`,
          userId: userId,
          file_url: fileUrl,
          file_type: fileType
        }
      );

      const savedMessage = response.data;
      savedMessage.fromUser = true;
      savedMessage.created_at = new Date();

      setRoomMessages((prev) => {
        const existingArray = prev[currentChatId] || [];
        return {
          ...prev,
          [currentChatId]: [...existingArray, savedMessage].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          ),
        };
      });

      const messageToSend = {
        content: savedMessage.content,
        sender: userId || "Unknown",
        senderColor: savedMessage.senderColor || "#ccc",
        created_at: new Date(),
        file_url: fileUrl,
        file_type: fileType,
      };

      if (socket) {
        socket.emit("send-message", messageToSend, currentChatId);
      }

      const updated = chats.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, lastMessage: `You: ${fileType === 'image' ? 'Image' : 'File'}`, time: "now" }
          : chat
      );
      setChats(updated);
    } catch (error) {
      console.error(error);
      showToastError(error.response?.data?.error || "Error uploading file");
    }
  };

  // Handle image upload (similar to file upload)
  const handleImageUpload = async (file) => {
    await handleFileUpload(file);
  };

  // 5. Create a new chat => POST to the server (no GET for messages)
  const handleCreateChat = async (chatData) => {
    const data = {
      name: chatData.name,
      description: chatData.description || "",
      adminId: userId,
      avatarColor: `bg-${
        ["green", "purple", "cyan", "yellow", "blue"][
          Math.floor(Math.random() * 5)
        ]
      }-400`,
      avatarText: chatData.name.charAt(0).toUpperCase(),
      lastMessage: "Start a conversation...",
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/chatroom`, data);
      if (response.status === 201) {
        const newChat = response.data?.chatroom;
        newChat.unread = true;
        setChats((prev) => [newChat, ...prev]);
        setCurrentChatId(newChat.id);
        navigate(`/Chat/${newChat.id}`);

        // Optionally join the new room
        if (socket) {
          socket.emit("joinRoom", newChat.id);
        }

        // Start with an empty array for the new chat
        setRoomMessages((prev) => ({
          ...prev,
          [newChat.id]: [],
        }));
      }
    } catch (err) {
      showToastError(err.response?.data?.message);
      console.log(err);
    }

    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  // 6. Auto-scroll
  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    // Check if it's a new chat or initial load
    const isNewChatOrInitialLoad =
      currentChatMessages.length > 0 &&
      (!lastScrollChatId || lastScrollChatId !== currentChatId);

    // Only auto-scroll if we're already near the bottom or it's a new chat
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    if ((isNearBottom || isNewChatOrInitialLoad) && !isPrepending) {
      container.scrollTop = container.scrollHeight;
    }
  }, [currentChatMessages, isPrepending, currentChatId, lastScrollChatId]);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      // Scroll to the very bottom
      container.scrollTop = container.scrollHeight;
    }
  }, [currentChatId]);

  // 7. Handle selecting a chat
  const handleChatClick = async (chatId) => {
    setLastScrollChatId(currentChatId);
    setCurrentChatId(chatId);
    // setIsMessagesLoaded(false);
    navigate(`/Chat/${chatId}`);
    // Mark as read
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId && chat.unread ? { ...chat, unread: false } : chat
      )
    );

    await axios.put(
      `${API_BASE_URL}/chatroom/${chatId}/readStatus/${userId}`
    );

    // Join the room if using Socket for presence
    if (socket) {
      socket.emit("joinRoom", chatId);
    }

    // On mobile, hide sidebar after selecting
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }

    // Fetch initial messages (if not already loaded)
    if (!roomMessages[chatId]) {
      console.log("Enter function fetch initial messages.");
      console.log(`${API_BASE_URL}/chatroom/${chatId}/messages`);

      try {
        const res = await axios.get(
          `${API_BASE_URL}/chatroom/${chatId}/messages`,
          {
            params: {
              cursor: null,
            },
          }
        );

        setRoomMessages((prev) => ({
          ...prev,
          // [chatId]: res.data.messages,
          [chatId]: res.data.messages
            .filter((message) => message.chat_id === chatId)
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
        }));

        // setRoomMessages((prev) => {
        //   const existing = prev[chatId] || [];
        //   return {
        //     ...prev,
        //     [chatId]: [...newMessages, ...existing], // prepend
        //   };
        // });

        setMessagePagination((prev) => ({
          ...prev,
          [chatId]: {
            cursor: res.data.cursor,
            hasMore: res.data.hasMore,
          },
        }));

        // setIsMessagesLoaded(true);
      } catch (err) {
        console.error("Error loading initial messages:", err);
        if (err.response?.status === 404) {
          showToastError("Chat room not found");
        } else if (err.response?.status === 403) {
          showToastError("You are not a member of this chat room");
        } else {
          showToastError("Failed to load messages");
        }
      }
      console.log(11111);
    }
    const container = messageContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight - container.clientHeight;
    }
    // else {
    //   setIsMessagesLoaded(true);
    // }
  };

  // 8. Handle resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowChatInfo(false);
        if (currentChatId && showSidebar) {
          setShowSidebar(false);
        }
      } else if (window.innerWidth < 1024) {
        setShowChatInfo(false);
        setShowSidebar(true);
      } else {
        setShowSidebar(true);
        setShowChatInfo(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentChatId]);

  // 9. Toggles
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const toggleChatInfo = () => setShowChatInfo(!showChatInfo);

  // 10. Lazy loading for messages

  const loadMoreMessages = async (chatId) => {
    console.log(chatId, lastScrollChatId);

    const container = messageContainerRef.current;
    const initialScrollHeight = container.scrollHeight;
    const initialScrollTop = container.scrollTop;

    if (chatId !== lastScrollChatId) {
      setLastScrollChatId(currentChatId);
      console.log("RIGHT???");
      return;
    }

    const { cursor, hasMore } = messagePagination[chatId] || {};

    if (hasMore === false) return;

    setIsPrepending(true);

    try {
      const res = await axios.get(
        `${API_BASE_URL}/chatroom/${chatId}/messages`,
        {
          params: { cursor },
        }
      );

      const newMessages = res.data.messages.filter(
        (message) => message.chat_id === chatId
      );
      // .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      setRoomMessages((prev) => {
        const current = prev[chatId] || [];
        const combinedMessages = [...newMessages, ...current]
          .filter(
            (msg, index, self) =>
              index === self.findIndex((m) => m.id === msg.id)
          )
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        return {
          ...prev,
          [chatId]: combinedMessages,
        };
      });

      setMessagePagination((prev) => ({
        ...prev,
        [chatId]: {
          cursor: res.data.cursor,
          hasMore: res.data.hasMore,
        },
      }));

      requestAnimationFrame(() => {
        if (container) {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop =
            newScrollHeight - initialScrollHeight + initialScrollTop;
        }
      });
    } catch (err) {
      console.error("Failed to load older messages:", err);
      if (err.response?.status === 404) {
        showToastError("Chat room not found");
      } else if (err.response?.status === 403) {
        showToastError("You are not a member of this chat room");
      } else {
        showToastError("Failed to load older messages");
      }
    } finally {
      // Reset prepending state
      setIsPrepending(false);
    }
  };

  // const loadMoreMessages = async (chatId) => {
  //   if (chatId !== currentChatId) {
  //     return;
  //   }

  //   const { cursor, hasMore } = messagePagination[chatId] || {};
  //   if (hasMore === false) return;

  //   setIsPrepending(true);

  //   try {
  //     const res = await axios.get(
  //       `${API_BASE_URL}/chatroom/${chatId}/messages`,
  //       {
  //         params: { cursor },
  //       }
  //     );

  //     const newMessages = res.data.messages;

  //     // setRoomMessages((prev) => ({
  //     //   ...prev,
  //     //   [chatId]: res.data.messages.filter(
  //     //     (message) => message.chat_id === chatId
  //     //   ),
  //     // }));

  //     setRoomMessages((prev) => {
  //       const current = prev[chatId] || [];
  //       console.log("current", current);
  //       console.log("new messages", newMessages);
  //       console.log("Chat ID FJAKLFJ:", chatId);

  //       return {
  //         ...prev,
  //         [chatId]: [...newMessages, ...current],
  //       };
  //     });

  //     setMessagePagination((prev) => ({
  //       ...prev,
  //       [chatId]: {
  //         cursor: res.data.cursor,
  //         hasMore: res.data.hasMore,
  //       },
  //     }));
  //   } catch (err) {
  //     console.error("Failed to load older messages:", err);
  //   } finally {
  //     setIsPrepending(false);
  //   }
  // };

  // 11. Handle join request
  const handleJoinRequest = async (userName) => {
    console.log(
      `User ${userName} requested to join chat ${invitedChatDetails?.name}`
    );

    const requestedId = invitedChatDetails.id;

    // update in backend
    try {
      await axios.post(
        `${API_BASE_URL}/chatroom/${requestedId}/request`,
        {
          userId: userId,
        }
      );
      showToastSuccess("Join request sent successfully");
    } catch (err) {
      console.log("Error in updating joining request: ", err.message);
      showToastError("Failed to send join request");
      return;
    }

    setShowJoinRequest(false);
    setShowWaitingApproval(true);
  };

  // 12. Handle cancel join request
  const handleCancelJoinRequest = () => {
    setShowJoinRequest(false);

    if (chats.length > 0) {
      setCurrentChatId(urlChatId);
    } else {
      setCurrentChatId(null);
    }
  };

  // 13. Handle back to chats
  const handleBackToChats = () => {
    setCurrentChatId(null);
    navigate("/Chat");
  };

  // 14. Handle delete chat
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);

  const handleDeleteChat = (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    setChatToDelete(chat);
    setShowDeleteModal(true);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/chatroom/${chatToDelete.id}`, {
        data: { userId: userId }
      });
      setChats((prev) => prev.filter((chat) => chat.id !== chatToDelete.id));
      if (currentChatId === chatToDelete.id) {
        const remainingChats = chats.filter((chat) => chat.id !== chatToDelete.id);
        if (remainingChats.length > 0) {
          setCurrentChatId(remainingChats[0].id);
          navigate(`/Chat/${remainingChats[0].id}`);
        } else {
          setCurrentChatId(null);
          navigate("/Chat");
        }
      }
      setShowDeleteModal(false);
      setChatToDelete(null);
      showToastError("Chat deleted successfully"); // Note: This should probably be a success toast, but using existing function
    } catch (err) {
      console.error("Failed to delete chat:", err);
      showToastError("Failed to delete chat");
      setShowDeleteModal(false);
      setChatToDelete(null);
    }
  };

  // 14. Render main content: ChatWindow
  const renderMainContent = () => {
    if (!currentChatId || !urlChatId) {
      return <EmptyState />;
    }

    if (currentChat?.status === "pending") {
      return <WaitingApproval chatName={currentChat.name} />;
    }

    return (
      <ChatWindow
        // messages={currentChat?.messages || []}
        messages={roomMessages[currentChatId] || []}
        // isTyping={isTyping}
        currentChat={currentChat}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
        messageContainerRef={messageContainerRef}
        toggleSidebar={toggleSidebar}
        toggleChatInfo={toggleChatInfo}
        showSidebar={showSidebar}
        showChatInfo={showChatInfo}
        onLoadMoreMessages={loadMoreMessages}
        currentUserId={userId}
        onFileUpload={handleFileUpload}
        onImageUpload={handleImageUpload}
        isOnline={isOnline}
        onBack={() => {
          navigate('/');
        }}
      />
    );
  };

  if (showWaitingApproval && invitedChatDetails) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 transition-colors">
        <div className="flex flex-1 overflow-hidden">
          {showSidebar && (
            <Sidebar
              chats={filteredChats}
              originalChats={chats}
              setOriginalChats={setChats}
              currentChatId={currentChatId}
              onChatClick={handleChatClick}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              onNewChat={() => setIsNewChatModalOpen(true)}
              onBackToChats={handleBackToChats}
            />
          )}
          <WaitingApproval chatName={invitedChatDetails.name} />
        </div>
      </div>
    );
  }

  if (showJoinRequest && invitedChatDetails) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 transition-colors">
        <div className="flex flex-1 overflow-hidden">
          {showSidebar && (
            <Sidebar
              chats={filteredChats}
              originalChats={chats}
              setOriginalChats={setChats}
              currentChatId={currentChatId}
              onChatClick={handleChatClick}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              onNewChat={() => setIsNewChatModalOpen(true)}
              onBackToChats={handleBackToChats}
            />
          )}
          <RequestJoin
            chatName={invitedChatDetails.name}
            onJoinRequest={handleJoinRequest}
            onCancel={handleCancelJoinRequest}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 transition-colors">
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <Sidebar
            chats={filteredChats}
            originalChats={chats}
            setOriginalChats={setChats}
            currentChatId={currentChatId}
            onChatClick={handleChatClick}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onNewChat={() => setIsNewChatModalOpen(true)}
            onDeleteChat={handleDeleteChat}
            userId={userId}
            onBackToChats={handleBackToChats}
          />
        )}

        {renderMainContent()}

        {urlChatId &&
          showChatInfo &&
          currentChatId &&
          currentChat?.status !== "pending" && (
            <ChatInfo
              chatId={currentChatId}
              setCurrentChatId={setCurrentChatId}
              onBackToChat={() => setShowChatInfo(false)}
            />
          )}
      </div>

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onCreateChat={handleCreateChat}
      />

      {/* Delete Chat Modal */}
      {showDeleteModal && chatToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-lg">
            <div className="font-['Inter'] p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <FaTimes className="text-red-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Delete Chat</h2>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  Are you sure you want to delete <span className="font-semibold">"{chatToDelete.name}"</span>?
                </p>
                <p className="text-sm text-gray-500">
                  All messages and data will be permanently removed.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setChatToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteChat}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                >
                  Delete Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
