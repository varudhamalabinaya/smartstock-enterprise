import React, { useState, useEffect } from 'react';
import CartTimer from '../cart/CartTimer';

// ─── Complete Product Image Map ──────────────────────────────────────────────
const PRODUCT_IMAGES = {
    // Groceries
    'Farm Fresh Milk 500ml':     '/image2.jpg',
    'Whole Wheat Bread':         '/bread.jpg',
    'Amul Butter 100g':          '/butter.jpg',
    'Tata Salt 1kg':             'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/1c70221b-4440-4d55-87e7-46fcce72fefd/Tata-Salt-Free-Flowing-and-Iodized-Namak-Vacuum-Evaporated-Salt-in-Fresh.jpeg',
    'Aashirvaad Atta 5kg':       'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/7e9cf9dc-814f-4dd2-a032-c0759053ae32/Aashirvaad-Select-Atta-Made-from-100-MP-Sharbati-Wheat-for-Softer-Rotis.jpeg',
    // Snacks
    'Lays Classic Salted 26g':   'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/15e1bd77-b474-4f36-a362-8f32842fedcb/Lay-s-Classic-Salted-Potato-Chips-Crispy-Salty.jpeg',
    'Dark Fantasy Choco Fills':   'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1500-1500,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/4f90eca9-f026-4eef-ae75-4c374efc05fd/Sunfeast-Dark-Fantasy-Choco-Fills-Original-Filled-Cookies-with-Choco-Creme.jpeg',
    'Oreo Chocolate Cream':       'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1100-1100,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/8b19b84c-b9bb-4dd2-964f-90871e7ca7ab/Cadbury-Oreo-Chocolate-Flavour-Creme-Sandwich-Biscuit-Family-Pack.jpeg',
    'Haldiram Bhujia 200g':       'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1600-1600,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/589adcdf-596c-43c6-bd32-040fd0ae6cb9/Let-s-try-Garlic-Bhujia-Savory-Snack.jpeg',
    'Kurkure Masala Munch':       'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-2000-2000,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/98119041-423b-4301-be46-66386cbd9e66/Kurkure-Masala-Munch-Crunchy-Snack.jpeg',
    // Beverages
    'Coca Cola 750ml':            'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/5e4695df-05d0-4bc7-a3ff-4557b0fdd61b/Coca-Cola-Diet-Coke-Soft-Drink-Can-Low-Calorie-Fizzy.jpeg',
    'Nescafe Instant Coffee':     'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1000-1000,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/f0f4ceb3-deb4-452b-8021-71e8f09ed871/Nescafe-Classic-Instant-Coffee-Powder-100-Pure-Coffee.jpeg',
    'Tropicana Orange Juice 1L':  'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/6fd7bd67-c9de-4055-95d8-27d1643a15b3/Dabur-Real-Fruit-Power-Orange-Fruit-Juice.jpeg',
    'Red Bull Energy Drink 250ml':'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/030fe1cd-fff1-44aa-b812-42580a6a9b30/Red-Bull-Energy-Drink-Ready-to-Drink-Beverage.jpg',
    'Bisleri Water 1L':           'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-2500-2500,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/ff3743d9-aedf-49a7-b0ed-5713e283e18b/Bisleri-Packaged-Drinking-Water-Bottle.jpg',
    // Personal Care
    'Dove Soap 100g':             'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1000-1000,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/65e04761-ed54-43a8-baeb-f468fd096366/Dove-Serum-Bar-with-Nutrient-Serum.jpeg',
    'Colgate Toothpaste 200g':    'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1080-1080,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/b8c7ab9a-d1e3-4499-840f-7679ee10bb17/Colgate-Strong-Teeth-Anticavity-Toothpaste.jpeg',
    'Head and Shoulders Shampoo': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-2400-2400,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/8c7f38c8-9948-4e20-aa05-f3061c57cc22/Head-Shoulders-Anti-Dandruff-Smooth-Silky-Shampoo.jpeg',
    'Dettol Hand Wash 250ml':     'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/17f6a51a-aac2-48b7-9820-71dd69e00996/Dettol-Skincare-Hand-Wash-Refill-Moisturizing-Handwash-pH-Balance-Gentle-on-Skin.jpeg',
    'Nivea Moisturizer 75ml':     'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1000-1000,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/f9d8af8a-333f-4cbd-b720-e67cf6656f55/NIVEA-Nourishing-Body-Lotion-Body-Milk-48-H-Moisturization-2X-Almond-Oil-For-Very-Dry-Skin.jpeg',
    // Fruits & Vegetables
    'Banana Robusta 6pcs':        'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-3000-3000,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/0f94f079-b7ec-4e97-a4f7-85a4f4d5625c/Banana-Elaichi-Yelakki.jpeg',
    'Tomato Local 500g':          'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1024-1024,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/dd677117-fffc-4595-87b3-b2ee62d0e465/Tomato-Local.png',
    'Onion 1kg':                  'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1024-1024,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/1e55d6e9-6958-40d3-ac15-1b63fc49e248/Onion.jpeg',
    'Potato 1kg':                 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1024-1024,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/c4286d3c-8773-4dce-8b47-341a5d394978/Potato.png',
    'Apple Shimla 4pcs':          'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-2000-2000,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/2d5e21d5-fbfa-463b-9749-a327460aa20a/Baby-Apple-Shimla.jpeg',
    'Mango Alphonso 500g':        'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-3000-3000,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/2e4f9c1a-6b0d-45da-aaaf-36c331a688c3/Mango-Raw.jpeg',
    'Spinach 250g':               'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-858-858,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/615032c7-9dcb-47b8-9947-35a42f8b9270/Organically-Grown-Spinach.jpeg',
    'Carrot 500g':                'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-768-768,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/3efbcc36-c254-4fa8-8eb5-e34ad58cb8f7/Carrot-Local.png',
    'Lemon 6pcs':                 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1024-1024,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/6b105f5e-c398-4f79-b630-816f403cf675/Lemon.jpeg',
    'Watermelon 1pc':             'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-3000-3000,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/16304024-e632-4b29-abb0-0320997422ce/Watermelon-Kiran-Tarbooj-.jpeg',
    'Strawberry (Mahabaleshwar)': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-3000-3000,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/1830bff1-92d3-4b13-bb3d-19b849c6b669/Strawberry-Mahabaleshwar-.jpg',
};

