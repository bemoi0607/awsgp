import React, { useState,useEffect } from 'react';
import { View, TextInput, Button, Text, BackHandler } from 'react-native';
import { signUp, confirmSignUp, signIn, signOut } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import awsconfig from '../src/aws-exports';

Amplify.configure(awsconfig);

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, Birthdate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [authState, setAuthState] = useState('initial');

 // ... (이전 코드)

  const handleSignUp = async () => {
    try {
      const { userId } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            phone_number: `+82${phoneNumber}`,
            name,
            gender, 
            birthdate 
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
        setAuthState('signIn');
      }
    } catch (error) {
      console.log('Error confirming sign up', error);
    }
  };

  const handleSignIn = async () => {
    try {
      const { isSignedIn } = await signIn({ username, password });

      if (isSignedIn) {
        setAuthState('signedIn');
      }
    } catch (error) {
      console.log('Error signing in', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setAuthState('initial');
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  };

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
      <Text>Sign Up</Text>
      <TextInput
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />

      <TextInput
        placeholder="birthdate"
        onChangeText={(text) => setPhoneNumber(text)}
      />
      <TextInput
        placeholder="name"
        onChangeText={(text) => setPhoneNumber(text)}
      />
      <TextInput
        placeholder="gender"
        onChangeText={(text) => setPhoneNumber(text)}
      />
      <TextInput
        placeholder="Phone Number"
        onChangeText={(text) => setPhoneNumber(text)}
      />
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
      case 'signIn':
        return (
          <View>
            <Text>Sign In</Text>
            <TextInput
              placeholder="Username"
              onChangeText={(text) => setUsername(text)}
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
            />
            <Button title="Sign In" onPress={handleSignIn} />
          </View>
        );
      case 'signedIn':
        return (
          <View>
            <Text>Welcome! You are signed in.</Text>
            <Button title="Sign Out" onPress={handleSignOut} />
          </View>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const backAction = () => {

        if (authState !== 'initial') {
            setAuthState('initial');
            return true; // 이벤트 처리 완료
        }
      return false; // 이벤트 처리하지 않음
    };

    const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
    );

    // 컴포넌트 언마운트 시 이벤트 핸들러 제거
    return () => backHandler.remove();
    } , [authState]);

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      {renderAuthForm()}
    </View>
  );
};

export default Login ;