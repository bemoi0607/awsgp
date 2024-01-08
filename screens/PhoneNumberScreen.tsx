import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Input } from 'native-base';
import { useNavigation } from '@react-navigation/native';
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


const PhoneNumberScreen: React.FunctionComponent<PhoneNumberScreenProps> = ({navigation}) => {

    const [phoneNumber, setPhoneNumber] = useState<string>('');

    const handleContinue = async () => {
        try {
            await AsyncStorage.setItem('PhoneNumber', phoneNumber);
            console.log(phoneNumber)
            navigation.navigate(MainScreens.PhoneNumber);
        } catch (error) {
            console.error('Error saving name to AsyncStorage:', error);
        }
    };
    
    return (
        <View style={{ height: '100%', justifyContent: 'space-between', backgroundColor: 'white' }}>
        <View>
            <Text style={{ color: 'black', fontSize: 20, marginBottom: '5%', fontWeight: 'bold' }}>
                전화번호를 입력해주세요.
            </Text>
        </View>
        <View>
            <Input
            style={{ borderWidth: 1, borderColor: 'white', fontSize: 35, fontWeight: 'bold' }}
            placeholder="전화번호"
            keyboardType="numeric" 
            onChangeText={(text) => setPhoneNumber(text)}
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

export default PhoneNumberScreen;