const CATEGORY_FALLBACK = {
    'Groceries':           { emoji: '🥛', bg: 'linear-gradient(135deg, #d4edda, #c3e6cb)' },
    'Snacks':              { emoji: '🍿', bg: 'linear-gradient(135deg, #fff3cd, #ffeaa7)' },
    'Beverages':           { emoji: '🥤', bg: 'linear-gradient(135deg, #cce5ff, #b8daff)' },
    'Personal Care':       { emoji: '🧴', bg: 'linear-gradient(135deg, #f3e5f5, #e1bee7)' },
    'Fruits & Vegetables': { emoji: '🥦', bg: 'linear-gradient(135deg, #d4edda, #c3e6cb)' },
    'default':             { emoji: '🛒', bg: 'linear-gradient(135deg, #ede7f6, #d1c4e9)' },
};

// ─── Category pill config ────────────────────────────────────────────────────
const CATEGORY_META = {
    'All':                 { emoji: '⚡', label: 'All' },
    'Groceries':           { emoji: '🛒', label: 'Groceries' },
    'Snacks':              { emoji: '🍟', label: 'Snacks' },
    'Beverages':           { emoji: '🥤', label: 'Beverages' },
    'Personal Care':       { emoji: '🧴', label: 'Care' },
    'Fruits & Vegetables': { emoji: '🥦', label: 'Fruits & Veg' },
};

