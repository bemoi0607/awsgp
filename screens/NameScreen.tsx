import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, BackHandler } from 'react-native';
import { Input } from 'native-base';
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


    return (
        <View style={{ height: '100%', justifyContent: 'space-between', backgroundColor: 'white' }}>
        <View>
            <Text style={{ color: 'black', fontSize: 20, marginBottom: '5%', fontWeight: 'bold' }}>
              이름을 입력해주세요.
            </Text>
        </View>
        <View>
            <Input
            style={{ borderWidth: 1, borderColor: 'white', fontSize: 35, fontWeight: 'bold' }}
            placeholder="이름"
            onChangeText={(text) => setName(text)}
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
