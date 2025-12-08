import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to the console with detailed information
        console.error('❌ Error Boundary caught an error:', error, errorInfo);
        
        // Check if it's a React hook error
        if (error.message && error.message.includes('Invalid hook call')) {
            console.error('🔧 React Hook Error Detected! Possible causes:');
            console.error('   1. React version mismatch between react and react-dom');
            console.error('   2. Multiple copies of React in the app');
            console.error('   3. Component not being called as a React component');
            console.error('   4. Hooks called outside function component');
        }
        
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI for kitchen screens
            if (this.props.kitchenMode) {
                return (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        padding: '20px',
                        backgroundColor: '#f5f5f5',
                        fontFamily: 'Arial, sans-serif'
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '40px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            textAlign: 'center',
                            maxWidth: '500px'
                        }}>
                            <h2 style={{ color: '#d32f2f', marginBottom: '20px' }}>
                                ⚠️ Kitchen System Error
                            </h2>
                            <p style={{ color: '#666', marginBottom: '20px' }}>
                                There was an error with the order notification system. 
                                The kitchen screen should refresh automatically.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                style={{
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    cursor: 'pointer'
                                }}
                            >
                                🔄 Refresh Kitchen Screen
                            </button>
                            <p style={{ fontSize: '12px', color: '#999', marginTop: '15px' }}>
                                Error: {this.state.error?.message || 'Unknown error'}
                            </p>
                            {this.state.error?.message?.includes('Invalid hook call') && (
                                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '5px', fontSize: '11px' }}>
                                    <strong>🔧 React Hook Error</strong><br/>
                                    This usually happens due to React version mismatch or bundling issues. Try refreshing the page.
                                </div>
                            )}
                        </div>
                    </div>
                );
            }

            // Default error UI for other screens
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '20px',
                    backgroundColor: '#f5f5f5'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '40px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        textAlign: 'center',
                        maxWidth: '500px'
                    }}>
                        <h2 style={{ color: '#d32f2f' }}>Something went wrong</h2>
                        <p style={{ color: '#666', marginBottom: '20px' }}>
                            Please refresh the page to try again.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;