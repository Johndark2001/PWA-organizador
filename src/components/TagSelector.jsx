// src/components/TagSelector.jsx
import { useState } from "react";

export default function TagSelector({ tags = [], onChange = () => {} }) {
  const [value, setValue] = useState("");

  const add = () => {
    if (!value.trim()) return;
    const next = [...tags, value.trim()];
    onChange(next);
    setValue("");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Agregar etiqueta"
          className="p-2 border rounded flex-1"
        />
        <button type="button" onClick={add} className="px-3 py-2 bg-blue-600 text-white rounded">Agregar</button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {tags.map((t) => (
          <span key={t} className="px-2 py-1 bg-gray-200 rounded text-sm">#{t}</span>
        ))}
      </div>
    </div>
  );
}
