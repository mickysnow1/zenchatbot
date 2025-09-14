import React, { useState, useEffect, useRef, memo } from 'react';

// All styles are included in this component. No separate CSS file is needed.
const AppStyles = () => (
  <style>{`
    :root {
      font-family: 'Roboto', Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      font-weight: 400;
      color-scheme: light dark;
      color: rgba(255, 255, 255, 0.87);
      background-color: #242424;
      font-synthesis: none;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');

    body { margin: 0; display: flex; place-items: center; min-width: 320px; min-height: 100vh; }
    #root { max-width: 1280px; margin: 0 auto; padding: 2rem; text-align: center; }

    .zenwiz-srOnly { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }

    .zenwiz-chatbotContainer { position: fixed; bottom: 0; right: 0; left: 0; z-index: 50; overflow: hidden; }
    @media (min-width: 640px) { .zenwiz-chatbotContainer { left: auto; bottom: 1.5rem; right: 1.5rem; } }

    .zenwiz-openChatButton { 
      width: 3.5rem; height: 3.5rem; 
      background-color: #4285f4; 
      border-radius: 50%; 
      box-shadow: 0 3px 5px -1px rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12); 
      display: flex; align-items: center; justify-content: center; 
      color: white; 
      transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1); 
      animation: zenwiz-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; 
      position: absolute; bottom: 1.5rem; right: 1.5rem; 
      border: none; cursor: pointer; 
    }
    .zenwiz-openChatButton:hover { 
      background-color: #3367d6; 
      box-shadow: 0 5px 5px -3px rgba(0,0,0,0.2), 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12); 
      transform: scale(1.05); 
    }
    @media (min-width: 640px) { .zenwiz-openChatButton { position: static; } }

    @keyframes zenwiz-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

    .zenwiz-openChatIcon { width: 1.5rem; height: 1.5rem; fill: currentColor; }

    .zenwiz-chatWindow { 
      width: 100%; max-height: 80vh; 
      background-color: #ffffff; 
      border-radius: 28px 28px 0 0; 
      box-shadow: 0 8px 25px -8px rgba(0,0,0,0.25); 
      display: flex; flex-direction: column; 
      border: none; 
      color: #202124; 
      overflow: hidden; 
    }
    @media (min-width: 640px) { 
      .zenwiz-chatWindow { 
        width: 400px; height: 600px; 
        border-radius: 28px; 
        box-shadow: 0 4px 18px 0 rgba(0,0,0,0.2); 
      } 
    }

    .zenwiz-chatHeader { 
      background: linear-gradient(135deg, #4285f4 0%, #34a853 100%); 
      padding: 1rem; 
      color: white; 
      display: flex; justify-content: space-between; align-items: center; 
      flex-shrink: 0; 
      box-shadow: 0 1px 0 rgba(0,0,0,0.05); 
    }

    .zenwiz-headerInfo { display: flex; align-items: center; gap: 0.75rem; }

    .zenwiz-headerIconContainer { 
      width: 2.5rem; height: 2.5rem; 
      background-color: rgba(255, 255, 255, 0.2); 
      border-radius: 50%; 
      display: flex; align-items: center; justify-content: center; 
    }

    .zenwiz-headerIcon { width: 1.5rem; height: 1.5rem; fill: currentColor; }

    .zenwiz-headerTitle { font-weight: 500; margin: 0; font-size: 1rem; }

    .zenwiz-headerStatus { font-size: 0.75rem; color: rgba(255, 255, 255, 0.8); margin: 0; }

    .zenwiz-closeChatButton { 
      width: 2.5rem; height: 2.5rem; 
      border-radius: 50%; 
      display: flex; align-items: center; justify-content: center; 
      transition: background-color 0.2s cubic-bezier(0.4, 0.0, 0.2, 1); 
      background: none; border: none; 
      color: white; cursor: pointer; 
      position: relative; 
    }
    .zenwiz-closeChatButton::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; opacity: 0; transition: opacity 0.2s; background-color: rgba(255,255,255,0.1);
    }
    .zenwiz-closeChatButton:hover::before { opacity: 1; }
    .zenwiz-closeChatButton:hover { background-color: transparent; }

    .zenwiz-closeChatIcon { width: 1.25rem; height: 1.25rem; fill: currentColor; stroke: currentColor; stroke-width: 2; }

    .zenwiz-messagesContainer { 
      flex: 1 1 0%; 
      overflow-y: auto; 
      padding: 1.5rem; 
      display: flex; flex-direction: column; gap: 1rem; 
      background-color: #f8f9fa; 
    }

    .zenwiz-messageRow { display: flex; align-items: flex-start; gap: 0.75rem; }

    .zenwiz-userMessageRow { justify-content: flex-end; }

    .zenwiz-botIconContainer { 
      width: 2rem; height: 2rem; 
      background-color: #4285f4; 
      border-radius: 50%; 
      display: flex; align-items: center; justify-content: center; 
      flex-shrink: 0; color: white; 
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    }

    .zenwiz-botIcon { width: 1rem; height: 1rem; fill: currentColor; }

    .zenwiz-messageBubble { 
      border-radius: 20px; 
      padding: 0.75rem 1rem; 
      max-width: 80%; 
      position: relative; 
      box-shadow: 0 1px 2px rgba(0,0,0,0.1); 
    }
    .zenwiz-userMessageBubble { 
      background-color: #4285f4; 
      color: white; 
      border-bottom-right-radius: 4px; 
    }
    .zenwiz-botMessageBubble { 
      background-color: #ffffff; 
      border-bottom-left-radius: 4px; 
      color: #202124; 
    }

    .zenwiz-messageText { 
      font-size: 0.875rem; 
      word-wrap: break-word; 
      line-height: 1.4; 
    }

    .zenwiz-userMessageText { color: white; }

    .zenwiz-botMessageText { color: #202124; }

    .zenwiz-linksContainer { margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.25rem; }

    .zenwiz-messageLink { 
      color: #1a73e8; 
      font-weight: 500; 
      text-decoration: none; 
      transition: color 0.2s; 
    }
    .zenwiz-messageLink:hover { color: #1557b0; text-decoration: underline; }

    .zenwiz-typingIndicatorRow { display: flex; align-items: flex-start; gap: 0.75rem; }

    .zenwiz-typingIndicatorBubble { 
      background-color: #ffffff; 
      border-radius: 20px; 
      border-bottom-left-radius: 4px; 
      padding: 0.75rem 1rem; 
      box-shadow: 0 1px 2px rgba(0,0,0,0.1); 
    }

    .zenwiz-typingIndicatorDots { display: flex; gap: 0.25rem; align-items: center; }

    .zenwiz-dot { 
      width: 0.375rem; height: 0.375rem; 
      background-color: #9aa0a6; 
      border-radius: 50%; 
      animation: zenwiz-typing-pulse 1.4s infinite ease-in-out both; 
    }
    .zenwiz-dot:nth-child(2) { animation-delay: 0.2s; }
    .zenwiz-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes zenwiz-typing-pulse { 
      0%, 80%, 100% { transform: scale(0); opacity: 0.5; } 
      40% { transform: scale(1.0); opacity: 1; } 
    }

    .zenwiz-suggestionsContainer { 
      padding: 1rem; 
      border-top: 1px solid #dadce0; 
      display: flex; flex-direction: column; gap: 0.5rem; 
      background-color: #f8f9fa; 
    }

    .zenwiz-suggestionButton { 
      width: 100%; 
      border: 1px solid #dadce0; 
      border-radius: 8px; 
      padding: 0.75rem; 
      text-align: left; 
      font-size: 0.875rem; 
      font-weight: 400; 
      color: #202124; 
      background-color: #ffffff; 
      transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1); 
      cursor: pointer; 
      box-shadow: 0 1px 2px rgba(0,0,0,0.05); 
    }
    .zenwiz-suggestionButton:hover { 
      background-color: #f1f3f4; 
      border-color: #4285f4; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
    }

    .zenwiz-chatInputArea { 
      border-top: 1px solid #dadce0; 
      padding: 1rem; 
      display: flex; align-items: center; gap: 0.75rem; 
      background-color: #ffffff; 
    }

    .zenwiz-chatInput { 
      flex: 1 1 0%; 
      background-color: #f1f3f4; 
      border-radius: 24px; 
      padding: 0.75rem 1.25rem; 
      font-size: 0.875rem; 
      border: none; 
      color: #202124; 
      outline: none; 
    }
    .zenwiz-chatInput:focus { 
      background-color: #ffffff; 
      box-shadow: 0 0 0 2px #4285f4, 0 1px 1px rgba(0,0,0,0.05); 
    }
    .zenwiz-chatInput::placeholder { color: #9aa0a6; }

    .zenwiz-sendButton { 
      width: 2.5rem; height: 2.5rem; 
      background-color: #4285f4; 
      border-radius: 50%; 
      display: flex; align-items: center; justify-content: center; 
      transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1); 
      border: none; cursor: pointer; 
      box-shadow: 0 1px 2px rgba(0,0,0,0.1); 
    }
    .zenwiz-sendButton:hover:not(:disabled) { 
      background-color: #3367d6; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.15); 
      transform: scale(1.05); 
    }
    .zenwiz-sendButton:disabled { 
      background-color: #dadce0; 
      cursor: not-allowed; 
      transform: none; 
    }

    .zenwiz-sendIcon { width: 1.25rem; height: 1.25rem; fill: white; }

  `}</style>
);

