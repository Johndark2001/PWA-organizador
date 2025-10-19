// src/components/ProgressBar.jsx
export default function ProgressBar({ completed = 0, total = 0 }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
      <div className="bg-blue-600 h-4" style={{ width: `${pct}%` }} />
    </div>
  );
}
