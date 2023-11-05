import { AntDesign } from '@expo/vector-icons';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loading from '../components/Loading';
import { IPlayer } from '../interfaces/IPlayer';
import { AppContext } from '../lib/Context';
import { Avatars } from '../lib/Images';
import { useGame } from '../lib/game-data';
import { VotingEndDTO, useWS, useWSMessage } from '../lib/ws';

interface VotePlayer {
	player: IPlayer;
	recording: File;
}

const VotingScreen = () => {
	const router = useRouter();
	const context = useContext(AppContext);
	const { send } = useWS();
	const { data, setResults, incrementScore } = useGame();
	const contestants = useMemo(() => data!.contestants, [data]);
	const [voted, setVoted] = useState<'top' | 'bottom' | ''>('');
	const [player1, setPlayer1] = useState<IPlayer>();
	const [player2, setPlayer2] = useState<IPlayer>();
	const [init, setInit] = useState(true);
	const [song, setSong] = useState<Audio.Sound>(new Audio.Sound());

	useWSMessage<VotingEndDTO>('VOTING_END', ({ result }) => {
		setResults(result);
		if (result !== 'TIED') {
			incrementScore(result.winner);
		}
		router.push('/winner');
	});

	useEffect(() => {
		if (data) {
			const contestants = data.contestants;
			setPlayer1(contestants[0]);
			setPlayer2(contestants[1]);
			setInit(false);
		}
	}, []);

	async function playSound(uri: string) {
		console.log('playing sound');
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			staysActiveInBackground: true,
			interruptionModeIOS: InterruptionModeIOS.DuckOthers,
			playsInSilentModeIOS: true,
			shouldDuckAndroid: true,
			interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
			playThroughEarpieceAndroid: false
		});

		const { sound } = await Audio.Sound.createAsync({ uri });

		setSong(sound);

		await sound.playAsync();
	}

	useEffect(() => {
		return song
			? () => {
					song.unloadAsync();
			  }
			: undefined;
	}, [song]);

	if (init) return <Loading></Loading>;

	return (
		<ImageBackground
			source={require('../assets/images/BackgroundPic/VoteBG.png')}
			imageStyle={{ resizeMode: 'cover' }}
			style={{ height: '100%', width: '100%' }}>
			<SafeAreaView style={styles.container}>
				<View style={styles.playerOne}>
					<Image source={Avatars[player1?.avatar!]} style={styles.pfp}></Image>
					<View style={styles.audio}>
						<TouchableOpacity onPress={() => playSound(`https://hktn.jasonxu.dev/rooms/${context.room}/recordings/${contestants[0].id}`)}>
							<AntDesign name="playcircleo" size={30} color="#210461" style={styles.icon} />
						</TouchableOpacity>
						<Text style={styles.songName}>
							{player1?.name} - {context.song}
						</Text>
					</View>
					<TouchableOpacity
						disabled={voted === 'top'}
						style={[styles.btn, voted === 'top' ? { backgroundColor: 'lightgrey' } : {}]}
						onPress={() => {
							setVoted('top');
							send({ event: 'SUBMIT_VOTE', data: { id: contestants[0].id } });
						}}>
						<Text style={styles.btnText}>{voted === 'top' ? 'Voted' : 'Vote'}</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.between}>
					<Image source={require('../assets/images/MicLeft.png')} style={styles.icon}></Image>
					<Text style={styles.title}>VS</Text>
					<Image source={require('../assets/images/MicRight.png')} style={styles.icon}></Image>
				</View>
				<View style={styles.playerTwo}>
					<Image source={Avatars[player2?.avatar!]} style={styles.pfp}></Image>
					<View style={styles.audio}>
						<TouchableOpacity onPress={() => playSound(`https://hktn.jasonxu.dev/rooms/${context.room}/recordings/${contestants[0].id}`)}>
							<AntDesign name="playcircleo" size={30} color="#210461" style={styles.icon} />
						</TouchableOpacity>
						<Text style={styles.songName}>
							{player2?.name} - {context.song}
						</Text>
					</View>
					<TouchableOpacity
						style={[styles.btn, voted === 'bottom' ? { backgroundColor: 'lightgrey' } : {}]}
						disabled={voted === 'bottom'}
						onPress={() => {
							setVoted('bottom');
							send({ event: 'SUBMIT_VOTE', data: { id: contestants[1].id } });
						}}>
						<Text style={styles.btnText}>{voted === 'bottom' ? 'Voted' : 'Vote'}</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around',
		// padding: 20,
		paddingVertical: 47
	},
	playerOne: {
		backgroundColor: 'white',
		display: 'flex',
		height: 260,
		width: 350,
		borderRadius: 30,
		alignItems: 'center'
	},
	playerTwo: {
		backgroundColor: 'white',
		display: 'flex',
		height: 260,
		width: 350,
		borderRadius: 30,
		alignItems: 'center'
	},
	btn: {
		backgroundColor: '#C2E812',
		paddingVertical: 12,
		width: 145,
		borderRadius: 30,
		marginLeft: 20,
		marginTop: 3
	},
	btnText: {
		fontFamily: 'Neulis700',
		color: '#210461',
		fontSize: 18,
		textAlign: 'center'
	},
	title: {
		color: '#C2E812',
		fontSize: 35,
		fontFamily: 'Neulis800',
		textAlign: 'center',
		paddingHorizontal: 15
	},
	between: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	icon: {},
	pfp: {
		marginTop: 10,
		height: 100,
		width: 100,
		borderColor: '#C2E812',
		borderWidth: 3,
		borderRadius: 50
	},
	audio: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 20,
		paddingVertical: 23
	},
	songName: {
		fontFamily: 'Neulis500',
		color: '#210461',
		fontSize: 25,
		textAlign: 'center'
	}
});

export default VotingScreen;

