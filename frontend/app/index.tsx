import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import BackButton from '../components/BackButton';
import api from '../services/AxiosConfig';

const HomeScreen = () => {
	const router = useRouter();

	const createRoom = () => {
		api.post('/rooms')
			.then((resp) => {
				console.log(resp.data);
			})
			.catch((err) => {
				console.log(err);
			});
		router.push('createroom');
	};

	return (
		<SafeAreaView style={styles.container}>
			<BackButton></BackButton>
			<Text>Hello</Text>
			<TouchableOpacity onPress={() => createRoom()}>
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

export default HomeScreen;
