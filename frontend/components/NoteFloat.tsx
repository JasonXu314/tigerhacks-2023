import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'react-native-elements';
import { Images } from '../lib/Images';

interface NoteData {
	note: 1 | 2;
	life: number;
	ticks: number;
	velocity: [number, number];
	position: [number, number];
	rotation: number;
	rotDelta: number;
}

export const NoteFloat: React.FC = () => {
	const [noteData, setNoteData] = useState<NoteData[]>([]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (Math.random() < 0.001) {
				const newNoteData: NoteData = {
					note: (Math.round(Math.random()) + 1) as 1 | 2,
					life: Math.round(Math.random() * 200),
					ticks: 0,
					position: [0, 0],
					velocity: [Math.random() * (Math.random() - 0.5) * 0.1, Math.random() * (Math.random() - 0.5) * 0.1],
					rotation: Math.random() * 2 * Math.PI,
					rotDelta: Math.random() * 0.1
				};

				setNoteData((noteData) => [...noteData, newNoteData]);
			}
		}, 20);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			const newNoteData = noteData.flatMap<NoteData>(({ note, life, ticks, position: [x, y], velocity, rotDelta, rotation }) =>
				ticks < life
					? [
							{
								note,
								life,
								ticks: ticks + 1,
								velocity,
								rotDelta,
								position: [x + velocity[0], y + velocity[1]],
								rotation: rotation + rotDelta
							}
					  ]
					: []
			);

			setNoteData(newNoteData);
		}, 10);

		return () => clearInterval(interval);
	}, []);

	return (
		<View style={styles.container}>
			{noteData.map(({ note, position: [x, y], rotation }, i) => (
				<Image
					key={i}
					source={Images[`Note${note}`]}
					style={{
						position: 'relative',
						top: '45%',
						left: '45%',
						transform: [{ scale: 0.125 }, { translateX: x, translateY: y }, { rotate: `${rotation}rad` }]
					}}
				/>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		overflow: 'visible'
	}
});

