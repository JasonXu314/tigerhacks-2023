import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../lib/game-data';
import { CloseRoundDTO, useWSMessage } from '../lib/ws';

const WinnerScreen = () => {
	const router = useRouter();
	const { data, reset } = useGame();
	const results = useMemo(() => data!.results, [data]);

	useWSMessage<CloseRoundDTO>('CLOSE_ROUND', () => {
		reset();
		router.push('/lobby'); // TODO: use back?
	});

	return (
		<ImageBackground
			source={require('../assets/images/BackgroundPic/WinnerBG.png')}
			imageStyle={{ resizeMode: 'cover' }}
			style={{ height: '100%', width: '100%' }}
		>
			<SafeAreaView style={styles.container}>
				<View style={styles.box}>
					<Text style={styles.p}>Winner of this match is..</Text>
					<Image source={require('../assets/images/Emoji.png')} style={styles.emoji}></Image>
					<Text style={styles.pWinner}>
						{results === 'TIED'
							? `${data?.contestants[0]} and ${data?.contestants[1]}`
							: data?.players.find((player) => player.id === results?.winner)?.name}
					</Text>
					<Text style={styles.p}>Votes: {results === 'TIED' ? `${data?.players.length! - 2}` : results?.votes}</Text>
					{results !== 'TIED' && (
						<Text style={styles.pLoser}>
							But don't get upset, {data?.contestants.find((player) => player.id !== results?.winner)!.name}, you had{' '}
							{results?.votes! - data?.players.length! - 2} votes!
						</Text>
					)}

					{/* TODO: this is not how to rematch, send CLOSE_ROUND websocket event */}
					<TouchableOpacity
						style={styles.btn}
						onPress={() => {
							router.back();
							router.back();
							router.back();
						}}
					>
						<Text style={styles.btnText}>Rematch</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	box: {
		height: 550,
		width: 300,
		backgroundColor: 'white',
		borderRadius: 30,
		display: 'flex',
		alignItems: 'center',
	},
	p: {
		color: '#210461',
		fontFamily: 'Neulis700',
		fontSize: 25,
		paddingHorizontal: 30,
		textAlign: 'center',
		paddingTop: 20,
	},
	pWinner: {
		textDecorationLine: 'underline',
		color: '#210461',
		fontFamily: 'Neulis700',
		fontSize: 25,
		paddingTop: 20,
	},
	pLoser: {
		color: '#210461',
		fontFamily: 'Neulis700',
		fontSize: 20,
		paddingTop: 20,
		textAlign: 'center',
		paddingHorizontal: 20,
	},
	emoji: {
		marginTop: 20,
		height: 140,
		width: 140,
	},
	btn: {
		backgroundColor: '#C2E812',
		paddingVertical: 12,
		width: 200,
		borderRadius: 30,
		marginLeft: 20,
		marginTop: 30,
	},
	btnText: {
		fontFamily: 'Neulis500',
		color: '#210461',
		fontSize: 18,
		textAlign: 'center',
	},
});

export default WinnerScreen;
