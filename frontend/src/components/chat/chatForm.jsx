import { SendIcon } from '../icons/icons';
import { Button } from '../ui/button';

export const ChatForm = ({ input, setInput, onSubmit, isDocumentReady, isTyping }) => {
  return (
    <form className="input-area" onSubmit={onSubmit}>
      <input
        type="text"
        className="chat-input"
        placeholder={isDocumentReady ? "Ask a question about your document..." : "Please upload a document first!"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={!isDocumentReady || isTyping}
      />
      <Button 
        type="submit" 
        isGradient={true}
        disabled={!isDocumentReady || isTyping || !input.trim()}
      >
        Send <SendIcon />
      </Button>
    </form>
  );
};
