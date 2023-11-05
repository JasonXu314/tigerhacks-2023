import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LyricsData } from '../data/LyricsData';
import { SongList } from '../data/SongList';
import { ILine } from '../interfaces/ILine';
import { AppContext } from '../lib/Context';
import { Avatars } from '../lib/Images';
import { useGame } from '../lib/game-data';
import api from '../services/AxiosConfig';

let recording = new Audio.Recording();

const GameScreen = () => {
	const router = useRouter();
	const context = useContext(AppContext);
	const [song, setSong] = useState<Audio.Sound>(new Audio.Sound());
	const [stopSong, setStopSong] = useState(false);
	const [words, setWords] = useState<ILine[]>([]);
	const [over, setOver] = useState(false);
	const [ahead, setAhead] = useState('');
	const scrollViewRef = useRef<any>(null);
	const [test, setTest] = useState();
	const [lineHighlightIdx, setLineHighlightIdx] = useState<number>(0);

	const { data } = useGame();

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

		const { sound } = await Audio.Sound.createAsync(SongList.find((sng) => sng.name === context.song)!.track);

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
			const data = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
			recording = data.recording;
			// recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
			await recording.startAsync();
			console.log('Recording started');
		} catch (err) {
			console.error('Failed to start recording', err);
		}
	}

	async function stopRecording() {
		console.log('Stopping recording..');
		await recording.stopAndUnloadAsync();
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false
		});
		const recordingUri = recording.getURI();
		if (recordingUri) {
			const formData = new FormData();
			if (data?.players) {
				const player = data.players.find((player) => player.name === context.name)!;
				formData.append('id', player.id.toString());
			}
			formData.append('file', {
				//@ts-expect-error
				uri: recordingUri,
				type: 'image/mp3',
				name: 'file.mp3'
			});

			api.post(`/rooms/${context.room}/submit`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
				transformRequest: (data, headers) => {
					return formData;
				}
			})
				.then(() => {})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	const startTicker = useCallback(() => {
		const lines = LyricsData[context.song].lines.reverse();
		let startTime = performance.now(),
			timeout: NodeJS.Timeout;
		const tick = () => {
			const delta = performance.now() - startTime;
			// calculate speed of moving color by subtracting next time from current time and dividing by width?

			const line = lines.find((line) => parseInt(line.startTimeMs) < delta);

			if (line && lines.indexOf(line) === 0) {
				setAhead('');
			} else if (line && !words.find((word) => word.startTimeMs === line.startTimeMs)) {
				const idx = lines.indexOf(line);
				setWords((words) => {
					if (!words.find((word) => word.startTimeMs === line.startTimeMs)) {
						const length = line.words.split(' ').length;
						const time = lines[idx + 1] ? parseInt(lines[idx + 1].startTimeMs) - delta : delta - parseInt(lines[idx - 1].startTimeMs); // meh heuristic
						const step = time / length;
						console.log(time, length, step);

						setLineHighlightIdx(0);
						startWordTicker(step, length);

						return [...words, line];
					}
					return words;
				});
				setAhead(lines[idx - 1].words);
			}
			if (delta - 5000 > parseInt(lines[0].startTimeMs)) {
				stopRecording();
				router.push('/voting');
				return;
			}

			timeout = setTimeout(tick, 10);
		};

		timeout = setTimeout(tick, 10);

		return () => clearTimeout(timeout);
	}, []);

	const secondTicker = useCallback(() => {
		let startTime = performance.now(),
			timeout: NodeJS.Timeout;
		const tick = () => {
			const delta = performance.now() - startTime;
			if (delta > 3000) {
				setWords((words) => [
					...words,
					{
						startTimeMs: '0',
						words: '1',
						syllables: [],
						endTimeMs: ''
					}
				]);
				startRecording();
				playSound();
				startTicker();
				return;
			} else if (delta > 2000) {
				setWords((words) => [
					...words,
					{
						startTimeMs: '0',
						words: '2',
						syllables: [],
						endTimeMs: ''
					}
				]);
			} else if (delta > 1000) {
				setWords((words) => [
					...words,
					{
						startTimeMs: '0',
						words: '3',
						syllables: [],
						endTimeMs: ''
					}
				]);
			}

			timeout = setTimeout(tick, 1000);
		};

		timeout = setTimeout(tick, 1000);

		return () => clearTimeout(timeout);
	}, []);

	const startWordTicker = useCallback((step: number, count: number) => {
		let timeout: NodeJS.Timeout,
			idx: number = 0;

		const tick = () => {
			setLineHighlightIdx((idx) => idx + 1);

			if (++idx < count) {
				timeout = setTimeout(tick, step);
			}
		};

		timeout = setTimeout(tick, step);

		return () => clearTimeout(timeout);
	}, []);

	useEffect(() => {
		if (context.bgMusic) {
			context.stopBgMusic();
		}
		secondTicker();
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
				<View style={styles.lyricsContainer}>
					<View style={styles.test}></View>
					<ScrollView
						style={styles.lyricsContainerInside}
						showsVerticalScrollIndicator={false}
						ref={scrollViewRef}
						onContentSizeChange={() => {
							scrollViewRef.current.scrollToEnd({ animated: true });
						}}>
						{words.map((line, i) => (
							<View key={i} style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 3}}>
								{line.words.split(' ').map((word, j) => (
									<Text key={j} style={i === words.length - 1 ? (j <= lineHighlightIdx ? styles.current : styles.line) : styles.line}>
										{word}
									</Text>
								))}
							</View>
						))}
						<Text style={styles.ahead}>{ahead}</Text>
					</ScrollView>
				</View>
				{data && <Image source={Avatars[data.players.find((player) => player.name === context.name)!.avatar]} style={styles.avatar}></Image>}
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
	},
	line: {
		marginTop: 'auto',
		color: '#FFFFFF',
		opacity: 0.5,
		fontSize: 18,
		fontFamily: 'Neulis',
		textAlign: 'center'
	},
	lyricsContainer: {
		paddingTop: 40,
		display: 'flex',
		maxHeight: '50%',
		overflow: 'hidden',
		marginBottom: 'auto'
	},
	lyricsContainerInside: {
		marginTop: 'auto'
	},
	ahead: {
		color: '#FFFFFF',
		opacity: 0.5,
		fontSize: 18,
		fontFamily: 'Neulis',
		textAlign: 'center'
	},
	current: {
		color: '#FFFFFF',
		fontSize: 22,
		fontFamily: 'Neulis700',
		textAlign: 'center'
	},
	test: {
		flex: 1
	}
});

export default GameScreen;

