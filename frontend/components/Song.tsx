import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { AppContext } from '../lib/Context';
import { useContext } from 'react';
import { ISong } from '../interfaces/ISong';

interface IProps {
	song: ISong;
	nonClickable?: boolean;
	setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Song = ({ song, nonClickable, setModalVisible }: IProps) => {
	const context = useContext(AppContext);
	if (nonClickable) {
		return (
			<View style={styles.songContainer}>
				<Image source={song.img} style={styles.icon}></Image>
				<View style={styles.songInfo}>
					<Text style={styles.songName}>{song.name}</Text>
					<Text style={styles.songArtist}>{song.artist}</Text>
				</View>
			</View>
		);
	}
	return (
		<TouchableOpacity
			style={styles.songContainer}
			onPress={() => {
				context.setSong(song);
				setModalVisible(false);
			}}
		>
			<Image source={song.img} style={styles.icon}></Image>
			<View style={styles.songInfo}>
				<Text style={styles.songName}>{song.name}</Text>
				<Text style={styles.songArtist}>{song.artist}</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	songContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 20,
		// borderBottomWidth: 2,
		// borderBottomColor: '#210461',
		paddingVertical: 7,
	},
	songInfo: {
		display: 'flex',
		gap: 5,
		color: '#210461',
	},
	icon: {
		flex: 1,
		resizeMode: 'contain',
		maxHeight: 50,
		maxWidth: 50,
	},
	songName: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	songArtist: {
		fontSize: 14,
	},
});

export default Song;
