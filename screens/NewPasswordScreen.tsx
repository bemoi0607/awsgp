import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react'
import { View,Text, KeyboardAvoidingView,Image,Dimensions, TextInput, TouchableOpacity } from 'react-native'
import { MainStackParamList } from '../stacks/Navigator';
import { Auth } from 'aws-amplify/auth';


const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

type ForgotPassWordScreenNavigationProps = StackNavigationProp<
    MainStackParamList,
    'ForgotPassword'
>;

interface ForgotPassWordScreenProps {
    navigation: ForgotPassWordScreenNavigationProps; 
};


const ForgotPasswordScreen: React.FunctionComponent<ForgotPassWordScreenProps> = ({navigation}) => {

    const [forgotPassword, setForgotPassword] = useState<string>('');

    const isForgotPasswordEmpty = () => {
        return forgotPassword.trim().length === 0;
    };

    // Send confirmation code to user's email or phone number
async function forgotPasswordSubmit(username: string) {
    try {
        const data = await Auth.forgotPassword(username);
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}



// Collect confirmation code and new password
async function resetPasswordSubmit(
    username: string,
    code: string,
    newPassword: string
) {
    try {
        const data = await Auth.forgotPasswordSubmit(username, code, newPassword);
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}


    return (
        <View style={{height:'100%',backgroundColor:'white'}}>
        <View style={{justifyContent:'center',alignItems:'center',height:screenHeight*0.5, backgroundColor:'white'}} >
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:20, fontWeight:'bold', }}>
                        비밀번호 재설정하기
                    </Text>
                    <TextInput
                        style={{ borderBottomWidth: 0.5, borderColor: 'gray', fontSize: 23, fontWeight: 'bold',width:screenWidth*0.9, marginTop:'10%' }}
                        placeholder="이메일을 입력해주세요"
                        onChangeText={(text) => setForgotPassword(text)}
                    />  
                    
                </View>

            <View style={{ height: screenHeight * 0.1, justifyContent: 'flex-end' }}>
                <TouchableOpacity
                    style={{
                        borderRadius: 15,
                        backgroundColor: isForgotPasswordEmpty() ? 'gray' : '#4A7AFF', // 버튼 색상 조건부 설정
                        width: screenWidth * 0.9,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: screenHeight * 0.05,
                        marginBottom: '3%'
                    }}
                    // onPress={handleContinue}
                    disabled={isForgotPasswordEmpty()} // 버튼 활성화 상태 조건부 설정
                >
                    <Text style={{ fontSize: 18, color: 'white' }}>확인</Text>
                </TouchableOpacity>
            </View>

        </View>
        </View>
    )
}

export default ForgotPasswordScreen