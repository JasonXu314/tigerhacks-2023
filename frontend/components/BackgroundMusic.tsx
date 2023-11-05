import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import BackButton from '../components/BackButton';
import api from '../services/AxiosConfig';
import { AntDesign } from '@expo/vector-icons';
import { AppContext } from '../lib/Context';
import { useContext } from 'react';

const BackgroundMusic = () => {
	const router = useRouter();
	const context = useContext(AppContext);

	return (
		<TouchableOpacity
			style={styles.audio}
			onPress={() => {
				context.stopBgMusic();
			}}
		>
			{/* <AntDesign name="sound" size={55} color="#D7E0EB" /> */}
			<AntDesign name="sound" size={45} color="#C2E812" />
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	audio: {
		position: 'absolute',
		top: 20,
		right: 25,
		zIndex: 99,
	},
});

export default BackgroundMusic;
