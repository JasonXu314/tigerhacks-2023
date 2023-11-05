import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
	onPress?: () => void;
}

const BackButton: React.FC<Props> = ({ onPress = () => {} }) => {
	const router = useRouter();

	return (
		<TouchableOpacity
			onPress={() => {
				if (router.canGoBack()) {
					onPress();
					router.back();
				}
			}}
			style={styles.container}>
			<AntDesign name="leftcircleo" size={30} color="#210461" />
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 20,
		left: 25,
		zIndex: 99
	}
});

export default BackButton;

