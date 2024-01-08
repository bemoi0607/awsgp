import { fetchAuthSession } from '@aws-amplify/auth';
import React, { useEffect } from 'react'
import { View,Text,StyleSheet,Image, Dimensions} from 'react-native'
import { Amplify, type ResourcesConfig } from 'aws-amplify';
import { defaultStorage } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens, MainStackParamList } from '../stacks/Navigator';
import axios from 'axios';


const BASE_URL = "http://100.114.50.220:8080"

type LandingScreenNavigationProps = StackNavigationProp<
    MainStackParamList, 
    'Landing'
>;

interface LandingScreenProps {
    navigation: LandingScreenNavigationProps;
};


const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;


const authConfig: ResourcesConfig['Auth'] = {
        Cognito: {
            userPoolId: 'ap-northeast-2_Dr7DjaWDb',
            userPoolClientId: '3r24ukm2n2f9e016a53j2omlee'
        }
    };

    Amplify.configure({
        Auth: authConfig
    });

cognitoUserPoolsTokenProvider.setKeyValueStorage(defaultStorage);


const LandingScreen:React.FunctionComponent<LandingScreenProps> = ({navigation}) => {

    const handleAutoSignIn = async () => {
        try {
            const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
            console.log(accessToken,idToken)

            const currentSession = await fetchAuthSession();
                if (currentSession && currentSession.tokens) {
                    console.log('Auto Sign-In Successful');
        
                    const timer = setTimeout(() => {
                        navigation.reset({routes: [{name: MainScreens.Main}]})
                    }, 3000);

                    return () => clearTimeout(timer);
                }
        
            } catch (error) {
                console.log('Auto Sign-In error:', error);
                const timer = setTimeout(() => {
                        navigation.reset({routes: [{name: MainScreens.LogIn}]})
                    }, 3000);
                return () => clearTimeout(timer);
            }
    };

useEffect(() => {
    handleAutoSignIn(); // Check current session and attempt auto sign-in
}, []);

    return (
    <View style={styles.container}>
                <View style={styles.navigation} />
                <View style={styles.body}>
                    <Image source={require('../images/gymprivate.jpeg')} style={styles.gymIcon} />
                    
                    <View style={styles.body2}>
                        <Image source={require('../images/gpname.jpeg')} style={styles.gymIcon2} />
                    </View>

                    <View style={styles.gymContainer}>
                        <Text style={styles.gymTitle}>프라이빗한 공간에서</Text>
                    </View>
                    <Text style={styles.gymText}>나만의 운동을 즐겨보세요!</Text>
                </View>
                <View style={styles.footer} />
            </View>
    )
}

export default LandingScreen

const styles = StyleSheet.create({

container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
},
navigation: {
    flex: 2,
    backgroundColor: 'rgba(255,255,255,1)',
},
body: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
},
body2:{
    bottom:'25%',
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
},
gymIcon: {
    width: 270,
    height: 270,
    marginBottom: '70%',
},
gymIcon2: {
    width: screenWidth,
    height: 100,
    marginBottom: '70%',
},
gymContainer: {
    bottom:'10%',
    width: screenWidth - 100,
    // borderBottomColor: 'rgba(138,151,239,1)',
    // borderBottomWidth: 0.8,
    padding: 5,
    alignItems: 'center',
},
gymTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8d8d8d',
},
gymText: {
    bottom:'10%',
    fontSize: 15,
    fontWeight: '700',
    color: '#8d8d8d',
},

footer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
},
});