// components/StarsBackground.jsx
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

function StarsBackground() {
  return (
    <div className="stars-background">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Stars radius={80} depth={40} count={12000} factor={4} fade />
      </Canvas>
    </div>
  );
}

export default StarsBackground;
