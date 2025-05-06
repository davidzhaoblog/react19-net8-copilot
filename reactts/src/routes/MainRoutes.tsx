import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Team from '@/pages/Team';
import Careers from '@/pages/Careers';
import Contact from '@/pages/Contact';
import Login from '@/pages/Identity/Login';
import ErrorLogList from '@/pages/errorLogs/ErrorLogList';

const MainRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Parent Route */}
            <Route path="/" element={<MainLayout />}>
                {/* Child Routes */}
                <Route index element={<Home />} />
                <Route path="about" element={<About />}>
                    {/* Nested Child Routes */}
                    <Route path="team" element={<Team />} />
                    <Route path="careers" element={<Careers />} />
                </Route>
                <Route path="contact" element={<Contact />} />
                <Route path="errorlog" element={<ErrorLogList />}>
                </Route>
            </Route>
            <Route path="login" element={<Login />} />
        </Routes>
    );
};
export default MainRoutes;