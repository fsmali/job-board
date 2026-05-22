import { Canvas } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';

function FloatingShape({ type }) {
  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh>
        {type === 'signup' ? (
          <icosahedronGeometry args={[2.5, 1]} />
        ) : (
          <torusKnotGeometry args={[1.5, 0.35, 120, 16]} />
        )}

        <meshStandardMaterial color="#646cff" wireframe />
      </mesh>
    </Float>
  );
}

function AuthBackground({ type = 'login' }) {
  return (
    <div className="auth-background">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <Stars radius={80} depth={40} count={12000} factor={4} fade />
        <FloatingShape type={type} />
      </Canvas>
    </div>
  );
}

export default AuthBackground;
