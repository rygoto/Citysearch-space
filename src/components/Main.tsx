import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { dummyStores, predeterminedPositions, routes } from '../components/data'; // .jsxを.tsファイルに変更しました
import Sphere from '../components/Controllsphere';
import Box from '../components/Shopdisplaybox';
import CitySkyline from '../components/Cityskyline';
import { convertLatLngToPoint, Road, RedPin } from '../components/Roaddrawing';
import BG from '../components/Background';
import { calculateTotalScore } from '../components/scoring';

interface Store {
    distance: number;
    priceRange: number;
    review: number;
    score?: number;
}

interface PositionWithId {
    id: number;
    x: number;
    y: number;
    z: number;
}

const Other: React.FC = () => {
    const [location, setLocation] = useState<string>('');
    const [isIframeOpen, setIsIframeOpen] = useState<boolean>(false);
    const [iframeUrl, setIframeUrl] = useState<string>('');

    const [weights, setWeights] = useState({ distance: 1, priceRange: 1, review: 1 });
    const [sortedStores, setSortedStores] = useState<Store[]>([]);

    const [showNewPage, setShowNewPage] = useState<boolean>(false);
    const [pulloutPage, setPulloutPage] = useState<boolean>(false);

    const [boxPositions, setBoxPositions] = useState<PositionWithId[]>(predeterminedPositions[0]);

    const redUrl = 'redpin.glb';

    const pullOut = () => {
        setPulloutPage(current => !current);
    };

    const openUrlInHalf = (url: string) => {
        setIsIframeOpen(true);
        setIframeUrl(url);
    };

    const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // API呼び出しや他の処理をここに追加
    };

    useEffect(() => {
        const newSortedStores = dummyStores.map(store => ({
            ...store,
            score: calculateTotalScore(store.distance, store.priceRange, store.review, weights)
        })).sort((a, b) => b.score! - a.score!);

        setSortedStores(newSortedStores);
    }, [weights]);

    const handleTotalRotationChange = (totalRotation: [number, number, number]) => {
        const rotateThreshold = 1.5;
        const rotateThreshold2 = 3.0;
        const rotateThreshold3 = 4.5;

        if (totalRotation[1] < rotateThreshold && totalRotation[1] > -rotateThreshold && totalRotation[0] > rotateThreshold && totalRotation[0] < rotateThreshold2) {
            setBoxPositions(predeterminedPositions[1]);
            setShowNewPage(false);
            switchRoute('decoderouteJinguToYotsuya');
        } else if (totalRotation[1] > rotateThreshold && totalRotation[0] < rotateThreshold) {
            setBoxPositions(predeterminedPositions[2]);
            setShowNewPage(true);
            switchRoute('decoderouteJinguToGaien');
        } else if (totalRotation[1] < -rotateThreshold && totalRotation[0] > rotateThreshold && totalRotation[0] < rotateThreshold2) {
            setBoxPositions(predeterminedPositions[4]);
            setShowNewPage(false);
            switchRoute('decoderouteJinguToGaien');
        } else if (totalRotation[1] > rotateThreshold && totalRotation[0] > rotateThreshold && totalRotation[0] < rotateThreshold2) {
            setBoxPositions(predeterminedPositions[5]);
            setShowNewPage(false);
        } else if (totalRotation[1] < rotateThreshold && totalRotation[1] > -rotateThreshold && totalRotation[0] > rotateThreshold2 && totalRotation[0] < rotateThreshold3) {
            setBoxPositions(predeterminedPositions[6]);
            setShowNewPage(false);
        } else if (totalRotation[1] < -rotateThreshold && totalRotation[0] > rotateThreshold2 && totalRotation[0] < rotateThreshold3) {
            setBoxPositions(predeterminedPositions[7]);
        } else if (totalRotation[1] > rotateThreshold && totalRotation[0] > rotateThreshold2 && totalRotation[0] < rotateThreshold3) {
            setBoxPositions(predeterminedPositions[8]);
        } else if (totalRotation[1] < rotateThreshold && totalRotation[1] > -rotateThreshold && totalRotation[0] > rotateThreshold3) {
            setBoxPositions(predeterminedPositions[9]);
        } else if (totalRotation[1] < -rotateThreshold && totalRotation[0] > rotateThreshold3) {
            setBoxPositions(predeterminedPositions[10]);
        } else if (totalRotation[1] > rotateThreshold && totalRotation[0] > rotateThreshold3) {
            setBoxPositions(predeterminedPositions[11]);
        } else {
            setBoxPositions(predeterminedPositions[0]);
            setShowNewPage(false);
        }
    };

    const [currentRoute, setCurrentRoute] = useState(routes.decoderouteJinguToGaien);

    const switchRoute = (routeName: keyof typeof routes) => {
        setCurrentRoute(routes[routeName]);
    };

    const road = convertLatLngToPoint(currentRoute, currentRoute[0], currentRoute[currentRoute.length - 1]);
    const lastposition = road[road.length - 1];
    lastposition[1] = -3;

    //const navigate = useNavigate();
    /*const handleBackClick = () => {
        navigate('/');
    };

    const handleNextClick = () => {
        navigate('/review');
    };*/

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <Canvas style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>
                <BG />
                <ambientLight />
                <pointLight position={[0, 0, 0]} intensity={2.0} />
                <pointLight position={[0, 1, 1]} intensity={5.0} />
                <Sphere onTotalRotationChange={handleTotalRotationChange} />
                {boxPositions.map((position) => {
                    const storeIndex = position.id - 1; // IDは1から始まると仮定
                    const store = sortedStores[storeIndex % sortedStores.length];
                    return (
                        <Box key={position.id} position={[position.x, position.y, position.z]} store={store} onOpenUrl={openUrlInHalf} />
                    );
                })}
                <CitySkyline />
                <pointLight position={[0, 1.7, 1]} intensity={20.0} color="orange" />
                <pointLight position={[0, -3, -17]} intensity={300.0} color="rgb(135, 206, 235)" />
                <RedPin url={redUrl} position={lastposition} />
                <Road points={road} />
            </Canvas>
            {isIframeOpen && (
                <iframe src={iframeUrl} style={{ height: '50vh', width: '100%' }}></iframe>
            )}
        </div>
    );
};

export default Other;
