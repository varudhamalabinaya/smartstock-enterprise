import React, { useState } from 'react';
import Login from './components/auth/Login';
import ProductList from './components/products/ProductList';

function App() {
  const [userId, setUserId] = useState(null);

  if (!userId) {
    return <Login onLogin={setUserId} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-20">
        <div className="font-bold text-xl text-primary">SmartStock</div>
        <div className="text-sm text-gray-500">User: {userId}</div>
      </div>
      <ProductList userId={userId} />
    </div>
  );
}

export default App;
