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
			<Text>{name}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
        width: 50,
	},
	avatar: {
		height: 50,
		width: 50,
		borderRadius: 50,
		overflow: 'hidden',
	},
});

export default Player;
