import { useRouter } from 'expo-router';
import { useCallback, useContext, useState } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BackButton from '../components/BackButton';
import { IRoom } from '../interfaces/IRoom';
import { AppContext } from '../lib/Context';
import { useWS } from '../lib/ws';
import api from '../services/AxiosConfig';

const CreateRoomScreen = () => {
	const [name, setName] = useState('');
	const [error, setError] = useState(false);
	const context = useContext(AppContext);
	const { connect } = useWS();
	const router = useRouter();

	const createRoom = useCallback(() => {
		if (name.trim() === '') {
			setError(true);
			return;
		}
		api.post<IRoom>('/rooms')
			.then((res) => {
				const { id } = res.data;
				context.setRoom(id);

				api.post<{ otp: string }>(`/rooms/${id}/join`, {
					name,
				})
					.then((res) => {
						const { otp } = res.data;

						connect(otp);
						router.push('/lobby');
					})
					.catch((err) => {
						console.error(err);
					});
			})
			.catch((err) => {
				console.log(err);
			});
	}, [context, router, connect]);

	return (
		<ImageBackground
			source={require('../assets/images/BackgroundPic/WelcomeBG.png')}
			imageStyle={{ resizeMode: 'cover' }}
			style={{ height: '100%', width: '100%', justifyContent: 'center' }}
		>
			<View style={styles.container}>
				<Text style={styles.title}>Song Wars</Text>
				<BackButton></BackButton>
				<Text style={styles.text}>Enter Name</Text>
				{error && <Text style={styles.error}>Please enter a name</Text>}
				<TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} maxLength={12}></TextInput>
				<TouchableOpacity style={styles.btn} onPress={() => createRoom()}>
					<Text style={styles.btnText}>Create Room</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.btn} onPress={() => router.push('/lobby')}>
					<Text style={styles.btnText}>Skip</Text>
				</TouchableOpacity>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		marginHorizontal: 20,
		borderRadius: 30,
		height: 320,
		padding: 20,
	},
	title: {
		top: -5.55,
		color: '#210461',
		fontSize: 33,
		fontFamily: 'Neulis700',
		textAlign: 'center',
	},
	text: {
		fontFamily: 'Neulis500',
		color: '#210461',
		fontSize: 19,
		textAlign: 'left',
		paddingVertical: 5,
	},
	btn: {
		marginTop: 17,
		backgroundColor: '#C2E812',
		paddingVertical: 12,
		width: 200,
		borderRadius: 30,
		alignSelf: 'center',
	},
	btnText: {
		fontFamily: 'Neulis500',
		color: '#210461',
		fontSize: 18,
		textAlign: 'center',
	},
	input: {
		height: 50,
		backgroundColor: '#D7E0EB',
		borderRadius: 20,
		paddingLeft: 20,
		width: '100%',
		marginVertical: 5,
	},
	error: {
		color: 'red',
	},
});

export default CreateRoomScreen;
