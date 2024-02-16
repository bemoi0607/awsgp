import React, { useEffect, useState } from 'react';
import { Button,StyleSheet, Image,Text, View, Dimensions, TouchableOpacity, Platform,ScrollView,RefreshControl, Linking } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MainScreens, MainStackParamList } from '../stacks/Navigator';
import { AntDesign } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import config from '../config'

const BASE_URL = config.SERVER_URL;

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const shadowStyle = Platform.select({
    ios: {
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
    android: {
        elevation: 10,
    },
})

////////////////////////////////////////////////////////////////////////


type MyInfoScreenNavigationProps = StackNavigationProp<
    MainStackParamList, // navigators/HomeStackNavigators/index.tsx 에서 지정했던 HomeStackParamList
    MainScreens.MyInfo
>;

interface MyInfoScreenProps {
    navigation: MyInfoScreenNavigationProps; // 네비게이션 속성에 대한 타입으로 방금 지정해주었던 MainScreenNavigationProps 을 지정
};

////////////////////////////////////////////////////////////////////////

const MyInfoScreen:React.FunctionComponent<MyInfoScreenProps> = (props) => {
    const {navigation} = props;
    const [refreshing, setRefreshing] = useState(false);
    const [userData, setUserData] = useState(null);
    const [logId, setLogId] = useState(null);

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

//   useEffect(() => {
//     AsyncStorage.getItem('logId')
//       .then((logId) => {
//         // Remove quotes from logId, if present
//         logId = logId.replace(/^['"](.*)['"]$/, '$1');
        
//         console.log(logId);

//         if (logId) {
//           setLogId(logId);
//         }
//       })
//       .catch((error) => {
//         console.log('Error retrieving logId:', error);
//       });
//   }, []);


//   useEffect(() => {
//   const fetchUserData = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/user/${logId}`);
    
//       if (response.status === 200) {
//         setUserData(response.data);
//         console.log('Fetched User Data:', response.data);
//       } else {
//         console.log('Error fetching user data. Status:', response.status);
//       }
//     } catch (error) {
//       console.log('Error fetching user data:', error);
//     }
//   };

//   fetchUserData();

// },[logId]); 


const onRefresh = async () => {
    setRefreshing(true);

    try {
        // AsyncStorage에서 로그인된 사용자의 logId 가져오기
        const logId = await AsyncStorage.getItem('logId');
        
        if (logId) {
        const formattedLogId = logId.replace(/^['"](.*)['"]$/, '$1');

        // Fetch user data
        try {
            const userResponse = await axios.get(`${BASE_URL}/user/${formattedLogId}`);
            if (userResponse.status === 200) {
            setUserData(userResponse.data);
            console.log("Updated user data:", userResponse.data);
            } else {
            console.log('Error fetching updated user data. Status:', userResponse.status);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }

        
        }
    } catch (error) {
        console.error('Error fetching logId from AsyncStorage:', error);
    }

    setRefreshing(false);
};


    return (
        <ScrollView
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={{height:screenHeight,backgroundColor:'white'}}>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:screenWidth*0.13,backgroundColor:'white',borderBottomWidth:0.5,borderBottomColor:'gray'}}>

                    <View>
                        <Image 
                            source={require('../images/logogp1.png')}
                            style={{width:screenWidth*0.45,height:'70%'}}
                            resizeMode='cover'
                        />
                    </View>
                </View>
    
            <View style={{flexDirection:'row',marginLeft:screenWidth*0.07,alignItems:'center',width:screenWidth,height:screenHeight*0.15,backgroundColor:'white'}}>
                    <Image 
                        source={require('../images/Man.png')}
                        style={{
                        height: 50,
                        width: 50,
                        borderRadius: 45,
                        marginBottom:10
                        }}
                        />
                    <View>
                        <Text style={{fontSize: 17,fontWeight:'bold',marginLeft:10,color:'#4F4F4F'}}>{userData?.username}</Text>
                        <Text style={{fontSize: 13,marginLeft:10,marginBottom:10,color:'#4F4F4F'}}>{userData?.email}</Text>
                    </View>    
            </View>

            <View style={{alignItems:'center'}}>
                <Image 
                        source={require('../images/리뷰이벤트.png')}
                        style={{
                        width:screenWidth*0.9,
                        height:screenHeight*0.2,
                        borderRadius:20
                        }}
                        />
            </View>

            <View style={{marginTop:screenWidth*0.1}}>
            <Text style={{fontWeight:'bold',fontSize:17,left:'5%'}}>보유회원권</Text>
                <TouchableOpacity
                onPress={()=>{navigation.navigate(MainScreens.MineMembership)}}
                style={{
                    borderTopWidth:1,
                    borderBottomWidth:1,
                    borderColor:'lightgray',
                    height: screenHeight *0.07,
                    width: screenWidth*0.9,
                    left:'5%',
                    marginTop: 20,
                    justifyContent:'center',
                    backgroundColor: 'rgba(255,255,255,1)',
                    padding: 5,
                    bottom:'10%'
                    }}>
            <View style={{flexDirection:'row',paddingHorizontal:10}}>
                <Text style={{fontSize:15,color:'#B4A8A8'}}>대관이용권 / PT회원권 보유내역</Text>
                <AntDesign name="right" size={15} color="#7f7f7f" style={{marginTop:3,marginLeft:screenWidth*0.21}}/>
            </View>
            </TouchableOpacity>
            </View>

            <View style={{marginTop:screenWidth*0.05}}>
            <Text style={{fontWeight:'bold',fontSize:17,left:'5%'}}>로그인정보</Text>
                <TouchableOpacity
                onPress={()=>{navigation.navigate(MainScreens.LogInfo)}}
                style={{
                    borderTopWidth:1,
                    borderBottomWidth:1,
                    borderColor:'lightgray',
                    height: screenHeight *0.07,
                    width: screenWidth*0.9,
                    left:'5%',
                    marginTop: 20,
                    justifyContent:'center',
                    backgroundColor: 'rgba(255,255,255,1)',
                    padding: 5,
                    }}>
            <View style={{flexDirection:'row',paddingHorizontal:10}}>
                <Text style={{fontSize:15,color:'#B4A8A8'}}>내 로그인정보 보기</Text>
                <AntDesign name="right" size={15} color="#7f7f7f" style={{left:'140%',marginTop:3,marginLeft:screenWidth*0.36}}/>
            </View>
            </TouchableOpacity>
            </View>
                <View style={{height:screenHeight*0.2,marginTop:'5%',justifyContent:'center'}}>
                <View style={{height:screenHeight*0.09,backgroundColor:'white',paddingHorizontal:'4%',justifyContent:'center',alignItems:'center',borderTopColor:'#E5E5E5',borderTopWidth:1}}>
                    <Text style={{color:'#797676',fontSize:12,fontWeight:'bold'}}>
                                    주식회사 라이프팔레트
                    </Text>
                    <Text style={{color:'#797676',fontSize:10,marginTop:'2.5%'}}>
                            주식회사 라이프팔레트는 통신판매중개자로서 통신판매의 당사자가 아니며 입점판매자가 등록한 상품정보 및 거래에 대한 책임을 지지 않습니다.
                    </Text>
                    
                    
            </View>
                    <View style={{flex:0.2,marginBottom:'1.7%',justifyContent:'center',backgroundColor:'white'}}>
                        <View style={{flex:0.7,flexDirection:'row',justifyContent:'center'}}>
                            <TouchableOpacity 
                            style={{width:screenWidth*0.15,height:40,justifyContent:'center',alignItems:'center'}}
                            onPress={() => Linking.openURL('https://sites.google.com/view/using-gymprivate/%ED%99%88')}>
                                    <Text style={{ color: '#797676', fontSize: 10 }}>이용약관   |</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                            style={{width:screenWidth*0.2,height:40,justifyContent:'center',alignItems:'center'}}
                            onPress={() => Linking.openURL('https://sites.google.com/view/gymprivate/%ED%99%88')}>
                                <Text style={{color:'#797676',fontSize:10}}> 개인정보처리방침 </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                            style={{width:screenWidth*0.2,height:40,justifyContent:'center',alignItems:'center'}}
                            onPress={() => Linking.openURL('https://sites.google.com/view/gymprivateusingduration/%ED%99%88')}>
                                <Text style={{ color: '#797676', fontSize: 10 }}>|   PT이용기간</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>

            </View>


        </View>
        </ScrollView>

    );
};

export default MyInfoScreen;