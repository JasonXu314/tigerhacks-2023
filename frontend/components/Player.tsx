import { View, StyleSheet, Image, Text, TouchableOpacity, PanResponder, Animated } from 'react-native';
import { Avatars } from '../lib/Images';
import { useRef, useState } from 'react';

interface IProps {
	name: string;
	avatar: string;
}

const Player = ({ name, avatar }: IProps) => {
	const position = useRef(new Animated.ValueXY()).current;
	const [pan, setPan] = useState(new Animated.ValueXY());
	const [dragging, setDragging] = useState(false);

	let val = { x: 0, y: 0 };
	pan.addListener((value) => (val = value));

    const isDropArea = () => {
        
    }

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: () => true,
			onPanResponderGrant: () => {
				setDragging(true);
				let temp = pan;
				temp.setOffset({
					x: val.x,
					y: val.y,
				});
				temp.setValue({
					x: 0,
					y: 0,
				});
				setPan(pan);
			},
			onPanResponderMove: Animated.event(
				[
					null,
					{
						dx: pan.x,
						dy: pan.y,
					},
				],
				{ useNativeDriver: false }
			),
			onPanResponderRelease: (e, gesture) => {
				setDragging(false);
				Animated.spring(pan, {
					toValue: { x: 0, y: 0 },
					friction: 5,
					useNativeDriver: false,
				}).start();
			},
		})
	).current;

	const panStyle = {
		transform: pan.getTranslateTransform(),
	};

	return (
		<Animated.View
			style={[
				styles.container,
				panStyle,
				{
					transform: pan.getTranslateTransform(),
					opacity: dragging ? 0.8 : 1,
				},
			]}
			{...panResponder.panHandlers}
		>
			<Image source={Avatars[avatar]} style={styles.avatar}></Image>
			<Text style={styles.name}>{name}</Text>
		</Animated.View>
		// <View style={styles.container}>
		// 	<Image source={Avatars[avatar]} style={styles.avatar}></Image>
		// 	<Text style={styles.name}>{name}</Text>
		// </View>
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
