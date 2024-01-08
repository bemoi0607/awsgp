import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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


    return (
        <View style={{ height: '100%', justifyContent: 'space-between', backgroundColor: 'white' }}>
        <View>
            <Text style={{ color: 'black', fontSize: 20, marginBottom: '5%', fontWeight: 'bold' }}>
                패스워드를 설정해주세요.
            </Text>
        </View>
        <View>
            <Input
            style={{ borderWidth: 1, borderColor: 'white', fontSize: 35, fontWeight: 'bold' }}
            placeholder="패스워드"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
            />
        </View>
        <View style={{ marginBottom: '3%' }}>
            <TouchableOpacity style={{ borderWidth: 1 }} onPress={handleContinue}>
            <Text style={{ fontSize: 20 }}>Continue</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
};

export default NameScreen;
