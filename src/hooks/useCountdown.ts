import { useState, useEffect } from 'react';

interface CountdownResult {
  nextAlarmDate: Date | null;
  remainingSeconds: number;
}

function calculate(startTimestamp: number, intervalMs: number): CountdownResult {
  const now = Date.now();
  const elapsed = now - startTimestamp;
  const cyclesElapsed = Math.floor(elapsed / intervalMs);
  const nextAlarmMs = startTimestamp + (cyclesElapsed + 1) * intervalMs;

  return {
    nextAlarmDate: new Date(nextAlarmMs),
    remainingSeconds: Math.max(0, Math.ceil((nextAlarmMs - now) / 1000)),
  };
}

export function useCountdown(
  startTimestamp: number | undefined,
  intervalSeconds: number,
  isActive: boolean,
): CountdownResult {
  const intervalMs = intervalSeconds * 1000;

  const [result, setResult] = useState<CountdownResult>(() => {
    if (!isActive || !startTimestamp) {
      return { nextAlarmDate: null, remainingSeconds: 0 };
    }
    return calculate(startTimestamp, intervalMs);
  });

  useEffect(() => {
    if (!isActive || !startTimestamp) {
      setResult({ nextAlarmDate: null, remainingSeconds: 0 });
      return;
    }

    setResult(calculate(startTimestamp, intervalMs));

    const timer = setInterval(() => {
      setResult(calculate(startTimestamp, intervalMs));
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, startTimestamp, intervalMs]);

  return result;
}
