import { useState, useEffect } from 'react';
import { getMenu } from '../services/api';
import { FiSearch } from 'react-icons/fi';

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

const Menu = () => {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await getMenu();
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filtered = items.filter((item) => {
    const matchCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) return <div className="loading">Loading menu...</div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Digital Menu</h1>
        <span style={{ color: '#7f8c8d' }}>{filtered.length} items</span>
      </div>

      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search dishes..." value={search}
          onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="menu-tabs">
        {categories.map((cat) => (
          <button key={cat}
            className={`menu-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-3">
        {filtered.map((item) => (
          <div key={item._id} className={`card menu-item-card menu-card ${!item.isAvailable ? 'unavailable' : ''}`}>
            <img src={getFoodImage(item)} alt={item.name} className="menu-image" />
            <div className="menu-info">
              <div className="item-header">
                <span className="item-name menu-title">{item.name}</span>
                <span className="item-price menu-price">₹{item.price}</span>
              </div>
              <p className="item-desc">{item.description}</p>
              <div className="item-footer">
                <span className={item.isVeg ? 'veg-badge' : 'nonveg-badge'}></span>
                <span className="menu-category">{item.category}</span>
                <span className={`status-badge ${item.isAvailable ? 'status-available' : 'status-reserved'}`}>
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
