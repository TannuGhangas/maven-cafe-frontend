// src/components/kitchen/KitchenDashboard.jsx

import React, { useState, useEffect } from "react";
import { FaSpinner, FaUsers } from "react-icons/fa";
import OrderDetailModal from "./OrderDetailModal";

// --------------------------------------------------
// 🔥 PASTE YOUR IMAGE URL HERE
// --------------------------------------------------
const defaultItemBg = "https://thumbs.dreamstime.com/b/modern-kitchen-interior-empty-banner-mock-up-d-render-modern-kitchen-interior-empty-banner-mock-up-119316673.jpg";

const KitchenDashboard = ({ user, callApi, setPage, styles }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState("home");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const headerImageUrl = "https://as1.ftcdn.net/jpg/04/13/77/26/1000_F_413772690_OuqXfprtzHZcuzJWqhg5WWRhmrzTpxC3.jpg";

  // --------------------------------------------------
  // 🔥 DEFINE THIS SAFELY — SO NO ERRORS
  // --------------------------------------------------
  const itemImages = {
    coffee: defaultItemBg,
    tea: defaultItemBg,
    milk: defaultItemBg,
    juice: defaultItemBg,
    water: defaultItemBg,
  };

  // --------------------------------------------------
  // FETCH ORDERS SAFELY
  // --------------------------------------------------
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await callApi(
        `/orders?userId=${user.id}&userRole=${user.role}`
      );

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Kitchen fetch error:", err);
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------
  const orderSlotIs = (order, slotName) => {
    if (!order?.slot || !slotName) return false;
    return String(order.slot).toLowerCase().includes(slotName);
  };

  const activeOrders = (orders || []).filter(
    (o) => String(o?.status || "").toLowerCase() !== "delivered"
  );

  const slotOrders = (slot) => activeOrders.filter((o) => orderSlotIs(o, slot));

  const computeTotalsForSlot = (slot) => {
    const totals = {};
    const arr = slotOrders(slot);

    arr.forEach((order) => {
      (order?.items || []).forEach((it) => {
        const key = String(it?.item || it?.type || "").toLowerCase();

        if (!totals[key]) {
          totals[key] = {
            key,
            name: it?.item || it?.type || "Item",
            totalQty: 0,
          };
        }

        totals[key].totalQty += Number(it?.quantity || 0);
      });
    });

    return totals;
  };

  const computeStatusCountsForItem = (slot, itemKey) => {
    const arr = slotOrders(slot);
    const counts = { Placed: 0, Making: 0, Ready: 0 };
    const ordersPerStatus = { Placed: [], Making: [], Ready: [] };

    arr.forEach((order) => {
      const hasItem = (order?.items || []).some(
        (it) =>
          String(it?.item || it?.type || "").toLowerCase() === itemKey
      );
      if (!hasItem) return;

      const st = order?.status;
      if (counts[st] !== undefined) {
        counts[st]++;
        ordersPerStatus[st].push(order);
      }
    });

    return { counts, ordersPerStatus };
  };

  const updateOrderStatus = async (id, newStatus) => {
    await callApi(`/orders/${id}/status`, "PUT", {
      status: newStatus,
      userId: user.id,
      userRole: user.role,
    });
    fetchOrders();
    setSelectedOrder(null);
  };

  // --------------------------------------------------
  // UI BLOCKS
  // --------------------------------------------------
  const renderSlotButtons = () => (
    <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
      {["morning", "afternoon"].map((slot) => {
        const total = slotOrders(slot).reduce(
          (sum, o) =>
            sum +
            (o?.items?.reduce(
              (q, it) => q + Number(it?.quantity || 0),
              0
            ) || 0),
          0
        );

        return (
          <button
            key={slot}
            onClick={() => {
              setSelectedSlot(slot);
              setView("slot");
            }}
            style={{
              flex: 1,
              padding: 16,
              borderRadius: 12,
              border: "none",
              backgroundColor:
                selectedSlot === slot ? "#FF5F1F" : "#f0f0f0",
              color: selectedSlot === slot ? "#fff" : "#333",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {slot.toUpperCase()}
            <div style={{ fontSize: 12, marginTop: 3 }}>{total} items</div>
          </button>
        );
      })}
    </div>
  );

  const renderSlotTotals = () => {
    const totals = Object.values(computeTotalsForSlot(selectedSlot));

    if (!totals.length)
      return <div style={{ padding: 12, color: "#666" }}>No items.</div>;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
        }}
      >
        {totals.map((t) => (
          <div
            key={t.key}
            onClick={() => {
              setSelectedItem(t.key);
              setView("itemStatus");
            }}
            style={{
              padding: 18,
              borderRadius: 14,
              backgroundImage: `linear-gradient(
                rgba(0,0,0,0.55), 
                rgba(0,0,0,0.55)
              ), url('${itemImages[t.key]}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "#fff",
              boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 800 }}>
              {t.totalQty}x
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 5 }}>
              {t.name.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderItemStatus = () => {
    const { counts } = computeStatusCountsForItem(selectedSlot, selectedItem);

    return (
      <div style={{ display: "flex", gap: 12 }}>
        {["Placed", "Making", "Ready"].map((st) => (
          <div
            key={st}
            onClick={() => {
              setSelectedStatus(st);
              setView("statusOrders");
            }}
            style={{
              flex: 1,
              padding: 14,
              background: "#fff",
              borderRadius: 10,
              textAlign: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 800 }}>
              {counts[st]}
            </div>
            <div style={{ fontSize: 13 }}>{st}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderOrdersForStatus = () => {
    const { ordersPerStatus } = computeStatusCountsForItem(
      selectedSlot,
      selectedItem
    );

    const list = ordersPerStatus[selectedStatus] || [];

    if (!list.length)
      return <div style={{ padding: 12 }}>No orders.</div>;

    return list.map((order) => {
      const items = (order?.items || []).filter(
        (it) =>
          String(it?.item || it?.type || "").toLowerCase() === selectedItem
      );

      const qty = items.reduce(
        (s, it) => s + Number(it?.quantity || 0),
        0
      );

      return (
        <div
          key={order?._id}
          onClick={() => setSelectedOrder(order)}
          style={{
            background: "#fff",
            padding: 12,
            borderRadius: 10,
            marginBottom: 10,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 800 }}>
              {order?.userName || "Customer"}
            </div>
            <div style={{ fontWeight: 700 }}>{qty} pcs</div>
          </div>

          <div style={{ marginTop: 5, fontSize: 13 }}>
            {items.slice(0, 3).map((it, idx) => (
              <div key={idx}>
                <b>{it?.quantity}x</b> {it?.type || it?.item} — Sugar:{" "}
                {it?.sugarLevel ?? "N/A"}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 5, fontSize: 13, color: "#666" }}>
            Location: {items[0]?.location || "N/A"}{" "}
            {items[0]?.tableNo ? ` (Table ${items[0]?.tableNo})` : ""}
          </div>
        </div>
      );
    });
  };

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------
  if (loading)
    return (
      <div style={styles.loadingContainer}>
        <FaSpinner className="spinner" size={28} /> Loading Kitchen…
      </div>
    );

  return (
    <div style={{ ...styles.screenPadding, minHeight: "100vh" }}>
      {/* HEADER */}
      <div
        style={{
          width: "100%",
          height: 140,
          borderRadius: 12,
          backgroundImage: `url('${headerImageUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginBottom: 16,
          padding: 20,
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700 }}>
          Kitchen Dashboard
        </div>
        <div style={{ fontSize: 14 }}>Manage & track active orders</div>
      </div>

      {/* HOME */}
      {view === "home" && (
        <>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
            Select Slot
          </div>
          {renderSlotButtons()}
        </>
      )}

      {/* SLOT TOTALS */}
      {view === "slot" && (
        <>
          <button
            style={styles.secondaryButton}
            onClick={() => setView("home")}
          >
            ← Back
          </button>

          {renderSlotTotals()}
        </>
      )}

      {/* ITEM STATUS */}
      {view === "itemStatus" && (
        <>
          <button
            style={styles.secondaryButton}
            onClick={() => setView("slot")}
          >
            ← Back
          </button>

          {renderItemStatus()}
        </>
      )}

      {/* ORDERS LIST */}
      {view === "statusOrders" && (
        <>
          <button
            style={styles.secondaryButton}
            onClick={() => setView("itemStatus")}
          >
            ← Back
          </button>

          {renderOrdersForStatus()}
        </>
      )}

      {/* MODAL */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateOrderStatus}
          currentUser={user}
          styles={styles}
        />
      )}

      {/* ADMIN */}
      {String(user.role).toLowerCase() === "admin" && (
        <button
          style={{
            ...styles.adminLinkButton,
            marginTop: 20,
            backgroundColor: "#FF5F1F",
            color: "#fff",
          }}
          onClick={() => setPage("admin-users")}
        >
          <FaUsers /> Go to Admin Users
        </button>
      )}
    </div>
  );
};

export default KitchenDashboard;
