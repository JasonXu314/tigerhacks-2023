import { useRouter } from 'expo-router';
import { useContext, useMemo, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackButton from '../components/BackButton';
import Loading from '../components/Loading';
import Player from '../components/Player';
import SongSelector from '../components/SongSelector';
import { AppContext } from '../lib/Context';
import { useGame } from '../lib/game-data';
import { AddContestantDTO, ClientErrorDTO, InitRoomDTO, JoinDTO, RemoveContestantDTO, SetSongDTO, StartGameDTO, useWS, useWSMessage } from '../lib/ws';

const LobbyScreen = () => {
	const [songSelectorVisible, setSongSelectorVisible] = useState(false);
	const context = useContext(AppContext);
	const router = useRouter();
	const { init, addContestant, removeContestant, addPlayer, data } = useGame();
	const players = useMemo(() => (data === null ? [] : data.players), [data]);
	const contestants = useMemo(() => (data === null ? [] : data.contestants), [data]);
	const host = useMemo(() => (data === null ? null : data.host), [data]);
	const [error, setError] = useState('');
	const { send } = useWS();

	useWSMessage<InitRoomDTO>('INIT_ROOM', ({ room: { players, contestants, host } }) => {
		init(players, contestants, host);
	});

	useWSMessage<ClientErrorDTO>('CLIENT_ERROR', () => {
		console.error('WS Client error');
		router.push('/');
	});

	useWSMessage<AddContestantDTO>('ADD_CONTESTANT', ({ id }) => {
		addContestant(id);
	});

	useWSMessage<RemoveContestantDTO>('REMOVE_CONTESTANT', ({ id }) => {
		removeContestant(id);
	});

	useWSMessage<SetSongDTO>('SET_SONG', ({ name }) => {
		context.setSong(name);
	});

	const startGame = () => {
		if (contestants.length < 2 ) {
			setError('Not enough players singing to start. Add some singers!');
		} else {
			send({ event: 'START_GAME' });
		}
	};

	useWSMessage<JoinDTO>('JOIN', ({ player }) => {
		addPlayer(player);
	});

	useWSMessage<StartGameDTO>('START_GAME', () => {
		router.push('/game');
		// whatever else needs to be done here?
	});

	useWSMessage<ClientErrorDTO>('CLIENT_ERROR', () => {
		console.warn('client error ws');
	});

	if (!data) {
		return <Loading></Loading>;
	}

	return (
		<ImageBackground
			source={require('../assets/images/BackgroundPic/DefaultBackground.png')}
			imageStyle={{ resizeMode: 'cover' }}
			style={{ height: '100%', width: '100%' }}>
			<View style={styles.container}>
				<BackButton onPress={() => send({ event: 'LEAVE_ROOM' })}></BackButton>
				<View>
					<Text style={[styles.codeTitle, { textAlign: 'center' }]}>Room Code</Text>
					<Text style={styles.code}>{context.room}</Text>
				</View>
				<View style={styles.col}>
					<Text style={styles.title}>Song</Text>
					<SongSelector modalVisible={songSelectorVisible} setModalVisible={setSongSelectorVisible}></SongSelector>
				</View>
				<View style={styles.col}>
					<Text style={styles.title}>Singers</Text>
					{error && <Text style={styles.error}>{error}</Text>}
					<ScrollView horizontal contentContainerStyle={{ gap: 10 }}>
						{contestants &&
							contestants.map((player) => (
								<Player
									key={player.id}
									id={player.id}
									name={player.name}
									avatar={player.avatar}
									contestants={contestants}
									isHost={context.name === host?.name} // Should be using id but whatever
								/>
							))}
						{contestants.length < 2 && <View style={styles.slot}></View>}
						{contestants.length < 1 && <View style={styles.slot}></View>}
					</ScrollView>
				</View>
				<View style={styles.col}>
					<Text style={styles.title}>Spectators</Text>
					<ScrollView horizontal contentContainerStyle={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
						{players &&
							players
								.filter((player) => !contestants.some((p) => p.id === player.id))
								.map((player) => (
									<Player
										key={player.id}
										id={player.id}
										name={player.name}
										avatar={player.avatar}
										contestants={contestants}
										isHost={context.name === host?.name}
									/>
								))}
					</ScrollView>
				</View>
				<TouchableOpacity style={styles.button} onPress={() => startGame()}>
					<Text style={styles.buttonText}>Start</Text>
				</TouchableOpacity>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: 20,
		marginVertical: '15%',
		borderRadius: 30,
		overflow: 'hidden',
		padding: 25,
		gap: 10,
		backgroundColor: 'white'
	},
	title: {
		fontSize: 25,
		fontFamily: 'Neulis500',
		color: '#210461'
	},
	codeTitle: {
		fontSize: 25,
		fontFamily: 'Neulis500',
		color: '#210461'
	},
	code: {
		fontSize: 30,
		textAlign: 'center',
		fontFamily: 'Neulis700',
		color: '#210461'
	},
	col: {
		display: 'flex',
		gap: 10
	},
	row: {
		display: 'flex',
		flexDirection: 'row',
		gap: 10
	},
	button: {
		backgroundColor: '#C2E812',
		paddingVertical: 13,
		paddingHorizontal: 50,
		borderRadius: 30,
		alignSelf: 'center',
		marginTop: 'auto'
	},
	buttonText: {
		fontSize: 20,
		fontFamily: 'Neulis500',
		color: '#210461',
		textAlign: 'center'
	},
	slot: {
		backgroundColor: '#DEDEDE',
		height: 50,
		width: 50,
		borderRadius: 50
	},
	error: {
		color: 'red',
		fontFamily: 'Neulis',
		fontSize: 15,
		borderColor: 'red',
		borderWidth: 1,
		padding: 10,
		borderRadius: 20
	}
});

export default LobbyScreen;

