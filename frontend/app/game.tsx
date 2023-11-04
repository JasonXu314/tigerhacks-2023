import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect, useContext } from 'react';
import { AppContext } from '../lib/Context';
import { Image } from 'react-native';

const GameScreen = () => {
	const router = useRouter();
	const context = useContext(AppContext);

	useEffect(() => {
		if (context.bgMusic) {
			context.stopBgMusic();
		}
	}, []);

	return (
		<ImageBackground
			source={require('../assets/images/BackgroundPic/PlaneBG.png')}
			imageStyle={{ resizeMode: 'cover' }}
			style={{ height: '100%', width: '100%' }}
		>
			<View style={styles.container}>
				<Image source={require('../assets/images/ring.png')} style={styles.ring}></Image>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	ring: {
		position: 'absolute',
		bottom: 0,
	},
});

export default GameScreen;
