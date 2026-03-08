import React from 'react';

const ThreeBackground = () => {
  return (
    <>
      {/* Animated gradient orbs */}
      <div 
        className="fixed inset-0 -z-10 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #030014 0%, #1e1b4b 50%, #312e81 100%)' }}
      >
        {/* Orb 1 */}
        <div 
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float 8s ease-in-out infinite',
          }}
        />
        
        {/* Orb 2 */}
        <div 
          style={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float 10s ease-in-out infinite reverse',
          }}
        />
        
        {/* Orb 3 */}
        <div 
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '30%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'float 12s ease-in-out infinite',
            animationDelay: '2s',
          }}
        />
        
        {/* Orb 4 */}
        <div 
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '20%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'float 9s ease-in-out infinite reverse',
            animationDelay: '1s',
          }}
        />
        
        {/* Star-like particles (CSS only) */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                background: 'white',
                borderRadius: '50%',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                opacity: Math.random() * 0.5 + 0.2,
                animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: Math.random() * 2 + 's',
              }}
            />
          ))}
        </div>
        
        {/* Grid pattern overlay */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            opacity: 0.5,
          }}
        />
      </div>
      
      {/* CSS keyframes injection */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(20px, -30px) scale(1.05);
          }
          66% {
            transform: translate(-15px, 15px) scale(0.95);
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }
      `}</style>
    </>
  );
};

export default ThreeBackground;

