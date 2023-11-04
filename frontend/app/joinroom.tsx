import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import BackButton from '../components/BackButton';

const JoinRoomScreen = () => {
	const router = useRouter();

	return (
		<ImageBackground
			source={require('../assets/images/BackgroundPic/DefaultBackground.png')}
			imageStyle={{ resizeMode: 'cover' }}
			style={{ height: '100%', width: '100%', justifyContent: 'center' }}
		>
			<SafeAreaView style={styles.container}>
				<View style={styles.box}>
					<BackButton></BackButton>
					<Text style={styles.text}>Name</Text>
					<TextInput style={styles.input} />
					<Text style={styles.text}>Room Code</Text>
					<TextInput style={styles.input} />

					<TouchableOpacity style={styles.btn} onPress={() => router.push('voting')}>
						<Text style={styles.btnText}>Join Room</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	// container: {
	// 	flex: 1,
	// 	display: 'flex',
	// 	justifyContent: 'center',
	// 	alignItems: 'center',
	// 	flexDirection: 'column',
	// },
	// box: {
	// 	display: 'flex',
	// 	gap: 16,
	// 	backgroundColor: 'white',
	// 	borderRadius: 30,
	// 	height: 350,
	// 	width: 300,
	// 	paddingTop: 70,
	// 	paddingHorizontal: 30,
	// },
	container: {
		marginHorizontal: 20,
		borderRadius: 30,
		height: '40%',
		overflow: 'hidden',
		padding: 25,
		gap: 10,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
	},
	btn: {
		backgroundColor: '#C2E812',
		paddingVertical: 12,
		width: 200,
		borderRadius: 30,
		marginLeft: 20,
		marginTop: 10,
	},
	btnText: {
		fontFamily: 'Neulis500',
		color: '#210461',
		fontSize: 18,
		textAlign: 'center',
	},

	input: {
		height: 40,
		backgroundColor: '#D7E0EB',
		borderRadius: 8,
		paddingHorizontal: 4,
	},
	text: {
		fontFamily: 'Neulis500',
		color: '#210461',
		fontSize: 18,
		textAlign: 'left',
	},
});

export default JoinRoomScreen;
