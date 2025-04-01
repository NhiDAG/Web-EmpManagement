import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/chat.css";
import gemini from "../assets/icons/google-gemini-icon.svg";
import { Send, Sparkles, User, Bot, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Gemini AI. How can I help you today?",
      sender: "ai",
    },
  ]);
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutsRef = useRef([]);

  const sendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const newUserMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await fetch(
        "https://localhost:7028/api/gemini/chat-gemini",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: inputMessage }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch response from AI.");
      }

      const aiReply = await response.text();
      displayTypingEffect(aiReply);
    } catch (error) {
      console.error("Error:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          text: "Error fetching response.",
          sender: "ai",
        },
      ]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const logOut = async () => {
    try {
      const response = await fetch("https://localhost:7028/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Logout successful");
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const displayTypingEffect = (fullText) => {
    typingTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    typingTimeoutsRef.current = [];

    const typingSpeed = 20;
    let currentText = "";
    setMessages((prevMessages) => {
      const newAIMessage = {
        id: prevMessages.length + 1,
        text: "",
        sender: "ai",
      };
      return [...prevMessages, newAIMessage];
    });

    for (let i = 0; i < fullText.length; i++) {
      const timeout = setTimeout(() => {
        currentText = fullText.slice(0, i + 1);
        setMessages((prevMessages) => {
          return prevMessages.map((msg, index) =>
            index === prevMessages.length - 1
              ? { ...msg, text: currentText }
              : msg
          );
        });

        if (i === fullText.length - 1) {
          setIsTyping(false);
        }
      }, i * typingSpeed);

      typingTimeoutsRef.current.push(timeout);
    }
  };

  useEffect(() => {
    return () => {
      typingTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="gemini-chat-container">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="gemini-chat-header"
      >
        <div className="gemini-logo-container">
          <div className="gemini-logo-gradient">
            <Sparkles className="gemini-logo-icon" size={24} />
          </div>
          <h1 className="gemini-logo-text">Gemini</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logOut}
          className="gemini-logout-button"
        >
          <LogOut size={20} />
        </motion.button>
      </motion.header>

      <div className="gemini-messages-container">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`gemini-message-wrapper ${
                msg.sender === "user" ? "user-message" : "ai-message"
              }`}
            >
              <div
                className={`gemini-message ${
                  msg.sender === "user" ? "user-bubble" : "ai-bubble"
                }`}
              >
                <div className="gemini-message-content">
                  {msg.sender === "ai" ? (
                    <div className="gemini-ai-icon">
                      <img
                        src={gemini}
                        alt="Gemini AI"
                        style={{
                          width: "20px",
                          height: "20px",
                          minWidth: "20px",
                          flexShrink: 0,
                        }}
                      />
                    </div>
                  ) : (
                    <User
                      className="text-gray-600"
                      size={20}
                      style={{ minWidth: "20px", flexShrink: 0 }}
                    />
                  )}
                  <p className="message-text">
                    {msg.text.split("\n").map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        {index < msg.text.split("\n").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="typing-indicator">
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="dot"
              style={{ fontSize: "24px" }}
            >
              .
            </motion.span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
              className="dot"
              style={{ fontSize: "24px" }}
            >
              .
            </motion.span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
              className="dot"
              style={{ fontSize: "24px" }}
            >
              .
            </motion.span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="gemini-input-container"
      >
        <div className="gemini-input-wrapper">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message"
            className="gemini-input"
          />
          <motion.button
            whileHover={{ scale: inputMessage.trim() && !isTyping ? 1.05 : 1 }}
            whileTap={{ scale: inputMessage.trim() && !isTyping ? 0.95 : 1 }}
            onClick={sendMessage}
            className="gemini-send-button"
            disabled={!inputMessage.trim() || isTyping} 
            style={{
              opacity: !inputMessage.trim() || isTyping ? 0.5 : 1, 
              cursor:
                !inputMessage.trim() || isTyping ? "not-allowed" : "pointer",
            }}
          >
            <Send size={24} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default ChatPage;
