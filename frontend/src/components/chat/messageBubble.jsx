import ReactMarkdown from 'react-markdown';

export const MessageBubble = ({ message }) => {
  return (
    <div className={`message ${message.role}`}>
      
      <div className="message-content">
        <ReactMarkdown>{message.text}</ReactMarkdown>
      </div>

      {message.citations && message.citations.length > 0 && (
        <div className="citations">
          <strong>Sources used:</strong> {message.citations.length} chunks retrieved from database
        </div>
      )}
    </div>
  );
};
