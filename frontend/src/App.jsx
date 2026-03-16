import React, { useState } from 'react';
import Login from './components/auth/Login';
import ProductList from './components/products/ProductList';

function App() {
  const [userId, setUserId] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  if (!userId) {
    return <Login onLogin={setUserId} />;
  }

  return (
    <div className="min-h-screen" style={{ background: '#f0f2f5' }}>
      {/* Premium Header */}
      <header className="sticky top-0 z-30 shadow-md" style={{ background: 'linear-gradient(135deg, #3C006B 0%, #6a0dad 100%)' }}>
        <div className="max-w-screen-lg mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-lg">🛒</div>
            <div>
              <div className="font-extrabold text-white text-lg leading-none tracking-tight">SmartStock</div>
              <div className="text-white/60 text-[10px] leading-none">Enterprise Edition</div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart badge */}
            {cartCount > 0 && (
              <div className="relative">
                <span className="text-white text-xl">🛍️</span>
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
              </div>
            )}
            {/* User avatar */}
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-bold">
                {userId}
              </div>
              <span className="text-white/80 text-xs hidden sm:block">User #{userId}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-screen-lg mx-auto">
        <ProductList userId={userId} onCartChange={setCartCount} />
      </main>
    </div>
  );
}

export default App;
