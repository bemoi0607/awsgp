import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView,Image,TextInput, Dimensions } from 'react-native';
import { Input } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens,MainStackParamList } from '../stacks/Navigator';

type PhoneNumberScreenNavigationProps = StackNavigationProp<
    MainStackParamList, 
    'PhoneNumber'
>;

interface PhoneNumberScreenProps {
    navigation: PhoneNumberScreenNavigationProps;
};

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;


const PhoneNumberScreen: React.FunctionComponent<PhoneNumberScreenProps> = ({navigation}) => {

    const [phoneNumber, setPhoneNumber] = useState<string>('');

    const handleContinue = async () => {
        try {
            await AsyncStorage.setItem('PhoneNumber', phoneNumber);
            console.log(phoneNumber)
            navigation.navigate(MainScreens.Confirmation);
        } catch (error) {
            console.error('Error saving name to AsyncStorage:', error);
        }
    };

    const isPhoneNumberEmpty = () => {
        return phoneNumber.trim().length === 0;
    };
    
    return (
        <KeyboardAvoidingView style={{flex:1,backgroundColor:'white'}} behavior='padding'>
        
        <View style={{justifyContent:'space-between',alignItems:'center',flex:1, backgroundColor:'white'}} >
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../images/6.jpg')} style={{width:screenWidth,height:80}} resizeMode='contain' />
                    <Text style={{fontSize:20, fontWeight:'bold', }}>
                        전화번호를 입력해주세요.
                    </Text>
                    <TextInput
                        style={{ borderBottomWidth: 0.5, borderColor: 'gray', fontSize: 35, fontWeight: 'bold',width:screenWidth*0.9, marginTop:'10%' }}
                        placeholder="전화번호"
                        keyboardType="numeric" 
                        onChangeText={(text) => setPhoneNumber(text)}
                    />  
                </View>

            <View style={{ height: screenHeight * 0.3, justifyContent: 'flex-end' }}>
                <TouchableOpacity
                    style={{
                        borderRadius: 15,
                        backgroundColor: isPhoneNumberEmpty() ? 'gray' : '#4A7AFF', // 버튼 색상 조건부 설정
                        width: screenWidth * 0.9,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: screenHeight * 0.05,
                        marginBottom: '3%'
                    }}
                    onPress={handleContinue}
                    disabled={isPhoneNumberEmpty()} // 버튼 활성화 상태 조건부 설정
                >
                    <Text style={{ fontSize: 18, color: 'white' }}>확인</Text>
                </TouchableOpacity>
            </View>

        </View>
        </KeyboardAvoidingView>

    );
};

export default PhoneNumberScreen;
