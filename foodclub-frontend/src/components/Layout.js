import React from 'react';
import Header from './Header';

function Layout({ children, title }) {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyZnUWk14oXn2AG3vFDrp_568dCdH7iDtoMA&s')`
      }}
    >
      <div className="min-h-screen bg-white/80">
        <Header title={title} />
        <div className="max-w-7xl mx-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;