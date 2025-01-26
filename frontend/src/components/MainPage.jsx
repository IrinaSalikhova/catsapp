import React from 'react';
import { Outlet } from 'react-router-dom';

const MainPage = ({ message, count, setCount, toggleLoginModal }) => {
  return (
    <div>
      <h1>Frontend Connected to Backend</h1>
      <p>{message}</p>
      <div className="card">
        <button onClick={() => setCount(count + 1)}>count is {count}</button>
      </div>
      <button onClick={toggleLoginModal}>Login</button>
      {/* Render child routes */}
      <Outlet />
    </div>
  );
};

export default MainPage;