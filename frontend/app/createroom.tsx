import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import SongSelector from '../components/SongSelector';
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../lib/Context';
import Player from '../components/Player';
import api from '../services/AxiosConfig';
import { useRouter } from 'expo-router';

const CreateRoomScreen = () => {
	const [songSelectorVisible, setSongSelectorVisible] = useState(false);
	const context = useContext(AppContext);
	const router = useRouter();

	const createRoom = () => {
		api.post('/rooms')
			.then((resp) => {
				console.log(resp.data.id);
			})
			.catch((err) => {
				console.log(err);
			});
		router.push('/lobby');
	};

	return (
		<ImageBackground
			source={require('../assets/images/BackgroundPic/DefaultBackground.png')}
			imageStyle={{ resizeMode: 'cover' }}
			style={{ height: '100%', width: '100%', justifyContent: 'center' }}
		>
			<View style={styles.container}>
				<BackButton></BackButton>
				<Text style={[styles.title]}>Enter Name</Text>
				<TextInput placeholder="Name" style={styles.input}></TextInput>
				<TouchableOpacity style={styles.btn} onPress={() => router.push('/createroom')}>
					<Text style={styles.btnText}>Create Room</Text>
				</TouchableOpacity>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 20,
		borderRadius: 30,
		height: '50%',
		overflow: 'hidden',
		padding: 25,
		gap: 10,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 25,
		fontFamily: 'Neulis500',
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
	input: {
		backgroundColor: '#DEDEDE',
		padding: 10,
		borderRadius: 20,
		width: '100%',
		height: 50,
        paddingLeft: 20,
	},
});

export default CreateRoomScreen;