// ─── Component ───────────────────────────────────────────────────────────────
const ProductList = ({ userId, onCartChange }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [categories, setCategories] = useState(['All', 'Groceries', 'Snacks', 'Beverages', 'Personal Care', 'Fruits & Vegetables']);
    const [activeCategory, setActiveCategory] = useState('All');
    const [search, setSearch] = useState('');

    useEffect(() => { fetchProducts(); }, []);

    useEffect(() => {
        if (onCartChange) onCartChange(Object.keys(cart).length);
    }, [cart]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (res.ok) setProducts(await res.json());
        } catch (err) { console.error('Failed to fetch products', err); }
    };

    const handleAddToCart = async (product) => {
        try {
            const res = await fetch('/api/inventory/lock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, productId: product.id, quantity: 1 })
            });
            if (res.ok) {
                const lock = await res.json();
                setCart(prev => ({ ...prev, [product.id]: lock }));
                fetchProducts();
            } else {
                const err = await res.json();
                alert(`Failed to add: ${err.message || 'Unknown error'}`);
            }
        } catch { alert('Error adding to cart'); }
    };

    const handleExpire = (productId) => {
        setCart(prev => { const n = { ...prev }; delete n[productId]; return n; });
        alert('Item reservation expired!');
        fetchProducts();
    };

    const filteredProducts = products
        .filter(p => activeCategory === 'All' || p.category === activeCategory)
        .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={{ paddingBottom: '5rem' }}>

            {/* ── Search bar ── */}
            <div style={{ padding: '1rem 1rem 0.5rem', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
                    <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.6rem', paddingBottom: '0.6rem', border: '2px solid #f0f0f0', borderRadius: '999px', fontSize: '0.9rem', background: '#f9f9fb', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                        onFocus={e => e.target.style.borderColor = '#3C006B'}
                        onBlur={e => e.target.style.borderColor = '#f0f0f0'}
                    />
                </div>
            </div>

            {/* ── Category pills ── */}
            <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1rem', overflowX: 'auto', background: '#fff', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: '56px', zIndex: 20 }}>
                {categories.map(cat => {
                    const meta = CATEGORY_META[cat] || { emoji: '📦', label: cat };
                    const isActive = activeCategory === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.35rem',
                                whiteSpace: 'nowrap', padding: '0.45rem 1rem',
                                borderRadius: '999px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                                background: isActive ? 'linear-gradient(135deg, #3C006B, #6a0dad)' : '#f3f4f6',
                                color: isActive ? '#fff' : '#4b5563',
                                boxShadow: isActive ? '0 3px 10px rgba(60,0,107,0.25)' : 'none',
                                transition: 'all 0.2s',
                                transform: isActive ? 'scale(1.03)' : 'scale(1)',
                            }}
                        >
                            <span>{meta.emoji}</span>
                            <span>{meta.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* ── Stats bar ── */}
            <div style={{ padding: '0.6rem 1rem', background: '#fafafa', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 }}>
                    {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''} found
                </span>
                {Object.keys(cart).length > 0 && (
                    <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#b45309', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>
                        🛒 {Object.keys(cart).length} in cart
                    </span>
                )}
            </div>

            {/* ── 3-column product grid ── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                padding: '0.75rem',
            }}>
                {filteredProducts.map(product => {
                    const inCart = cart[product.id];
                    const available = product.stockQuantity;
                    const imgSrc = PRODUCT_IMAGES[product.name] || null;
                    const fallback = CATEGORY_FALLBACK[product.category] || CATEGORY_FALLBACK['default'];
                    const outOfStock = available === 0;

                    return (
                        <div key={product.id} style={{
                            background: '#fff',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                            border: inCart ? '2px solid #10b981' : '2px solid transparent',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.15s, box-shadow 0.15s',
                            opacity: outOfStock ? 0.7 : 1,
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)'; }}
                        >
                            {/* Product image */}
                            <div style={{ position: 'relative', height: '110px', overflow: 'hidden' }}>
                                {imgSrc ? (
                                    <img src={imgSrc} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', background: fallback.bg }}>
                                        {fallback.emoji}
                                    </div>
                                )}
                                {/* Out of stock overlay */}
                                {outOfStock && (
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.65rem', background: 'rgba(0,0,0,0.6)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>OUT OF STOCK</span>
                                    </div>
                                )}
                                {/* Low stock badge */}
                                {!outOfStock && available < 5 && (
                                    <div style={{ position: 'absolute', top: '6px', left: '6px', background: '#ef4444', color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                                        Only {available} left!
                                    </div>
                                )}
                            </div>

                            {/* Card body */}
                            <div style={{ padding: '0.6rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginBottom: '0.2rem', fontWeight: 500 }}>{product.category}</div>
                                <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1f2937', margin: '0 0 0.5rem', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {product.name}
                                </h3>

                                {/* Price + Add button */}
                                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#3C006B' }}>₹{product.price}</span>

                                    {inCart ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                            <span style={{ fontSize: '0.65rem', background: '#d1fae5', color: '#065f46', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>✓ Added</span>
                                            <CartTimer expiresAt={inCart.expiresAt} onExpire={() => handleExpire(product.id)} />
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => !outOfStock && handleAddToCart(product)}
                                            disabled={outOfStock}
                                            style={{
                                                padding: '0.35rem 0.75rem',
                                                borderRadius: '8px',
                                                border: 'none',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                cursor: outOfStock ? 'not-allowed' : 'pointer',
                                                background: outOfStock ? '#e5e7eb' : 'linear-gradient(135deg, #FF3269, #e0195a)',
                                                color: outOfStock ? '#9ca3af' : '#fff',
                                                boxShadow: outOfStock ? 'none' : '0 3px 10px rgba(255,50,105,0.3)',
                                                transition: 'transform 0.15s',
                                            }}
                                            onMouseEnter={e => { if (!outOfStock) e.target.style.transform = 'scale(1.05)'; }}
                                            onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
                                        >
                                            ADD
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredProducts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#9ca3af' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                    <div style={{ fontWeight: 600 }}>No products found</div>
                    <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Try a different search or category</div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
