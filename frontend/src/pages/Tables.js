import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTables } from '../services/api';
import { FiUsers, FiCoffee } from 'react-icons/fi';

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const { data } = await getTables();
        setTables(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
    const interval = setInterval(fetchTables, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="loading">Loading tables...</div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Tables</h1>
        <span style={{ color: '#7f8c8d' }}>
          {tables.filter(t => t.status === 'available').length} / {tables.length} available
        </span>
      </div>
      <div className="grid grid-3">
        {tables.map((table) => (
          <div key={table._id}
            className={`card table-card ${table.status}`}
            onClick={() => navigate(`/orders/new/${table._id}`)}
          >
            <div className="table-icon"><FiCoffee size={18} /></div>
            <div className="table-number">T{table.number}</div>
            <div className="table-capacity"><FiUsers style={{ marginRight: 4 }} />{table.capacity} seats</div>
            <span className={`status-badge status-${table.status}`}>{table.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tables;
