import { Text, View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import SongSelector from '../components/SongSelector';
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../lib/Context';

const CreateRoomScreen = () => {
	const [songSelectorVisible, setSongSelectorVisible] = useState(false);
	const context = useContext(AppContext);

	return (
		<ImageBackground
			source={require('../assets/images/BackgroundPic/DefaultBackground.png')}
			imageStyle={{ resizeMode: 'cover' }}
			style={{ height: '100%', width: '100%' }}
		>
			<View style={styles.container}>
				<BackButton></BackButton>
				<Text style={[styles.codeTitle, { textAlign: 'center' }]}>Room Code</Text>
				<Text style={styles.code}>{context.room}</Text>
				<View style={styles.col}>
					<Text style={styles.title}>Song</Text>
					<SongSelector modalVisible={songSelectorVisible} setModalVisible={setSongSelectorVisible}></SongSelector>
				</View>
				<View style={styles.col}>
					<Text style={styles.title}>Singers</Text>
				</View>
				<View style={styles.col}>
					<Text style={styles.title}>Spectators</Text>
				</View>
                <TouchableOpacity>
                    <Text>Start Game</Text>
                </TouchableOpacity>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: 20,
		marginVertical: '15%',
		borderRadius: 30,
		overflow: 'hidden',
		padding: 25,
		gap: 10,
		backgroundColor: 'white',
	},
	title: {
		fontSize: 25,
		fontFamily: 'Neulis500',
	},
	codeTitle: {
		fontSize: 25,
		fontFamily: 'Neulis500',
	},
	code: {
		fontSize: 300,
		textAlign: 'center',
		fontFamily: 'Neulis700',
	},
	col: {
		display: 'flex',
		gap: 10,
	},
});

export default CreateRoomScreen;
