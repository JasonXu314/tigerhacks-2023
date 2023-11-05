import { Audio, InterruptionModeAndroid, InterruptionModeIOS, AVPlaybackStatus } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { Image, ImageBackground, StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { AppContext } from '../lib/Context';
import { Avatars } from '../lib/Images';
import { LyricsData } from '../data/LyricsData';
import { ILine } from '../interfaces/ILine';
import * as FileSystem from 'expo-file-system';
import api from '../services/AxiosConfig';
import { SongList } from '../data/SongList';
import { Buffer } from 'buffer';
import { useGame } from '../lib/game-data';
import { IPlayer } from '../interfaces/IPlayer';
import { AxiosError } from 'axios';

const GameScreen = () => {
	const router = useRouter();
	const context = useContext(AppContext);
	const [song, setSong] = useState<Audio.Sound>(new Audio.Sound());
	const [recording, setRecording] = useState<Audio.Recording>(new Audio.Recording());
	const [stopSong, setStopSong] = useState(false);
	const [words, setWords] = useState<ILine[]>([]);
	const [over, setOver] = useState(false);
	const [ahead, setAhead] = useState('');
	const scrollViewRef = useRef<any>(null);

	const { data } = useGame();

	function onPlaybackStatusUpdate(status: AVPlaybackStatus) {
		if (status.isLoaded) {
			if (!status.didJustFinish) {
				return;
			}
			stopRecording();

			// send recording and then move screens
		}
	}

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

		const { sound } = await Audio.Sound.createAsync(SongList.find((sng) => sng.name === context.song)!.track);

		sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

		setSong(sound);

		await sound.playAsync();
	}

	async function startRecording() {
		try {
			await Audio.requestPermissionsAsync();
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
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
			allowsRecordingIOS: false,
		});
		const recordingUri = recording.getURI();
		if (recordingUri) {
			const recordingBase64 = await FileSystem.readAsStringAsync(recordingUri, {
				encoding: FileSystem.EncodingType.Base64,
			});
			const languageCode = 'en';

			const buffer = Buffer.from(recordingBase64, 'base64');
			const blob = new Blob([buffer], { type: 'audio/mp3' });
			const file = new File([blob], 'test.mp3', { type: 'audio/mp3' });

			const formData = new FormData();
			if (data?.players) {
				const player = data.players.find((player) => player.name === context.name)!;
				formData.append('id', player.id.toString());
			}
			formData.append('file', file);

			api.post(`/rooms/${context.room}/submit`, formData)
				.then(() => {
				})
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
				return;
			}

			if (line && !words.find((word) => word.startTimeMs === line.startTimeMs)) {
				setWords((words) => {
					if (!words.find((word) => word.startTimeMs === line.startTimeMs)) {
						return [...words, line];
					}
					return words;
				});
				setAhead(lines[lines.indexOf(line) - 1].words);
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
						endTimeMs: '',
					},
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
						endTimeMs: '',
					},
				]);
			} else if (delta > 1000) {
				setWords((words) => [
					...words,
					{
						startTimeMs: '0',
						words: '3',
						syllables: [],
						endTimeMs: '',
					},
				]);
			}

			timeout = setTimeout(tick, 1000);
		};

		timeout = setTimeout(tick, 1000);

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
			style={{ height: '100%', width: '100%' }}
		>
			<View style={styles.container}>
				<View style={styles.lyricsContainer}>
					<View style={styles.test}></View>
					<ScrollView
						style={styles.lyricsContainerInside}
						showsVerticalScrollIndicator={false}
						ref={scrollViewRef}
						onContentSizeChange={() => {
							scrollViewRef.current.scrollToEnd({ animated: true });
						}}
					>
						{words.map((line, i) => (
							<Text key={i} style={i === words.length - 1 ? styles.current : styles.line}>
								{line.words}
							</Text>
						))}
						<Text style={styles.ahead}>{ahead}</Text>
					</ScrollView>
				</View>
				<TouchableOpacity style={{ zIndex: 99 }} onPress={() => stopRecording()}>
					<Text>Stop Recording</Text>
				</TouchableOpacity>

				<Image source={Avatars[context.avatar]} style={styles.avatar}></Image>
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
		padding: 20,
	},
	avatar: {
		position: 'absolute',
		bottom: 35,
		height: 110,
		width: 110,
	},
	ring: {
		position: 'absolute',
		bottom: 0,
	},
	line: {
		marginTop: 'auto',
		color: '#FFFFFF',
		opacity: 0.5,
		fontSize: 18,
		fontFamily: 'Neulis',
		textAlign: 'center',
	},
	lyricsContainer: {
		paddingTop: 40,
		display: 'flex',
		maxHeight: '50%',
		overflow: 'hidden',
		marginBottom: 'auto',
	},
	lyricsContainerInside: {
		marginTop: 'auto',
	},
	ahead: {
		color: '#FFFFFF',
		opacity: 0.5,
		fontSize: 18,
		fontFamily: 'Neulis',
		textAlign: 'center',
	},
	current: {
		color: '#FFFFFF',
		fontSize: 22,
		fontFamily: 'Neulis700',
		textAlign: 'center',
	},
	test: {
		flex: 1,
	},
});

export default GameScreen;
