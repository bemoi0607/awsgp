import React, { useState } from 'react'
import { View,Text, Button } from 'react-native'
import { signOut } from 'aws-amplify/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList,MainScreens } from '../stacks/Navigator';
import { Amplify, type ResourcesConfig } from 'aws-amplify';
import { defaultStorage } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';


const authConfig: ResourcesConfig['Auth'] = {
        Cognito: {
            userPoolId: 'ap-northeast-2_Dr7DjaWDb',
            userPoolClientId: '3r24ukm2n2f9e016a53j2omlee'
        }
    };

    Amplify.configure({
        Auth: authConfig
    });

cognitoUserPoolsTokenProvider.setKeyValueStorage(defaultStorage);


type MyInfoScreenNavigationProps = StackNavigationProp<
    MainStackParamList, 
    'MyInfo'
>;

interface MyInfoScreenProps {
    navigation: MyInfoScreenNavigationProps; 
};


const MyInfoScreen:React.FunctionComponent<MyInfoScreenProps> = ({navigation}) => {

  const handleSignOut = async () => {
    try {
            await signOut({ global: true });
            console.log('logout completed')
            navigation.reset({routes: [{name: MainScreens.LogIn}]})
        } catch (error) {
            console.log('error signing out: ', error);
        }
    };
    
  return (
    <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
      <Button title="로그아웃" onPress={handleSignOut} />
    </View>
  )
}

export default MyInfoScreen