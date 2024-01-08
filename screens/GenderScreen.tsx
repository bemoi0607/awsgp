import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Input } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens,MainStackParamList } from '../stacks/Navigator';

type GenderScreenNavigationProps = StackNavigationProp<
    MainStackParamList, 
    'Gender'
>;

interface GenderScreenProps {
    navigation: GenderScreenNavigationProps;
};



const NameScreen: React.FunctionComponent<GenderScreenProps> = ({navigation}) => {
    
    const [gender, setGender] = useState<string>('');

    const handleContinue = async () => {
    try {
        await AsyncStorage.setItem('Gender', gender);
        console.log(gender)
        navigation.navigate(MainScreens.BirthDate);
    } catch (error) {
        console.error('Error saving name to AsyncStorage:', error);
    }
};


    return (
        <View style={{ height: '100%', justifyContent: 'space-between', backgroundColor: 'white' }}>
        <View>
            <Text style={{ color: 'black', fontSize: 20, marginBottom: '5%', fontWeight: 'bold' }}>
                성별을 알려주세요.
            </Text>
        </View>
        <View>
            <Input
            style={{ borderWidth: 1, borderColor: 'white', fontSize: 35, fontWeight: 'bold' }}
            placeholder="성별"
            onChangeText={(text) => setGender(text)}
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
