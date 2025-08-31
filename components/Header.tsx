import React from 'react';
import FilmIcon from './icons/FilmIcon';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center space-x-3">
        <FilmIcon className="w-8 h-8 text-indigo-400" />
        <h1 className="text-3xl font-bold text-white tracking-tight">
          VEO-2 Video Generator
        </h1>
      </div>
      <p className="text-gray-400 mt-2">
        Prompt generator ini saya buat untuk membantu teman teman member bisa membuat video Potrait
      </p>
    </header>
  );
};

export default Header;