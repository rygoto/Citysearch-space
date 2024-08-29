import React, { useState, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { Html, RoundedBox, useGLTF } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import { TextureLoader } from 'three';

interface Store {
    texture: string;
    name: string;
    time: string;
    distance: number;
    priceRange: string;
    review: string;
    url: string;
    score: string;
}

interface BoxProps {
    position: [number, number, number];
    animatedPosition?: [number, number, number];
    store: Store;
    onOpenUrl?: (url: string) => void;
}

const Box: React.FC<BoxProps> = ({ position, animatedPosition, store, onOpenUrl }) => {
    const texture = useLoader(TextureLoader, store.texture);
    const [showHtml, setShowHtml] = useState(true);
    const [showInfoPanel, setShowInfoPanel] = useState(false);

    const RoundedBox1 = useGLTF('RoundedBox1.glb');

    const handleOnClick = () => {
        setShowInfoPanel(!showInfoPanel);
    };

    useEffect(() => {
        const threshold = 0;
        const threshold2 = -0.5;
        if (position[2] > threshold || position[2] < threshold2) {
            setShowHtml(false);
        } else {
            setShowHtml(true);
        }
    }, [position]);

    const animatedProps = useSpring({ position: animatedPosition || position });
    const props = useSpring({ positionY: showInfoPanel ? 0.8 : 2 });

    return (
        <>
            <a.mesh position={animatedProps.position} renderOrder={1}>
                <RoundedBox args={[1.5, 2, 0.03]} radius={0.1} smoothness={4}>
                    <meshStandardMaterial map={texture} />
                </RoundedBox>
                {showHtml && (
                    <Html position={[-0.3, 1.5, 0]}>
                        <div className="store-info">
                            <p>{store.name}</p>
                        </div>
                    </Html>
                )}
                {showHtml && (
                    <Html position={[-0.5, -0.8, 0]}>
                        <div className="store-info">
                            <p>{store.time}</p>
                        </div>
                    </Html>
                )}
            </a.mesh>
            {showInfoPanel && (
                <Html position={[-2, 2, 0]}>
                    <div className="store-panel">
                        <p>{store.name}</p>
                        <p>{store.distance}m</p>
                        <p>{store.priceRange}</p>
                        <p>{store.review}</p>
                        <p>{store.url}</p>
                        <p>{store.score}</p>
                    </div>
                </Html>
            )}
        </>
    );
}

export default Box;