import React, { useState,useEffect } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import awsconfig from '../src/aws-exports';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens,MainStackParamList } from '../stacks/Navigator';

type ConfirmationScreenNavigationProps = StackNavigationProp<
    MainStackParamList, 
    'Confirmation'
>;

interface ConfirmationScreenProps {
    navigation: ConfirmationScreenNavigationProps;
};


Amplify.configure(awsconfig);

const Confirmation: React.FunctionComponent<ConfirmationScreenProps> = ({navigation}) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [birthdate, setBirthdate] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [confirmationCode, setConfirmationCode] = useState<string>('');
    const [authState, setAuthState] = useState<string>('signUp');




    useEffect(() => {
        // Fetch data from AsyncStorage when the component mounts
        const fetchDataFromStorage = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem('Username');
                const storedPassword = await AsyncStorage.getItem('Password');
                const storedName = await AsyncStorage.getItem('Name');
                const storedGender = await AsyncStorage.getItem('Gender');
                const storedBirthdate = await AsyncStorage.getItem('Birthdate');
                const storedPhoneNumber = await AsyncStorage.getItem('PhoneNumber');

                setUsername(storedUsername || '');
                setPassword(storedPassword || '');
                setName(storedName || '');
                setGender(storedGender || '');
                setBirthdate(storedBirthdate || '');
                setPhoneNumber(storedPhoneNumber || '');
            } catch (error) {
                console.error('Error fetching data from AsyncStorage:', error);
            }
        };

        fetchDataFromStorage();
    }, []);


    const handleSignUp = async () => {
        const convertToFormattedDate = (input: string): string => {
            if (input.length === 8) {
                const year = input.substring(0, 4);
                const month = input.substring(4, 6);
                const day = input.substring(6, 8);
                return `${year}-${month}-${day}`;
            } else {
                // 유효한 날짜 형식이 아닌 경우 또는 다른 예외처리를 원하는 경우 추가 로직 구현
                console.error('Invalid date format');
                return input;
            }
        };
        
        const formattedDate = convertToFormattedDate(birthdate);

    try {
        const { userId } = await signUp({
            username,
            password,
            options: {
            userAttributes: {
                phone_number: `+82${phoneNumber}`,
                name: name,
                gender: gender, 
                birthdate: formattedDate
            },
            autoSignIn: true
            }
        });

        console.log(`User ID: ${userId}`);
        setAuthState('confirmSignUp');
        } catch (error) {
        console.log('Error signing up:', error);
        }
    };



const handleSignUpConfirmation = async () => {
        try {
        const { isSignUpComplete } = await confirmSignUp({
            username,
            confirmationCode
        });

        if (isSignUpComplete) {
            navigation.navigate(MainScreens.Home);
        }
        } catch (error) {
        console.log('Error confirming sign up', error);
        }
    };

    // const handleSignIn = async () => {
    //     try {
    //     const { isSignedIn } = await signIn({ username, password });

    //     if (isSignedIn) {
    //         setAuthState('signedIn');
    //     }
    //     } catch (error) {
    //     console.log('Error signing in', error);
    //     }
    // };

// const handleSignOut = async () => {
//         try {
//         await signOut();
//         setAuthState('initial');
//         } catch (error) {
//         console.log('Error signing out: ', error);
//         }
//     };

    const renderAuthForm = () => {
        switch (authState) {
        case 'initial':
            return (
            <View>
                <Text>로그인하기:</Text>
                <Button title="Sign Up" onPress={() => setAuthState('signUp')} />
                <Button title="Sign In" onPress={() => setAuthState('signIn')} />
            </View>
            );
case 'signUp':
    return (
        <View>
            <Text>이 정보가 맞나요?</Text>
                    <Text>Username: {username}</Text>
                    <Text>Password: {password}</Text>
                    <Text>Name: {name}</Text>
                    <Text>Gender: {gender}</Text>
                    <Text>Birthdate: {birthdate}</Text>
                    <Text>Phone Number: {phoneNumber}</Text>
            <Button title="Sign Up" onPress={handleSignUp} />
            
        </View>
    );
        case 'confirmSignUp':
            return (
            <View>
                <Text>Confirm Sign Up</Text>
                <TextInput
                placeholder="Confirmation Code"
                onChangeText={(text) => setConfirmationCode(text)}
                />
                <Button title="Confirm Sign Up" onPress={handleSignUpConfirmation} />
            </View>
            );
        default:
            return null;
        }
    };


    return (
        <View style={{ padding: 20, marginTop: 50 }}>
            {renderAuthForm()}
        </View>
    );
    };

    export default Confirmation ;