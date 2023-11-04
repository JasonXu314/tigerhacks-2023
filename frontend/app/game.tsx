import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const GameScreen = () => {
	const router = useRouter();

	return (
		<SafeAreaView style={styles.container}>
			<Text>Hello</Text>
			<TouchableOpacity onPress={() => router.push('createroom')}>
				<Text>Create Room</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
});

export default GameScreen;
