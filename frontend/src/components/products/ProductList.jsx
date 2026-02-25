import React, { useState, useEffect } from 'react';
import CartTimer from '../cart/CartTimer';

const ProductList = ({ userId }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({}); // { productId: lockObject }
    const [categories, setCategories] = useState(['All', 'Groceries', 'Snacks', 'Beverages']);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    const handleAddToCart = async (product) => {
        try {
            const res = await fetch('http://localhost:8080/api/inventory/lock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    productId: product.id,
                    quantity: 1
                })
            });

            if (res.ok) {
                const lock = await res.json();
                setCart(prev => ({ ...prev, [product.id]: lock }));
                // Optimistically update stock or refetch
                fetchProducts();
            } else {
                const err = await res.json();
                alert(`Failed to add: ${err.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error(err);
            alert("Error adding to cart");
        }
    };

    const handleExpire = (productId) => {
        // Remove from cart locally and refetch to get updated stock
        setCart(prev => {
            const newCart = { ...prev };
            delete newCart[productId];
            return newCart;
        });
        alert("Item reservation expired!");
        fetchProducts();
    };

    const filteredProducts = activeCategory === 'All'
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <div className="pb-20">
            {/* Categories */}
            <div className="flex overflow-x-auto gap-4 p-4 sticky top-0 bg-white z-10 shadow-sm custom-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 gap-4 p-4">
                {filteredProducts.map(product => {
                    const inCart = cart[product.id];
                    const available = product.stockQuantity; // This should be dynamic based on locks

                    return (
                        <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                            <div className="h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                                Image
                            </div>
                            <h3 className="font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
                            <div className="text-xs text-gray-500 mb-2">{product.category}</div>

                            <div className="mt-auto flex items-center justify-between">
                                <div>
                                    <span className="text-lg font-bold">₹{product.price}</span>
                                    {available < 5 && available > 0 && (
                                        <div className="text-[10px] text-red-500 font-bold animate-pulse">
                                            Only {available} left!
                                        </div>
                                    )}
                                    {available === 0 && (
                                        <div className="text-[10px] text-gray-500 font-bold">
                                            Out of Stock
                                        </div>
                                    )}
                                </div>

                                {inCart ? (
                                    <div className="flex flex-col items-end">
                                        <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-bold mb-1">
                                            1 in Cart
                                        </div>
                                        <CartTimer expiresAt={inCart.expiresAt} onExpire={() => handleExpire(product.id)} />
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={available === 0}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${available === 0
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'bg-secondary text-white shadow-lg shadow-pink-200 active:scale-95'
                                            }`}
                                    >
                                        ADD
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center p-10 text-gray-500">
                    No products found in this category.
                </div>
            )}
        </div>
    );
};

export default ProductList;
