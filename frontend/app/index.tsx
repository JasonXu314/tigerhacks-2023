import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import BackButton from '../components/BackButton';
import api from '../services/AxiosConfig';

const HomeScreen = () => {
	const router = useRouter();

	const createRoom = () => {
		api.post('/rooms')
			.then((resp) => {
				console.log(resp.data);
			})
			.catch((err) => {
				console.log(err);
			});
		router.push('createroom');
	};

	return (
		<ImageBackground
			source={require('../assets/images/BackgroundPic/HeroPageWMic.png')}
			imageStyle={{ resizeMode: 'cover' }}
			style={{ height: '100%', width: '100%' }}
		>
			<SafeAreaView style={styles.container}>
				<BackButton></BackButton>
				<Text style={styles.p}>Hello</Text>
				<TouchableOpacity style={styles.btn} onPress={() => createRoom()}>
					<Text style={styles.btnText}>Create Room</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.btn} onPress={() => createRoom()}>
					<Text style={styles.btnText}>Join Room</Text>
				</TouchableOpacity>
			</SafeAreaView>
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
	btn: {
		marginTop: 20,
		backgroundColor: '#C2E812',
		borderRadius: 30,
		paddingVertical: 12,
		width: 200,
	},
	btnText: {
		fontFamily: 'Neulis500',
		color: '#210461',
		fontSize: 20,
		textAlign: 'center',
	},
	p: {
		fontFamily: 'Neulis500',
		color: '#210461',
		fontSize: 20,
		textAlign: 'center',
	},
});

export default HomeScreen;
