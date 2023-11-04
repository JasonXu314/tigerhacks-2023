import { View, StyleSheet, Image, Text, TouchableOpacity, PanResponder, Animated } from 'react-native';
import { Avatars } from '../lib/Images';
import { useRef, useState } from 'react';
import { IPlayer } from '../interfaces/IPlayer';

interface IProps {
	name: string;
	avatar: string;
	players: IPlayer[];
	spectators: IPlayer[];
	setPlayers: React.Dispatch<React.SetStateAction<IPlayer[]>>;
	setSpectators: React.Dispatch<React.SetStateAction<IPlayer[]>>;
}

// TODO: Reflect change in backend
const Player = ({ name, avatar, players, spectators, setPlayers, setSpectators }: IProps) => {
	const swapSides = () => {
		const player = players.find((user) => user.name === name);
		if (player) {
			// they're playing
			setSpectators([...spectators, player]);
			setPlayers((players) => players.filter((user) => user != player));
		} else {
			// they're spectating
            if (players.length >= 4) {
                return;
            }
			const player = spectators.find((user) => user.name === name);
			setPlayers([...players, player!]);
			setSpectators((players) => players.filter((user) => user != player));
		}
	};

	return (
		<TouchableOpacity style={styles.container} onPress={() => swapSides()}>
			<Image source={Avatars[avatar]} style={styles.avatar}></Image>
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
