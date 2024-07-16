import React, { useEffect, useState } from 'react';

const CountDown = ({ dateAt }: { dateAt: Date }) => {
  const [partyTime, setPartyTime] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const target = new Date(dateAt).getTime(); // Convert to milliseconds

    const interval = setInterval(() => {
      const now = new Date().getTime(); // Get current time in milliseconds
      const difference = target - now;

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      setDays(d);

      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      setHours(h);

      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      setMinutes(m);

      const s = Math.floor((difference % (1000 * 60)) / 1000);
      setSeconds(s);

      if (d <= 0 && h <= 0 && m <= 0 && s <= 0) {
        setPartyTime(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [dateAt]);

  return (
    <div className="flex text-xs text-black">
      <div className="flex gap-2">
        <div className="flex gap-1">
          <span>{days}</span>
          <span>Days</span>
        </div>
        <span className="divider">:</span>
        <div className="flex gap-1">
          <span>{hours}</span>
          <span>Hours</span>
        </div>
        <span className="divider">:</span>
        <div className="flex gap-1">
          <span>{minutes}</span>
          <span>Minutes</span>
        </div>
        <span className="divider">:</span>
        <div className="flex gap-1">
          <span>{seconds}</span>
          <span>Seconds</span>
        </div>
      </div>
    </div>
  );
};

export default CountDown;
