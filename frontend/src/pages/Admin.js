import { useState, useEffect } from 'react';
import { getMenu, createMenuItem, updateMenuItem, deleteMenuItem } from '../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';

const emptyForm = { name: '', category: 'Starters', price: '', description: '', isVeg: true, isAvailable: true };

const Admin = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filterCat, setFilterCat] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const { data } = await getMenu();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };
    try {
      if (editingId) {
        await updateMenuItem(editingId, payload);
        toast.success('Item updated');
      } else {
        await createMenuItem(payload);
        toast.success('Item created');
      }
      setForm(emptyForm);
      setShowForm(false);
      setEditingId(null);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, category: item.category, price: item.price, description: item.description, isVeg: item.isVeg, isAvailable: item.isAvailable });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteMenuItem(id);
      toast.success('Item deleted');
      fetchItems();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const cancelForm = () => {
    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
  };

  const filtered = filterCat === 'All' ? items : items.filter(i => i.category === filterCat);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Admin Panel — Menu Management</h1>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}>
          <FiPlus /> Add New Item
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3 className="admin-form-title">{editingId ? 'Edit Item' : 'Add New Item'}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" className="form-control" value={form.category} onChange={handleChange}>
                <option>Starters</option><option>Mains</option><option>Drinks</option><option>Desserts</option>
              </select>
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input name="price" type="number" className="form-control" value={form.price} onChange={handleChange} required min="0" />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <input name="description" className="form-control" value={form.description} onChange={handleChange} />
          </div>
          <div className="form-row admin-form-actions-row">
            <div className="form-group">
              <div className="checkbox-group">
                <input type="checkbox" name="isVeg" checked={form.isVeg} onChange={handleChange} />
                <label className="inline-label">Vegetarian</label>
              </div>
            </div>
            <div className="form-group">
              <div className="checkbox-group">
                <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} />
                <label className="inline-label">Available</label>
              </div>
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="btn btn-success"><FiCheck /> {editingId ? 'Update' : 'Create'}</button>
              <button type="button" className="btn btn-outline" onClick={cancelForm}><FiX /> Cancel</button>
            </div>
          </div>
        </form>
      )}

      <div className="admin-filter-wrap">
        <select className="form-control admin-filter-select" value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}>
          <option value="All">All Categories</option>
          <option>Starters</option><option>Mains</option><option>Drinks</option><option>Desserts</option>
        </select>
      </div>

      <div className="admin-card-list">
        {filtered.map(item => (
          <div key={item._id} className="admin-item-card">
            <div className="admin-item-main">
              <strong>{item.name}</strong>
              <span className="item-description-inline">{item.description}</span>
            </div>
            <div className="admin-item-meta">
              <span>{item.category}</span>
              <span className="price-cell">₹{item.price}</span>
              <span className={item.isVeg ? 'veg-badge' : 'nonveg-badge'}></span>
              <span className={`status-badge ${item.isAvailable ? 'status-available' : 'status-reserved'}`}>
                {item.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <div className="table-actions">
              <button className="btn btn-sm btn-outline" onClick={() => handleEdit(item)}><FiEdit2 /></button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
