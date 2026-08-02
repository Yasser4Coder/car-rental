export default function MaterialIcon({ name, filled = false, className = '' }) {
  return (
    <span className={`material-symbols-outlined ${filled ? 'filled' : ''} ${className}`}>
      {name}
    </span>
  );
}
