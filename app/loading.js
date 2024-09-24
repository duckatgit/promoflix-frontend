import React from 'react'

const Loading = () => {
    return (
        <div style={styles.container}>
            <div style={styles.loader}></div>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
    },
    loader: {
        border: '8px solid #f3f3f3',  // Light gray
        borderTop: '8px solid #3498db', // Blue
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        animation: 'spin 1s linear infinite'
    },
    '@keyframes spin': {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' }
    }
};

export default Loading;
