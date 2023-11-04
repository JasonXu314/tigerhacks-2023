import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import BackButton from '../components/BackButton';
import api from '../services/AxiosConfig';

const HomeScreen = () => {
	const router = useRouter();

	const createRoom = () => {
		api.post('/rooms')
			.then((resp) => {
				console.log(resp.data.id);
			})
			.catch((err) => {
				console.log(err);
			});
		router.push('createroom');
	};

	return (
		<ImageBackground
			source={require('../assets/images/BackgroundPic/HeroPageNoMic.png')}
			imageStyle={{ resizeMode: 'cover' }}
			style={{ height: '100%', width: '100%' }}
		>
			<SafeAreaView style={styles.container}>
				{/*<BackButton></BackButton>*/}
				<Image source={require('../assets/images/mic.png')} style={styles.logo}></Image>
				<Text style={styles.title}>Song Wars</Text>
				<Text style={styles.p}>Compete with your friends on exciting karaoke arena! Create lobbies, vote and have fun!</Text>
				<View style={styles.btnBox}>
					<TouchableOpacity style={styles.btn} onPress={() => createRoom()}>
						<Text style={styles.btnText}>Create Room</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.btn} onPress={() => createRoom()}>
						<Text style={styles.btnText}>Join Room</Text>
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
		// justifyContent: 'center',
		// flexDirection: 'column',

		padding: 20,
	},
	title: {
		color: '#C2E812',
		fontSize: 48,
		fontFamily: 'Neulis800',
		textAlign: 'center',
	},
	btn: {
		marginTop: 20,
		backgroundColor: '#C2E812',
		paddingVertical: 12,
		width: 200,
		borderRadius: 30,
	},
	btnText: {
		fontFamily: 'Neulis500',
		color: '#210461',
		fontSize: 18,
		textAlign: 'center',
	},
	p: {
		fontFamily: 'Neulis500',
		color: 'white',
		fontSize: 18,
		textAlign: 'center',
		paddingVertical: 20,
	},
	btnBox: {
		display: 'flex',
		flexDirection: 'column',
		gap: 15,
		alignItems: 'center',
		marginTop: 10,
	},
	logo: {
		marginTop: 50,
		width: 200,
		height: 200,
	},
});

export default HomeScreen;
