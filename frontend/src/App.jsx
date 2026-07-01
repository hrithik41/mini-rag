import { useState, useRef, useEffect } from 'react';
import { Header } from './components/layout/header';
import { MessageBubble } from './components/chat/messageBubble';
import { ChatForm } from './components/chat/chatForm';

const API_URL = "http://localhost:5001/api/documents"; 

function App() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! Please upload a PDF or TXT document to begin chatting.' }
  ]);
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDocumentReady, setIsDocumentReady] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/`, { method: 'POST', body: formData });
      const data = await response.json();
      
      if (response.ok) {
        setIsDocumentReady(true);
        setMessages(prev => [...prev, { role: 'bot', text: `Awesome! "${file.name}" is ready. What would you like to know about it?` }]);
      } else alert("Error: " + data.error);
    } catch (err) {
      alert("Failed to connect to the backend.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !isDocumentReady) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg })
      });
      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { role: 'bot', text: data.answer, citations: data.contextUsed }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: "Error: " + data.error }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Network error." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app-container">
      <Header 
        isDocumentReady={isDocumentReady} 
        isUploading={isUploading} 
        onFileUpload={handleFileUpload} 
      />

      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        {isTyping && <MessageBubble message={{ role: 'bot', text: 'Thinking...' }} />}
      </div>

      <ChatForm 
        input={input} 
        setInput={setInput} 
        onSubmit={handleSendMessage} 
        isDocumentReady={isDocumentReady} 
        isTyping={isTyping} 
      />
    </div>
  );
}

export default App;
