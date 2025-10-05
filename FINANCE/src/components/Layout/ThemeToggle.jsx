import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  useEffect(() => {
    if (dark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);
  return (
    <button className="toggle-theme" onClick={() => setDark(d => !d)} aria-label="Toggle dark mode">
      {dark ? <i className="bi bi-moon-fill"></i> : <i className="bi bi-sun-fill"></i>}
    </button>
  );
};

export default ThemeToggle;
