import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Text, Float, ContactShadows } from '@react-three/drei';
import { useState, Suspense } from 'react';

const GenericPhone = ({ color = "#1f2937" }) => {
    return (
        <group>
            <mesh castShadow>
                <boxGeometry args={[1.5, 3, 0.15]} />
                <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0.08]}>
                <boxGeometry args={[1.4, 2.9, 0.01]} />
                <meshStandardMaterial color="#000" roughness={0} metalness={1} />
            </mesh>
            <group position={[0.4, 1.1, -0.08]}>
                <mesh castShadow>
                    <boxGeometry args={[0.5, 0.5, 0.05]} />
                    <meshStandardMaterial color="#000" />
                </mesh>
            </group>
        </group>
    );
};

const GenericLaptop = ({ color = "#475569" }) => {
    return (
        <group rotation={[0.2, 0, 0]}>
            {/* Screen part */}
            <group position={[0, 0.8, -1]}>
                <mesh castShadow>
                    <boxGeometry args={[4, 2.5, 0.1]} />
                    <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0, 0.06]}>
                    <boxGeometry args={[3.8, 2.3, 0.01]} />
                    <meshStandardMaterial color="#000" metalness={1} roughness={0} />
                </mesh>
            </group>
            {/* Base part */}
            <mesh position={[0, -0.4, 0]} castShadow>
                <boxGeometry args={[4, 0.15, 2.5]} />
                <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Keyboard area */}
            <mesh position={[0, -0.32, 0]}>
                <boxGeometry args={[3.5, 0.01, 1.2]} />
                <meshStandardMaterial color="#111" />
            </mesh>
        </group>
    );
};

const GenericWatch = ({ color = "#1e293b" }) => {
    return (
        <group>
            {/* Watch Face */}
            <mesh castShadow>
                <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0, 0.11]}>
                <cylinderGeometry args={[0.7, 0.7, 0.01, 32]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color="#000" metalness={1} roughness={0} />
            </mesh>
            {/* Straps */}
            <mesh position={[0, 1.1, 0]}>
                <boxGeometry args={[0.6, 1, 0.15]} />
                <meshStandardMaterial color="#334155" roughness={0.8} />
            </mesh>
            <mesh position={[0, -1.1, 0]}>
                <boxGeometry args={[0.6, 1, 0.15]} />
                <meshStandardMaterial color="#334155" roughness={0.8} />
            </mesh>
        </group>
    );
};

const Product3DViewer = ({ type = "phone" }) => {
    const [activeColor, setActiveColor] = useState(type === 'laptop' ? "#475569" : (type === 'watch' ? "#1e293b" : "#1f2937"));
    
    const colorsData = {
        phone: [
            { name: "Titan Xám", value: "#334155" },
            { name: "Titan Tự Nhiên", value: "#94a3b8" },
            { name: "Titan Xanh", value: "#1e3a8a" }
        ],
        laptop: [
            { name: "Space Gray", value: "#334155" },
            { name: "Silver", value: "#cbd5e1" },
            { name: "Midnight", value: "#0f172a" }
        ],
        watch: [
            { name: "Starlight", value: "#f1f5f9" },
            { name: "Midnight", value: "#0f172a" },
            { name: "Ocean Blue", value: "#1e3a8a" }
        ]
    };

    const colors = colorsData[type] || colorsData.phone;

    return (
        <div className="w-full h-full relative bg-gray-950/20 rounded-[3rem] overflow-hidden group">
            <div className="absolute top-8 left-8 z-10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Trải nghiệm thực tế ảo</p>
                <div className="flex flex-col gap-3">
                    {colors.map((c) => (
                        <button
                            key={c.value}
                            onClick={() => setActiveColor(c.value)}
                            className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 ${activeColor === c.value ? 'border-primary-500 scale-125' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            title={c.name}
                        >
                            <div className="w-full h-full rounded-full shadow-inner" style={{ backgroundColor: c.value }}></div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-8 left-8 z-10">
                <h4 className="text-white font-black text-lg tracking-tight uppercase">{type} 3D Model</h4>
                <p className="text-gray-500 text-[10px] font-bold">Xoay 360° để xem mọi góc cạnh</p>
            </div>

            <Canvas shadows dpr={[1, 2]}>
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, 0, type === 'laptop' ? 7 : 5]} fov={40} />
                    <OrbitControls 
                        enablePan={false} 
                        enableZoom={true} 
                        minDistance={3} 
                        maxDistance={10}
                        autoRotate={true}
                        autoRotateSpeed={0.5}
                    />
                    
                    <ambientLight intensity={0.7} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1500} castShadow />
                    
                    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                        {type === 'laptop' && <GenericLaptop color={activeColor} />}
                        {type === 'watch' && <GenericWatch color={activeColor} />}
                        {type === 'phone' && <GenericPhone color={activeColor} />}
                    </Float>

                    <ContactShadows 
                        position={[0, -2, 0]} 
                        opacity={0.4} 
                        scale={12} 
                        blur={2.5} 
                        far={4} 
                    />
                    
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
            
            <div className="absolute inset-0 pointer-events-none border-[1px] border-white/5 rounded-[3rem] shadow-inner"></div>
        </div>
    );
};


export default Product3DViewer;
