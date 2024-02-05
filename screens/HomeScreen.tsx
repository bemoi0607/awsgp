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
        elevation: 2,
    },
})


export const basicDimensions = {
    height: 852,
    width: 393,
  };
  

const calculateAdjustedRatio = (dimension, basicDimension) => {
  const ratio = dimension / basicDimension;
  if (ratio < 1) {
    // 화면 크기가 기준치보다 작은 경우, 비율을 조정
    return (1 / ratio).toFixed(2);
  }
  return ratio.toFixed(2);
};

export const height = calculateAdjustedRatio(screenHeight, basicDimensions.height);
export const width = calculateAdjustedRatio(screenWidth, basicDimensions.width);
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

    const images = [
        require('../images/리뷰이벤트.png'),
        require('../images/리뷰이벤트3.png'),
        require('../images/firstevent.png'),
    ];

    //자동슬라이드 스크롤뷰 
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef();

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prevIndex => {
                const nextIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
                scrollViewRef.current.scrollTo({ x: screenWidth * nextIndex, animated: true });
                return nextIndex;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const renderIndicator = () => {
        return (
            <View style={styles.indicatorContainer}>
                {images.map((image, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            { backgroundColor: activeIndex === index ? 'darkgray' : 'lightgray' },
                        ]}
                    />
                ))}
            </View>
        );
    };
        const [pState, setPState] = useState(0);
        const [refreshing, setRefreshing] = useState(false);
        const [userData, setUserData] = useState(null);
        const [logId, setLogId] = useState(null);

        const onRefresh = () => {
            setRefreshing(true)
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

                // uid 로 period_membership pstate 가져오기
                const membershipResponse = await fetch(`${BASE_URL}/membership?uid=${uid}`);
                const membershipData = await membershipResponse.json();
                setPState(membershipData.pstate);
                console.log(membershipData[0].pstate)
                        
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    fetchData();
}, []);

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
                <View style={{ width: screenWidth, height: screenWidth * 0.5, backgroundColor: 'white', paddingHorizontal: 24 }}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                onMomentumScrollEnd={e => {
                    const activeIndex = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                    setActiveIndex(activeIndex);
                }}
                showsHorizontalScrollIndicator={false}
            >
                {images.map((image, index) => (
                    <Image
                        key={index} 
                        source={images[index]}
                        style={{ width:screenWidth-48, height: '100%', borderRadius: 16,marginRight:48 }}
                    />
                ))}
            </ScrollView>
            {renderIndicator()}
        </View> 
    </View>
    <View style={{paddingHorizontal:24}}>
        <Text style={styles.subtitle}>짐프라이빗 서비스</Text>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <TouchableOpacity style={styles.Box1}
             onPress={()=>{navigation.navigate(MainScreens.YNMember)}}>
            
                <View style={{flex:1,paddingHorizontal:24,paddingVertical:24,justifyContent:'space-between'}}>
                    <Image source={require('../images/barbell.png')} style={styles.ImageIcon}/>
                    <View>
                        <Text style={styles.Body2Black}>공간</Text>
                        <Text style={styles.Body2Black}>예약하기</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.Box1}
             onPress={()=>{navigation.navigate(MainScreens.PT)}}>
                <View style={{flex:1,paddingHorizontal:24,paddingVertical:24,justifyContent:'space-between'}}>
                    <Image source={require('../images/whistle.png')} style={styles.ImageIcon}/>
                    <View>
                        <Text style={styles.Body2Black}>PT</Text>
                        <Text style={styles.Body2Black}>시작하기</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.Box2}  onPress={()=>{navigation.navigate(MainScreens.MembershipPurchase1)}}>
            <View style={{flex:1,paddingHorizontal:24,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <View>
                    <Text style={styles.Caption2}>처음이신가요?</Text>
                    <Text style={styles.Body2}>멤버쉽 구매하기</Text>
                </View>
                <AntDesign name="right" size={24} color="#FFFFFF" />
            </View>
        </TouchableOpacity>
        <TouchableOpacity 
        style={styles.Box3}
        onPress={() => {
            const url = 'https://talk.naver.com/ct/w4f4np?frm=mnmb&frm=nmb_detail';
            Linking.canOpenURL(url)
              .then((supported) => {
                if (supported) {
                  Linking.openURL(url);
                } else {
                  console.log("Can't handle URL: " + url);
                }
              })
              .catch((err) => console.error('An error occurred', err));
          }}
        >
            <View style={{flex:1,paddingHorizontal:24,flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:2}}>
                <View>
                    <Text style={styles.Caption2Black}>궁금한 점이 있으신가요?</Text>
                    <Text style={styles.Body2Black}>1:1 문의하기를 이용해주세요.</Text>
                </View>
                <Image source={require('../images/1:1question.png')} style={{width:40,height:40}}/>    
            </View>
        </TouchableOpacity>
    </View>
    </ScrollView>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({

indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
dot:{
        height: 8/height,
        width: 8/height,
        borderRadius: 4,
        marginHorizontal: 3,
        marginTop:8
    },
subtitle:{
    fontSize:24,
    fontWeight:'bold',
    marginTop:40
},
Body2:{
    fontSize:18,
    fontWeight:'bold',
    color:'#FFFFFF'
},
Caption2:{
    fontSize:12,
    color:'#FFFFFF'
},
Body1Black:{
    fontSize:18,
    fontWeight:'bold',
    color:'#333333'
},
Body2Black:{
    fontSize:18,
    fontWeight:'bold',
    color:'#333333'
},
Caption2Black:{
    fontSize:12,
    color:'#333333'
},
Box1:{
    width:'47%',
    height:158/height,
    backgroundColor:'#F1F3F5',
    borderRadius:16,
    marginTop:24
},
Box2:{
    width:'100%',
    height:72/height,
    backgroundColor:'#4169E1',
    borderRadius:16,
    marginTop:24
},
Box3:{
    width:'100%',
    height:102/height,
    backgroundColor:'#F1F3F5',
    borderRadius:16,
    marginTop:60,
    bottom:24
},
ImageIcon:{
    width:36/height,
    height:36/height
}

});
