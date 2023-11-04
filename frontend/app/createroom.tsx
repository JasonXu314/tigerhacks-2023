import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';

const CreateRoomScreen = () => {
	return (
		<SafeAreaView style={styles.container}>
            <BackButton></BackButton>
			<Text>Hello</Text>
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

export default CreateRoomScreen;
