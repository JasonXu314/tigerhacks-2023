import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import SongSelector from '../components/SongSelector';
import { useState, useEffect } from 'react';

const CreateRoomScreen = () => {
    const [songSelectorVisible, setSongSelectorVisible] = useState(false);

	return (
		<SafeAreaView style={styles.container}>
            <BackButton></BackButton>
            <SongSelector modalVisible={songSelectorVisible} setModalVisible={setSongSelectorVisible}></SongSelector>
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
