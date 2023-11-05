import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IPlayer } from '../interfaces/IPlayer';
import { Avatars } from '../lib/Images';
import { useWS } from '../lib/ws';
import { FontAwesome5 } from '@expo/vector-icons';
import { useGame } from '../lib/game-data';

interface IProps {
	name: string;
	id: number;
	avatar: string;
	isHost: boolean;
	contestants: IPlayer[];
}

const Player: React.FC<IProps> = ({ name, id, avatar, isHost, contestants }) => {
	const { send } = useWS();
    const { data } = useGame()

	const swapSides = () => {
		if (contestants.some((p) => p.id === id)) {
			send({ event: 'REMOVE_CONTESTANT', data: { id } });
		} else if (contestants.length < 4) {
			send({ event: 'ADD_CONTESTANT', data: { id } });
		}
	};

	return (
		<TouchableOpacity style={styles.container} onPress={isHost ? swapSides : () => {}}>
			<Image source={Avatars[avatar]} style={styles.avatar}></Image>
			{data?.host.id === id && <FontAwesome5 name="crown" size={16} color="gold" style={{ position: 'absolute' }} />}
			<Text style={styles.name}>{name}</Text>
		</TouchableOpacity>
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
