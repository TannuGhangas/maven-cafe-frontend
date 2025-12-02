import React from 'react';
import '../../styles/SlotSelector.css';

const SlotSelector = ({ selectedSlot, setSelectedSlot, slotOrders, setSelectedItemTypeKey, setView, setSelectedStatus, setExpandedOrderId, computeTotalsForSlot, styles }) => {
    const isMobile = window.innerWidth < 768;

    const itemImages = {
        coffee: "https://i.pinimg.com/474x/7a/29/df/7a29dfc903d98c6ba13b687ef1fa1d1a.jpg",
        tea: "https://tmdone-cdn.s3.me-south-1.amazonaws.com/store-covers/133003776906429295.jpg",

        milk: "https://www.shutterstock.com/image-photo/almond-milk-cup-glass-on-600nw-2571172141.jpg",
        water: "https://images.stockcake.com/public/d/f/f/dffca756-1b7f-4366-8b89-4ad6f9bbf88a_large/chilled-water-glass-stockcake.jpg",
        shikanji: "https://i.pinimg.com/736x/1f/fd/08/1ffd086ffef72a98f234162a312cfe39.jpg",
        jaljeera: "https://i.ndtvimg.com/i/2018-02/jaljeera_620x330_81517570928.jpg",
        soup: "https://www.inspiredtaste.net/wp-content/uploads/2018/10/Homemade-Vegetable-Soup-Recipe-2-1200.jpg",
        maggie: "https://i.pinimg.com/736x/5c/6d/9f/5c6d9fe78de73a7698948e011d6745f1.jpg",
        oats: "https://images.moneycontrol.com/static-mcnews/2024/08/20240827041559_oats.jpg?impolicy=website&width=1600&height=900",
    };

    const renderSlotButtons = () => (
        <div className="slot-buttons">
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
                        }}
                        className={`slot-button ${selectedSlot === slot ? 'selected' : ''}`}
                    >
                        {slot.toUpperCase()}
                        <div className="slot-button-item-count">{total} items</div>
                    </button>
                );
            })}
        </div>
    );

    const renderSlotTotals = () => {
        if (!selectedSlot) return null;

        const totals = Object.values(computeTotalsForSlot(selectedSlot));

        if (!totals.length)
            return <div className="no-items-message">No items for this slot.</div>;

        return (
            <div className="slot-totals">
                {totals.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => {
                            setSelectedItemTypeKey(t.key);
                            setView("itemStatus");
                            setSelectedStatus("Placed");
                            setExpandedOrderId(null);
                        }}
                        className="slot-total-card"
                    >
                        <div className="slot-total-image" style={{
                            backgroundImage: `url('${itemImages[t.itemCategory]}')`
                        }}></div>
                        <div className="slot-total-text">
                            <div className="slot-total-quantity">{t.totalQty}</div>
                            <div className="slot-total-name">
                                {t.name.toUpperCase()}
                                {t.hasNew && (
                                    <span style={{
                                        backgroundColor: '#ff6b6b',
                                        color: 'white',
                                        padding: '1px 4px',
                                        borderRadius: '6px',
                                        fontSize: '0.6rem',
                                        fontWeight: 'bold',
                                        marginLeft: '4px',
                                        verticalAlign: 'middle'
                                    }}>
                                        NEW
                                    </span>
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        );
    };

    return (
        <>
            <div className="slot-selector-title">
                Select Slot
            </div>
            {renderSlotButtons()}

            {selectedSlot && (
                <>
                    <div className="slot-selector-slot-title">
                        {selectedSlot.toUpperCase()}
                    </div>
                    {renderSlotTotals()}
                </>
            )}
        </>
    );
};
export default SlotSelector;