const MemoizedMessageRow = memo(({ msg }) => {
  return (
    <div className={`zenwiz-messageRow ${msg.type === 'user' ? 'zenwiz-userMessageRow' : ''}`}>
      {msg.type === 'bot' && (
        <div className="zenwiz-botIconContainer">
          <svg xmlns="http://www.w3.org/2000/svg" className="zenwiz-botIcon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.34 9.32l-3.38-3.38c-.04-.04-.08-.06-.13-.06s-.1.02-.13-.05l-2.45 2.45c-.21.21-.55.21-.77 0l-.7-.7c-.22-.22-.22-.57 0-.78L15.23 4.5c.03-.03.05-.08.05-.13s-.02-.1-.06-.13l-3.38-3.38c-.22-.22-.58-.22-.8 0l-1.88 1.88-2.61-1.1c-.28-.12-.6-.04-.8.16L4.5 3.23c-.2.2-.28.52-.16.8l1.1 2.61-1.88 1.88c-.22.22-.22.58 0 .8l3.38 3.38c.04.04.08.06.13.06s.1-.02.13-.05l2.45-2.45c-.21-.21.55.21.77 0l.7.7c.22.22.22.57 0-.78l-2.45 2.45c-.03-.03-.05-.08-.05-.13s.02.1.06.13l3.38 3.38c.22.22.58.22.8 0l1.88-1.88 2.61 1.1c-.28-.12.6-.04.8-.16l1.28-1.28c-.2-.2.28-.52.16-.8l-1.1-2.61 1.88-1.88c-.22-.22.22-.58 0-.8zM9.5 12c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm5 5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5z" />
          </svg>
        </div>
      )}
      <div className={`zenwiz-messageBubble ${msg.type === 'user' ? 'zenwiz-userMessageBubble' : 'zenwiz-botMessageBubble'}`}>
        <div className={`zenwiz-messageText ${msg.type === 'user' ? 'zenwiz-userMessageText' : 'zenwiz-botMessageText'}`}>
          {msg.text.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < msg.text.split('\n').length - 1 && <br />}
            </span>
          ))}
          {msg.links.length > 0 && (
            <div className="zenwiz-linksContainer">
              {msg.links.map((link, i) => (
                <a key={i} href={link.url} className="zenwiz-messageLink" target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

const ZenWizChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: crypto.randomUUID(), 
      type: 'bot', 
      text: "Hi! I'm ZenWiz. Ask me about creating an account, site navigation, or general real estate questions.", 
      links: [] 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatboxRef = useRef(null);
  const timeoutRef = useRef(null);

  const responses = {
    'sign up': { text: 'You can create a new account by clicking here:', links: [{ url: '#', label: 'Create Account' }] },
    'contact': { text: 'Our support team is ready to help. You can find our contact details on our support page:', links: [{ url: '#', label: 'Contact Support' }] },
    'help': { text: 'I can help with account creation, site navigation, and general real estate questions. You can also contact our human support team.', links: [] },
    'escrow': { text: "Escrow is a legal arrangement where a third party holds money or property until specific conditions are met, protecting both buyer and seller.", links: [] },
    'default': { text: "That's a great question! I'm still learning, but you can find more information on our website or contact our support team for help.", links: [] },
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [messages, isTyping]);
  useEffect(() => { if (isOpen) inputRef.current?.focus(); }, [isOpen]);
  useEffect(() => {
    const handleClickOutside = (event) => { 
      if (chatboxRef.current && !chatboxRef.current.contains(event.target)) setIsOpen(false); 
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const sendMessage = (message = inputMessage) => {
    if (!message.trim() || isTyping) return;
    const userMessage = { id: crypto.randomUUID(), type: 'user', text: message, links: [] };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    timeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      const lowerMessage = message.toLowerCase();
      let botResponse = responses.default;
      const responseKeys = Object.keys(responses).sort((a, b) => b.length - a.length);
      for (const key of responseKeys) { 
        if (lowerMessage.includes(key)) { 
          botResponse = responses[key]; 
          break; 
        } 
      }
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), type: 'bot', text: botResponse.text, links: botResponse.links }]);
    }, 1200);
  };

  const suggestions = ['How do I sign up?', 'What is escrow?', 'Contact support'];

  return (
    <>
      <AppStyles />
      <div ref={chatboxRef} className="zenwiz-chatbotContainer">
        {!isOpen && (
          <button onClick={() => setIsOpen(true)} className="zenwiz-openChatButton" aria-label="Open chat">
            <svg xmlns="http://www.w3.org/2000/svg" className="zenwiz-openChatIcon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.34 9.32l-3.38-3.38c-.04-.04-.08-.06-.13-.06s-.1.02-.13-.05l-2.45 2.45c-.21.21-.55.21-.77 0l-.7-.7c-.22-.22-.22-.57 0-.78L15.23 4.5c.03-.03.05-.08.05-.13s-.02-.1-.06-.13l-3.38-3.38c-.22-.22-.58-.22-.8 0l-1.88 1.88-2.61-1.1c-.28-.12-.6-.04-.8.16L4.5 3.23c-.2.2-.28.52-.16.8l1.1 2.61-1.88 1.88c-.22.22-.22.58 0 .8l3.38 3.38c.04.04.08.06.13.06s.1-.02.13-.05l2.45-2.45c-.21-.21.55.21.77 0l.7.7c.22.22.22.57 0-.78l-2.45 2.45c-.03-.03-.05-.08-.05-.13s.02.1.06.13l3.38 3.38c.22.22.58.22.8 0l1.88-1.88 2.61 1.1c-.28-.12.6-.04.8-.16l1.28-1.28c-.2-.2.28-.52.16-.8l-1.1-2.61 1.88-1.88c-.22-.22.22-.58 0-.8zM9.5 12c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm5 5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5z" />
            </svg>
          </button>
        )}
        {isOpen && (
          <div className="zenwiz-chatWindow">
            <div className="zenwiz-chatHeader">
              <div className="zenwiz-headerInfo">
                <div className="zenwiz-headerIconContainer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="zenwiz-headerIcon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.34 9.32l-3.38-3.38c-.04-.04-.08-.06-.13-.06s-.1.02-.13-.05l-2.45 2.45c-.21.21-.55.21-.77 0l-.7-.7c-.22-.22-.22-.57 0-.78L15.23 4.5c.03-.03.05-.08.05-.13s-.02-.1-.06-.13l-3.38-3.38c-.22-.22-.58-.22-.8 0l-1.88 1.88-2.61-1.1c-.28-.12-.6-.04-.8.16L4.5 3.23c-.2.2-.28.52-.16.8l1.1 2.61-1.88 1.88c-.22.22-.22.58 0 .8l3.38 3.38c.04.04.08.06.13.06s.1-.02.13-.05l2.45-2.45c-.21-.21.55.21.77 0l.7.7c.22.22.22.57 0-.78l-2.45 2.45c-.03-.03-.05-.08-.05-.13s.02.1.06.13l3.38 3.38c.22.22.58.22.8 0l1.88-1.88 2.61 1.1c-.28-.12.6-.04.8-.16l1.28-1.28c-.2-.2.28-.52.16-.8l-1.1-2.61 1.88-1.88c-.22-.22.22-.58 0-.8zM9.5 12c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm5 5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="zenwiz-headerTitle">ZenWiz AI</h3>
                  <p className="zenwiz-headerStatus">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="zenwiz-closeChatButton" aria-label="Close chat">
                <svg className="zenwiz-closeChatIcon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="zenwiz-messagesContainer" role="log" aria-live="polite">
              {messages.map((msg) => (
                <MemoizedMessageRow key={msg.id} msg={msg} />
              ))}
              {isTyping && (
                <div className="zenwiz-typingIndicatorRow">
                  <div className="zenwiz-botIconContainer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="zenwiz-botIcon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.34 9.32l-3.38-3.38c-.04-.04-.08-.06-.13-.06s-.1.02-.13-.05l-2.45 2.45c-.21.21-.55.21-.77 0l-.7-.7c-.22-.22-.22-.57 0-.78L15.23 4.5c.03-.03.05-.08.05-.13s-.02-.1-.06-.13l-3.38-3.38c-.22-.22-.58-.22-.8 0l-1.88 1.88-2.61-1.1c-.28-.12-.6-.04-.8.16L4.5 3.23c-.2.2-.28.52-.16.8l1.1 2.61-1.88 1.88c-.22.22-.22.58 0 .8l3.38 3.38c.04.04.08.06.13.06s.1-.02.13-.05l2.45-2.45c-.21-.21.55.21.77 0l.7.7c.22.22.22.57 0-.78l-2.45 2.45c-.03-.03-.05-.08-.05-.13s.02.1.06.13l3.38 3.38c.22.22.58.22.8 0l1.88-1.88 2.61 1.1c-.28-.12.6-.04.8-.16l1.28-1.28c-.2-.2.28-.52.16-.8l-1.1-2.61 1.88-1.88c-.22-.22.22-.58 0-.8zM9.5 12c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm5 5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5z" />
                    </svg>
                  </div>
                  <div className="zenwiz-typingIndicatorBubble">
                    <div className="zenwiz-typingIndicatorDots" aria-label="ZenWiz is typing">
                      <div className="zenwiz-dot"></div>
                      <div className="zenwiz-dot"></div>
                      <div className="zenwiz-dot"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {messages.length <= 1 && (
              <div className="zenwiz-suggestionsContainer">
                {suggestions.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => sendMessage(s)} 
                    className="zenwiz-suggestionButton" 
                    aria-label={`Send suggestion: ${s}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="zenwiz-chatInputArea">
              <label htmlFor="chat-input" className="zenwiz-srOnly">Type your message</label>
              <input 
                id="chat-input" 
                ref={inputRef} 
                type="text" 
                value={inputMessage} 
                onChange={(e) => setInputMessage(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()} 
                placeholder="Type your message..." 
                className="zenwiz-chatInput" 
              />
              <button 
                onClick={() => sendMessage()} 
                className="zenwiz-sendButton" 
                aria-label="Send message" 
                disabled={!inputMessage.trim() || isTyping}
              >
                <svg className="zenwiz-sendIcon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      <div style={{color: '#888', marginTop: '2rem'}}>
        <h1>React Chatbot Demonstration</h1>
        <p>Click the icon to interact with the ZenWiz AI assistant.</p>
      </div>
    </>
  );
};

// The default export must be the App component
export default ZenWizChatbot;
