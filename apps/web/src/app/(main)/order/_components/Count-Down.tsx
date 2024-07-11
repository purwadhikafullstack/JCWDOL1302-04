import React, { useEffect, useState } from 'react';

const CountDown = ({ dateAt }: { dateAt: Date }) => {
  const [partyTime, setPartyTime] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const target = dateAt;

    const interval = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

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
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex text-black text-xs">
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
