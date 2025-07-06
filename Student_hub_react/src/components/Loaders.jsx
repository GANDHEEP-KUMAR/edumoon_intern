import Spinner from 'react-bootstrap/Spinner';


const Loader = () => {
    return (
        <div 
            className="d-flex flex-column justify-content-center align-items-center"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                zIndex: 9999,
                animation: 'fadeIn 0.3s ease-out'
            }}
        >
            {/* Custom Animated Loader */}
            <div className="position-relative mb-4">
                <div 
                    className="spinner-border"
                    style={{
                        width: '4rem',
                        height: '4rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '50%',
                        border: '4px solid transparent',
                        animation: 'spin 1s linear infinite, pulse 2s ease-in-out infinite'
                    }}
                    role="status"
                >
                    <span className="visually-hidden">Loading...</span>
                </div>
                
                {/* Inner rotating element */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '2rem',
                        height: '2rem',
                        background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite reverse'
                    }}
                ></div>
            </div>

            {/* Loading Text */}
            <div className="text-center">
                <h5 
                    className="gradient-text fw-bold mb-2"
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}
                >
                    Loading...
                </h5>
                <p className="small mb-0" style={{ color: '#6c757d' }}>Please wait while we fetch your content</p>
            </div>

            {/* Animated dots */}
            <div className="d-flex mt-3">
                <div 
                    className="me-1"
                    style={{
                        width: '8px',
                        height: '8px',
                        background: '#667eea',
                        borderRadius: '50%',
                        animation: 'bounce 1.4s ease-in-out infinite both',
                        animationDelay: '0s'
                    }}
                ></div>
                <div 
                    className="me-1"
                    style={{
                        width: '8px',
                        height: '8px',
                        background: '#667eea',
                        borderRadius: '50%',
                        animation: 'bounce 1.4s ease-in-out infinite both',
                        animationDelay: '0.16s'
                    }}
                ></div>
                <div 
                    style={{
                        width: '8px',
                        height: '8px',
                        background: '#667eea',
                        borderRadius: '50%',
                        animation: 'bounce 1.4s ease-in-out infinite both',
                        animationDelay: '0.32s'
                    }}
                ></div>
            </div>

            <style jsx>{`
                @keyframes bounce {
                    0%, 80%, 100% {
                        transform: scale(0);
                    }
                    40% {
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
}

export default Loader;