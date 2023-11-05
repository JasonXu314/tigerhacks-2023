import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import BackButton from '../components/BackButton';
import { useState } from 'react';

const JoinRoomScreen = () => {
	const router = useRouter();
    const [name, setName] = useState('');
    const [code, setCode] = useState('');

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
					<TextInput placeholder="Enter the name..." style={styles.input} maxLength={12} value={name} onChangeText={setName} />
				</View>
				<View>
					<Text style={styles.text}>Room Code</Text>
					<TextInput placeholder="Enter the code.." style={styles.input} maxLength={4} value={code} onChangeText={setCode} autoCapitalize = {"characters"}/>
				</View>

				<TouchableOpacity style={[styles.btn, { alignItems: 'center' }]} onPress={() => router.push('voting')}>
					<Text style={styles.btnText}>Join Room</Text>
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

export default JoinRoomScreen;
