import React, { useRef, useState, useEffect } from 'react';
import { useLoader, useFrame, ThreeEvent } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

interface SphereProps {
    onTotalRotationChange: (rotation: [number, number, number]) => void;
}

const Sphere: React.FC<SphereProps> = ({ onTotalRotationChange }) => {
    const ref = useRef<THREE.Mesh>(null);
    const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [totalRotation, setTotalRotation] = useState<[number, number, number]>([0, 0, 0]);
    const lastTouch = useRef({ x: 0, y: 0 });

    const handleInteractionStart = (x: number, y: number) => {
        setIsDragging(true);
        lastTouch.current = { x, y };
    };

    const handleInteractionMove = (x: number, y: number) => {
        if (!isDragging) return;

        const dx = x - lastTouch.current.x;
        const dy = y - lastTouch.current.y;
        const newRotation: [number, number, number] = [
            rotation[0] + dy * 0.01,
            rotation[1] + dx * 0.01,
            0
        ];
        setRotation(newRotation);

        setTotalRotation(prev => {
            const newTotalROtation: [number, number, number] = [
                prev[0] + dy * 0.01,
                prev[1] + dx * 0.01,
                prev[2]
            ];
            return newTotalROtation;
        });
        lastTouch.current = { x, y };
    };

    const handleMouseDown = (event: ThreeEvent<PointerEvent>) => {//(event: React.MouseEvent) => {
        handleInteractionStart(event.clientX, event.clientY);
    };

    const handleMouseMove = (event: MouseEvent) => {
        handleInteractionMove(event.clientX, event.clientY);
    };

    /*const handleTouchStart = (event: React.TouchEvent) => {// (event: ThreeEvent<TouchEvent>) => {// 
        event.nativeEvent.preventDefault();
        const touch = event.touches[0];
        handleInteractionStart(touch.clientX, touch.clientY);
    };*/

    const handleTouchMove = (event: TouchEvent) => {
        event.preventDefault();
        const touch = event.touches[0];
        handleInteractionMove(touch.clientX, touch.clientY);
    };

    const handleInteractionEnd = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleInteractionEnd);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleInteractionEnd);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleInteractionEnd);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleInteractionEnd);
        };
    }, [isDragging, rotation]);

    useEffect(() => {
        onTotalRotationChange(totalRotation);
    }, [totalRotation, onTotalRotationChange]);

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.set(...rotation);
        }
    });
    const texture = useLoader(TextureLoader, '/Earth.jpg');

    return (
        <mesh
            position={[0, -2.3, 0]}
            renderOrder={1}
            ref={ref}
            onPointerDown={handleMouseDown}
        >
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshStandardMaterial map={texture} side={THREE.BackSide} />
        </mesh>
    );
};

export default Sphere;

/* return 
    position={[0, -2.3, 0]}
    renderOrder={1}
    ref={ref}
    onPointerDown={handleMouseDown}
    onTouchStart={handleTouchStart}
*/