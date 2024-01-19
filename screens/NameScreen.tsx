import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, BackHandler, Dimensions, TextInput,Image, Button } from 'react-native';
import { Input, KeyboardAvoidingView } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens,MainStackParamList } from '../stacks/Navigator';


type NameScreenNavigationProps = StackNavigationProp<
    MainStackParamList, 
    'Name'
>;

interface NameScreenProps {
    navigation: NameScreenNavigationProps; 

};

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;


const NameScreen:React.FunctionComponent<NameScreenProps> = ({navigation}) => {


useEffect(() => {
        const backAction = () => {
            navigation.navigate(MainScreens.LogIn);
            return true; 
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, [navigation]);

    
    const [name, setName] = useState<string>('');

const handleContinue = async () => {
    try {
        await AsyncStorage.setItem('Name', name);
        console.log(name)
        navigation.navigate(MainScreens.PassWord);
    } catch (error) {
        console.error('Error saving name to AsyncStorage:', error);
    }
};

    const isNameEmpty = () => {
        return name.trim().length === 0;
    };


    return (
        <KeyboardAvoidingView style={{flex:1,backgroundColor:'white'}} behavior='padding'>
        
        <View style={{justifyContent:'space-between',alignItems:'center',flex:1, backgroundColor:'white'}} >
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../images/1.jpg')} style={{width:screenWidth,height:80}} resizeMode='contain' />
                    <Text style={{fontSize:20, fontWeight:'bold', }}>
                        이름을 입력해주세요.
                    </Text>
                    <TextInput
                        style={{ borderBottomWidth: 0.5, borderColor: 'gray', fontSize: 35, fontWeight: 'bold',width:screenWidth*0.9, marginTop:'10%' }}
                        placeholder="이름"
                        placeholderTextColor={'gray'}
                        onChangeText={(text) => setName(text)}
                    />  
                </View>

            <View style={{ height: screenHeight * 0.3, justifyContent: 'flex-end' }}>
                <TouchableOpacity
                    style={{
                        borderRadius: 15,
                        backgroundColor: isNameEmpty() ? 'gray' : '#4A7AFF', // 버튼 색상 조건부 설정
                        width: screenWidth * 0.9,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: screenHeight * 0.05,
                        marginBottom: '3%'
                    }}
                    onPress={handleContinue}
                    disabled={isNameEmpty()} // 버튼 활성화 상태 조건부 설정
                >
                    <Text style={{ fontSize: 18, color: 'white' }}>확인</Text>
                </TouchableOpacity>
            </View>

        </View>
        </KeyboardAvoidingView>
        
    );
};

export default NameScreen;
