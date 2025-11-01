import React, { useEffect, useRef, useState } from "react";
import {
  AudioConfig,
  SpeechConfig,
  SpeechRecognizer,
} from "microsoft-cognitiveservices-speech-sdk";
import { AvatarChat, AvatarPerson } from "./ReusableComponents";
import {
  IconButton,
  ThemeToggle,
  DateSeparator,
  TypingIndicator,
  Avatar,
  Badge,
  Tooltip,
} from "../ui/ThemeAwareComponents";
import {
  FaBars,
  FaGlobe,
  FaImage,
  FaInfoCircle,
  FaMicrophone,
  FaPaperclip,
  FaPaperPlane,
  FaRegStopCircle,
  FaSearch,
  FaEllipsisV,
  FaTrash,
  FaReply,
  FaSmile,
  FaArrowLeft,
  FaUsers,
} from "react-icons/fa";
import { languages } from "../../constants";
import MemberProfiles from "./MemberProfiles";

const MessageBubble = ({ message, currentUserId, currentChat, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const isSent = message?.created_by === currentUserId;
  const sender = message?.sender;
  
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex mb-4 animate-slide-up ${
        isSent ? "justify-end" : "justify-start"
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`flex gap-2 max-w-[70%] ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isSent && (
          <div className="flex-shrink-0">
            <Avatar 
              src={sender?.profile_picture} 
              alt={sender?.given_name}
              fallback={sender?.given_name?.charAt(0)}
              size="sm"
            />
          </div>
        )}
        
        <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'}`}>
          {!isSent && (
            <span className="font-['Inter'] text-xs text-brand-grey-600 dark:text-brand-grey-400 mb-1 px-2">
              {sender?.given_name}
            </span>
          )}
          
          <div className="relative group">
            <div
              className={`
                font-['Inter'] rounded-2xl p-3 break-words whitespace-pre-wrap
                ${isSent 
                  ? 'message-bubble-sent' 
                  : 'message-bubble-received'
                }
              `}
            >
              {message?.content}
              <div className={`font-['Inter'] text-xs mt-1 flex items-center gap-1 ${
                isSent ? 'text-brand-grey-700' : 'text-brand-grey-500 dark:text-brand-grey-400'
              }`}>
                <span>{formatTime(message?.created_at)}</span>
                {isSent && message?.read && (
                  <span className="text-success">✓✓</span>
                )}
              </div>
            </div>
            
            {showActions && (
              <div className={`absolute top-0 ${isSent ? 'right-full mr-2' : 'left-full ml-2'} flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                <Tooltip content="React">
                  <button className="btn-icon p-2 text-xs">
                    <FaSmile />
                  </button>
                </Tooltip>
                <Tooltip content="Reply">
                  <button className="btn-icon p-2 text-xs">
                    <FaReply />
                  </button>
                </Tooltip>
                {isSent && (
                  <Tooltip content="Delete">
                    <button 
                      onClick={() => onDelete?.(message.id)}
                      className="btn-icon p-2 text-xs text-error"
                    >
                      <FaTrash />
                    </button>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatHeader = ({
  currentChat,
  toggleSidebar,
  toggleChatInfo,
  showChatInfo,
  language,
  setLanguage,
  onSearch,
  onBack,
  onShowMembers,
}) => {
  const [showLangSelector, setShowLangSelector] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  return (
    <header className="px-6 py-4 border-b border-brand-grey-200 dark:border-brand-grey-light bg-brand-white dark:bg-brand-grey-medium flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Tooltip content="Back">
            <IconButton
              icon={<FaArrowLeft />}
              onClick={onBack || toggleSidebar}
              ariaLabel="Back to chats"
              className="md:hidden"
            />
          </Tooltip>

          <AvatarChat
            color={currentChat?.avatar_color}
            text={currentChat?.avatar_text}
          />
          
          <div className="flex-1 min-w-0">
            <h2 className="font-['Montserrat'] font-bold text-lg text-brand-grey-dark dark:text-brand-white truncate">
              {currentChat?.name}
            </h2>
            <div className="flex items-center gap-2">
              <p className="font-['Inter'] text-sm text-brand-grey-600 dark:text-brand-grey-400 truncate">
                {currentChat?.member_count || 0} members
              </p>
              {currentChat?.is_typing && (
                <span className="font-['Inter'] text-sm text-brand-yellow">
                  typing...
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Tooltip content="Search messages">
            <IconButton
              icon={<FaSearch />}
              onClick={onSearch}
              ariaLabel="Search messages"
            />
          </Tooltip>
          
          <div className="relative">
            <Tooltip content="Translation">
              <IconButton
                icon={<FaGlobe />}
                onClick={() => setShowLangSelector(!showLangSelector)}
                ariaLabel="Select language"
              />
            </Tooltip>
            
            {showLangSelector && (
              <div className="absolute right-0 top-full mt-2 bg-brand-white dark:bg-brand-grey-medium rounded-2xl shadow-large border border-brand-grey-200 dark:border-brand-grey-light p-2 z-50 min-w-[200px]">
                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    setShowLangSelector(false);
                  }}
                  className="w-full input-modern text-sm"
                  aria-label="Select translation language"
                >
                  {languages.map((lang, i) => (
                    <option key={i} value={lang.code}>
                      {lang.language}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <Tooltip content="View members">
            <IconButton
              icon={<FaUsers />}
              onClick={onShowMembers}
              ariaLabel="View members"
            />
          </Tooltip>
          
          <ThemeToggle />
          
          <Tooltip content={showChatInfo ? "Hide info" : "Show info"}>
            <IconButton
              icon={<FaInfoCircle />}
              onClick={toggleChatInfo}
              className={showChatInfo ? "bg-brand-yellow/20" : ""}
              ariaLabel={showChatInfo ? "Hide chat info" : "Show chat info"}
            />
          </Tooltip>
        </div>
      </div>
    </header>
  );
};

const MessageComposer = ({
  newMessage,
  setNewMessage,
  onSendMessage,
  onFileUpload,
  onImageUpload,
  isRecording,
  onRecordStart,
  onRecordStop,
}) => {
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
      e.target.value = "";
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      onImageUpload?.(file);
      e.target.value = "";
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [newMessage]);

  return (
    <div className="px-6 py-4 bg-brand-white dark:bg-brand-grey-medium border-t border-brand-grey-200 dark:border-brand-grey-light flex-shrink-0">
      <div className="flex items-end gap-3">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          aria-label="Upload file"
        />
        <input
          type="file"
          ref={imageInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
          aria-label="Upload image"
        />

        <div className="flex gap-1">
          <Tooltip content="Attach file">
            <IconButton
              icon={<FaPaperclip />}
              onClick={() => fileInputRef.current.click()}
              ariaLabel="Attach file"
            />
          </Tooltip>
          
          <Tooltip content="Attach image">
            <IconButton
              icon={<FaImage />}
              onClick={() => imageInputRef.current.click()}
              ariaLabel="Attach image"
            />
          </Tooltip>
          
          <Tooltip content={isRecording ? "Stop recording" : "Voice message"}>
            <IconButton
              icon={isRecording ? <FaRegStopCircle className="text-error" /> : <FaMicrophone />}
              onClick={isRecording ? onRecordStop : onRecordStart}
              className={isRecording ? "bg-error/10" : ""}
              ariaLabel={isRecording ? "Stop recording" : "Start voice recording"}
            />
          </Tooltip>
        </div>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            className="w-full px-4 py-3 bg-brand-grey-50 dark:bg-brand-grey-light rounded-2xl
                     border-none text-brand-grey-dark dark:text-brand-white font-['Inter']
                     placeholder:text-brand-grey-500 dark:placeholder:text-brand-grey-300
                     focus:outline-none focus:ring-2 focus:ring-brand-yellow/50
                     transition-all duration-200 resize-none max-h-32 scrollbar-custom"
            placeholder="Type a message... (Ctrl+Enter to send)"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={1}
            aria-label="Message input"
          />
        </div>

        <Tooltip content="Send message">
          <button
            onClick={onSendMessage}
            disabled={!newMessage.trim()}
            className={`p-3 rounded-full transition-all duration-200 ${
              newMessage.trim()
                ? 'bg-brand-yellow hover:bg-brand-yellow-light text-brand-grey-dark active:scale-95'
                : 'bg-brand-grey-200 dark:bg-brand-grey-600 text-brand-grey-500 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            <FaPaperPlane className="text-lg" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

const ChatWindow = ({
  messages = [],
  currentChat,
  newMessage,
  setNewMessage,
  onSendMessage,
  messageContainerRef,
  toggleSidebar,
  toggleChatInfo,
  showChatInfo,
  onFileUpload,
  onImageUpload,
  onLoadMoreMessages,
  currentUserId,
  onDeleteMessage,
  onBack,
  isOnline,
}) => {
  const [language, setLanguage] = useState("en");
  const [isRecording, setIsRecording] = useState(false);
  const [translatedMessages, setTranslatedMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showMemberProfiles, setShowMemberProfiles] = useState(false);
  
  const speechKey = import.meta.env.VITE_TRANS_KEY;
  const speechRegion = import.meta.env.VITE_SPEECH_REGION;
  const recognizerRef = useRef(null);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop < 100 && currentChat?.id) {
        onLoadMoreMessages(currentChat.id);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentChat, onLoadMoreMessages]);

  const handleSpeechToTextStart = () => {
    if (!speechKey || !speechRegion) {
      console.error("Speech configuration missing");
      return;
    }
    
    const speechConfig = SpeechConfig.fromSubscription(speechKey, speechRegion);
    const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
    speechConfig.setProperty("speechServiceConnection_Language", "auto");
    const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

    recognizerRef.current = recognizer;
    setIsRecording(true);

    recognizer.startContinuousRecognitionAsync(
      () => {},
      (err) => {
        console.error(err);
        setIsRecording(false);
      }
    );

    recognizer.recognizing = (s, e) => {
      setNewMessage(e.result.text);
    };
  };

  const handleSpeechToTextStop = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync(
        () => {
          setIsRecording(false);
        },
        (err) => {
          console.error(err);
          setIsRecording(false);
        }
      );
    }
  };

  const translateText = async (text, targetLanguage) => {
    try {
      const response = await fetch(
        `https://api.cognitive.microsofttranslator.com//translate?api-version=3.0&to=${targetLanguage}`,
        {
          method: "POST",
          headers: {
            "Ocp-Apim-Subscription-Key": import.meta.env.VITE_TRANS_KEY,
            "Ocp-Apim-Subscription-Region": import.meta.env.VITE_TRANS_REGION,
            "Content-Type": "application/json",
          },
          body: JSON.stringify([{ Text: text }]),
        }
      );
      const data = await response.json();
      return data[0].translations[0].text;
    } catch (error) {
      console.error("Translation Error:", error);
      return text;
    }
  };

  useEffect(() => {
    const translateIncomingMessages = async () => {
      if (language === "en") {
        setTranslatedMessages(messages);
        return;
      }
      
      const updatedMessages = await Promise.all(
        messages.map(async (message) => {
          if (message?.language !== language) {
            const translatedContent = await translateText(
              message?.content,
              language
            );
            return { ...message, content: translatedContent };
          }
          return message;
        })
      );
      setTranslatedMessages(updatedMessages);
    };

    translateIncomingMessages();
  }, [language, messages]);

  const groupedMessages = React.useMemo(() => {
    const groups = [];
    translatedMessages.forEach((message, i) => {
      const currentDate = new Date(message.created_at);
      const prevMessage = i > 0 ? translatedMessages[i - 1] : null;
      const prevDate = prevMessage ? new Date(prevMessage.created_at) : null;

      const shouldShowDateSeparator =
        i === 0 ||
        currentDate.getFullYear() !== prevDate.getFullYear() ||
        currentDate.getMonth() !== prevDate.getMonth() ||
        currentDate.getDate() !== prevDate.getDate();

      if (shouldShowDateSeparator) {
        groups.push({
          type: 'date',
          date: currentDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
        });
      }

      groups.push({
        type: 'message',
        data: message,
      });
    });
    return groups;
  }, [translatedMessages]);

  return (
    <div className="flex-1 flex flex-col h-full bg-brand-white dark:bg-brand-grey-dark relative">
      {!isOnline && (
        <div className="absolute top-0 left-0 right-0 bg-error text-white px-4 py-2 text-center z-50 font-['Inter'] text-sm">
          You are offline. Messages will be sent when connection is restored.
        </div>
      )}
      
      <ChatHeader
        currentChat={currentChat}
        toggleSidebar={toggleSidebar}
        toggleChatInfo={toggleChatInfo}
        showChatInfo={showChatInfo}
        language={language}
        setLanguage={setLanguage}
        onBack={onBack}
        onShowMembers={() => setShowMemberProfiles(true)}
      />

      <div 
        className="flex-1 overflow-y-auto px-6 py-4 scrollbar-custom" 
        ref={messageContainerRef}
      >
        {groupedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="font-['Montserrat'] font-semibold text-brand-grey-dark dark:text-brand-white mb-2">
              No messages yet
            </h3>
            <p className="font-['Inter'] text-sm text-brand-grey-600 dark:text-brand-grey-400">
              Start the conversation by sending a message
            </p>
          </div>
        ) : (
          <>
            {groupedMessages.map((item, index) => {
              if (item.type === 'date') {
                return <DateSeparator key={`date-${index}`} date={item.date} />;
              }
              return (
                <MessageBubble
                  key={item.data.id || index}
                  message={item.data}
                  currentUserId={currentUserId}
                  currentChat={currentChat}
                  onDelete={onDeleteMessage}
                />
              );
            })}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <TypingIndicator />
              </div>
            )}
          </>
        )}
      </div>

      <MessageComposer
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={onSendMessage}
        onFileUpload={onFileUpload}
        onImageUpload={onImageUpload}
        isRecording={isRecording}
        onRecordStart={handleSpeechToTextStart}
        onRecordStop={handleSpeechToTextStop}
      />

      <MemberProfiles
        chatId={currentChat?.id}
        currentUserId={currentUserId}
        isOpen={showMemberProfiles}
        onClose={() => setShowMemberProfiles(false)}
      />
    </div>
  );
};

export default ChatWindow;
