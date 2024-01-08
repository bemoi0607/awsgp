import React, { useState,useEffect } from 'react';
import { View, TextInput, Button, Text, BackHandler } from 'react-native';
import { signIn, signOut, autoSignIn, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens,MainStackParamList } from '../stacks/Navigator';
import { Amplify, type ResourcesConfig } from 'aws-amplify';
import { defaultStorage } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';



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
    // const currentAuthenticatedUser = async() => {
    // try {
    //     const { username, userId, signInDetails } = await getCurrentUser();
    //     console.log(`The username: ${username}`);
    //     console.log(`The userId: ${userId}`);
    //     console.log(`The signInDetails: ${signInDetails}`);
    // } catch (err) {
    //     console.log(err);
    // }
    // }

    
    //사용자 정보가져올때 쓰기 2
    // useEffect (()=>{
    //     currentAuthenticatedUser();
    // },[])


    // const currentSession = async() => {
    //     try {
    //         const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
    //         console.log(accessToken)
    //     } catch (err) {
    //         console.log(err);
    //     }
    //     }

    //     useEffect(()=>{
    //         currentSession();
    //     })


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
            navigation.navigate(MainScreens.Main);
        }
    } catch (error) {
        console.log('Error signing in', error);
    }
};

    const handleSignOut = async () => {
    try {
            await signOut({ global: true });
            console.log('logout completed')
        } catch (error) {
            console.log('error signing out: ', error);
        }
    };

    const renderAuthForm = () => {
        switch (authState) {
        case 'initial':
            return (
            <View style={{justifyContent: 'center',alignItems:'center'}}>
                <Text>로그인:</Text>
                <View>
                <TextInput
                    placeholder="Username"
                    onChangeText={(text) => setUsername(text)}
                />
                <TextInput
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                />
            </View>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Button title="로그인" onPress={handleSignIn} />
                <Button title="회원가입" onPress={handleSignUp} />
                <Button title="로그아웃" onPress={handleSignOut} />
            </View>
            </View>
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
        <View style={{ padding: 20, marginTop: 50 }}>
            {renderAuthForm()}
        </View>
    );
    };

    export default LogIn ;
