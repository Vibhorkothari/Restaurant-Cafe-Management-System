import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMenu, getTables, createOrder } from '../services/api';
import { toast } from 'react-toastify';
import { FiSearch, FiPlus, FiMinus, FiTrash2, FiShoppingCart, FiCheck } from 'react-icons/fi';

const categories = ['All', 'Starters', 'Mains', 'Drinks', 'Desserts'];
const FOOD_IMAGES = {
  'Paneer Tikka': 'https://images.unsplash.com/photo-1720323933296-5f5b59ecb9f5?auto=format&fit=crop&w=300&q=80',
  'Butter Chicken': 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?auto=format&fit=crop&w=300&q=80',
  'Dal Makhani': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80',
  'Paneer Butter Masala': 'https://images.unsplash.com/photo-1666001094459-5f0391f3de79?auto=format&fit=crop&w=300&q=80',
  'Chicken Biryani': 'https://images.unsplash.com/photo-1633945274309-2c16c9682a8b?auto=format&fit=crop&w=300&q=80',
  'Veg Biryani': 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=300&q=80',
  'Cold Coffee': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=300&q=80',
  'Mango Lassi': 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&w=300&q=80',
  'Gulab Jamun': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&q=80',
  Rasmalai: 'https://images.unsplash.com/photo-1626106861350-9200b367cf7f?auto=format&fit=crop&w=300&q=80',
};
const getFoodImage = (item) => FOOD_IMAGES[item.name] || item.image || `https://source.unsplash.com/300x300/?food,${encodeURIComponent(item.name)}`;

const NewOrder = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [table, setTable] = useState(null);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, tablesRes] = await Promise.all([getMenu(), getTables()]);
        setMenuItems(menuRes.data.filter(i => i.isAvailable));
        const found = tablesRes.data.find(t => t._id === tableId);
        setTable(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tableId]);

  const addToCart = useCallback((item) => {
    setRecentlyAdded(item._id);
    setTimeout(() => setRecentlyAdded(''), 550);
    setCart(prev => {
      const existing = prev.find(c => c.menuItem === item._id);
      if (existing) {
        return prev.map(c => c.menuItem === item._id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { menuItem: item._id, name: item.name, price: item.price, quantity: 1 }];
    });
  }, []);

  const updateQty = (menuItemId, delta) => {
    setCart(prev => prev.map(c => {
      if (c.menuItem === menuItemId) {
        const newQty = c.quantity + delta;
        return newQty > 0 ? { ...c, quantity: newQty } : c;
      }
      return c;
    }).filter(c => c.quantity > 0));
  };

  const removeFromCart = (menuItemId) => {
    setCart(prev => prev.filter(c => c.menuItem !== menuItemId));
  };

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const cgst = Math.round(subtotal * 0.025 * 100) / 100;
  const sgst = Math.round(subtotal * 0.025 * 100) / 100;
  const total = Math.round((subtotal + cgst + sgst) * 100) / 100;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return toast.error('Add items to the order');
    setSubmitting(true);
    try {
      await createOrder({ table: tableId, tableNumber: table.number, items: cart });
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = menuItems.filter((item) => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>New Order — Table {table?.number}</h1>
      </div>

      <div className="order-layout premium-order-layout">
        <aside className="order-category-sidebar card">
          <h3 className="category-title">Categories</h3>
          <div className="category-list">
            {categories.map(cat => (
              <button key={cat} className={`category-item ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}>{cat}</button>
            ))}
          </div>
        </aside>

        <div className="order-menu-section">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search menu..." value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="menu-inline-title">{activeCategory} Items</div>
          <div className="menu-list">
            {filtered.map(item => (
              <div key={item._id} className="card menu-item-card menu-card menu-item-clickable"
                onClick={() => addToCart(item)}>
                <img src={getFoodImage(item)} alt={item.name} className="menu-image" />
                <div className="menu-info">
                  <div className="item-header">
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">₹{item.price}</span>
                  </div>
                  <p className="item-desc">{item.description}</p>
                </div>
                <div className="item-footer">
                  <span className={item.isVeg ? 'veg-badge' : 'nonveg-badge'}></span>
                  <button className={`btn btn-primary btn-sm add-btn ${recentlyAdded === item._id ? 'added' : ''}`} onClick={(e) => { e.stopPropagation(); addToCart(item); }}>
                    {recentlyAdded === item._id ? <><FiCheck /> Added</> : <><FiPlus /> Add</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-cart-section cart">
          <h3 className="cart-title">
            <FiShoppingCart /> Table {table?.number} Cart
          </h3>
          {cart.length === 0 ? (
            <div className="cart-empty">
              <p>No items added yet</p>
              <p className="cart-empty-hint">Click on menu items to add them</p>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.menuItem} className="cart-item">
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">₹{item.price} each</div>
                  </div>
                  <div className="qty-controls">
                    <button onClick={() => updateQty(item.menuItem, -1)}><FiMinus size={12} /></button>
                    <span className="qty-value">{item.quantity}</span>
                    <button onClick={() => updateQty(item.menuItem, 1)}><FiPlus size={12} /></button>
                    <button onClick={() => removeFromCart(item.menuItem)} className="remove-item-btn">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              <div className="cart-summary">
                <div className="cart-summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="cart-summary-row"><span>CGST (2.5%)</span><span>₹{cgst.toFixed(2)}</span></div>
                <div className="cart-summary-row"><span>SGST (2.5%)</span><span>₹{sgst.toFixed(2)}</span></div>
                <div className="cart-summary-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
              </div>
              <button className="btn btn-success btn-lg place-order-btn"
                onClick={handlePlaceOrder} disabled={submitting}>
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
