import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveOrders, updateOrderStatus } from '../services/api';
import socket from '../services/socket';
import { toast } from 'react-toastify';

const statusFlow = {
  pending: { next: 'preparing', label: 'Start Preparing', cls: 'btn-warning' },
  preparing: { next: 'ready', label: 'Mark Ready', cls: 'btn-info' },
  ready: { next: 'served', label: 'Mark Served', cls: 'btn-success' },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await getActiveOrders();
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
    return () => {
      socket.off('newOrder', fetchOrders);
      socket.off('orderUpdated', fetchOrders);
      socket.off('orderStatusChanged', fetchOrders);
    };
  }, [fetchOrders]);

  const handleStatusChange = async (e, orderId, status) => {
    e.stopPropagation();
    try {
      await updateOrderStatus(orderId, { status });
      toast.success(`Order updated to ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Active Orders</h1>
        <span style={{ color: '#7f8c8d' }}>{orders.length} active</span>
      </div>

      {orders.length === 0 ? (
        <div className="loading"><p>No active orders</p></div>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-card" onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
            <div className="order-card-header">
              <span className="order-table">Table {order.tableNumber}</span>
              <span className={`status-badge status-${order.status}`}>{order.status}</span>
            </div>
            <div className="order-card-meta">
              <span>{order.items.length} items</span>
              <span>₹{order.total?.toFixed(2)}</span>
              <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
            </div>

            {expanded === order._id && (
              <>
                <ul className="order-card-items">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="order-card-actions">
                  {statusFlow[order.status] && (
                    <button className={`btn btn-sm ${statusFlow[order.status].cls}`}
                      onClick={(e) => handleStatusChange(e, order._id, statusFlow[order.status].next)}>
                      {statusFlow[order.status].label}
                    </button>
                  )}
                  {order.status === 'served' && (
                    <button className="btn btn-sm btn-primary"
                      onClick={(e) => { e.stopPropagation(); navigate(`/bill/${order._id}`); }}>
                      Generate Bill
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
