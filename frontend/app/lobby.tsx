import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackButton from '../components/BackButton';
import Player from '../components/Player';
import SongSelector from '../components/SongSelector';
import { IPlayer } from '../interfaces/IPlayer';
import { AppContext } from '../lib/Context';
import { AddContestantDTO, ClientErrorDTO, InitRoomDTO, RemoveContestantDTO, SetSongDTO, useWSMessage } from '../lib/ws';

const LobbyScreen = () => {
	const [songSelectorVisible, setSongSelectorVisible] = useState(false);
	const context = useContext(AppContext);
	const router = useRouter();
	const [players, setPlayers] = useState<IPlayer[]>([]); // TODO: consider moving this up to context if not persisted across route changes
	const [contestants, setContestants] = useState<IPlayer[]>([]);
	const [host, setHost] = useState<IPlayer>();

	useWSMessage<InitRoomDTO>('INIT_ROOM', (msg) => {
		setPlayers(msg.room.players);
		setContestants(msg.room.contestants);
		setHost(msg.room.host);
	});

	useWSMessage<ClientErrorDTO>('CLIENT_ERROR', () => {
		router.push('/');
	});

	useWSMessage<AddContestantDTO>('ADD_CONTESTANT', ({ id }) => {
		setContestants((contestants) => [...contestants, players.find((p) => p.id === id)!]);
	});

	useWSMessage<RemoveContestantDTO>('REMOVE_CONTESTANT', ({ id }) => {
		setContestants((contestants) => contestants.filter((p) => p.id !== id));
	});

	useWSMessage<SetSongDTO>('SET_SONG', ({ name }) => {
		// TODO: set song to name, idk how lol
	});

	return (
		<ImageBackground
			source={require('../assets/images/BackgroundPic/DefaultBackground.png')}
			imageStyle={{ resizeMode: 'cover' }}
			style={{ height: '100%', width: '100%' }}>
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
				</View>
				<View style={styles.col}>
					<Text style={styles.title}>Spectators</Text>
				</View>
				<TouchableOpacity>
					<Text>Start Game</Text>
				</TouchableOpacity>
				<Player name="Cooly4477888" avatar="bee"></Player>
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
		fontFamily: 'Neulis500'
	},
	codeTitle: {
		fontSize: 25,
		fontFamily: 'Neulis500'
	},
	code: {
		fontSize: 30,
		textAlign: 'center',
		fontFamily: 'Neulis700'
	},
	col: {
		display: 'flex',
		gap: 10
	}
});

export default LobbyScreen;

