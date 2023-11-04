import { useRouter } from 'expo-router';
import { useCallback, useContext, useState } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BackButton from '../components/BackButton';
import { IRoom } from '../interfaces/IRoom';
import { AppContext } from '../lib/Context';
import { useWS } from '../lib/ws';
import api from '../services/AxiosConfig';

const CreateRoomScreen = () => {
	const [songSelectorVisible, setSongSelectorVisible] = useState(false);
	const context = useContext(AppContext);
	const { connect } = useWS();
	const router = useRouter();

	const createRoom = useCallback(() => {
		api.post<IRoom>('/rooms')
			.then((res) => {
				const { id } = res.data;
				context.setRoom(id);

				api.post<{ otp: string }>(`/rooms/${id}/join`)
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
			source={require('../assets/images/BackgroundPic/DefaultBackground.png')}
			imageStyle={{ resizeMode: 'cover' }}
			style={{ height: '100%', width: '100%', justifyContent: 'center' }}>
			<View style={styles.container}>
				<BackButton></BackButton>
				<Text style={[styles.title]}>Enter Name</Text>
				<TextInput placeholder="Name" style={styles.input}></TextInput>
				<TouchableOpacity style={styles.btn} onPress={() => /** CHECK THIS (JASON INSERTED THIS) */ createRoom()}>
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
		justifyContent: 'center'
	},
	title: {
		fontSize: 25,
		fontFamily: 'Neulis500'
	},
	btn: {
		marginTop: 20,
		backgroundColor: '#C2E812',
		paddingVertical: 12,
		width: 200,
		borderRadius: 30
	},
	btnText: {
		fontFamily: 'Neulis500',
		color: '#210461',
		fontSize: 18,
		textAlign: 'center'
	},
	input: {
		backgroundColor: '#DEDEDE',
		padding: 10,
		borderRadius: 20,
		width: '100%',
		height: 50,
		paddingLeft: 20
	}
});

export default CreateRoomScreen;

