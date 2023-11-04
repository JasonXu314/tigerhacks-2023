import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { Avatars } from '../lib/Images';

interface IProps {
	name: string;
	avatar: string;
}

const Player = ({ name, avatar }: IProps) => {
	return (
		<View style={styles.container}>
			<Image source={Avatars[avatar]} style={styles.avatar}></Image>
			<Text style={styles.name}>{name}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignSelf: 'flex-start',
        alignItems: 'center',
	},
	avatar: {
		height: 50,
		width: 50,
		borderRadius: 50,
		overflow: 'hidden',
	},
	name: {
		fontSize: 15,
		fontFamily: 'Neulis500',
		color: '#210461',
	},
});

export default Player;
