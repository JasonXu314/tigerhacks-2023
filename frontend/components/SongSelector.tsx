import { StyleSheet, Text, View, TouchableOpacity, Modal, Pressable, ScrollView, TouchableWithoutFeedback, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useContext, useEffect } from 'react';
import Song from './Song';
import Images from '../lib/Images';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { AppContext } from '../lib/Context';
import { SongList } from '../data/SongList';

interface IProps {
	modalVisible: boolean;
	setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const SongSelector = ({ modalVisible, setModalVisible }: IProps) => {
	const router = useRouter();
	const context = useContext(AppContext);

	return (
		<View style={styles.centeredView}>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<Pressable onPress={(event) => event.target == event.currentTarget && setModalVisible(false)} style={styles.background}>
					<View style={styles.modalContainer}>
						<TouchableOpacity
							onPress={() => {
								setModalVisible(false);
							}}
							style={styles.back}
						>
							<AntDesign name="leftcircleo" size={25} color="#210461" />
						</TouchableOpacity>
						<View style={styles.searchbar}>
							<TextInput placeholder="Search song..." style={styles.input}></TextInput>
							<EvilIcons name="search" size={24} color="black" style={styles.searchIcon} />
						</View>
						<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
							<View onStartShouldSetResponder={() => true}>
								{SongList.map((song) => (
									<Song song={song} key={song.name} setModalVisible={setModalVisible}></Song>
								))}
							</View>
						</ScrollView>
					</View>
				</Pressable>
			</Modal>
			<TouchableOpacity style={[styles.button, styles.buttonOpen]} onPress={() => setModalVisible(true)}>
				<Song song={context.song} setModalVisible={setModalVisible} nonClickable={true}></Song>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	background: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	modalContainer: {
		backgroundColor: '#F2E9F9',
		display: 'flex',
		height: '65%',
		width: '75%',
		borderRadius: 20,
		overflow: 'hidden',
		paddingTop: 65,
		paddingBottom: 40,
		paddingHorizontal: 25,
	},
	centeredView: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
		width: 300,
        paddingLeft: 30,
	},
	buttonOpen: {
		backgroundColor: '#F194FF',
	},
	buttonClose: {
		backgroundColor: '#2196F3',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
	searchbar: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		borderRadius: 20,
		overflow: 'hidden',
		marginBottom: 10,
	},
	input: {
		backgroundColor: 'white',
		width: '100%',
		paddingLeft: 15,
		height: 30,
	},
	searchIcon: {
		position: 'absolute',
		right: 10,
		alignSelf: 'center',
	},
	back: {
		position: 'absolute',
		top: 20,
		left: 25,
	},
});

export default SongSelector;
