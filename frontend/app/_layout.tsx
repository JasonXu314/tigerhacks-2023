import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { createContext } from 'react';
import React from 'react';
import { AppContext } from '../lib/Context';
import { ISong } from '../interfaces/ISong';
import Images from '../lib/Images';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router';
export const unstable_settings = {
	initialRouteName: 'home',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		Neulis: require('../assets/fonts/NeulisNeue400.ttf'),
		Neulis500: require('../assets/fonts/NeulisNeue500.ttf'),
		Neulis800: require('../assets/fonts/NeulisNeue800.ttf'),
		ProximaNova: require('../assets/fonts/Proxima-Nova.otf'),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const [song, setSong] = useState<ISong>({
		name: 'Dance The Night',
		artist: 'Dua Lipa',
		img: Images.duaLipa,
		track: 'pathtotrack',
	});
	const [room, setRoom] = useState('');
	const [bgMusic, setBgMusic] = useState<Audio.Sound>(new Audio.Sound());

	async function playSound() {
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			staysActiveInBackground: true,
			interruptionModeIOS: InterruptionModeIOS.DuckOthers,
			playsInSilentModeIOS: true,
			shouldDuckAndroid: true,
			interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
			playThroughEarpieceAndroid: false,
		});
		const { sound } = await Audio.Sound.createAsync(require('../assets/music/bgmusic.mp3'));
		sound.setIsLoopingAsync(true);

		setBgMusic(sound);

		await sound.playAsync();
	}

	useEffect(() => {
		return bgMusic
			? () => {
                bgMusic.unloadAsync();
			  }
			: undefined;
	}, [bgMusic]);

	useEffect(() => {
		playSound();
	}, []);

    const startBgMusic = async() => {
        await bgMusic.playAsync()
    }

    const stopBgMusic = async() => {
        await bgMusic.stopAsync()
    }

	return (
		<AppContext.Provider value={{ song, setSong, room, setRoom, startBgMusic, stopBgMusic }}>
			<Stack>
				<Stack.Screen name="index" options={{ headerShown: false }} />
				<Stack.Screen name="createroom" options={{ headerShown: false }} />
				<Stack.Screen name="game" options={{ headerShown: false }} />
				<Stack.Screen name="joinroom" options={{ headerShown: false }} />
				<Stack.Screen name="voting" options={{ headerShown: false }} />
				<Stack.Screen name="winner" options={{ headerShown: false }} />
			</Stack>
		</AppContext.Provider>
	);
}
