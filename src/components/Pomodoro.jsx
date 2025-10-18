// src/components/Pomodoro.jsx
import { useEffect, useRef, useState } from "react";

/**
 * Props:
 * - workMinutes (default 25)
 * - breakMinutes (default 5)
 * - onWorkComplete(minutes) -> llamado cuando termina un ciclo de trabajo
 */
export default function Pomodoro({ workMinutes = 25, breakMinutes = 5, onWorkComplete }) {
  const [mode, setMode] = useState("work"); // 'work' | 'break' | 'idle'
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
  const intervalRef = useRef(null);

  useEffect(() => {
    // ajustar segundos al cambiar modo
    setSecondsLeft(mode === "work" ? workMinutes * 60 : breakMinutes * 60);
  }, [mode, workMinutes, breakMinutes]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => s - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  useEffect(() => {
    if (secondsLeft <= 0 && running) {
      // completar el ciclo
      if (mode === "work") {
        onWorkComplete && onWorkComplete(workMinutes); // sumar minutos enfocados
        // cambiar a break automáticamente
        setMode("break");
        setSecondsLeft(breakMinutes * 60);
        // continuar corriendo en break
      } else if (mode === "break") {
        // después del break volvemos a modo work y pausamos
        setMode("work");
        setSecondsLeft(workMinutes * 60);
        setRunning(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, running, mode]);

  const start = () => { setRunning(true); };
  const pause = () => { setRunning(false); };
  const reset = () => {
    setRunning(false);
    setMode("work");
    setSecondsLeft(workMinutes * 60);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="bg-white p-3 rounded shadow w-full max-w-sm">
      <div className="text-center">
        <div className="text-sm text-gray-500 mb-1">Modo: {mode === "work" ? "Trabajo" : "Descanso"}</div>
        <div className="text-3xl font-mono mb-2">{mm}:{ss}</div>
        <div className="flex justify-center gap-2">
          {!running ? (
            <button onClick={start} className="px-3 py-1 bg-green-600 text-white rounded">Iniciar</button>
          ) : (
            <button onClick={pause} className="px-3 py-1 bg-yellow-500 text-white rounded">Pausar</button>
          )}
          <button onClick={reset} className="px-3 py-1 bg-gray-200 rounded">Reiniciar</button>
        </div>
        <div className="text-xs text-gray-500 mt-2">Ciclo {workMinutes} / {breakMinutes} minutos</div>
      </div>
    </div>
  );
}
