import React, { useState,useEffect } from 'react';
import { View, TextInput, Button, Text, Dimensions,TouchableOpacity, Platform, Alert } from 'react-native';
import { signUp, confirmSignUp,resendSignUpCode } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import awsconfig from '../src/aws-exports';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens,MainStackParamList } from '../stacks/Navigator';
import { KeyboardAvoidingView } from 'native-base';



type ConfirmationScreenNavigationProps = StackNavigationProp<
    MainStackParamList, 
    'Confirmation'
>;

interface ConfirmationScreenProps {
    navigation: ConfirmationScreenNavigationProps;
};


const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const shadowStyle = Platform.select({
    ios: {
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
    android: {
        elevation: 10,
    },
})

Amplify.configure(awsconfig);

const Confirmation: React.FunctionComponent<ConfirmationScreenProps> = ({navigation}) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [birthdate, setBirthdate] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [confirmationCode, setConfirmationCode] = useState<string>('');
    const [authState, setAuthState] = useState<string>('signUp');

    const resendConfirmationCode = async () => {
        try {
            await resendSignUpCode({username});
            console.log('코드를 다시 보냈습니다.');
        } catch (error) {
            console.error('코드를 다시 보내는 데 실패했습니다.', error);
        }
        }




    useEffect(() => {
        // Fetch data from AsyncStorage when the component mounts
        const fetchDataFromStorage = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem('Username');
                const storedPassword = await AsyncStorage.getItem('Password');
                const storedName = await AsyncStorage.getItem('Name');
                const storedGender = await AsyncStorage.getItem('Gender');
                const storedBirthdate = await AsyncStorage.getItem('Birthdate');
                const storedPhoneNumber = await AsyncStorage.getItem('PhoneNumber');

                setUsername(storedUsername || '');
                setPassword(storedPassword || '');
                setName(storedName || '');
                setGender(storedGender || '');
                setBirthdate(storedBirthdate || '');
                setPhoneNumber(storedPhoneNumber || '');
            } catch (error) {
                console.error('Error fetching data from AsyncStorage:', error);
            }
        };

        fetchDataFromStorage();
    }, []);


    const handleSignUp = async () => {
        const convertToFormattedDate = (input: string): string => {
            if (input.length === 8) {
                const year = input.substring(0, 4);
                const month = input.substring(4, 6);
                const day = input.substring(6, 8);
                return `${year}-${month}-${day}`;
            } else {
                // 유효한 날짜 형식이 아닌 경우 또는 다른 예외처리를 원하는 경우 추가 로직 구현
                console.error('Invalid date format');
                return input;
            }
        };
        
        const formattedDate = convertToFormattedDate(birthdate);

    try {
        const { userId } = await signUp({
            username,
            password,
            options: {
            userAttributes: {
                phone_number: `+8210${phoneNumber}`,
                name: name,
                gender: gender, 
                birthdate: formattedDate
            },
            autoSignIn: true
            }
        });

        console.log(`User ID: ${userId}`);
        setAuthState('confirmSignUp');
        } catch (error) {
        console.log('Error signing up:', error);
        }
    };



const handleSignUpConfirmation = async () => {
    try {
        const { isSignUpComplete } = await confirmSignUp({
            username,
            confirmationCode
        });

        if (isSignUpComplete) {
            // 회원가입 성공 알림 표시
            Alert.alert(
                "회원가입 성공", // 대화 상자 제목
                "회원가입에 성공했습니다! 로그인 해주세요.", // 메시지 내용
                [
                    { text: "OK", onPress: () => navigation.navigate(MainScreens.LogIn) }
                    // 사용자가 OK 버튼을 누르면 로그인 화면으로 이동
                ],
                { cancelable: false } // 안드로이드에서 뒤로가기 버튼으로 대화 상자를 닫을 수 없게 설정
            );
        }
    } catch (error) {
        console.log('Error confirming sign up', error);
    }
};


    const isConfirmationCodeEmpty = () => {
        return confirmationCode.trim().length === 0;
    };


    // const handleSignIn = async () => {
    //     try {
    //     const { isSignedIn } = await signIn({ username, password });

    //     if (isSignedIn) {
    //         setAuthState('signedIn');
    //     }
    //     } catch (error) {
    //     console.log('Error signing in', error);
    //     }
    // };

