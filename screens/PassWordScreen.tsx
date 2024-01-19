import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, KeyboardAvoidingView,Image, TextInput } from 'react-native';
import { Input } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens,MainStackParamList } from '../stacks/Navigator';

type PassWordScreenNavigationProps = StackNavigationProp<
    MainStackParamList, 
    'PassWord'
>;

interface PassWordScreenProps {
    navigation: PassWordScreenNavigationProps; 
};

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const NameScreen:React.FunctionComponent<PassWordScreenProps> = ({navigation}) => {
    
    const [password, setPassword] = useState<string>('');


    const handleContinue = async () => {
    try {
        await AsyncStorage.setItem('Password', password);
        console.log(password)
        navigation.navigate(MainScreens.Gender);
    } catch (error) {
        console.error('Error saving name to AsyncStorage:', error);
    }
};

    const isPasswordEmpty = () => {
        return password.trim().length === 0;
    };


    return (
        <KeyboardAvoidingView style={{flex:1,backgroundColor:'white'}} behavior='padding'>
        
        <View style={{justifyContent:'space-between',alignItems:'center',flex:1, backgroundColor:'white'}} >
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../images/2.jpg')} style={{width:screenWidth,height:80}} resizeMode='contain' />
                    <Text style={{fontSize:20, fontWeight:'bold', }}>
                        패스워드를 설정해주세요.
                    </Text>
                    <TextInput
                        style={{ borderBottomWidth: 0.5, borderColor: 'gray', fontSize: 35, fontWeight: 'bold',width:screenWidth*0.9, marginTop:'10%' }}
                        placeholder="패스워드"
                        secureTextEntry
                        onChangeText={(text) => setPassword(text)}
                    />  
                </View>

            <View style={{ height: screenHeight * 0.3, justifyContent: 'flex-end' }}>
                <TouchableOpacity
                    style={{
                        borderRadius: 15,
                        backgroundColor: isPasswordEmpty() ? 'gray' : '#4A7AFF', // 버튼 색상 조건부 설정
                        width: screenWidth * 0.9,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: screenHeight * 0.05,
                        marginBottom: '3%'
                    }}
                    onPress={handleContinue}
                    disabled={isPasswordEmpty()} // 버튼 활성화 상태 조건부 설정
                >
                    <Text style={{ fontSize: 18, color: 'white' }}>확인</Text>
                </TouchableOpacity>
            </View>

        </View>
        </KeyboardAvoidingView>
    //     <View style={{ height: '100%', justifyContent: 'space-between', backgroundColor: 'white' }}>
    //     <View>
    //         <Text style={{ color: 'black', fontSize: 20, marginBottom: '5%', fontWeight: 'bold' }}>
    //             패스워드를 설정해주세요.
    //         </Text>
    //     </View>
    //     <View>
    //         <Input
    //         style={{ borderWidth: 1, borderColor: 'white', fontSize: 35, fontWeight: 'bold' }}
    //         placeholder="패스워드"
    //         secureTextEntry
    //         onChangeText={(text) => setPassword(text)}
    //         />
    //     </View>
    //     <View style={{ marginBottom: '3%' }}>
    //         <TouchableOpacity style={{ borderWidth: 1 }} onPress={handleContinue}>
    //         <Text style={{ fontSize: 20 }}>Continue</Text>
    //         </TouchableOpacity>
    //     </View>
    //     </View>
    );
};

export default NameScreen;
