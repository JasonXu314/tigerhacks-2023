import { AntDesign, EvilIcons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SongList } from '../data/SongList';
import { AppContext } from '../lib/Context';
import Song from './Song';

interface IProps {
	modalVisible: boolean;
	setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const SongSelector = ({ modalVisible, setModalVisible }: IProps) => {
	const context = useContext(AppContext);
	const [search, setSearch] = useState('');
    const [songList, setSongList] = useState(SongList);

    const searchHandler = (text: string) => {
        setSearch(text);
        setSongList([...SongList.filter((song) => song.name.startsWith(text))]);
    }

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
							<AntDesign name="leftcircleo" size={30} color="#210461" />
						</TouchableOpacity>
						<View style={styles.searchbar}>
							<TextInput placeholder="Search song..." style={styles.input} value={search} onChangeText={searchHandler}></TextInput>
							<EvilIcons name="search" size={30} color="black" style={styles.searchIcon} />
						</View>
						<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
							<View onStartShouldSetResponder={() => true}>
								{songList.map((song) => (
									<Song song={song} key={song.name} setModalVisible={setModalVisible}></Song>
								))}
							</View>
						</ScrollView>
					</View>
				</Pressable>
			</Modal>
			<TouchableOpacity style={[styles.button, styles.buttonOpen]} onPress={() => setModalVisible(true)}>
				<Song song={SongList.find((sng) => sng.name === context.song)!} setModalVisible={setModalVisible} nonClickable={true}></Song>
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
		flex: 1,
		marginHorizontal: 20,
		marginVertical: '15%',
		borderRadius: 30,
		overflow: 'hidden',
		padding: 25,
		paddingTop: 70,
		gap: 10,
		backgroundColor: 'white',
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
		paddingLeft: 15,
	},
	buttonOpen: {
		backgroundColor: '#fad2fa',
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
		borderRadius: 35,
		overflow: 'hidden',
		marginBottom: 10,
	},
	input: {
		backgroundColor: '#D7E0EB',
		width: '100%',
		paddingLeft: 15,
		height: 45,
		fontSize: 16,
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
