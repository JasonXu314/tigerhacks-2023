import { Image, ImageBackground, StyleSheet, View, Text, ScrollView } from 'react-native';

const Loading = () => {
	return (
		<ImageBackground
			source={require('../assets/images/BackgroundPic/WelcomeBG.png')}
			imageStyle={{ resizeMode: 'cover' }}
			style={{ height: '100%', width: '100%', justifyContent: 'center' }}
		>
            
		</ImageBackground>
	);
};

export default Loading;
