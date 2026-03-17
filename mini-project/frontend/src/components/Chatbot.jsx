import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Hello! I\'m your AI Football Assistant. How can I help you with player management, training, or analytics today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState(['Show Players', 'Training Tips', 'Injury Alerts', 'Analytics Help']);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = (message = input) => {
    if (message.trim() === '') return;

    const userMessage = { text: message, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Get bot response
    const botResponse = getBotResponse(message.toLowerCase());
    setTimeout(() => {
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
      setIsTyping(false);
      updateQuickReplies(message.toLowerCase());
    }, 1000 + Math.random() * 1000); // Simulate typing delay
  };

  const getBotResponse = (input) => {
    if (input.includes('player') || input.includes('show players')) {
      return 'Here are some players. Check the dashboard for details.';
    } else if (input.includes('training') || input.includes('session')) {
      return 'Training sessions are available in the dashboard.';
    } else if (input.includes('injury') || input.includes('risk') || input.includes('alert')) {
      return 'Injury alerts are shown in the dashboard.';
    } else if (input.includes('analytics') || input.includes('stats')) {
      return 'Analytics are available in the dashboard.';
    } else if (input.includes('login') || input.includes('sign in')) {
      return 'Login at /login. Use your email and password.';
    } else if (input.includes('register') || input.includes('signup')) {
      return 'Register at /signup. Provide email, name, and role.';
    } else if (input.includes('create player')) {
      return 'Go to Create Player page. Fill in all fields.';
    } else if (input.includes('dashboard')) {
      return 'Dashboard displays players, training, and analytics.';
    } else if (input.includes('help') || input.includes('what can you do')) {
      return 'I can help with login, registration, and navigation.';
    } else if (input.includes('tip') || input.includes('advice')) {
      const tips = [
        'Ensure players rest between sessions.',
        'Monitor hydration.',
        'Use data for prevention.'
      ];
      return `Tip: ${tips[Math.floor(Math.random() * tips.length)]}`;
    } else {
      return 'I\'m your football assistant. Ask about players or training.';
    }
  };

  const updateQuickReplies = (input) => {
    if (input.includes('player')) {
      setQuickReplies(['View All Players', 'Create New Player', 'Player Stats', 'Back to Main']);
    } else if (input.includes('training')) {
      setQuickReplies(['Schedule Session', 'View Sessions', 'Training Tips', 'Back to Main']);
    } else if (input.includes('injury')) {
      setQuickReplies(['Risk Alerts', 'Prevention Tips', 'Medical Help', 'Back to Main']);
    } else {
      setQuickReplies(['Show Players', 'Training Tips', 'Injury Alerts', 'Analytics Help']);
    }
  };

  const handleQuickReply = (reply) => {
    handleSend(reply);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="chat-toggle" onClick={toggleChat}>
        <span className="chat-icon">🤖</span>
        <div className="chat-badge">AI</div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>🤖 AI Football Assistant</span>
            <button onClick={toggleChat} className="close-btn">×</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && <div className="message bot typing">Typing...</div>}
          </div>
          <div className="quick-replies">
            {quickReplies.map((reply, index) => (
              <button key={index} onClick={() => handleQuickReply(reply)} className="quick-reply-btn">
                {reply}
              </button>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
            />
            <button onClick={() => handleSend()} disabled={isTyping}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;