import { fetchAuthSession } from '@aws-amplify/auth';
import React, { useEffect } from 'react'
import { View,Text,StyleSheet,Image, Dimensions} from 'react-native'
import { Amplify, type ResourcesConfig } from 'aws-amplify';
import { defaultStorage } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens, MainStackParamList } from '../stacks/Navigator';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config'

const BASE_URL = config.SERVER_URL;

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
            userPoolId: 'ap-northeast-2_pwU98HT1p',
            userPoolClientId: '1jd71cp4ln4mejku8s3t3rervm'
        }
    };

    Amplify.configure({
        Auth: authConfig
    });

cognitoUserPoolsTokenProvider.setKeyValueStorage(defaultStorage);


const LandingScreen:React.FunctionComponent<LandingScreenProps> = ({navigation}) => {

    useEffect(()=>{
        console.log(BASE_URL);
    })

    const handleAutoSignIn = async () => {
    try {
        const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
        console.log(accessToken, idToken);

    const currentSession = await fetchAuthSession();
    if (currentSession && currentSession.tokens) {
        console.log('Auto Sign-In Successful');

        // 서버에 유저 정보 전송
        const userData = {
            logId: idToken.payload['cognito:username'],
            username: idToken.payload.name,
            email: idToken.payload.email,
            gender: idToken.payload.gender,
            birthday: idToken.payload.birthdate,
            phoneNumber:idToken.payload.phone_number
        };

        // axios를 사용하여 서버에 POST 요청 보내기
        axios.post(`${BASE_URL}/user`, userData)
            .then(response => {
                console.log(response.data);
            
                    AsyncStorage.setItem('logId',JSON.stringify(userData.logId));
                    AsyncStorage.setItem('username', JSON.stringify(userData.username));
                    AsyncStorage.setItem('email', JSON.stringify(userData.email));
                    AsyncStorage.setItem('gender', JSON.stringify(userData.gender));
                    AsyncStorage.setItem('birthday', JSON.stringify(userData.birthday));
                    AsyncStorage.setItem('phoneNumber', JSON.stringify(userData.phoneNumber));

                    console.log(userData.logId,userData.username)
            })
            .catch(error => {
        // 에러 발생 시 처리
        console.error('Error sending user data to server:', error);
        if (error.response) {
            // 요청이 이루어졌으나 서버가 2xx 범위가 아닌 상태 코드로 응답한 경우
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // 요청이 이루어졌으나 응답을 받지 못한 경우
            console.log(error.request);
        } else {
            // 요청을 설정하는 중에 문제가 발생한 경우
            console.log('Error', error.message);
        }
        console.log(error.config);
    });

        const timer = setTimeout(() => {
            navigation.reset({ routes: [{ name: MainScreens.Main }] })
        }, 3000);

        return () => clearTimeout(timer);
        }

    } catch (error) {
        console.log('Auto Sign-In error:', error);
        const timer = setTimeout(() => {
            navigation.reset({ routes: [{ name: MainScreens.LogIn }] })
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