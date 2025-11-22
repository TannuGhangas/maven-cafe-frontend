// src/components/kitchen/OrderDetailModal.jsx

import React, { useMemo, useState } from 'react';
import { FaCheckCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const OrderDetailModal = ({ order, onClose, onUpdateStatus, currentUser, styles }) => {
  const [expandedGroup, setExpandedGroup] = useState(null);

  const nextStatus = useMemo(() => {
    if (order.status === 'Placed') return 'Making';
    if (order.status === 'Making') return 'Ready';
    if (order.status === 'Ready') return 'Delivered';
    return null;
  }, [order.status]);

  // Group items inside a single order by type+item (so chef sees totals inside the order)
  const groupedItems = useMemo(() => {
    const groups = {};
    (order.items || []).forEach((item) => {
      const key = `${item.type || ''}-${item.item || ''}`;
      if (!groups[key]) {
        groups[key] = { type: item.type, item: item.item, totalQty: 0, allItems: [] };
      }
      groups[key].totalQty += (item.quantity || 0);
      groups[key].allItems.push(item);
    });
    return Object.values(groups);
  }, [order.items]);

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modalContent, width: '90%' }}>
        <h2 style={{ color: 'blue' }}>Order #{order._id && String(order._id).substring(18)}</h2>

        <p><strong>Customer:</strong> {order.userName || 'Unknown'}</p>
        <p><strong>Slot:</strong> {order.slot}</p>
        <p>
          <strong>Current Status:</strong>
          <span style={{ color: nextStatus ? 'orange' : 'green' }}> {order.status}</span>
        </p>
        <p><strong>Time Placed:</strong> {order.timestamp ? new Date(order.timestamp).toLocaleString() : 'N/A'}</p>

        <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: 8, marginTop: 12 }}>
          Items (Grouped)
        </h4>

        {groupedItems.map((group, idx) => {
          const isOpen = expandedGroup === idx;
          return (
            <div
              key={idx}
              style={{
                padding: 12,
                borderRadius: 12,
                marginBottom: 12,
                backgroundColor: '#f7f7f7',
                cursor: 'pointer'
              }}
              onClick={() => setExpandedGroup(isOpen ? null : idx)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: 16 }}>{group.totalQty}x {group.type} {group.item}</strong>
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
              </div>

              {isOpen && (
                <div style={{ marginTop: 8, padding: 8, background: '#fff', borderRadius: 8 }}>
                  {group.allItems.map((it, i) => (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <div><strong>{it.quantity}x {it.item}</strong></div>
                      <div>Location: {it.location}{it.tableNo ? ` (Table ${it.tableNo})` : ''}{it.customLocation ? ` | ${it.customLocation}` : ''}</div>
                      <div>Sugar: {it.sugarLevel ?? 'N/A'} | Notes: {it.notes || 'None'}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {nextStatus && (
          <button
            style={styles.primaryButton}
            onClick={() => onUpdateStatus(order._id, nextStatus)}
          >
            <FaCheckCircle /> Mark as {nextStatus}
          </button>
        )}

        <button
          style={styles.secondaryButton}
          onClick={() => onUpdateStatus(order._id, 'Delivered')}
        >
          Mark as Delivered (Final)
        </button>

        <button style={styles.closeButton} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default OrderDetailModal;