// const handleSignOut = async () => {
//         try {
//         await signOut();
//         setAuthState('initial');
//         } catch (error) {
//         console.log('Error signing out: ', error);
//         }
//     };

    const renderAuthForm = () => {
        switch (authState) {
        case 'initial':
            return (
            <View>
                <Text>로그인하기:</Text>
                <Button title="Sign Up" onPress={() => setAuthState('signUp')} />
                <Button title="Sign In" onPress={() => setAuthState('signIn')} />
            </View>
            );
case 'signUp':
    return (
        <KeyboardAvoidingView style={{}}>
        <View style={{justifyContent:'center',alignItems:'center',height:'100%',backgroundColor:'white',width:screenWidth}}>
            <View style={{height:screenHeight*0.06,width:screenWidth,alignItems:'flex-start',marginLeft:'10%'}}>  
                <Text style={{color:'black',fontSize:23, fontWeight:'bold'}}>이 정보가 맞나요?</Text>
            </View>
                <View style={{alignItems:'center',backgroundColor:'#fffdfd',width:screenWidth*0.9,height:screenHeight*0.5,justifyContent:'space-between',paddingVertical:'9%',borderRadius:15,...shadowStyle}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',width:screenWidth*0.65,alignItems:'center'}}>
                        <Text style={{color:'gray'}}>이름 : </Text>
                        <Text style={{color:'gray'}}>{name}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',width:screenWidth*0.65,alignItems:'center'}}>
                        <Text style={{color:'gray'}}>패스워드 : </Text>
                        <Text style={{color:'gray'}}>{password}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',width:screenWidth*0.65,alignItems:'center'}}>
                        <Text style={{color:'gray'}}>성별 : </Text>
                        <Text style={{color:'gray'}}>{gender}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',width:screenWidth*0.65,alignItems:'center'}}>
                        <Text style={{color:'gray'}}>생일 : </Text>
                        <Text style={{color:'gray'}}>{birthdate}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',width:screenWidth*0.65,alignItems:'center'}}>
                        <Text style={{color:'gray'}}>이메일 : </Text>
                        <Text style={{color:'gray'}}>{username}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',width:screenWidth*0.65,alignItems:'center'}}>
                        <Text style={{color:'gray'}}>전화번호 : </Text>
                        <Text style={{color:'gray'}}>{phoneNumber}</Text>
                    </View>
                </View>

                <View style={{height:screenHeight*0.2,justifyContent:'center',alignItems:'center',width:screenWidth*0.9}}>
                    <TouchableOpacity 
                    style={{width:screenWidth*0.9,height:screenHeight*0.06,backgroundColor:'#4A7AFF',justifyContent:'center',alignItems:'center',borderRadius:15}}
                    onPress={handleSignUp} >
                        <Text style={{fontSize:18, color:'white'}}>확인</Text>
                    </TouchableOpacity>
                </View>
                    
            
        </View>
        </KeyboardAvoidingView>
    );
        case 'confirmSignUp':
            return (
            <View style={{height:screenHeight,width:screenWidth,justifyContent:'space-between',alignItems:'center',backgroundColor:'white'}}>
            <View style={{height:screenHeight*0.3,width:screenWidth,justifyContent:'center',alignItems:'center'}}>
                
                <Text style={{fontSize:20,fontWeight:'bold',color:'black'}}>인증번호를 입력해주세요.</Text>
            </View>
            <View style={{height:screenHeight*0.9,bottom:'5%'}}>
                <TextInput
                placeholder="인증번호 6자리"
                placeholderTextColor={'gray'}
                style={{ borderBottomWidth: 0.5, borderColor: 'gray', fontSize: 30, fontWeight: 'bold',width:screenWidth*0.9}}
                onChangeText={(text) => setConfirmationCode(text)}
                />

                <TouchableOpacity 
                disabled={isConfirmationCodeEmpty()}
                onPress={handleSignUpConfirmation}
                style={{
                    backgroundColor: isConfirmationCodeEmpty() ? 'gray' : '#4A7AFF',
                    borderRadius:15,
                    width:screenWidth*0.9,
                    justifyContent:'center',
                    alignItems:'center',
                    marginTop:'10%',
                    height:screenHeight*0.05}}>
                    <Text style={{color:'white',fontSize:18,fontWeight:'bold'}}>
                        인증하기
                    </Text>
                </TouchableOpacity>
                <View style={{marginTop:'10%',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:15}}>
                        인증번호가 오지 않나요 ?
                    </Text>

                <TouchableOpacity 
                style={{
                    backgroundColor: '#84a1f3',
                    borderRadius:15,
                    width:screenWidth*0.4,
                    justifyContent:'center',
                    alignItems:'center',
                    marginTop:'5%',
                    height:screenHeight*0.05}}
                
                onPress={() => resendConfirmationCode()}>
                    <Text style={{color:'white', fontWeight:'bold'}}>인증번호 다시보내기</Text>
                </TouchableOpacity>
                </View>
                

            </View>

        
            </View>

            );
        default:
            return null;
        }
    };


    return (
        <View>
            {renderAuthForm()}
        </View>
    );
    };

    export default Confirmation ;