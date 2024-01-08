// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, Platform, Dimensions, ScrollView, Image,RefreshControl} from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { HistoryScreens, HistoryStackParamList, MainScreens } from '../stacks/Navigator';
// import Constants from 'expo-constants';
// import moment from 'moment';

// const BASE_URL = "http://172.30.1.15:8080"
// const screenWidth = Dimensions.get('screen').width;
// const screenHeight = Dimensions.get('screen').height;

// // 그림자 효과를 위한 스타일 객체 생성
// const shadowStyle = Platform.select({
//   ios: {
//     shadowColor: 'rgba(0, 0, 0, 0.2)',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 1,
//     shadowRadius: 4,
//   },
//   android: {
//     elevation: 5,
//   },
// });

// type BookingHistoryNavigationProps = StackNavigationProp<
//   HistoryStackParamList,
//   HistoryScreens.History
// >;

// interface BookingHistoryScreenProps {
//   navigation: BookingHistoryNavigationProps;
// }

// const BookingHistory: React.FunctionComponent<BookingHistoryScreenProps> = (props) => {
//   const { navigation } = props;
//   const [reservations, setReservations] = useState([]);
//   const [AllReservation, setAllReservation] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const [logId, setLogId] = useState(null);
//   const [willUseReservation, setWillUseReservation] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);

//         const onRefresh = async () => {
//   setRefreshing(true);

//   try {
//     // Fetch updated reservation data
//     const logId = await AsyncStorage.getItem('logId');
//     const userResponse = await axios.get(`${BASE_URL}/user/${logId}`);
//     const userData = userResponse.data;
//     setUserData(userData);

//     const allReservationResponse = await axios.get(`${BASE_URL}/user/${logId}`);
//     const allReservationData = allReservationResponse.data;
//     setAllReservation(allReservationData);

//     const reservationsResponse = await axios.get(`${BASE_URL}/reservationHistory/${logId}`);
//     const reservationsData = reservationsResponse.data;
//     setReservations(reservationsData);

//     console.log("Reservation data refreshed.");
//   } catch (error) {
//     console.error('Error refreshing reservation data:', error);
//   }

//   setRefreshing(false);
// };


//   useEffect(() => {
//     AsyncStorage.getItem('logId')
//       .then((data) => {
//         if (data) {
//           setLogId(data);
//         }
//       })
//       .catch((error) => {
//         console.log('Error retrieving logId:', error);
//       });
//   }, []);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/user/${logId}`);
//         const userData = response.data;
//         setUserData(userData);
//       } catch (error) {
//         console.log('Error fetching user data:', error);
//       }
//     };

//     if (logId) {
//       fetchUserData();
//     }
//   }, [logId]);

//   useEffect(() => {
//     const fetchAllReservation = async () => {
//       try {
//         // AsyncStorage에서 로그인된 사용자의 logId 가져오기
//         const logId = await AsyncStorage.getItem('logId');

//         if (logId) {
//           axios
//             .get(`${BASE_URL}/user/${logId}`)
//             .then((response) => {
//               setAllReservation(response.data);
//               console.log("last:", response.data)
//             })
//             .catch((error) => {
//               console.error(error);
//             });
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchAllReservation();
//   }, []);


//   // Function to check if a review is completed for a specific merchant_uid
//   useEffect(() => {
//     const fetchReservations = async () => {
//       try {
//         const logId = await AsyncStorage.getItem('logId');
//         const response = await axios.get(`${BASE_URL}/reservationHistory/${logId}`);
//         const data = response.data;
//         console.log(data);
//         setReservations(data);
//       } catch (error) {
//         console.error('예약을 가져오는 중 오류가 발생했습니다:', error);
//       }
//     };

//     fetchReservations();
//   }, []);


//   const cancelPay = (reservation) => {
//     const cancelUrl = "http://172.30.1.42:8080/payments/cancel"; // Replace with the actual URL
    
//     const requestData = {
//       merchant_uid: reservation.merchant_uid,
//       cancel_request_amount: "", 
//       reason: "주문 오류", 
//     };
  
//     console.log('Cancellation Request Data:', requestData);
  
//     axios({
//       url: cancelUrl,
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       data: requestData,
//     })
//       .then((response) => {
//         // Handle success response
//         console.log("Cancellation request successful", response);
//         alert("예약이 취소되었습니다.");
//       })
//       .catch((error) => {
//         // Handle error response
//         console.error("Error cancelling payment", error);
//       });
//   };

// const cancelReservation = async (reservation) => {
//   try {
//     const merchant_uid = reservation.merchant_uid; 
//     console.log(merchant_uid)
//     const apiUrl = `${BASE_URL}/delete_reservation/${merchant_uid}`;
//     const response = await axios.post(apiUrl);

//     console.log(response.data);
//     alert("예약이 취소되었습니다.");
//     navigation.navigate(MainScreens.MyReservation)
//   } catch (error) {
//     console.error("에러:", error);
//   }
// };



