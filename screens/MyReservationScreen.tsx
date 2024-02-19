import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Dimensions, ScrollView, Image,RefreshControl,StyleSheet, Alert} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList, MainScreens } from '../stacks/Navigator';
import moment from 'moment';
import config from '../config'
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';



const BASE_URL = config.SERVER_URL;


const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

// 그림자 효과를 위한 스타일 객체 생성
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
});

type MyReservationScreenyNavigationProps = StackNavigationProp<
    MainStackParamList,
    MainScreens.MyReservation
>;

interface MyReservationScreenProps {
    navigation: MyReservationScreenyNavigationProps
}

const MyReservationScreen: React.FunctionComponent<MyReservationScreenProps> = (props) => {
    const { navigation } = props;
    const [reservations, setReservations] = useState([]);
    const [userData, setUserData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [allReservations, setAllReservations] = useState([]);
    const [todayReservations, setTodayReservations] = useState([]);
    const [CompleteReservations, setCompleteReservations] = useState([]);
    const [filter, setFilter] = useState('all'); 
    const [isLoading, setIsLoading] = useState(true);


    useFocusEffect(
        React.useCallback(() => {
            setIsLoading(true); // 로딩 시작
            fetchReservations() // 예약 데이터를 새로고침하는 함수 호출
                .catch(console.error) // 에러 처리
                .finally(() => setIsLoading(false)); // 로딩 종료

            // 필요한 경우 여기에 정리(clean-up) 로직을 추가하세요.
        }, [])
    );


    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const logId = await AsyncStorage.getItem('logId');
            if (logId) {
                const formattedLogId = logId.replace(/^['"](.*)['"]$/, '$1');
                const response = await axios.get(`${BASE_URL}/reservationHistory/${formattedLogId}`);
                let fetchedReservations = response.data
                    // 우선 데이터 정렬
                    .sort((a, b) => {
                        const dateA = moment(a.date_of_use + ' ' + a.time_of_use.split('-')[0], 'YYYY-MM-DD HH:mm');
                        const dateB = moment(b.date_of_use + ' ' + b.time_of_use.split('-')[0], 'YYYY-MM-DD HH:mm');
                        return dateA.diff(dateB);
                    })
                    // 유효성 검사를 통과한 데이터만 필터링
                    .filter(reservation => reservation.date_of_use && reservation.time_of_use);
    
                // 유효한 데이터만 상태에 저장
                setAllReservations(fetchedReservations);
    
                const now = moment();
                let todayReservations = fetchedReservations.filter(reservation => {
                    const endDate = moment(reservation.date_of_use);
                    const endTimeMoment = moment(`${reservation.date_of_use.split('T')[0]} ${reservation.time_of_use.split('-')[1]}`, 'YYYY-MM-DD HH:mm');
                    return endDate.isSame(now, 'day') && endTimeMoment.isAfter(now);
                });
    
                let completedReservations = fetchedReservations.filter(reservation => {
                    const endDate = moment(reservation.date_of_use);
                    const endTimeMoment = moment(`${reservation.date_of_use.split('T')[0]} ${reservation.time_of_use.split('-')[1]}`, 'YYYY-MM-DD HH:mm');
                    return endDate.isBefore(now, 'day') || (endDate.isSame(now, 'day') && endTimeMoment.isBefore(now));
                });
    
                // 상태 업데이트
                setTodayReservations(todayReservations);
                setCompleteReservations(completedReservations);
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setRefreshing(false);
        }
    };

useEffect(() => {
    const fetchData = async () => {
        try {
        // AsyncStorage에서 logId 가져오기
        let logId = await AsyncStorage.getItem('logId');
        if (logId) {
            // Remove quotes from logId, if present
            logId = logId.replace(/^['"](.*)['"]$/, '$1');

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
    }, []);

    useEffect(() => {
        fetchReservations();
    }, [filter]);

    

    const fetchReservations = async () => {
        setIsLoading(true);
        try {
            const logId = await AsyncStorage.getItem('logId');
            if (logId) {
                const formattedLogId = logId.replace(/^['"](.*)['"]$/, '$1');
                const response = await axios.get(`${BASE_URL}/reservationHistory/${formattedLogId}`);
                let fetchedReservations = response.data
                    // 우선 데이터 정렬
                    .sort((a, b) => {
                        const dateA = moment(a.date_of_use + ' ' + a.time_of_use.split('-')[0], 'YYYY-MM-DD HH:mm');
                        const dateB = moment(b.date_of_use + ' ' + b.time_of_use.split('-')[0], 'YYYY-MM-DD HH:mm');
                        return dateA.diff(dateB);
                    })
                    // 유효성 검사를 통과한 데이터만 필터링
                    .filter(reservation => reservation.date_of_use && reservation.time_of_use);
    
                // 유효한 데이터만 상태에 저장
                setAllReservations(fetchedReservations);
    
                const now = moment();
                let todayReservations = fetchedReservations.filter(reservation => {
                    const endDate = moment(reservation.date_of_use);
                    const endTimeMoment = moment(`${reservation.date_of_use.split('T')[0]} ${reservation.time_of_use.split('-')[1]}`, 'YYYY-MM-DD HH:mm');
                    return endDate.isSame(now, 'day') && endTimeMoment.isAfter(now);
                });
    
                let completedReservations = fetchedReservations.filter(reservation => {
                    const endDate = moment(reservation.date_of_use);
                    const endTimeMoment = moment(`${reservation.date_of_use.split('T')[0]} ${reservation.time_of_use.split('-')[1]}`, 'YYYY-MM-DD HH:mm');
                    return endDate.isBefore(now, 'day') || (endDate.isSame(now, 'day') && endTimeMoment.isBefore(now));
                });
    
                // 상태 업데이트
                setTodayReservations(todayReservations);
                setCompleteReservations(completedReservations);
                console.log('Fetched Reservations Data:', fetchedReservations);
            }

        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    //필터가 바뀔때 마다 정확하게 적용되도록 코드 추가 
    useEffect(() => {
        switch (filter) {
            case 'all':
                setReservations(allReservations);
                break;
            case 'today':
                setReservations(todayReservations);
                break;
            case 'complete':
                setReservations(CompleteReservations);
                break;
            default:
                setReservations(allReservations);
        }
    }, [filter, allReservations, todayReservations, CompleteReservations]);

    // useEffect(()=>{
    //     console.log("todayReservation:",todayReservations)
    // })


const cancelReservation = async (reservation) => {
    try {
        const merchant_uid = reservation.merchant_uid; 
        console.log(merchant_uid);
        const apiUrl = `${BASE_URL}/delete_reservation/${merchant_uid}`;
        const response = await axios.post(apiUrl);
        console.log(response.data);

        // 예약 취소 후 Alert 표시
        Alert.alert("예약 취소", "예약이 취소되었습니다.", [
            { text: "확인", onPress: () => fetchReservations() }
        ]);
    } catch (error) {
        console.error("에러:", error);
        Alert.alert("오류", "예약 취소 중 오류가 발생했습니다.");
    }
};

const cancelPay = async (reservation) => {
    const cancelUrl = `${BASE_URL}/payments/cancel`;
    const requestData = {
        merchant_uid: reservation.merchant_uid,
        cancel_request_amount: "", 
        reason: "주문 오류", 
    };

    try {
        const response = await axios.post(cancelUrl, requestData);
        console.log("Cancellation request successful", response.data);

        // 결제 취소 후 Alert 표시
        Alert.alert("결제 취소", "예약이 취소되었습니다.", [
            { text: "확인", onPress: () => fetchReservations() }
        ]);
    } catch (error) {
        console.error("Error cancelling payment", error);
        Alert.alert("오류", "결제 취소 중 오류가 발생했습니다.");
    }
};


const handleCancellation = (reservation) => {
    if (reservation.amount === 0) {
        // 예약 취소 함수 실행
        cancelReservation(reservation);
    } else {
        // 결제 취소 함수 실행
        cancelPay(reservation);
    }
};


const roomImages = {
    1: require('../images/rooms1.jpg'),
    2: require('../images/rooms2.jpg'),
    3: require('../images/rooms3.jpeg'),
    // 이하 생략, 필요한 모든 방 번호에 대해 반복222
};


if (isLoading) {
    // 로딩 중이라면 로티 애니메이션 표시
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <LottieView
                source={require('../src/lottie/loading.json')}
                style={{width:100,height:100}}
                autoPlay
                loop
            />
        </View>
    );
}


    return (
        <View style={styles.container}>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:screenWidth*0.13,backgroundColor:'white',borderBottomWidth:0.5,borderBottomColor:'gray'}}>
                <View>
                    <Image 
                    source={require('../images/logogp1.png')}
                    style={{width:screenWidth*0.45,height:'70%'}}
                    resizeMode='cover'
                    />
                </View>
            </View>

        <View style={{justifyContent:'center',alignItems:'center'}}>
            <View style={{backgroundColor:'white',width:screenWidth,height:screenWidth*0.3,justifyContent:'space-between',flexDirection:'row'}}>
            
                <View style={{alignItems:'flex-start',backgroundColor:'white',justifyContent:'center'}}>
                <View style={{flexDirection:'row',marginLeft:'11%'}}>
                    <View>
                        <Text style={{fontSize:30,fontWeight:'bold'}}>{userData?.username} </Text>
                    </View>
                    <View style={{justifyContent:'flex-end',marginBottom:'2%'}}>
                        <Text style={{fontSize:17,fontWeight:'200'}}>님의 예약</Text>
                    </View>
                </View>
                </View>

                <View style={{alignItems:'flex-end',justifyContent:'center',marginRight:'3%'}}>
                    <Image 
                            source={require('../images/Man.png')}
                            style={{
                            height: 50,
                            width: 50,
                            borderRadius: 45,
                            marginBottom:10
                            }}
                        />
                </View>
            
            </View>


        </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[styles.button, filter === 'all' ? styles.buttonActive : styles.buttonInactive]} 
                    onPress={() =>  {
                        setReservations(allReservations)
                        setFilter('all')    
                    }}>
                    <Text style={[styles.buttonText, filter === 'all' ? styles.buttonTextActive : styles.buttonTextinActive]}>전체 {allReservations.length}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, filter === 'today' ? styles.buttonActive : styles.buttonInactive]} 
                    onPress={() => {
                        setReservations(todayReservations);
                        setFilter('today')                        
                        }
                        }>
                    <Text style={[styles.buttonText,filter === 'today' ? styles.buttonTextActive : styles.buttonTextinActive]}>오늘이용 {todayReservations.length}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, filter === 'complete' ? styles.buttonActive : styles.buttonInactive]} 
                    onPress={() => {
                        setReservations(CompleteReservations);
                        setFilter('complete')                        
                        }
                        }>
                    <Text style={[styles.buttonText,filter === 'complete' ? styles.buttonTextActive : styles.buttonTextinActive]}>이용완료 {CompleteReservations.length}</Text>
                </TouchableOpacity>  
                

            </View>
            {reservations.length > 0 ? (
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
               {reservations.map((reservation) => {
                    if (
                        reservation.merchant_uid !== null &&
                        reservation.rid !== null &&
                        reservation.room_number !== null &&
                        reservation.time_of_use !== null &&
                        reservation.date_of_use !== null
                        ){
                            const [startTime, endTime] = reservation.time_of_use.split('-');
                            const startDateTime = moment(reservation.date_of_use).format('YYYY-MM-DD') + ' ' + startTime;
                            const endDateTime = moment(reservation.date_of_use).format('YYYY-MM-DD') + ' ' + endTime;
                            const isBeforeNow = moment().isBefore(endDateTime);
        
                            return (
                                <View key={reservation.rid}>
                                <View style={{ alignItems: 'center', width: screenWidth, height: screenWidth * 0.75, justifyContent: 'center' }}>
                                <View style={{ width: '90%', height: screenWidth * 0.63, ...shadowStyle, backgroundColor: 'white', borderRadius: 15 }}>
                                    <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 15, flexDirection: 'row', alignItems: 'center', paddingHorizontal: '6%' }}>
                                        <Text style={{ color: '#C2C2C2', fontSize: 13 }}>대관 예약번호   {reservation.merchant_uid}</Text>
                                        <TouchableOpacity
                                        disabled={!isBeforeNow}
                                        style={{ marginLeft: 'auto',opacity: isBeforeNow ? 1 : 0.2,  }}
                                        onPress={() => handleCancellation(reservation)}><Text style={{ fontSize: 13, color: '#EB0D0D' }}>예약취소</Text>
                                        </TouchableOpacity>
                                    </View>
                
                                    <View style={{ flex: 3, flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E5E5E5' }}>
                                        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
                                        <Image
                                            style={{
                                            width: '75%',
                                            height: '85%',
                                            marginLeft: '10%',
                                            borderRadius: 8,
                                            }}
                                            source={roomImages[reservation.room_number]} />
                                    </View>
                                    <View style={{ marginLeft: 'auto', flex: 1, justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 18, color: '#4F4F4F', fontWeight: 'bold' }}>
                                            짐프라이빗 대관
                                        </Text>
                                        <Text style={{ color: '#797676', fontSize: 14, fontWeight: 'bold' }}>방 번호 : {reservation.room_number}</Text>
                
                                        <View style={{ marginTop: '20%' }}>
                                            <Text style={{ color: '#797676', fontSize: 14, fontWeight: 'bold' }}>사용날짜 : {moment(reservation.date_of_use).format('YYYY-MM-DD')}</Text>
                                            <Text style={{ color: '#797676', fontSize: 14, fontWeight: 'bold' }}>
                                            사용시간 : {reservation.time_of_use}
                                            </Text>
                                        </View>
                                        </View>
                                    </View>
                
                                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1.1, backgroundColor: 'white', borderBottomRightRadius: 15, borderBottomLeftRadius: 15 }}>
                                        <TouchableOpacity
                                        style={{
                                            backgroundColor: reservation.rvid !== null || isBeforeNow ? 'lightgray' : '#1E90FF',
                                            width: '90%',
                                            height: '65%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 8,
                                        }}
                                        onPress={() => {
                                            if (reservation.rvid === null) {
                                            navigation.navigate(MainScreens.Review, {
                                                room_number: reservation.room_number,
                                                date_of_use: reservation.date_of_use,
                                                time_of_use: reservation.time_of_use,
                                                merchant_uid: reservation.merchant_uid,
                                            });
                                            }
                                        }}
                                        disabled={reservation.rvid !== null || isBeforeNow }
                                        >
                                        <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>
                                            {reservation.rvid !== null ? '후기 작성 완료' : '후기 작성하기'}
                                        </Text>
                                        </TouchableOpacity>
                                    </View>
                                    </View>
                                </View>
                                </View>   
                            );
                        }
                    })}
            </ScrollView>
                    ) : (
                        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                            <View style={{height:screenHeight*0.5,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontSize:20}}>예약 내역이 없습니다.</Text>
                            </View>
                        </ScrollView>
                        )}
        </View>
    );
};


export default MyReservationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    buttonContainer: {
        flexDirection: 'row',
        height:60,
        paddingHorizontal:24,
        backgroundColor:'white',
        alignItems:'center'
    },
    button: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 16,
        marginHorizontal: 10,
        height:30,
        width:90,
        justifyContent:'center',
        alignItems:'center'
    },
    buttonActive: {
        backgroundColor: 'blue',
        borderColor: '#4169E1',
    },
    buttonInactive: {
        backgroundColor: 'transparent',
        borderColor:'#DEE2E6'
    },
    buttonText: {
        color: '#868E96',
    }
    ,
    buttonTextActive:{
        color:'white',
        fontWeight:'bold'
    },
    buttonTextinActive:{
        color:'#868E96'
    }
});