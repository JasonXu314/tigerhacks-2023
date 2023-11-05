import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import BackButton from '../components/BackButton';
import api from '../services/AxiosConfig';
import { AntDesign } from '@expo/vector-icons';
import { AppContext } from '../lib/Context';
import { useContext } from 'react';
import BackgroundMusic from '../components/BackgroundMusic';

const HomeScreen = () => {
	const router = useRouter();
	const context = useContext(AppContext);

	return (
		<ImageBackground
			source={require('../assets/images/BackgroundPic/HeroPageNoMic.png')}
			imageStyle={{ resizeMode: 'cover' }}
			style={{ height: '100%', width: '100%' }}
		>
			<SafeAreaView style={styles.container}>
				{/* <TouchableOpacity
					style={styles.audio}
					onPress={() => {
						context.stopBgMusic();
					}}
				>
					<AntDesign name="sound" size={55} color="#D7E0EB" />
					<AntDesign name="sound" size={45} color="#C2E812" />
				</TouchableOpacity> */}
				<BackgroundMusic></BackgroundMusic>
				<Image source={require('../assets/images/mic.png')} style={styles.logo}></Image>
				<Text style={styles.title}>Song Wars</Text>
				<Text style={styles.p}>Compete with your friends on exciting karaoke arena! Create lobbies, vote and have fun!</Text>
				<View style={styles.btnBox}>
					<TouchableOpacity style={styles.btn} onPress={() => router.push('/createroom')}>
						<Text style={styles.btnText}>Create Room</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.btn} onPress={() => router.push('/joinroom')}>
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

		padding: 20,
	},
	title: {
		color: '#C2E812',
		fontSize: 48,
		fontFamily: 'Neulis800',
		textAlign: 'center',
	},
	btn: {
		marginTop: 10,
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
	audio: {
		position: 'absolute',
		right: 26,
		top: 65,
	},
});

export default HomeScreen;
