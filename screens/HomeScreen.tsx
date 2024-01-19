import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity,Image, FlatList,Button, Platform, ScrollView,RefreshControl} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens,MainStackParamList, MembershipScreens } from '../stacks/Navigator';
import { signIn, signOut, autoSignIn, getCurrentUser, fetchAuthSession, } from 'aws-amplify/auth';
import { RouteProp } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
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
        elevation: 5,
    },
})


//////////////////////////////////////////////////////////////// 코드 타입정의

type HomeScreenNavigationProps = StackNavigationProp<
    MainStackParamList, // navigators/HomeStackNavigators/index.tsx 에서 지정했던 HomeStackParamList
    'Home' | 'Book' | 'Membership' | 'MembershipPurchase1' | 'PT'
>;

interface HomeScreenProps {
    route: RouteProp<MainStackParamList, 'Home'>;
    navigation: HomeScreenNavigationProps; // 네비게이션 속성에 대한 타입으로 방금 지정해주었던 MainScreenNavigationProps 을 지정
};


//////////////////////////////////////////////////////////////// 



const HomeScreen: React.FunctionComponent<HomeScreenProps> = ({navigation,route}) => {

    const [event,setEvent]=useState([
        {id:'1', name:'event1', source: require('../images/earlybird.jpeg')},
        {id:'2', name:'event2', source: require('../images/rooms1.png')},
        {id:'3', name:'event3', source: require('../images/rooms2.png')},
        {id:'4', name:'event4', source: require('../images/rooms3.jpeg')},
    ]);

    



        const [pState, setPState] = useState(0);
        const [refreshing, setRefreshing] = useState(false);
        const [userData, setUserData] = useState(null);
        const [logId, setLogId] = useState(null);

        const onRefresh = () => {
            setRefreshing(true)

            // fetchPState();

            setRefreshing(false)
        }
        
//정기권 구매여부 확인

useEffect(() => {
    const fetchData = async () => {
        try {
            // AsyncStorage에서 logId 가져오기
            let logId = await AsyncStorage.getItem('logId');
            if (logId) {
                // Remove quotes from logId, if present
                logId = logId.replace(/^['"](.*)['"]$/, '$1');
                console.log(logId);

                // logId를 사용하여 사용자 UID 가져오기
                const uidResponse = await fetch(`${BASE_URL}/user/${logId}`);
                const uidData = await uidResponse.json();
                const uid = uidData.uid;
                console.log(uid);

                // uid 로 pstate 가져오기
                const pstateResponse = await fetch(`${BASE_URL}/membership?uid=${uid}`);
                const pstateData = await pstateResponse.json();
                setPState(pstateData.p_state);
                console.log(pstateData)
                        
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    fetchData();
}, []);



    // const handleMembershipPress = () => {
    //     if (pState === 1) {
    //     navigation.navigate(MainScreens.Membership);
    //     } else {
    //     navigation.navigate(MainScreens.MembershipPurchase1);
    //     }
    // };


return (
        <ScrollView style={{backgroundColor:'white'}}
            refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        >
            <View style={{height: 'auto'}}>

                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:screenWidth*0.13,backgroundColor:'white'}}>

                    <View>
                        <Image 
                            source={require('../images/logogp.jpeg')}
                            style={{width:screenWidth*0.45,height:'70%'}}
                            resizeMode='cover'
                        />
                    </View>
                </View>
            <View style={{width:screenWidth,height:screenWidth,backgroundColor:'white'}}>
                <FlatList
                    horizontal
                    data={event}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                // onPress={() => { navigation.navigate(MainScreens.Event) }}
                                style={{ flex: 1 }}
                            >
                                <Image
                                    source={item.source}
                                    style={{ width: screenWidth, height: '100%' }}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                        );
                    }}
                />

            </View> 
        <View>
        
        <View style={{width:screenWidth,height:screenWidth*0.7,backgroundColor:'white'}}>
            <View style={{flex:0.6,backgroundColor:'white',justifyContent:'center'}}>
                <Text style={styles.serviceTitle}>
                            짐프라이빗 서비스
                </Text>
            </View>

        <View style={{flex:1,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
            <TouchableOpacity 
                        style={styles.ReservationContainer}
                        onPress={()=>{navigation.navigate(MainScreens.YNMember)}}>

                            <View style={{flexDirection:'row',flex:1,paddingHorizontal:'8%'}}>
                                <View style={{flex:1.2,backgroundColor:'white',justifyContent:'center'}}>
                                    <Image
                                        source={require('../images/calendar.png')}
                                        style={{width:'60%',height:'55%'}}
                                    />
                                </View>
                                <View style={{flex:2.5,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                                    <View ><Text style={styles.gray}>회원/비회원</Text></View>
                                    <View style={{marginTop:'4%'}}><Text style={styles.black}>공간 예약하기</Text></View>
                                </View>
                                <View style={{flex:1,backgroundColor:'white',justifyContent:'center'}}>
                                <AntDesign name="right" size={15} color="#131515" style={{marginLeft:'auto'}} />
                                </View>
                            </View>

                    </TouchableOpacity>

        </View>

        {/* <View style={{flex:1,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
            <TouchableOpacity 
                        style={styles.ReservationContainer}
                        onPress={handleMembershipPress}>

                            <View style={{flexDirection:'row',flex:1,paddingHorizontal:'8%'}}>
                                <View style={{flex:1.2,backgroundColor:'white',justifyContent:'center'}}>
                                    <Image
                                        source={require('../../src/images/id-card.png')}
                                        style={{width:'60%',height:'55%'}}
                                    />
                                </View>
                                <View style={{flex:2.5,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                                    <View><Text style={styles.gray}>회원권을 이용하시겠어요?</Text></View>
                                    <View style={{marginTop:'4%'}}><Text style={styles.black}>회원권 이용하기</Text></View>
                                </View>
                                <View style={{flex:1,backgroundColor:'white',justifyContent:'center'}}>
                                <AntDesign name="right" size={15} color="#131515" style={{marginLeft:'auto'}} />
                                </View>
                            </View>
                </TouchableOpacity>
        </View> */}

        <View style={{flex:1,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity 
                                style={styles.ReservationContainer}
                                onPress={()=>{navigation.navigate(MainScreens.PT)}}>

                                    <View style={{flexDirection:'row',flex:1,paddingHorizontal:'8%'}}>
                                        <View style={{flex:1.2,backgroundColor:'white',justifyContent:'center'}}>
                                            <Image
                                                source={require('../images/Dumbell.png')}
                                                style={{width:'50%',height:'50%'}}
                                            />
                                        </View>
                                        <View style={{flex:2.5,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                                            <View><Text style={styles.gray}>운동을 할줄 모른다면?</Text></View>
                                            <View style={{marginTop:'4%'}}><Text style={styles.black}>운동 배우기</Text></View>
                                        </View>
                                        <View style={{flex:1,backgroundColor:'white',justifyContent:'center'}}>
                                        <AntDesign name="right" size={15} color="#131515" style={{marginLeft:'auto'}} />
                                        </View>
                                    </View>
                    </TouchableOpacity>
            </View>
            </View>      
        </View>
        <View style={{width:screenWidth,height:screenWidth,backgroundColor:'white'}}>
            <View style={{flex:0.5,backgroundColor:'white',justifyContent:'center'}}>
            <Text style={{fontSize:21,fontWeight:'bold',marginLeft:'7%'}}>
                            Gym Private?
            </Text>
            </View>
            <View style={{flex:1,backgroundColor:'white',justifyContent:'center'}}>
                <TouchableOpacity 
                                style={{width:'80%',height:'77%',backgroundColor:'#4A7AFF',borderRadius:10,marginLeft:'15%'}}
                                activeOpacity={0.5}
                                onPress={() => {Linking.openURL('http://www.gymprivate.com');}}>
                <View style={{flex:1,backgroundColor:'#4A7AFF',flexDirection:'row',alignItems:'center',borderRadius:10}}>  
                    <Image
                    source={require('../images/rooms2.png')}
                    style={{width:'28%',height:'72%',right:'40%',borderRadius:10}}
                    />
                    <View style={{right:'10%'}}>
                        <Text style={{color: 'white',fontWeight:'bold',fontSize:16}}>짐프라이빗 서비스 둘러보기</Text>
                        <Text style={{color: 'white',marginTop:'9%',fontSize:14}}>당신만을 위한 운동공간</Text>
                        <Text style={{color: 'white',fontSize:14}}>짐프라이빗</Text>
                    </View>
                </View>                 
                </TouchableOpacity>
            </View>
            <View style={{flex:1,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
            <TouchableOpacity 
            onPress={()=>{navigation.navigate(MainScreens.Franchise)}}
            style={{width:screenWidth*0.9,height:'65%',backgroundColor:'white',...shadowStyle,borderRadius:10}}>
                <View style={{flex:1,flexDirection:'row'}}>
                    <View style={{flex:3,backgroundColor:'white',justifyContent:'center',left:'25%'}}>
                        <Text style={{fontSize:15,fontWeight:'bold',marginBottom:'1.5%'}}>짐프라이빗 가맹문의</Text>
                        <Text style={{color:'#797676'}}>효율적인 공간 기대 그이상의 수익</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Image
                        source={require('../images/3DReport.png')}
                        style={{width:'50%',height:'65%'}}
                        />
                    </View>
                </View>
            </TouchableOpacity>
            </View>
            
                <View style={{flex:0.6,backgroundColor:'white',paddingHorizontal:'4%',justifyContent:'center',alignItems:'center',borderTopColor:'#E5E5E5',borderTopWidth:1}}>
                    <Text style={{color:'#797676',fontSize:12}}>
                                    (주)라이프팔레트
                    </Text>
                    <Text style={{color:'#797676',fontSize:10,marginTop:'2.5%'}}>
                            주식회사 라이프팔레트는 통신판매중개자로서 통신판매의 당사자가 아니며 입점판매자가 등록한 상품정보 및 거래에 대한 책임을 지지 않습니다.
                    </Text>
                    
                    
                </View>
                    <View style={{flex:0.2,marginBottom:'1.7%',justifyContent:'center'}}>
                        <View style={{flex:0.7,flexDirection:'row',justifyContent:'center'}}>
                            <TouchableOpacity onPress={() => Linking.openURL('https://sites.google.com/view/using-gymprivate/%ED%99%88')}>
                                <Text style={{ color: '#797676', fontSize: 10 }}>이용약관  |</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL('https://sites.google.com/view/gymprivate/%ED%99%88')}>
                                <Text style={{color:'#797676',fontSize:10}}>  개인정보처리방침  |</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL('https://sites.google.com/view/gymprivateusingduration/%ED%99%88')}>
                                <Text style={{ color: '#797676', fontSize: 10 }}> PT이용기간</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <View style={{justifyContent:'center'}}>
                            
                        </View> */}
                    </View>
            
            
        </View>    
    </View>
    </ScrollView>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({



gray:{
    fontSize:11,
    color: 'gray',
    fontWeight:'500'
},

black:{
    fontSize:17,
    color:'black',
    fontWeight:'bold'
},


serviceTitle:{
    left:'7%',
    fontSize: 21,
    fontWeight: 'bold',
    
},


ReservationContainer: {
    ...shadowStyle,
    height: '75%',
    width: '90%',
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent:'center',
    alignItems:'center'
},



});
