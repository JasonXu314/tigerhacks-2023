import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { useRouter } from 'expo-router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Image, ImageBackground, StyleSheet, View, Text } from 'react-native';
import { AppContext } from '../lib/Context';
import { Avatars } from '../lib/Images';
import { LyricsData } from '../data/LyricsData';

const GameScreen = () => {
	const router = useRouter();
	const context = useContext(AppContext);
	const [song, setSong] = useState<Audio.Sound>(new Audio.Sound());
	const [recording, setRecording] = useState<Audio.Recording>(new Audio.Recording());
    const [stopSong, setStopSong] = useState(false);
    const [words, setWords] = useState<string[]>([]);

	async function playSound() {
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			staysActiveInBackground: true,
			interruptionModeIOS: InterruptionModeIOS.DuckOthers,
			playsInSilentModeIOS: true,
			shouldDuckAndroid: true,
			interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
			playThroughEarpieceAndroid: false
		});
		const { sound } = await Audio.Sound.createAsync(context.song.track);
		sound.setIsLoopingAsync(true);

		setSong(sound);

		await sound.playAsync();
	}

	async function startRecording() {
		try {
			await Audio.requestPermissionsAsync();
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true
			});

			console.log('Starting recording..');
			const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
			setRecording(recording);
			console.log('Recording started');
		} catch (err) {
			console.error('Failed to start recording', err);
		}
	}

	async function stopRecording() {
		console.log('Stopping recording..');
		setRecording(new Audio.Recording());
		await recording.stopAndUnloadAsync();
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false
		});
		const uri = recording.getURI();
		console.log('Recording stopped and stored at', uri);
	}

	const startTicker = useCallback(() => {
        const lines = LyricsData[context.song.name].lines.reverse();
		let startTime = performance.now(),
			timeout: NodeJS.Timeout;
		const tick = () => {
			const delta = performance.now() - startTime;
            // calculate speed of moving color by subtracting next time from current time and dividing by width?
            if (delta === 7030) {
                console.log('a')
            }

            const line = lines.find((line) => parseInt(line.startTimeMs) < delta);
            
            if (line && !words.includes(line.startTimeMs)) {
                setWords([...words, line.words]);
            }

			timeout = setTimeout(tick, 10);
		};

		timeout = setTimeout(tick, 10);

		return () => clearTimeout(timeout);
	}, []);

	useEffect(() => {
		if (context.bgMusic) {
			context.stopBgMusic();
		}
		playSound();
        let stopTicker = startTicker();
		// startRecording();
	}, []);

	useEffect(() => {
		return song
			? () => {
					song.unloadAsync();
			  }
			: undefined;
	}, [song]);

	return (
		<ImageBackground
			source={require('../assets/images/BackgroundPic/PlaneBG.png')}
			imageStyle={{ resizeMode: 'cover' }}
			style={{ height: '100%', width: '100%' }}>
			<View style={styles.container}>
                <Text>{words}</Text>
				<Image source={Avatars['bee']} style={styles.avatar}></Image>
				<Image source={require('../assets/images/ring.png')} style={styles.ring}></Image>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20
	},
	avatar: {
		position: 'absolute',
		bottom: 35,
		height: 110,
		width: 110
	},
	ring: {
		position: 'absolute',
		bottom: 0
	}
});

export default GameScreen;

