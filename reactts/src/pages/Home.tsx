import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import React from 'react';

const Home: React.FC = () => {
  // return <h1>Welcome to the Home Page</h1>;
    return (
    <div className="p-4">
        <ThemeSwitcher />
        <LanguageSwitcher />
      <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
    </div>
  );
};

export default Home;
