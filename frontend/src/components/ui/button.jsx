export const Button = ({ children, onClick, disabled, className = '', isGradient = false, ...props }) => {
  const btnClass = isGradient ? 'send-btn' : 'upload-btn';
  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`${btnClass} ${className}`}
      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      {...props}
    >
      {children}
    </button>
  );
};
