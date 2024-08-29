import React, { useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

interface Building {
    key: string;
    position: [number, number, number];
    height?: number;
    isGround?: boolean;
}

function CitySkyline() {
    const [buildings, setBuildings] = useState<Building[]>([]);

    useEffect(() => {
        const newBuildings: Building[] = [];
        const buildingCount = 100;

        for (let i = 0; i < buildingCount; i++) {
            const min = 0.6;
            const max = 1;
            const height = (Math.random() * 5 + 5) / 2.3;
            const positionX = (Math.random() - 0.5) * 40;
            const positionZ = (Math.random() - 0.5) * 40 - 20;

            newBuildings.push({
                key: `building-${i}`,
                position: [positionX, height / 2 - 10, positionZ],
                height: height,
            });
        }
        newBuildings.push({
            key: 'ground',
            position: [0, -10.5, 0],
            isGround: true,
        });

        setBuildings(newBuildings);
    }, []);

    return (
        <>
            {buildings.map((item) => (
                item.isGround ? (
                    <mesh key={item.key} rotation={[-Math.PI / 2, 0, 0]} position={item.position} renderOrder={2}>
                        <planeGeometry args={[100, 100]} />
                        <meshStandardMaterial color={'gray'} transparent opacity={0.7} />
                    </mesh>
                ) : (
                    <mesh key={item.key} position={item.position}>
                        <boxGeometry args={[1, item.height!, 1]} />
                        <meshStandardMaterial color="gray" />
                    </mesh>
                )
            ))}
        </>
    );
}

interface PinProps {
    url: string;
    position: [number, number, number];
}

function RedPin({ url, position }: PinProps) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} position={position} />;
}

function GreenPin({ url, position }: PinProps) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} position={position} />;
}

export default CitySkyline;
export { RedPin, GreenPin };