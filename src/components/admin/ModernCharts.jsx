import React from 'react';
import { FaChartLine, FaChartBar, FaChartArea } from 'react-icons/fa';

// Modern SVG Line Chart Component
export const ModernLineChart = ({ data, title, color = '#103c7f', height = 200 }) => {
    const padding = 30;
    const chartHeight = height - padding * 2;
    const chartWidth = Math.max(200, height * 1.5); // Responsive width based on height
    
    if (!data || data.length === 0) {
        return (
            <div className="chart-card">
                <h4>{title}</h4>
                <div style={{
                    height: height - 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                    fontStyle: 'italic',
                    fontSize: '0.9rem'
                }}>
                    No data available
                </div>
            </div>
        );
    }

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const valueRange = maxValue - minValue || 1;
    
    const points = data.map((d, i) => {
        const x = padding + (i / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((d.value - minValue) / valueRange) * chartHeight;
        return `${x},${y}`;
    }).join(' ');

    const areaPoints = `${padding},${padding + chartHeight} ${points} ${padding + chartWidth},${padding + chartHeight}`;

    return (
        <div className="chart-card">
            <h4>
                <FaChartLine style={{ marginRight: '8px', color }} />
                {title}
            </h4>
            <svg width={chartWidth + padding * 2} height={height} style={{ margin: '0 auto', display: 'block' }}>
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                    <line
                        key={i}
                        x1={padding}
                        y1={padding + chartHeight * ratio}
                        x2={padding + chartWidth}
                        y2={padding + chartHeight * ratio}
                        stroke="#e0e0e0"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                    />
                ))}
                
                {/* Y-axis labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                    const value = Math.round(maxValue - (maxValue - minValue) * ratio);
                    return (
                        <text
                            key={`ylabel-${i}`}
                            x={padding - 5}
                            y={padding + chartHeight * ratio + 4}
                            textAnchor="end"
                            fontSize="11"
                            fill="#666"
                        >
                            {value}
                        </text>
                    );
                })}
                
                {/* X-axis labels */}
                {data.map((d, i) => (
                    <text
                        key={`xlabel-${i}`}
                        x={padding + (i / (data.length - 1)) * chartWidth}
                        y={padding + chartHeight + 20}
                        textAnchor="middle"
                        fontSize="11"
                        fill="#666"
                    >
                        {d.label}
                    </text>
                ))}
                
                {/* Area fill */}
                <polygon
                    points={areaPoints}
                    fill={color}
                    fillOpacity="0.1"
                />
                
                {/* Line */}
                <polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                
                {/* Data points */}
                {data.map((d, i) => {
                    const x = padding + (i / (data.length - 1)) * chartWidth;
                    const y = padding + chartHeight - ((d.value - minValue) / valueRange) * chartHeight;
                    return (
                        <g key={i}>
                            <circle
                                cx={x}
                                cy={y}
                                r="4"
                                fill={color}
                                stroke="white"
                                strokeWidth="2"
                            />
                            <text
                                x={x}
                                y={y - 10}
                                textAnchor="middle"
                                fontSize="10"
                                fontWeight="bold"
                                fill={color}
                            >
                                {d.value}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

// Modern SVG Bar Chart Component
export const ModernBarChart = ({ data, title, color = '#103c7f', height = 200 }) => {
    const padding = 30;
    const chartHeight = height - padding * 2;
    const chartWidth = Math.max(200, height * 1.5); // Responsive width based on height
    
    if (!data || data.length === 0) {
        return (
            <div className="chart-card">
                <h4>{title}</h4>
                <div style={{
                    height: height - 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                    fontStyle: 'italic',
                    fontSize: '0.9rem'
                }}>
                    No data available
                </div>
            </div>
        );
    }

    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = (chartWidth - (data.length - 1) * 10) / data.length;
    
    return (
        <div className="chart-card">
            <h4>
                <FaChartBar style={{ marginRight: '8px', color }} />
                {title}
            </h4>
            <svg width={chartWidth + padding * 2} height={height} style={{ margin: '0 auto', display: 'block' }}>
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                    <line
                        key={i}
                        x1={padding}
                        y1={padding + chartHeight * ratio}
                        x2={padding + chartWidth}
                        y2={padding + chartHeight * ratio}
                        stroke="#e0e0e0"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                    />
                ))}
                
                {/* Y-axis labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                    const value = Math.round(maxValue * ratio);
                    return (
                        <text
                            key={`ylabel-${i}`}
                            x={padding - 5}
                            y={padding + chartHeight - chartHeight * ratio + 4}
                            textAnchor="end"
                            fontSize="11"
                            fill="#666"
                        >
                            {value}
                        </text>
                    );
                })}
                
                {/* Bars */}
                {data.map((d, i) => {
                    const barHeight = maxValue > 0 ? (d.value / maxValue) * chartHeight : 0;
                    const x = padding + i * (barWidth + 10);
                    const y = padding + chartHeight - barHeight;
                    
                    return (
                        <g key={i}>
                            <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                fill={`url(#barGradient-${i})`}
                                rx="3"
                            />
                            <text
                                x={x + barWidth / 2}
                                y={y - 5}
                                textAnchor="middle"
                                fontSize="10"
                                fontWeight="bold"
                                fill={color}
                            >
                                {d.value}
                            </text>
                            <text
                                x={x + barWidth / 2}
                                y={padding + chartHeight + 15}
                                textAnchor="middle"
                                fontSize="11"
                                fill="#666"
                            >
                                {d.label}
                            </text>
                            
                            {/* Gradient definition */}
                            <defs>
                                <linearGradient id={`barGradient-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                                    <stop offset="100%" stopColor={color} stopOpacity="0.4" />
                                </linearGradient>
                            </defs>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

// Doughnut Chart Component
export const ModernDoughnutChart = ({ data, title, colors = ['#103c7f', '#a1db40', '#ff6b6b', '#4ecdc4'], height = 200 }) => {
    const size = Math.min(height - 40, 160); // Limit size for better fit
    const center = size / 2;
    const radius = center - 15;
    const innerRadius = radius * 0.6;
    
    if (!data || data.length === 0) {
        return (
            <div className="chart-card">
                <h4>{title}</h4>
                <div style={{
                    height: height - 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                    fontStyle: 'italic',
                    fontSize: '0.9rem'
                }}>
                    No data available
                </div>
            </div>
        );
    }

    const total = data.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = 0;
    
    const segments = data.map((d, i) => {
        const angle = (d.value / total) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        currentAngle += angle;
        
        const x1 = center + radius * Math.cos((startAngle - 90) * Math.PI / 180);
        const y1 = center + radius * Math.sin((startAngle - 90) * Math.PI / 180);
        const x2 = center + radius * Math.cos((endAngle - 90) * Math.PI / 180);
        const y2 = center + radius * Math.sin((endAngle - 90) * Math.PI / 180);
        
        const x3 = center + innerRadius * Math.cos((endAngle - 90) * Math.PI / 180);
        const y3 = center + innerRadius * Math.sin((endAngle - 90) * Math.PI / 180);
        const x4 = center + innerRadius * Math.cos((startAngle - 90) * Math.PI / 180);
        const y4 = center + innerRadius * Math.sin((startAngle - 90) * Math.PI / 180);
        
        const largeArcFlag = angle > 180 ? 1 : 0;
        
        const pathData = [
            `M ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `L ${x3} ${y3}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
            'Z'
        ].join(' ');
        
        return {
            path: pathData,
            color: colors[i % colors.length],
            label: d.label,
            value: d.value,
            percentage: Math.round((d.value / total) * 100)
        };
    });

    return (
        <div className="chart-card">
            <h4>
                <FaChartArea style={{ marginRight: '8px', color: colors[0] }} />
                {title}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <svg width={size} height={size} style={{ margin: '0 auto', display: 'block' }}>
                    {segments.map((segment, i) => (
                        <path
                            key={i}
                            d={segment.path}
                            fill={segment.color}
                            stroke="white"
                            strokeWidth="2"
                        />
                    ))}
                    
                    {/* Center circle */}
                    <circle
                        cx={center}
                        cy={center}
                        r={innerRadius - 5}
                        fill="white"
                    />
                    
                    {/* Center text */}
                    <text
                        x={center}
                        y={center - 5}
                        textAnchor="middle"
                        fontSize="16"
                        fontWeight="bold"
                        fill="#103c7f"
                    >
                        {total}
                    </text>
                    <text
                        x={center}
                        y={center + 10}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#666"
                    >
                        Total
                    </text>
                </svg>
                
                {/* Legend */}
                <div style={{ flex: 1, marginLeft: '20px' }}>
                    {segments.map((segment, i) => (
                        <div key={i} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            marginBottom: '8px',
                            fontSize: '12px'
                        }}>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                backgroundColor: segment.color,
                                borderRadius: '2px',
                                marginRight: '8px'
                            }}></div>
                            <span style={{ flex: 1 }}>
                                {segment.label}: {segment.value} ({segment.percentage}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Real-time Order Status Chart
export const OrderStatusChart = ({ orders, height = 200 }) => {
    const statusData = [
        { label: 'Placed', value: orders.filter(o => o.status === 'Placed').length },
        { label: 'Making', value: orders.filter(o => o.status === 'Making').length },
        { label: 'Ready', value: orders.filter(o => o.status === 'Ready').length },
        { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length }
    ];

    return <ModernDoughnutChart data={statusData} title="Order Status Distribution" height={height} />;
};

// Weekly Orders Trend
export const WeeklyOrdersChart = ({ orders, height = 200 }) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData = days.map((day, index) => {
        const dayOrders = orders.filter(order => {
            const orderDate = new Date(order.timestamp);
            return orderDate.getDay() === index;
        });
        return { label: day, value: dayOrders.length };
    });

    return <ModernBarChart data={weeklyData} title="Weekly Orders Distribution" height={height} />;
};

// Monthly Orders Trend
export const MonthlyOrdersChart = ({ orders, height = 200 }) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    const monthlyData = months.map((month, index) => {
        const monthOrders = orders.filter(order => {
            const orderDate = new Date(order.timestamp);
            return orderDate.getFullYear() === currentYear && orderDate.getMonth() === index;
        });
        return { label: month, value: monthOrders.length };
    });

    return <ModernLineChart data={monthlyData} title="Monthly Orders Trend (2025)" height={height} />;
};