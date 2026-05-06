import { useState, useEffect, useCallback } from 'react';
import { getDailyReport } from '../services/api';
import { FiCalendar } from 'react-icons/fi';

const Reports = () => {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getDailyReport(date);
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  const maxDishCount = report?.topDishes?.[0]?.count || 1;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Daily Sales Report</h1>
        <div className="reports-date-filter">
          <FiCalendar />
          <input type="date" className="form-control reports-date-input"
            value={date} onChange={(e) => setDate(e.target.value)} max={today} />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading report...</div>
      ) : report ? (
        <>
          <div className="report-cards">
            <div className="report-card">
              <div className="report-value">{report.totalOrders}</div>
              <div className="report-label">Total Orders</div>
            </div>
            <div className="report-card">
              <div className="report-value">₹{report.totalRevenue.toLocaleString('en-IN')}</div>
              <div className="report-label">Total Revenue</div>
            </div>
            <div className="report-card">
              <div className="report-value">₹{(report.totalCGST + report.totalSGST).toFixed(2)}</div>
              <div className="report-label">Total GST</div>
            </div>
            <div className="report-card">
              <div className="report-value">₹{report.totalCGST.toFixed(2)}</div>
              <div className="report-label">CGST (2.5%)</div>
            </div>
            <div className="report-card">
              <div className="report-value">₹{report.totalSGST.toFixed(2)}</div>
              <div className="report-label">SGST (2.5%)</div>
            </div>
          </div>

          {report.topDishes.length > 0 && (
            <div className="top-dishes">
              <h3>Top Selling Dishes</h3>
              {report.topDishes.map((dish, idx) => (
                <div key={idx} className="dish-bar">
                  <span className="dish-name">{idx + 1}. {dish.name}</span>
                  <div className="dish-fill" style={{ width: `${(dish.count / maxDishCount) * 100}%` }}></div>
                  <span className="dish-count">{dish.count}</span>
                </div>
              ))}
            </div>
          )}

          {Object.keys(report.paymentBreakdown || {}).length > 0 && (
            <div className="top-dishes">
              <h3>Payment Breakdown</h3>
              <div className="payment-breakdown">
                {Object.entries(report.paymentBreakdown).map(([method, amount]) => (
                  <div key={method} className="report-card">
                    <div className="report-value">₹{amount.toLocaleString('en-IN')}</div>
                    <div className="report-label">{method.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.totalOrders === 0 && (
            <div className="loading loading-empty-state">
              <p className="empty-state-title">No billed orders for this date</p>
              <p className="empty-state-subtitle">Select a different date to view reports</p>
            </div>
          )}
        </>
      ) : (
        <div className="loading">No data available</div>
      )}
    </div>
  );
};

export default Reports;
