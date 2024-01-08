import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Input } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens,MainStackParamList } from '../stacks/Navigator';

type EmailScreenNavigationProps = StackNavigationProp<
    MainStackParamList, 
    'Email'
>;

interface EmailScreenProps {
    navigation: EmailScreenNavigationProps;
};



const EmailScreen: React.FunctionComponent<EmailScreenProps>= ({navigation}) => {
    const [username, setUsername] = useState<string>('');

    const handleContinue = async () => {
        try {
            await AsyncStorage.setItem('Username', username);
            console.log(username)
            navigation.navigate(MainScreens.PhoneNumber);
        } catch (error) {
            console.error('Error saving name to AsyncStorage:', error);
        }
    };

    return (
        <View style={{ height: '100%', justifyContent: 'space-between', backgroundColor: 'white' }}>
        <View>
            <Text style={{ color: 'black', fontSize: 20, marginBottom: '5%', fontWeight: 'bold' }}>
                이메일을 입력해주세요.
            </Text>
        </View>
        <View>
            <Input
            style={{ borderWidth: 1, borderColor: 'white', fontSize: 35, fontWeight: 'bold' }}
            placeholder="이메일"
            onChangeText={(text) => setUsername(text)}
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

export default EmailScreen;
