import { StyleSheet, Text, View, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const JoinRoomScreen = () => {
	const router = useRouter();

	return (
		<ImageBackground
			source={require('../assets/images/BackgroundPic/DefaultBackground.png')}
			imageStyle={{ resizeMode: 'cover' }}
			style={{ height: '100%', width: '100%' }}
		>
			<SafeAreaView style={styles.container}>
				<View style={styles.box}>
					<Text style={styles.text}>Name</Text>
					{/* <TextInput style={styles.input} placeholder="useless placeholder" /> */}
					<Text style={styles.text}>Room Code</Text>
					{/* <TextInput style={styles.input} placeholder="useless placeholder" keyboardType="numeric" /> */}
					<TouchableOpacity style={styles.btn} onPress={() => router.push('')}>
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
		justifyContent: 'center',
		alignItems: 'center',
	},
	box: {
		backgroundColor: 'white',
		borderRadius: 30,
		height: 300,
		width: 300,
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
		height: 100,
		width: 200,
	},
	text: {
		fontFamily: 'Neulis500',
		color: '#210461',
		fontSize: 18,
		textAlign: 'left',
	},
});

export default JoinRoomScreen;
