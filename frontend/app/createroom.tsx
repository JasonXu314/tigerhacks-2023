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
		<SafeAreaView style={styles.container}>
			<BackButton></BackButton>
            <Text style={styles.codeTitle}>Room Code</Text>
            <Text style={styles.code}>{context.room}</Text>
            <Text style={styles.title}>Song</Text>
			<SongSelector modalVisible={songSelectorVisible} setModalVisible={setSongSelectorVisible}></SongSelector>
            <Text style={styles.title}>Singers</Text>
            <Text style={styles.title}>Spectators</Text>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: 20,
		marginVertical: '15%',
        backgroundColor: 'red',
        borderRadius: 30,
        overflow: 'hidden',
        padding: 20,
	},
    title: {
        fontSize: 25,
        fontFamily: "Neulis500"
    },
    codeTitle: {
        fontSize: 25,
        fontFamily: "Neulis600"
    },
    code: {
        fontSize: 300,
        fontFamily: "Neulis700"
    }
});

export default CreateRoomScreen;
