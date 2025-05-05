import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div>
      <h1>About Us</h1>
      <nav>
        <Link to="team">Our Team</Link> | <Link to="careers">Careers</Link>
      </nav>
      <hr />
      {/* Render nested child routes */}
      <Outlet />
    </div>
  );
};

export default About;
