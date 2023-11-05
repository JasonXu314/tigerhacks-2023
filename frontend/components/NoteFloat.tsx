import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'react-native-elements';

export const NoteFloat: React.FC = () => {
	return (
		<View style={styles.container}>
			<Image source={require('./assets')} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		overflow: 'visible'
	}
});

