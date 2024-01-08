import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Input } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens,MainStackParamList } from '../stacks/Navigator';

type BirthdateScreenNavigationProps = StackNavigationProp<
    MainStackParamList, 
    'BirthDate'
>;

interface BirthdateScreenProps {
    navigation: BirthdateScreenNavigationProps;
};


const BirthdateScreen: React.FunctionComponent<BirthdateScreenProps> = ({navigation}) => {
    
    const [birthdate, setBirthdate] = useState<string>('');

    const handleContinue = async () => {
        try {
            await AsyncStorage.setItem('Birthdate', birthdate);
            console.log(birthdate)
            navigation.navigate(MainScreens.Email);
        } catch (error) {
            console.error('Error saving name to AsyncStorage:', error);
        }
    };

    return (
        <View style={{ height: '100%', justifyContent: 'space-between', backgroundColor: 'white' }}>
        <View>
            <Text style={{ color: 'black', fontSize: 20, marginBottom: '5%', fontWeight: 'bold' }}>
                생년월일을 입력해주세요.
            </Text>
        </View>
        <View>
            <Input
            style={{ borderWidth: 1, borderColor: 'white', fontSize: 35, fontWeight: 'bold' }}
            placeholder="생년월일 8자리"
            keyboardType="numeric" 
            onChangeText={(text) => setBirthdate(text)}
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

export default BirthdateScreen;
