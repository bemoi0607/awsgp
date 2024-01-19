import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Linking } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Constants from 'expo-constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { LogInformationScreens, MainScreens, MainStackParamList } from '../stacks/Navigator';
import { signOut } from 'aws-amplify/auth';
import config from '../config'

const BASE_URL = config.SERVER_URL;
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

////////////////////////////////////////////////////////////////////////


type LogInfoScreenNavigationProps = StackNavigationProp<
    MainStackParamList, // navigators/HomeStackNavigators/index.tsx 에서 지정했던 HomeStackParamList
    MainScreens.LogInfo
>;

interface LogInfoScreenProps {
    navigation: LogInfoScreenNavigationProps; // 네비게이션 속성에 대한 타입으로 방금 지정해주었던 MainScreenNavigationProps 을 지정
};

////////////////////////////////////////////////////////////////////////

const LogInformationScreen:React.FunctionComponent<LogInfoScreenProps> = (props) => {
    const {navigation} = props;
    const [userData, setUserData] = useState(null);
    const [logId, setLogId] = useState(null);

    // useEffect(() => {
    //     AsyncStorage.getItem('logId')
    //     .then((logId) => {
    //         // Remove quotes from logId, if present
    //         logId = logId.replace(/^['"](.*)['"]$/, '$1');
            
    //         console.log(logId);

    //         if (logId) {
    //         setLogId(logId);
    //         }
    //     })
    //     .catch((error) => {
    //         console.log('Error retrieving logId:', error);
    //     });
    // }, []);


    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         try {
    //         const response = await axios.get(`${BASE_URL}/user/${logId}`);
            
    //         if (response.status === 200) {
    //             setUserData(response.data);
    //             console.log('Fetched User Data:', response.data);
    //         } 
    //         } catch (error) {
    //         console.log('Error fetching user data:', error);
    //         }
    //     };

    //     fetchUserData();

    // },[logId]); 

    useEffect(() => {
    const fetchData = async () => {
        try {
        // AsyncStorage에서 logId 가져오기
        let logId = await AsyncStorage.getItem('logId');
        if (logId) {
            // Remove quotes from logId, if present
            logId = logId.replace(/^['"](.*)['"]$/, '$1');
            console.log(logId);

            // logId를 사용하여 사용자 데이터 가져오기
            const response = await axios.get(`${BASE_URL}/user/${logId}`);
            if (response.status === 200) {
            setUserData(response.data);
            console.log('Fetched User Data:', response.data);
            }
        }
        } catch (error) {
        console.log('Error:', error);
        }
    };

    fetchData();
    }, []); // 빈 의존성 배열로, 컴포넌트 마운트 시에만 실행


const handleSignOut = async () => {
    try {
        await signOut({ global: true });
        console.log('Logout completed');
        
        await AsyncStorage.clear();
        console.log('AsyncStorage cleared');

       // AsyncStorage가 비어있는지 확인
        const keys = await AsyncStorage.getAllKeys();
        if (keys.length === 0) {
            console.log('Confirmed: AsyncStorage is empty');
        } else {
            console.log('Remaining keys in AsyncStorage:', keys);
        }

        navigation.reset({routes: [{name: MainScreens.LogIn}]});
    } catch (error) {
        console.log('Error signing out: ', error);
    }
};

    // useEffect(() => {
    //     AsyncStorage.getItem('logId')
    //     .then((data) => {
    //         if (data) {
    //         setLogId(data);
    //         }
    //     })
    //     .catch((error) => {
    //         console.log('Error retrieving logId:', error);
    //     });
    // }, []);

    // useEffect(() => {
    //     const fetchUserData = async () => {
    //     try {
    //         const response = await axios.get(`${BASE_URL}/user/${logId}`);
    //         const userData = response.data;
    //         setUserData(userData);
    //     } catch (error) {
    //         console.log('Error fetching user data:', error);
    //     }
    //     };

    //     if (logId) {
    //     fetchUserData();
    //     }
    // }, [logId]);

    return (
        <View style={{height:'auto'}}>
            <View style={{height:screenHeight,width:screenWidth}}>
                <View style={{backgroundColor:'white',width:screenWidth,height:screenHeight*0.1,justifyContent:'center',alignItems:'flex-start',borderBottomColor:'lightgray',borderBottomWidth:0.5}}>
                    <Text style={{fontSize:18, fontWeight:'bold',marginLeft:'5%'}}>
                        가입정보
                    </Text>
                </View>
                <View style={{backgroundColor:'white',width:screenWidth,height:screenHeight*0.08,justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                    <Text style={{fontSize:15,fontWeight:'600',marginLeft: '5%'}}>이름 </Text>
                    <Text style={{fontSize:15,fontWeight:'600',marginRight: '7%',color:'gray'}}>{userData?.username}</Text>
                </View>

                <View style={{backgroundColor:'white',width:screenWidth,height:screenHeight*0.08,justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                    <Text style={{fontSize:15,fontWeight:'600',marginLeft: '5%'}}>이메일 </Text>
                    <Text style={{fontSize:15,fontWeight:'600',marginRight: '7%',color:'gray'}}>{userData?.email}</Text>
                </View>

                <View style={{backgroundColor:'white',width:screenWidth,height:screenHeight*0.08,justifyContent:'space-between',alignItems:'center',flexDirection:'row',borderBottomColor:'lightgray',borderBottomWidth:0.5}}>
                    <Text style={{fontSize:15,fontWeight:'600',marginLeft: '5%'}}>생일 </Text>
                    <Text style={{fontSize:15,fontWeight:'600',marginRight: '7%',color:'gray'}}>{userData?.birthday}</Text>
                </View>

                <View style={{backgroundColor:'white',width:screenWidth,height:screenHeight*0.1,justifyContent:'center',alignItems:'flex-start',marginTop:'3%',borderBottomColor:'lightgray',borderBottomWidth:0.5,borderTopColor:'lightgray'}}>
                    <Text style={{fontSize:18, fontWeight:'bold',marginLeft:'5%'}}>
                        알림
                    </Text>
                </View>
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity 
                    onPress={() => Linking.openURL('https://sites.google.com/view/using-gymprivate/%ED%99%88')}
                    style={{backgroundColor:'white',width:screenWidth,height:screenHeight*0.08,justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                        <Text style={{fontSize:15,fontWeight:'600',marginLeft: '5%'}}>이용약관</Text>
                        <View style={{backgroundColor:'white',alignItems:'flex-end',marginRight:'5%'}}>
                                <AntDesign name="right" size={17} color="#131515" style={{marginLeft:'auto',fontWeight:'bold'}} />
                        </View>
                    </TouchableOpacity>
                    
                </View>

                <View style={{backgroundColor:'white',width:screenWidth,height:screenHeight*0.08,justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                    <Text style={{fontSize:15,fontWeight:'600',marginLeft: '5%'}}>앱 버전 </Text>
                    <Text style={{fontSize:15,fontWeight:'600',marginRight: '5%',color:'gray'}}>v1.0.0 </Text>
                </View>

                <View style={{justifyContent:'center',alignItems:'center',top:'6%'}}>
                <TouchableOpacity
                    style={{
                        height:screenWidth*0.12,
                        width:screenWidth*0.8,
                        backgroundColor:'#4A7AFF',
                        justifyContent:'center',
                        alignItems:'center',
                        borderRadius:15,
                    }}
                    onPress={handleSignOut}>
                    <Text style={{color:'rgba(255,255,255,1)',fontWeight:'bold',fontSize:15}}>로그아웃</Text>
                </TouchableOpacity>
            </View>

            </View>
        

        
        </View>
    );
};

export default LogInformationScreen;
