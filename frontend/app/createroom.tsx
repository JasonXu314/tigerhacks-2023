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
			<View style={styles.box}>
				<BackButton></BackButton>
				<Text style={styles.title}>Song Wars</Text>
				<View>
					<Text style={styles.text}>Name</Text>
					<TextInput placeholder="Enter the name..." style={styles.input} value={name} onChangeText={setName} maxLength={12} />
				</View>

				<TouchableOpacity style={[styles.btn, { alignItems: 'center' }]} onPress={() => createRoom()}>
					<Text style={styles.btnText}>Create Room</Text>
				</TouchableOpacity>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	box: {
		backgroundColor: 'white',
		marginHorizontal: 20,
		borderRadius: 30,
		paddingHorizontal: 20,
		paddingVertical: 40,
		gap: 15,
		justifyContent: 'center',
	},
	btn: {
		backgroundColor: '#C2E812',
		paddingVertical: 12,
		width: 200,
		borderRadius: 30,
		alignSelf: 'center',
		marginTop: 8,
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
        fontSize: 16,
        marginTop: 2,
	},
	text: {
		fontFamily: 'Neulis500',
		color: '#210461',
		fontSize: 19,
		textAlign: 'left',
		paddingLeft: 10,
	},
	title: {
		color: '#210461',
		fontSize: 33,
		fontFamily: 'Neulis700',
		textAlign: 'center',
	},
});

export default CreateRoomScreen;
