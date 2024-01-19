import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions,Image,TextInput, Alert,TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {  MainScreens, MembershipScreens, MembershipStackParamList } from '../stacks/Navigator';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config'

const BASE_URL = config.SERVER_URL;

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

type MembershipScreenNavigationProps = StackNavigationProp<
    MembershipStackParamList,
    MembershipScreens.MembershipBookedInfo,
    MainScreens.MyReservation
>;

interface MembershipScreenProps {
    route: RouteProp<MembershipStackParamList, 'MembershipBookedInfo'>;
    navigation: MembershipScreenNavigationProps;
}

const MembershipBookedInfoScreen: React.FunctionComponent<MembershipScreenProps> = ({navigation,route}) => {
    const now = new Date();
    const timestamp = now.getTime(); // 밀리초 단위 타임스탬프
    const milliseconds = now.getMilliseconds(); // 현재 밀리초
    const merchantUid = `mid_${timestamp}_${milliseconds}`;
    console.log(merchantUid)

    const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    

    useEffect(() => {
        const fetchSelectedRoomNumber = async () => {
        try {
            const roomNumber = await AsyncStorage.getItem('selectedRoomNumber');
            setSelectedRoomNumber(roomNumber);
        } catch (error) {
            console.log('Error fetching selected room number from AsyncStorage:', error);
        }
        };

        fetchSelectedRoomNumber();
    }, []);
    
    useEffect(() => {
        const fetchSelectedDate = async () => {
        try {
            const savedDate = await AsyncStorage.getItem('selectedDateSlot');
            setSelectedDate(savedDate || '');
        } catch (error) {
            console.error('Failed to fetch selected date:', error);
        }
        };

        fetchSelectedDate();
    }, []);


    const {
        selectedUsingTimeSlot,
        isMorning,
        isEvening,
        selectedDayTimeSlot,
        selectedNightTimeSlot,
        selectedEndTime,
    } = route.params;


    const [logId, setLogId] = useState(null);

    useEffect(() => {
    const fetchData = async () => {
        try {
            // Fetch logId from AsyncStorage
            let fetchedLogId = await AsyncStorage.getItem('logId');
            if (fetchedLogId) {
                // Remove quotes if present
                fetchedLogId = fetchedLogId.replace(/^['"](.*)['"]$/, '$1');
                console.log(fetchedLogId);
                setLogId(fetchedLogId); // Update the logId state
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    fetchData();
}, []);



    const handleSubmit = async () => {
    try {

        let startTime, endTime;

        if (isMorning && selectedDayTimeSlot) {
            startTime = selectedDayTimeSlot;
            endTime = selectedEndTime;
        } else if (isEvening && selectedNightTimeSlot) {
            startTime = selectedNightTimeSlot;
            endTime = selectedEndTime;
        } else {
            return; // Handle the case when the time slot is not selected properly
        }


        const response = await axios.post(`${BASE_URL}/reservation`, {
            room: selectedRoomNumber,
            date: selectedDate,
            startTime: startTime,
            endTime: endTime,
            usingTime: selectedUsingTimeSlot,
            logId: logId,
            amount:0,
            merchantUid:merchantUid
            

         // Spread the user information into the request body
        });

        console.log(response.data);
        console.log('success');
        Alert.alert('알림', '예약이 완료되었습니다!');
        navigation.navigate(MainScreens.MyReservation);
    } catch (error) {
        console.error(error);
    }

    // navigation.navigate(MainScreens.MyReservation);
};
    

 // const [Price, setPrice] = useState(0);

// useEffect(() => {
//         const fetchPrice = async () => {
//         try {
//             const response = await axios.post(`${BASE_URL}/booking_price/price`, {
//                 usingTime: selectedUsingTimeSlot,
//             });

//         if (response.status === 200) {
//             const priceData = response.data;
//             setPrice(priceData.price);
//         } else {
//             console.error('Failed to fetch price');
//         }
//         } catch (error) {
//         console.error('Error fetching price:', error);
//         }
//     };

//         fetchPrice();
//     }, [selectedUsingTimeSlot]);

    // const name = '짐프라이빗 대관'
    // const amount = Price
    // const [merchantUid, setMerchantUid] = useState(`mid_${new Date().getTime()}`);
    // const [buyerName, setBuyerName] = useState('이상범');
    // const [buyerTel, setBuyerTel] = useState('01072976384');
    // const [buyerEmail, setBuyerEmail] = useState('tkdqjay384@gmail.com');
    

    //결제 요청
//   const handlePayment = async () => {
//     const data = {
//       params: {
//         pg: 'html5_inicis.INIpayTest',
//         pay_method: 'card',
//         currency: undefined,
//         //웹훅 수신 url
//         notice_url:`https://c766-220-127-76-219.ngrok-free.app/portone-webhook`,
//         display: undefined,
//         merchant_uid: merchantUid,
//         name,
//         amount,
//         app_scheme: 'exampleformanagedexpo',
//         tax_free: undefined,
//         buyer_name: buyerName,
//         buyer_tel: buyerTel,
//         buyer_email: buyerEmail,
//         buyer_addr: undefined,
//         buyer_postcode: undefined,
//         custom_data: undefined,
//         vbank_due: undefined,
//         popup: undefined,
//         digital: undefined,
//         language: undefined,
//         biz_num: undefined,
//         customer_uid: undefined,
//         naverPopupMode: undefined,
//         naverUseCfm: undefined,
//         naverProducts: undefined,
//         m_redirect_url: undefined,
//         escrow: false,
//       },
//       tierCode: undefined,
//     };

//     try {
//       // 백엔드로 결제 요청 정보 전송
//       await axios.post(`${BASE_URL}/payment/requests`, data);
//       console.log(data)
//       navigation.navigate(BookingScreens.BookingPayment, data.params,);
//       console.log(data)
//     } catch (error) {
//       console.error('결제 요청 중 오류가 발생했습니다.', error.response);
//     }
//   };

return (
    <>     
        
        <View style={{backgroundColor:'white',height:2000}}>
            <View style={{backgroundColor:'white',paddingHorizontal:25,height:screenHeight*0.08}}>
            <Text style={{marginTop:screenWidth*0.1,fontSize:23 ,fontWeight:'bold',color:'#4F4F4F'}}>
            예약정보
            </Text>
            </View>
            <View style={{flexDirection:'row',backgroundColor:'white',height:screenHeight*0.19,paddingHorizontal:25}}>
                <Image
                style={{
                width: 135,
                height: 135,
                borderRadius:15,
                marginTop:20
                }}
                source={require('../images/Room1.jpeg')}/>
                <View style={{marginLeft:30,marginTop:20}}>
                    <Text style={{fontSize:19,color:'#4F4F4F',fontWeight:'bold'}}>
                        짐프라이빗 대관
                    </Text>
                    <Text style={{color:'#797676',fontSize:15,marginTop:3,fontWeight:'bold',marginBottom:'3%'}}>방 번호 : {selectedRoomNumber}</Text>
                    <Text style={{color:'#797676',fontSize:15,fontWeight:'bold',marginBottom:'3%'}}>사용날짜 :  {selectedDate}</Text>
                        <Text style={{color:'#797676',fontSize:15,fontWeight:'bold'}}>
                                사용시간 : {' '}
                                {isMorning && selectedDayTimeSlot
                                ? `${selectedDayTimeSlot} - ${selectedEndTime}`
                                : isEvening && selectedNightTimeSlot
                                ? `${selectedNightTimeSlot} - ${selectedEndTime}`
                                : null}
                            </Text>
                
                    </View>
                </View>
            {/* <View style={{backgroundColor:'white',paddingHorizontal:25,height:screenHeight*0.17}}>
                <Text style={{marginTop:screenWidth*0.1,fontSize:23 ,fontWeight:'bold',color:'#4F4F4F'}}>
                가격정보
                </Text>
                <Text style={{marginTop:screenWidth*0.05,fontSize:18,fontWeight:'bold',color:'#797676'}}>총 상품가격 : {Price}</Text>
            </View> */}
            {/* <View style={{width:screenWidth*0.9,alignSelf:'center',borderTopColor:'#E5E5E5',borderTopWidth:1,backgroundColor:'white',paddingHorizontal:10,height:screenHeight*0.2}}>
                <Text style={{marginTop:screenWidth*0.1,fontSize:23 ,fontWeight:'bold',color:'#4F4F4F'}}>
                구매자정보
                </Text>
                <Text style={{marginTop:25,fontSize:14,fontWeight:'bold',color:'#797676'}}>이름</Text>
                <TextInput
                style={styles.input}
                placeholder="이름을 입력해주세요"
                value={buyerName}
                onChangeText={setBuyerName}
                />
            </View> */}
            </View> 
        
            <View
            style={{
                position: 'absolute',
                bottom: 20,
                width: '100%',
            }}
        >
            <TouchableOpacity
            style={{
                backgroundColor: '#4A7AFF',
                padding: 15,
                marginHorizontal: 16,
                borderRadius: 20,
                alignItems: 'center',
            }}
            onPress={handleSubmit}
            //   disabled={!name}
            >
            
            <Text
                style={{
                color:'white',
                fontSize: 20,
                fontWeight: 'bold',
                }}
            >
                예약하기
            </Text>
            </TouchableOpacity>
        </View>
    </>     
    );
    };

export default MembershipBookedInfoScreen;

const styles = StyleSheet.create({
    container: {
        marginTop: screenWidth*0.05,
        justifyContent: 'center',
        alignItems: 'center',
    },
    InfoContainer: {
        flex: 1,
        width: screenWidth / 1.2,
        borderRadius:15,
        height: screenHeight / 4,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    PayInfo1Container: {
        flex: 1,
        borderColor: 'black',
        borderWeight: 3,
        borderRadius:15,
        width: screenWidth / 1.2,
        height: screenHeight / 13,
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
    },
    PayInfo2Container: {
        flex: 1,
        flexDirection: 'row',
        borderBottomColor: 'black',
        borderRadius:15,
        width: screenWidth / 1.2,
        height: screenHeight / 13,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'blue',
    },
    InfoTitle: {
        fontSize: 20,
    },
    payBar: {
        flexDirection: 'row',
        flex: 1,
        backgroundColor: 'rgba(242,242,242,242)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        marginTop:15,
        borderWidth: 1,
        borderColor: '#4A7AFF',
        borderRadius: 5,
        width: screenWidth * 0.85,
        height: screenWidth* 0.12,
        paddingHorizontal:10,
        backgroundColor:'#FCF8F8'
      },
    payNavigation: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'rgba(255,255,255,1)',
        
    },
    payTitle: {
        fontSize: 17,
        color: 'rgba(255,255,255,1)',
        fontWeight: 'bold',
        
    },
    });