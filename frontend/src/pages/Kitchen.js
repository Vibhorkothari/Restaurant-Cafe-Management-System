import { useState, useEffect, useCallback } from 'react';
import { getKitchenOrders, updateOrderStatus } from '../services/api';
import socket from '../services/socket';
import { toast } from 'react-toastify';
import { FiClock } from 'react-icons/fi';

const timeAgo = (date) => {
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
};

const Kitchen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await getKitchenOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    socket.on('newOrder', fetchOrders);
    socket.on('orderUpdated', fetchOrders);
    socket.on('orderStatusChanged', fetchOrders);
    const interval = setInterval(fetchOrders, 30000);
    return () => {
      socket.off('newOrder', fetchOrders);
      socket.off('orderUpdated', fetchOrders);
      socket.off('orderStatusChanged', fetchOrders);
      clearInterval(interval);
    };
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="loading">Loading kitchen orders...</div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Kitchen Display</h1>
        <span style={{ color: '#7f8c8d' }}>{orders.length} active orders</span>
      </div>

      {orders.length === 0 ? (
        <div className="loading" style={{ flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: '1.2rem' }}>No pending orders</p>
          <p style={{ fontSize: '0.9rem' }}>New orders will appear here in real-time</p>
        </div>
      ) : (
        <div className="kitchen-grid">
          {orders.map(order => (
            <div key={order._id} className={`kitchen-card ${order.status}`}>
              <div className="kitchen-header">
                <span className="kitchen-table">Table {order.tableNumber}</span>
                <div style={{ textAlign: 'right' }}>
                  <span className={`status-badge status-${order.status}`}>{order.status}</span>
                  <div className="kitchen-time"><FiClock size={12} /> {timeAgo(order.createdAt)}</div>
                </div>
              </div>
              <ul className="kitchen-items">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    <span>{item.name}</span>
                    <span className="qty">×{item.quantity}</span>
                  </li>
                ))}
              </ul>
              <div style={{ textAlign: 'center' }}>
                {order.status === 'pending' && (
                  <button className="btn btn-warning" onClick={() => handleStatusChange(order._id, 'preparing')}>
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button className="btn btn-success" onClick={() => handleStatusChange(order._id, 'ready')}>
                    Mark Ready
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Kitchen;
