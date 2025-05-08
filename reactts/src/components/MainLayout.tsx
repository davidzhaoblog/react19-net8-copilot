import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <div>
      <nav>
      <Link to="errorlog">ErrorLog</Link> | <Link to="/">Home</Link> | <Link to="/about">About</Link> | <Link to="/contact">Contact</Link>
      </nav>
      <hr />
      {/* Render child routes */}
      <Outlet />
    </div>
  );
};

export default MainLayout;
