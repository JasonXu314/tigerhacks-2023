import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackButton from '../components/BackButton';
import Player from '../components/Player';
import SongSelector from '../components/SongSelector';
import { IPlayer } from '../interfaces/IPlayer';
import { AppContext } from '../lib/Context';
import { AddContestantDTO, ClientErrorDTO, InitRoomDTO, JoinDTO, RemoveContestantDTO, SetSongDTO, StartGameDTO, useWSMessage } from '../lib/ws';

const LobbyScreen = () => {
	const [songSelectorVisible, setSongSelectorVisible] = useState(false);
	const context = useContext(AppContext);
	const router = useRouter();
	const [players, setPlayers] = useState<IPlayer[]>([
		{
			id: 123,
			name: 'Cooly',
			roomId: 'ACSN',
			score: 1,
			avatar: 'dolphin',
		},
	]); // TODO: consider moving this up to context if not persisted across route changes
	const [contestants, setContestants] = useState<IPlayer[]>([
		{
			id: 113,
			name: 'BBEBEBE',
			roomId: 'ACSN',
			score: 1,
			avatar: 'bee',
		},
		{
			id: 1235,
			name: 'Joe',
			roomId: 'ACSN',
			score: 1,
			avatar: 'cat',
		},
		{
			id: 1234,
			name: 'Bobb',
			roomId: 'ACSN',
			score: 1,
			avatar: 'chicken',
		},
		{
			id: 12345,
			name: 'Bob',
			roomId: 'ACSN',
			score: 1,
			avatar: 'dog',
		},
	]);
	const [host, setHost] = useState<IPlayer>();
	const [error, setError] = useState('');

	useWSMessage<InitRoomDTO>('INIT_ROOM', (msg) => {
		setPlayers(msg.room.players);
		setContestants(msg.room.contestants);
		setHost(msg.room.host);
	});

	useWSMessage<ClientErrorDTO>('CLIENT_ERROR', () => {
		console.error('WS Client error');
		router.push('/');
	});

	useWSMessage<AddContestantDTO>('ADD_CONTESTANT', ({ id }) => {
		setContestants((contestants) => [...contestants, players.find((p) => p.id === id)!]);
	});

	useWSMessage<RemoveContestantDTO>('REMOVE_CONTESTANT', ({ id }) => {
		setContestants((contestants) => contestants.filter((p) => p.id !== id));
	});

	useWSMessage<SetSongDTO>('SET_SONG', ({ name }) => {
		context.setSong(name);
	});

	const startGame = () => {
		if (players.length === 0) {
			setError('Not enough players singing to start. Add some singers!');
		} else if (players.length === 1 || players.length === 3) {
			setError('Odd number of singers found. Please only have 2 or 4 singers!');
		} else {
			router.push('/game');
		}
	};

	useWSMessage<JoinDTO>('JOIN', ({ player }) => {
		setPlayers((players) => [...players, player]);
	});

	useWSMessage<StartGameDTO>('START_GAME', () => {
		router.push('/game');
		// whatever else needs to be done here?
	});

	return (
		<ImageBackground
			source={require('../assets/images/BackgroundPic/DefaultBackground.png')}
			imageStyle={{ resizeMode: 'cover' }}
			style={{ height: '100%', width: '100%' }}
		>
			<View style={styles.container}>
				<BackButton></BackButton>
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
						{players &&
							players.map((player) => (
								<Player
									key={player.id}
									name={player.name}
									avatar={player.avatar}
									players={players}
									spectators={contestants}
									setPlayers={setPlayers}
									setSpectators={setContestants}
								></Player>
							))}
						{players.length < 4 && <View style={styles.slot}></View>}
						{players.length < 3 && <View style={styles.slot}></View>}
						{players.length < 2 && <View style={styles.slot}></View>}
						{players.length < 1 && <View style={styles.slot}></View>}
					</ScrollView>
				</View>
				<View style={styles.col}>
					<Text style={styles.title}>Spectators</Text>
					<ScrollView horizontal contentContainerStyle={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
						{contestants &&
							contestants.map((player) => (
								<Player
									key={player.id}
									name={player.name}
									spectators={contestants}
									avatar={player.avatar}
									players={players}
									setPlayers={setPlayers}
									setSpectators={setContestants}
								></Player>
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
		backgroundColor: 'white',
	},
	title: {
		fontSize: 25,
		fontFamily: 'Neulis500',
	},
	codeTitle: {
		fontSize: 25,
		fontFamily: 'Neulis500',
	},
	code: {
		fontSize: 30,
		textAlign: 'center',
		fontFamily: 'Neulis700',
	},
	col: {
		display: 'flex',
		gap: 10,
	},
	row: {
		display: 'flex',
		flexDirection: 'row',
		gap: 10,
	},
	button: {
		backgroundColor: '#C2E812',
		paddingVertical: 13,
		paddingHorizontal: 50,
		borderRadius: 30,
		alignSelf: 'center',
		marginTop: 'auto',
	},
	buttonText: {
		fontSize: 20,
		fontFamily: 'Neulis500',
		color: '#210461',
		textAlign: 'center',
	},
	slot: {
		backgroundColor: '#DEDEDE',
		height: 50,
		width: 50,
		borderRadius: 50,
	},
	error: {
		color: 'red',
		fontFamily: 'Neulis',
		fontSize: 15,
		borderColor: 'red',
		borderWidth: 1,
		padding: 10,
		borderRadius: 20,
	},
});

export default LobbyScreen;