// const handleCancellation = (reservation) => {
//   if (reservation.amount === 0) {
//     // reservation.amount가 0이면 예약 취소 함수를 실행합니다.
//     cancelReservation(reservation);
//   } else {
//     // 그렇지 않으면 결제 취소 함수를 실행합니다.
//     cancelPay(reservation);
//   }
// };


// return (
//   <View style={{justifyContent:'center','alignItems':'center'}}>
//     {AllReservation && (
//       <ScrollView
//       refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }>
//         {reservations.map((reservation) => {
//           // Check if any of the required properties are null or undefined
//           if (
//             reservation.merchant_uid !== null &&
//             reservation.rid !== null &&
//             reservation.room_number !== null &&
//             reservation.time_of_use !== null &&
//             reservation.date_of_use !== null
//           ) {
//             const [startTime, endTime] = reservation.time_of_use.split('-');
//             const startDateTime = moment(reservation.date_of_use).format('YYYY-MM-DD') + ' ' + startTime;
//             const endDateTime = moment(reservation.date_of_use).format('YYYY-MM-DD') + ' ' + endTime;
//             const isBeforeNow = moment().isBefore(endDateTime);

//             return (
//             <View key={reservation.rid}>
//                 <View style={{ alignItems: 'center', width: screenWidth, height: screenWidth * 0.75, justifyContent: 'center' }}>
//                 <View style={{ width: '90%', height: screenWidth * 0.63, ...shadowStyle, backgroundColor: 'white', borderRadius: 15 }}>
//                   <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 15, flexDirection: 'row', alignItems: 'center', paddingHorizontal: '6%' }}>
//                     <Text style={{ color: '#C2C2C2', fontSize: 13 }}>대관 예약번호   {reservation.merchant_uid}</Text>
//                     <TouchableOpacity
//                       style={{ marginLeft: 'auto' }}
//                       onPress={() => handleCancellation(reservation)}><Text style={{ fontSize: 13, color: '#EB0D0D' }}>예약취소</Text>
//                     </TouchableOpacity>
//                   </View>

//                   <View style={{ flex: 3, flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E5E5E5' }}>
//                     <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
//                       <Image
//                         style={{
//                           width: '75%',
//                           height: '85%',
//                           marginLeft: '10%',
//                           borderRadius: 15,
//                         }}
//                         source={require('../images/Room1.jpeg')} />
//                     </View>
//                     <View style={{ marginLeft: 'auto', flex: 1, justifyContent: 'center' }}>
//                       <Text style={{ fontSize: 18, color: '#4F4F4F', fontWeight: 'bold' }}>
//                         짐프라이빗 대관
//                       </Text>
//                       <Text style={{ color: '#797676', fontSize: 14, fontWeight: 'bold' }}>방 번호 : {reservation.room_number}</Text>

//                       <View style={{ marginTop: '20%' }}>
//                         <Text style={{ color: '#797676', fontSize: 14, fontWeight: 'bold' }}>사용날짜 : {moment(reservation.date_of_use).format('YYYY-MM-DD')}</Text>
//                         <Text style={{ color: '#797676', fontSize: 14, fontWeight: 'bold' }}>
//                           사용시간 : {reservation.time_of_use}
//                         </Text>
//                       </View>
//                     </View>
//                   </View>

//                   <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1.1, backgroundColor: 'white', borderBottomRightRadius: 15, borderBottomLeftRadius: 15 }}>
//                     <TouchableOpacity
//                       style={{
//                         backgroundColor: reservation.rvid !== null || isBeforeNow ? 'lightgray' : '#1E90FF',
//                         width: '90%',
//                         height: '65%',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         borderRadius: 8,
//                       }}
//                       onPress={() => {
//                         if (reservation.rvid === null) {
//                           navigation.navigate(HistoryScreens.Review, {
//                             room_number: reservation.room_number,
//                             date_of_use: reservation.date_of_use,
//                             time_of_use: reservation.time_of_use,
//                             merchant_uid: reservation.merchant_uid,
//                           });
//                         }
//                       }}
//                       disabled={reservation.rvid !== null || isBeforeNow }
//                     >
//                       <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>
//                         {reservation.rvid !== null ? '후기 작성 완료' : '후기 작성하기'}
//                       </Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>
//             </View>
              
//             );
//           } else {
//             return(
//                 <View style={{ width:screenWidth,alignItems: 'center', justifyContent: 'center',height:screenHeight,bottom:'10%' }} key={reservation.rid}>
//                   <Text style={{ fontSize: 17, fontWeight: 'bold' }}>예약 정보가 없습니다.</Text>
//                 </View>
//             )
//           }
//         })}
//       </ScrollView>
//     )}

    
//   </View>
// );
  
// };

// export default BookingHistory;
