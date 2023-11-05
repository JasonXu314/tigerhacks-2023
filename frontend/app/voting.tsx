import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IPlayer } from '../interfaces/IPlayer';
import { AppContext } from '../lib/Context';
import { useGame } from '../lib/game-data';
import { VotingEndDTO, useWS, useWSMessage } from '../lib/ws';
import api from '../services/AxiosConfig';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import { Buffer } from 'buffer';
import { Avatars } from '../lib/Images';
import Loading from '../components/Loading';

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
	const [player1, setPlayer1] = useState<VotePlayer>();
	const [player2, setPlayer2] = useState<VotePlayer>();
    const [init, setInit] = useState(true);

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
			api.get(`/room/${context.room}/recording/${contestants[0].id}`)
				.then((resp: any) => {
					const blob = new Blob([resp], { type: 'audio/mp3' });
					const file = new File([blob], 'test.mp3', { type: 'audio/mp3' });
					setPlayer1({
						player: contestants[0],
						recording: file,
					});
                    setInit(false);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, []);

    async function playSound(file: File) {
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			staysActiveInBackground: true,
			interruptionModeIOS: InterruptionModeIOS.DuckOthers,
			playsInSilentModeIOS: true,
			shouldDuckAndroid: true,
			interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
			playThroughEarpieceAndroid: false,
		});

		const { sound } = await Audio.Sound.createAsync(file);

		// sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

		setSong(sound);

		await sound.playAsync();
	}

    if (init) return <Loading></Loading>

	return (
		<ImageBackground
			source={require('../assets/images/BackgroundPic/VoteBG.png')}
			imageStyle={{ resizeMode: 'cover' }}
			style={{ height: '100%', width: '100%' }}
		>
			<SafeAreaView style={styles.container}>
				<View style={styles.playerOne}>
					<Image source={Avatars[player1?.player.avatar!]} style={styles.pfp}></Image>
					<View style={styles.audio}>
						<TouchableOpacity>
							<AntDesign name="playcircleo" size={30} color="#210461" style={styles.icon} />
						</TouchableOpacity>
						<Text style={styles.songName}>Jason - Super Shy</Text>
					</View>
					<TouchableOpacity
						disabled={voted === 'top'}
						style={styles.btn}
						onPress={() => {
							setVoted('top');
							send({ event: 'SUBMIT_VOTE', data: { id: contestants[0].id } });
						}}
					>
						<Text style={styles.btnText}>{voted === 'top' ? 'Voted' : 'Vote'}</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.between}>
					<Image source={require('../assets/images/MicLeft.png')} style={styles.icon}></Image>
					<Text style={styles.title}>VS</Text>
					<Image source={require('../assets/images/MicRight.png')} style={styles.icon}></Image>
				</View>
				<View style={styles.playerTwo}>
					<Image source={require('../assets/images/profile-pic/unicorn.png')} style={styles.pfp}></Image>
					<View style={styles.audio}>
						<TouchableOpacity>
							<AntDesign name="playcircleo" size={30} color="#210461" style={styles.icon} />
						</TouchableOpacity>
						<Text style={styles.songName}>Jason - Super Shy</Text>
					</View>
					<TouchableOpacity
						style={styles.btn}
						disabled={voted === 'bottom'}
						onPress={() => {
							setVoted('bottom');
							send({ event: 'SUBMIT_VOTE', data: { id: contestants[1].id } });
						}}
					>
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
		paddingVertical: 47,
	},
	playerOne: {
		backgroundColor: 'white',
		display: 'flex',
		height: 260,
		width: 350,
		borderRadius: 30,
		alignItems: 'center',
	},
	playerTwo: {
		backgroundColor: 'white',
		display: 'flex',
		height: 260,
		width: 350,
		borderRadius: 30,
		alignItems: 'center',
	},
	btn: {
		backgroundColor: '#C2E812',
		paddingVertical: 12,
		width: 145,
		borderRadius: 30,
		marginLeft: 20,
		marginTop: 3,
	},
	btnText: {
		fontFamily: 'Neulis700',
		color: '#210461',
		fontSize: 18,
		textAlign: 'center',
	},
	title: {
		color: '#C2E812',
		fontSize: 35,
		fontFamily: 'Neulis800',
		textAlign: 'center',
		paddingHorizontal: 15,
	},
	between: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	icon: {},
	pfp: {
		marginTop: 10,
		height: 100,
		width: 100,
		borderColor: '#C2E812',
		borderWidth: 3,
		borderRadius: 50,
	},
	audio: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 20,
		paddingVertical: 23,
	},
	songName: {
		fontFamily: 'Neulis500',
		color: '#210461',
		fontSize: 25,
		textAlign: 'center',
	},
});

export default VotingScreen;
