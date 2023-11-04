import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useMemo } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../lib/Context';
import { useGame } from '../lib/game-data';
import { useWS } from '../lib/ws';
import api from '../services/AxiosConfig';

const VotingScreen = () => {
	const router = useRouter();
	const context = useContext(AppContext);
	const { send } = useWS();
	const { data } = useGame();
	const contestants = useMemo(() => data!.contestants, [data]);

	useEffect(() => {
		let playerid = ''; // TODO: replace with actual id
		api.get(`/room/${context.room}/recording/${playerid}`)
			.then((resp) => {})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<ImageBackground
			source={require('../assets/images/BackgroundPic/VoteBG.png')}
			imageStyle={{ resizeMode: 'cover' }}
			style={{ height: '100%', width: '100%' }}>
			<SafeAreaView style={styles.container}>
				<View style={styles.playerOne}>
					<Image source={require('../assets/images/profile-pic/bee.png')} style={styles.pfp}></Image>
					<View style={styles.audio}>
						<TouchableOpacity>
							<AntDesign name="playcircleo" size={30} color="#210461" style={styles.icon} />
						</TouchableOpacity>
						<Text style={styles.songName}>Jason - Super Shy</Text>
					</View>
					<TouchableOpacity style={styles.btn}>
						<Text
							style={styles.btnText}
							onPress={() => {
								send({ type: 'SUBMIT_VOTE', data: { id: contestants[0].id } });
							}}>
							Vote
						</Text>
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
						onPress={() => {
							send({ type: 'SUBMIT_VOTE', data: { id: contestants[1].id } });
						}}>
						<Text style={styles.btnText}>Vote</Text>
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

