export const Badge = ({ text, active = false }) => {
  if (!active) return null;
  return (
    <span className="status-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }}></span>
      {text}
    </span>
  );
};
