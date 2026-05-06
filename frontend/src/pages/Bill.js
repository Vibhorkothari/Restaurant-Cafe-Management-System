import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, updateOrderStatus } from '../services/api';
import { toast } from 'react-toastify';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

const Bill = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await getOrder(orderId);
        setOrder(data);
        if (data.paymentMethod) setPaymentMethod(data.paymentMethod);
      } catch (err) {
        toast.error('Order not found');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, navigate]);

  const handleBill = async () => {
    setProcessing(true);
    try {
      await updateOrderStatus(orderId, { status: 'billed', paymentMethod });
      toast.success('Bill completed!');
      setOrder(prev => ({ ...prev, status: 'billed', paymentMethod }));
      setTimeout(() => window.print(), 500);
    } catch (err) {
      toast.error('Failed to complete bill');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="loading">Loading bill...</div>;
  if (!order) return null;

  const isBilled = order.status === 'billed';

  return (
    <div className="bill-container fade-in">
      <div className="no-print" style={{ marginBottom: 16 }}>
        <button className="btn btn-outline" onClick={() => navigate('/orders')}>
          <FiArrowLeft /> Back to Orders
        </button>
      </div>

      <div className="bill-print">
        <div className="bill-header">
          <h1>CafeManager</h1>
          <p>Restaurant & Cafe</p>
          <p>123 Food Street, Mumbai, India</p>
          <p>GSTIN: 27XXXXX1234X1ZX</p>
        </div>

        <div className="bill-info">
          <div>
            <p><strong>Table:</strong> {order.tableNumber}</p>
            <p><strong>Waiter:</strong> {order.createdBy?.name || 'N/A'}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
            <p><strong>Time:</strong> {new Date(order.createdAt).toLocaleTimeString('en-IN')}</p>
            <p><strong>Bill #:</strong> {order._id.slice(-6).toUpperCase()}</p>
          </div>
        </div>

        <table className="bill-table">
          <thead>
            <tr>
              <th>Item</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Rate</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td className="text-right">{item.quantity}</td>
                <td className="text-right">₹{item.price.toFixed(2)}</td>
                <td className="text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bill-totals">
          <div className="row"><span>Subtotal</span><span>₹{order.subtotal?.toFixed(2)}</span></div>
          <div className="row"><span>CGST (2.5%)</span><span>₹{order.cgst?.toFixed(2)}</span></div>
          <div className="row"><span>SGST (2.5%)</span><span>₹{order.sgst?.toFixed(2)}</span></div>
          <div className="row grand-total"><span>Grand Total</span><span>₹{order.total?.toFixed(2)}</span></div>
        </div>

        {isBilled && (
          <div style={{ textAlign: 'center', margin: '16px 0', fontSize: '0.9rem' }}>
            <strong>Payment:</strong> {order.paymentMethod?.toUpperCase()}
          </div>
        )}

        <div className="bill-footer">
          <p>Thank you! Visit Again</p>
          <p style={{ fontSize: '0.75rem', marginTop: 4 }}>This is a computer-generated bill</p>
        </div>
      </div>

      {!isBilled && (
        <div className="no-print">
          <h3 style={{ textAlign: 'center', margin: '20px 0 12px' }}>Payment Method</h3>
          <div className="payment-selector">
            {['cash', 'card', 'upi'].map(method => (
              <button key={method}
                className={`payment-option ${paymentMethod === method ? 'selected' : ''}`}
                onClick={() => setPaymentMethod(method)}>
                {method.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="bill-actions">
            <button className="btn btn-primary btn-lg" onClick={handleBill} disabled={processing}>
              <FiPrinter /> {processing ? 'Processing...' : 'Complete & Print'}
            </button>
          </div>
        </div>
      )}

      {isBilled && (
        <div className="bill-actions no-print">
          <button className="btn btn-primary" onClick={() => window.print()}>
            <FiPrinter /> Print Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Bill;
