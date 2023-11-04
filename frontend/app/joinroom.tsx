import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import BackButton from '../components/BackButton';

const JoinRoomScreen = () => {
	const router = useRouter();

	return (
		<ImageBackground
			source={require('../assets/images/BackgroundPic/WelcomeBG.png')}
			imageStyle={{ resizeMode: 'cover' }}
			style={{ height: '100%', width: '100%', justifyContent: 'center' }}
		>
			<SafeAreaView style={styles.container}>
				<View style={styles.box}>
					<BackButton></BackButton>
					<Text style={styles.title}>Song Wars</Text>
					<Text style={styles.textOne}>Name</Text>
					<TextInput placeholder="Enter the name..." style={styles.input} maxLength={12} />
					<Text style={styles.text}>Room Code</Text>
					<TextInput placeholder="Enter the code.." style={styles.input} maxLength={12} />

					<TouchableOpacity style={[styles.btn, { alignItems: 'center' }]} onPress={() => router.push('voting')}>
						<Text style={styles.btnText}>Join Room</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {},
	box: {
		backgroundColor: 'white',
		marginHorizontal: 20,
		borderRadius: 30,
		height: 350,
		padding: 20,
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
	text: {
		fontFamily: 'Neulis500',
		color: '#210461',
		fontSize: 19,
		textAlign: 'left',
		paddingBottom: 6,
	},
	textOne: {
		fontFamily: 'Neulis500',
		color: '#210461',
		fontSize: 19,
		textAlign: 'left',
		paddingVertical: 6,
	},
	title: {
		top: -5.55,
		color: '#210461',
		fontSize: 33,
		fontFamily: 'Neulis700',
		textAlign: 'center',
	},
});

export default JoinRoomScreen;
