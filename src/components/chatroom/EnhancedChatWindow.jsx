import {
  AudioConfig,
  SpeechConfig,
  SpeechRecognizer,
} from "microsoft-cognitiveservices-speech-sdk";
import { useEffect, useRef, useState } from "react";
import { AvatarChat, AvatarPerson, IconButton } from "./ReusableComponents";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaBars,
  FaGlobe,
  FaImage,
  FaInfoCircle,
  FaMicrophone,
  FaPaperclip,
  FaPaperPlane,
  FaRegStopCircle,
  FaChevronDown,
  FaCheck,
  FaCheckDouble,
} from "react-icons/fa";
import { languages } from "../../constants";

const MessageBubble = ({ message, currentUserId, currentChat, isLast }) => {
  const isSent = message?.created_by === currentUserId;
  const timestamp = new Date(message?.created_at);
  const timeString = timestamp.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex mb-4 ${isSent ? "justify-end" : "justify-start"}`}
    >
      {!isSent && (
        <div className="mr-2">
          <AvatarPerson person={message?.sender} size="sm" />
        </div>
      )}
      <div className="max-w-md">
        {!isSent && (
          <div className="font-['Inter'] text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 ml-1">
            {message?.sender?.given_name}
          </div>
        )}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`font-['Inter'] rounded-2xl px-4 py-3 inline-block break-words whitespace-normal shadow-sm ${
            isSent
              ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white ml-auto"
              : "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700"
          }`}
        >
          <p className="text-[15px] leading-relaxed">{message?.content}</p>
          <div className={`flex items-center gap-1 mt-1 justify-end ${
            isSent ? "text-primary-100" : "text-neutral-500 dark:text-neutral-400"
          }`}>
            <span className="text-[11px] font-medium">{timeString}</span>
            {isSent && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {message?.read ? (
                  <FaCheckDouble className="text-xs" />
                ) : (
                  <FaCheck className="text-xs" />
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const TypingIndicator = ({ userName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-2 mb-4"
    >
      <div className="bg-white dark:bg-neutral-800 rounded-2xl px-4 py-3 shadow-sm border border-neutral-200 dark:border-neutral-700 flex items-center gap-2">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">{userName} is typing</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary-500 rounded-full"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ScrollToBottomButton = ({ onClick, isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClick}
          className="fixed bottom-24 right-8 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-large z-20 transition-colors duration-300"
        >
          <FaChevronDown className="text-xl" />
          <motion.div
            className="absolute inset-0 rounded-full bg-primary-400"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const ChatWindow = ({
  messages,
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
}) => {
  const [language, setLanguage] = useState("en");
  const speechKey = import.meta.env.VITE_TRANS_KEY;
  const speechRegion = import.meta.env.VITE_SPEECH_REGION;
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const recognizerRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [translatedMessages, setTranslatedMessages] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);

      if (scrollTop < 100 && currentChat?.id) {
        onLoadMoreMessages(currentChat.id);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentChat, onLoadMoreMessages]);

  const scrollToBottom = () => {
    messageContainerRef.current?.scrollTo({
      top: messageContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageButtonClick = () => {
    imageInputRef.current.click();
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
      if (onImageUpload) {
        onImageUpload(file);
      }
      e.target.value = "";
    }
  };

  const handleSpeechToTextStart = () => {
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
      const translated = data[0].translations[0].text;
      return translated;
    } catch (error) {
      console.error("Translation Error:", error);
    }
  };

  useEffect(() => {
    const translateIncomingMessages = async () => {
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

  return (
    <div className="xl:pt-18 lg:pt-16 md:pt-12 sm:pt-8 pt-6 mt-10 lg:mt-2 flex-1 flex flex-col bg-neutral-50 dark:bg-neutral-950 transition-colors">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between shadow-sm backdrop-blur-md"
      >
        <div className="flex items-center">
          <button
            className="md:hidden mr-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            onClick={toggleSidebar}
          >
            <FaBars />
          </button>

          <AvatarChat
            color={currentChat?.avatar_color}
            text={currentChat?.avatar_text}
          />
          <div className="ml-3">
            <h2 className="font-['Montserrat'] font-bold text-lg text-neutral-900 dark:text-neutral-100">
              {currentChat?.name}
            </h2>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success-500' : 'bg-neutral-400'} animate-pulse`} />
              <p className="font-['Inter'] text-xs text-neutral-600 dark:text-neutral-400">
                {isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-xl p-2 gap-2">
            <FaGlobe className="text-primary-600 dark:text-primary-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="font-['Inter'] bg-transparent text-sm border-none outline-none focus:ring-0 text-neutral-700 dark:text-neutral-300 cursor-pointer"
            >
              {languages.map((lang, i) => (
                <option key={i} value={lang.code}>
                  {lang.language}
                </option>
              ))}
            </select>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleChatInfo}
            className={`p-3 rounded-xl transition-all duration-300 ${
              showChatInfo 
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <FaInfoCircle />
          </motion.button>
        </div>
      </motion.div>

      <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900" ref={messageContainerRef}>
        {translatedMessages.map((message, i) => {
          const currentDate = new Date(message.created_at);
          const prevDate = i > 0 ? new Date(messages[i - 1].created_at) : null;

          const shouldShowDateSeparator =
            i === 0 ||
            currentDate.getFullYear() !== prevDate.getFullYear() ||
            currentDate.getMonth() !== prevDate.getMonth() ||
            currentDate.getDate() !== prevDate.getDate();

          return (
            <div key={i}>
              {shouldShowDateSeparator && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-['Inter'] text-xs font-semibold flex justify-center items-center mb-6 mt-2"
                >
                  <span className="bg-white dark:bg-neutral-800 px-4 py-2 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400">
                    {currentDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </motion.div>
              )}
              <MessageBubble
                message={message}
                currentUserId={currentUserId}
                currentChat={currentChat}
                isLast={i === translatedMessages.length - 1}
              />
            </div>
          );
        })}
        <AnimatePresence>
          {isTyping && <TypingIndicator userName={typingUser || "Someone"} />}
        </AnimatePresence>
      </div>

      <ScrollToBottomButton onClick={scrollToBottom} isVisible={showScrollButton} />

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={imageInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFileButtonClick}
            className="hidden sm:block p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/30 text-primary-600 dark:text-primary-400 transition-all duration-300"
          >
            <FaPaperclip className="text-lg" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleImageButtonClick}
            className="hidden sm:block p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/30 text-primary-600 dark:text-primary-400 transition-all duration-300"
          >
            <FaImage className="text-lg" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={isRecording ? handleSpeechToTextStop : handleSpeechToTextStart}
            className={`hidden sm:block p-3 rounded-xl transition-all duration-300 ${
              isRecording 
                ? 'bg-error-500 text-white animate-pulse' 
                : 'hover:bg-primary-50 dark:hover:bg-primary-900/30 text-primary-600 dark:text-primary-400'
            }`}
          >
            {isRecording ? (
              <FaRegStopCircle className="text-lg" />
            ) : (
              <FaMicrophone className="text-lg" />
            )}
          </motion.button>

          <div className="flex-1">
            <textarea
              className="font-['Inter'] w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSendMessage}
            className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
          >
            <FaPaperPlane className="text-lg" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatWindow;
