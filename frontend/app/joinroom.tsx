import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
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
				<Text>Hello</Text>
				<TouchableOpacity onPress={() => router.push('')}>
					<Text>Create Room</Text>
				</TouchableOpacity>
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
});

export default JoinRoomScreen;
