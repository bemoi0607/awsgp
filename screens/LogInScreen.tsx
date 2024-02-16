import React, { useState,useEffect } from 'react';
import { View, TextInput, Button, Text, BackHandler, Dimensions,TouchableOpacity,Image,StyleSheet, Alert } from 'react-native';
import { signIn, signOut, autoSignIn, getCurrentUser, fetchAuthSession, } from 'aws-amplify/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens,MainStackParamList } from '../stacks/Navigator';
import { Amplify, type ResourcesConfig } from 'aws-amplify';
import { defaultStorage } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { KeyboardAvoidingView } from 'native-base';



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



////////// type

type LogInScreenNavigationProps = StackNavigationProp<
    MainStackParamList, 
    'LogIn'
>;

interface LogInScreenProps {
    navigation: LogInScreenNavigationProps;
};

///////////////////



const LogIn: React.FunctionComponent<LogInScreenProps> = ({navigation}) => {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [authState, setAuthState] = useState<string>('initial');


    // useEffect(() => {
    //     const checkUser = async () => {
    //     try {
    //         const user = await Auth.currentAuthenticatedUser();
    //         if (user) {
    //         navigation.navigate(MainScreens.Main);
    //         }
    //     } catch (error) {
    //         console.log('Error checking user:', error);
    //     }
    //     };

    //     Hub.listen('auth', (data) => {
    //     const { payload } = data;
    //     if (payload.event === 'signIn') {
    //         navigation.navigate(MainScreens.Main);
    //     } else if (payload.event === 'signOut') {
    //         setAuthState('initial');
    //     }
    //     });

    //     checkUser();
    // }, [navigation]);
    
    //사용자 정보가져올때 쓰기 1


//     const handleAutoSignIn = async () => {
//     try {
//         const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
//         console.log(accessToken,idToken)
//         const currentSession = await fetchAuthSession();
//         if (currentSession && currentSession.tokens) {
//             console.log('Auto Sign-In Successful');
//                 navigation.replace(MainScreens.Main);
//             return;
//         }
//     } catch (error) {
//         console.log('Auto Sign-In error:', error);
//         setAuthState('initial');
//     }
// };

// useEffect(() => {
//     handleAutoSignIn(); // Check current session and attempt auto sign-in
// }, []);



    const handleSignUp = async () => {
        navigation.navigate(MainScreens.Name);
    };



const handleSignIn = async () => {
    try {
        const { isSignedIn } = await signIn({ username, password });

        if (isSignedIn) {
            console.log("log in successful");
            navigation.navigate(MainScreens.LogInLoading);
        }
    } catch (error) {
    console.log('Error signing in:', error);
        if (error.message.includes('NotAuthorizedException') || error.message.includes('Incorrect username or password.')) {
            Alert.alert("로그인 실패", "아이디나 비밀번호가 잘못되었습니다!");
        } else if (error.message.includes('UserNotFoundException') || error.message.includes('User does not exist.')) {
            Alert.alert("로그인 실패", "존재하지 않는 사용자입니다.");
        } else {
            Alert.alert("로그인 실패", "정보를 모두 입력해주세요!");
        }
    }
};


    const renderAuthForm = () => {
        switch (authState) {
        case 'initial':
            return (
            <KeyboardAvoidingView style={{height:screenHeight*1.4}} behavior='padding'>
            <View style={{justifyContent: 'center',alignItems:'center',backgroundColor:'white',height:'auto'}}>
                <View style={{height: screenHeight*0.37,backgroundColor:'white',justifyContent:'center',alignItems:'baseline'}}>
                    <Image source={require('../images/gymprivate.jpeg')} style={{width: 200,height: 200}} />
                </View>
                <View style={{width:screenWidth,height:screenHeight*0.2,justifyContent:'center',alignItems:'center'}}>
                    <TextInput
                    style={{borderBottomWidth:0.5,width:screenWidth*0.8,height:screenHeight*0.05}}
                    placeholderTextColor={'gray'}
                    placeholder="이메일을 입력해주세요"
                    onChangeText={(text) => setUsername(text)}
                />
                <TextInput
                    style={{borderBottomWidth:0.5,width:screenWidth*0.8,height:screenHeight*0.05,marginTop:'5%'}}
                    placeholderTextColor={'gray'}
                    placeholder="패스워드를 입력해주세요"
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                />
            </View>
            
                <View style={{height:screenHeight*0.1,width:screenWidth,backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <TouchableOpacity
                    style={{borderRadius:15,backgroundColor:'#4A7AFF',height:screenHeight*0.05,width:screenWidth*0.75,justifyContent:'center',alignItems:'center',marginBottom:'10%'}}
                    onPress={handleSignIn}
                    >
                        <Text style={{color:'white',fontWeight:'bold'}}>로그인</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection:'row',justifyContent:'space-between',height:screenHeight*0.25,width:screenWidth,alignItems:'center',paddingHorizontal: '12.5%'}}>

                <View>
                    <TouchableOpacity>
                        <Text 
                        onPress={()=>{navigation.navigate(MainScreens.ForgotPassword)}}
                        style={{fontWeight:'200',fontSize:15,color:'gray'}}>비밀번호를 잊으셨나요?</Text>
                    </TouchableOpacity> 
                </View>

                <View style={{marginRight:'5%'}}>
                    <TouchableOpacity
                        onPress={handleSignUp}>
                        <Text style={{fontWeight:'200',fontSize:15,color:'gray'}}>회원가입</Text>
                    </TouchableOpacity> 

                </View>

                </View>
                
                
                
            </View>
            </KeyboardAvoidingView>
            
            

            
    
            );
        default:
            return null;
        }
    };

    useEffect(() => {
        const backAction = () => {

            if (authState !== 'initial') {
                setAuthState('initial');
                return true; // 이벤트 처리 완료
            }
        return false; // 이벤트 처리하지 않음
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        // 컴포넌트 언마운트 시 이벤트 핸들러 제거
        return () => backHandler.remove();
        } , [authState]);

    return (
        
        
            <View style={{height: screenHeight,backgroundColor:'white'}}>  
                {renderAuthForm()}
            </View>
            

    );
    };

    export default LogIn ;


    
