import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

const BackButton = () => {
	const router = useRouter();

	return (
		<TouchableOpacity
			onPress={() => {
				if (router.canGoBack()) {
					router.back();
				}
			}}
			style={styles.container}
		>
			<AntDesign name="leftcircleo" size={40} color="#210461" />
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 20,
		left: 25,
		zIndex: 99,
	},
});

export default BackButton;
