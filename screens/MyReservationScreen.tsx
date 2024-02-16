import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Platform, TouchableOpacity,Image,RefreshControl, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { StackNavigationProp } from '@react-navigation/stack';
import { HistoryScreens, MainScreens, MainStackParamList } from '../stacks/Navigator';
import moment from 'moment';
import config from '../config'

const BASE_URL = config.SERVER_URL;

////////////////////////////////////////////////////////////////

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



type MyReservationScreenNavigationProps = StackNavigationProp<
    MainStackParamList, 
    MainScreens.MyReservation
>;

interface MyReservationScreenProps {
    navigation: MyReservationScreenNavigationProps; 
};


////////////////////////////////////////////////////////////////


const MyReservationScreen:React.FunctionComponent<MyReservationScreenProps> = (props) => {
  const {navigation} = props;
  const [willUseReservation, setWillUseReservation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // const [lastReservation, setLastReservation] = useState(null);
  // const [totalExerciseTime, setTotalExerciseTime] = useState(0);

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



  useEffect(() => {
    const fetchWillUseReservation = async () => {
      try {
        // AsyncStorage에서 로그인된 사용자의 logId 가져오기
        const logId = await AsyncStorage.getItem('logId');

        
        if (logId) {
          const formattedLogId = logId.replace(/^['"](.*)['"]$/, '$1');
          axios
            .get(`${BASE_URL}/user/${formattedLogId}`)
            .then((response) => {
              setWillUseReservation(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchWillUseReservation();
  }, []);



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

      // Fetch reservation data
      try {
        const reservationResponse = await axios.get(`${BASE_URL}/user/${formattedLogId}`);
        setWillUseReservation(reservationResponse.data);
        console.log("Updated reservation data:", reservationResponse.data);
      } catch (error) {
        console.error('Error fetching reservation data:', error);
      }
    }
  } catch (error) {
    console.error('Error fetching logId from AsyncStorage:', error);
  }

  setRefreshing(false);
};





  // useEffect(() => {
  //   const fetchLastReservation = async () => {
  //     try {
  //       // AsyncStorage에서 로그인된 사용자의 logId 가져오기
  //       const logId = await AsyncStorage.getItem('logId');
        
  //       if (logId) {
  //         axios
  //           .get(`${BASE_URL}/userlast/${logId}`)
  //           .then((response) => {
  //             setLastReservation(response.data);
  //           })
  //           .catch((error) => {
  //             console.error(error);
  //           });
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchLastReservation();
  // }, []);






// useEffect(() => {
//   const fetchTotalExerciseTime = async () => {
//     try {
//       // Get logId of logged in user from AsyncStorage
//       const logId = await AsyncStorage.getItem('logId');

//       if (logId) {
//         axios
//           .get(`${BASE_URL}/totalUsingTime/${logId}`)
//           .then((response) => {
//             // Calculate the total exercise time
//             const totalUsageTime = response.data.totalUsageTime || 0;
//             setTotalExerciseTime(totalUsageTime);
//           })
//           .catch((error) => {
//             console.error(error);
//           });
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   fetchTotalExerciseTime();
// }, []);


  return (
    <ScrollView
    style={{backgroundColor:'white'}}
    refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
      <View style={{height:'auto',backgroundColor:'white'}}>
        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:screenWidth*0.13,backgroundColor:'white',borderBottomWidth:0.5,borderBottomColor:'gray'}}>

                    <View>
                        <Image 
                            source={require('../images/logogp1.png')}
                            style={{width:screenWidth*0.45,height:'70%'}}
                            resizeMode='cover'
                        />
                    </View>
                </View>

      <View style={{backgroundColor:'white',height:screenWidth*0.6,width:screenWidth,justifyContent:'center',alignItems:'center'}}>
          <TouchableOpacity
                    style={{borderRadius:20}}
                    onPress={()=>{navigation.navigate('프로필')}}>
                      
                        <Image 
                        style={{width:screenWidth*0.85,height:screenWidth*0.5,borderRadius:20}}
                        source={require('../images/리뷰이벤트3.png')} />
          </TouchableOpacity>
      </View>


    <View style={{justifyContent:'center',alignItems:'center',marginTop:'3%'}}>
      <View style={{backgroundColor:'white',width:screenWidth*0.9,height:screenWidth*0.15,justifyContent:'space-between',marginBottom:'3%',flexDirection:'row'}}>
      
      <View style={{alignItems:'flex-start',backgroundColor:'white',marginTop:'3%'}}>
        <Text style={{fontSize:20,fontWeight:'bold',marginLeft:'7%'}}>예약내역</Text>
      </View>
      
      <View>
        <TouchableOpacity
          onPress={()=>{navigation.navigate(MainScreens.BookingHistory)}}>
            <View style={{alignItems:'flex-end',marginTop:'15%'}}>
              <View style={{backgroundColor:'white',width:screenWidth*0.2}}>
                <Text style={{fontSize:15,color:'#4A7AFF',fontWeight:'bold'}}>상세보기 <AntDesign  name="right" size={15} color='#4A7AFF' /></Text>
                
              </View>
            </View>

            
        </TouchableOpacity>
      </View>
      
    </View>

    </View>






  

{/* <View>
  {lastReservation && lastReservation.rid ? (

  <View key={lastReservation.rid}>
          
    <View style={{justifyContent:'center',alignItems:'center',height:screenWidth*0.58,backgroundColor:'white',bottom:'10%'}}>
        <View style={{justifyContent:'center',alignItems:'center',height:screenWidth*0.58,backgroundColor:'white'}}>
          <View style={{width:'90%',height:'80%',backgroundColor:'white',flexDirection:'row',borderRadius:15,borderWidth:2,borderColor:'black'}}>
            
              <View style={{flex:4,backgroundColor:'white',marginLeft:'5%'}}>

                  <View style={{flex:2,justifyContent:'center',backgroundColor:'white',borderBottomWidth:1.2,borderBottomColor:'#C1C1C1'}}>
                      <Text style={{fontSize:21,color:'#4A7AFF',fontWeight:'bold'}}>이전예약</Text>
                      <Text style={{fontSize:13,color:'#797676',marginTop:'4%'}}>사용하신 예약에 대한 정보입니다.</Text>
                  </View>

                <View style={{flex:1.2,backgroundColor:'white',justifyContent:'center'}}>
                    <Text style={{fontWeight:'bold'}}>{lastReservation.room_number}번방, {moment(lastReservation.date_of_use).format('MM/DD(dd)')}, {lastReservation.time_of_use}</Text>
                </View>

              </View>

              <View style={{flex:1.5,backgroundColor:'white',borderTopRightRadius:15,borderBottomRightRadius:15,alignItems:'center'}}>
                
                <Image 
                source={require('../images/alarm-clock.png')}
                style={{width:'40%',height:'20%',top:'10%'}}
                />

              </View>
              
          </View>
        </View>
    </View>

  </View>

      ) : (

        <View style={{justifyContent:'center',alignItems:'center',height:screenWidth*0.58,backgroundColor:'white',bottom:'10%'}}>
        <View style={{justifyContent:'center',alignItems:'center',height:screenWidth*0.58,backgroundColor:'white'}}>
          <View style={{width:'90%',height:'80%',backgroundColor:'white',flexDirection:'row',borderRadius:15,borderWidth:2,borderColor:'black'}}>
            
              <View style={{flex:4,backgroundColor:'white',marginLeft:'5%'}}>

                  <View style={{width:screenWidth*0.4,height:screenHeight*0.12,justifyContent:'center',backgroundColor:'white'}}>
                      <Text style={{fontSize:21,color:'#4A7AFF',fontWeight:'bold'}}>이전예약</Text>
                      
                  </View>


              <View style={{justifyContent:'center',width:screenWidth*0.8,backgroundColor:'white'}}>
                <Text style={{fontSize:12,fontWeight:'500',color:'gray'}}>신청하신 예약 건이 없습니다.</Text>
                <Text style={{fontSize:12,fontWeight:'500',color:'gray'}}>서비스를 둘러보고 원하는 예약을 선택해주세요.</Text>
              </View>
                

              </View>

              <View style={{width:screenWidth*0.25,height:screenWidth*0.25,backgroundColor:'white',borderTopRightRadius:15,borderBottomRightRadius:15,alignItems:'center',justifyContent:'center'}}>
                
                <Image 
                source={require('../images/alarm-clock.png')}
                style={{width:'40%',height:'40%'}}
                />

              </View>
              
          </View>
        </View>
        </View>
        
      )}
  </View> */}




<View style={{justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
      
  <View>
  
  {willUseReservation && willUseReservation.rid ? ( 
    <View key={willUseReservation.rid}>
      <View style={{justifyContent:'center',alignItems:'center',height:screenWidth*0.58,backgroundColor:'white',width:screenWidth,bottom:'10%'}}>
        <View style={{justifyContent:'center',alignItems:'center',height:screenWidth*0.58,backgroundColor:'white'}}>
          <View style={{width:'90%',height:'80%',backgroundColor:'white',flexDirection:'row',borderRadius:15,borderWidth:2,borderColor:'black'}}>
            
              <View style={{flex:4,backgroundColor:'white',marginLeft:'5%'}}>

                  <View style={{flex:2,justifyContent:'center',backgroundColor:'white',borderBottomWidth:1.2,borderBottomColor:'#C1C1C1'}}>
                      <Text style={{fontSize:21,color:'#4A7AFF',fontWeight:'bold'}}>이용예정</Text>
                      <Text style={{fontSize:13,color:'#797676',marginTop:'4%'}}>사용하실 예약에 대한 정보입니다.</Text>
                  </View>

                <View style={{flex:1.2,backgroundColor:'white',justifyContent:'center'}}>
                    <Text style={{fontWeight:'bold'}}>{willUseReservation.room_number}번방, {moment(willUseReservation.date_of_use).format('MM/DD(dd)')}, {willUseReservation.time_of_use}</Text>
                </View>

              </View>

              <View style={{flex:1.5,backgroundColor:'white',borderTopRightRadius:15,borderBottomRightRadius:15,alignItems:'center'}}>
                
                <Image 
                source={require('../images/alarm-clock.png')}
                style={{width:'40%',height:'20%',top:'10%'}}
                />

              </View>
              
          </View>
        </View>
    </View>  
    
        
    </View>

  ) : (
      <View style={{justifyContent:'center',alignItems:'center',height:screenWidth*0.58,width:screenWidth,backgroundColor:'white',bottom:'10%'}}>
        <View style={{justifyContent:'center',alignItems:'center',height:screenWidth*0.58,backgroundColor:'white'}}>
          <View style={{width:'90%',height:'80%',backgroundColor:'white',flexDirection:'row',borderRadius:15,borderWidth:2,borderColor:'black'}}>
            
              <View style={{flex:4,backgroundColor:'white',marginLeft:'5%'}}>

                  <View style={{width:screenWidth*0.4,height:screenHeight*0.12,justifyContent:'center',backgroundColor:'white'}}>
                      <Text style={{fontSize:21,color:'#4A7AFF',fontWeight:'bold'}}>이용예정</Text>
                  </View>


              <View style={{justifyContent:'center',width:screenWidth*0.8,backgroundColor:'white'}}>
                <Text style={{fontSize:12,fontWeight:'500',color:'gray'}}>신청하신 예약 건이 없습니다.</Text>
                <Text style={{fontSize:12,fontWeight:'500',color:'gray'}}>서비스를 둘러보고 원하는 예약을 선택해주세요.</Text>
              </View>
                

              </View>

              <View style={{width:screenWidth*0.25,height:screenWidth*0.25,backgroundColor:'white',borderTopRightRadius:15,borderBottomRightRadius:15,alignItems:'center',justifyContent:'center'}}>
                
                <Image 
                source={require('../images/alarm-clock.png')}
                style={{width:'40%',height:'40%',top:'10%'}}
                />

              </View>
              
          </View>
        </View>
        </View>
  )}
</View>
</View>


{/* 
    {userData && (
      <View style={{justifyContent:'center',alignItems:'center',height:screenWidth*0.4,backgroundColor:'white',bottom:'5%'}}>
        <View style={{...shadowStyle,width:screenWidth*0.8,height:screenWidth*0.23,backgroundColor:'#1F75FE',marginBottom:'5%',justifyContent:'center',alignItems:'center',borderRadius:20}}>
          <Text style={{fontSize:14,fontWeight:'500',color:'white'}}><Text style={{fontSize:20,color:'white',fontWeight:'bold'}}>{userData.username}</Text> 님의 총 운동시간은</Text>
          <Text style={{fontSize:14,fontWeight:'500',color:'white'}}>
            <Text style={{ color: 'white', fontSize: 22,fontWeight:'bold' }}>{totalExerciseTime} 분</Text> 이네요 :)
          </Text>
        </View>
      </View>
      
    )} */}


  </View>
</ScrollView>

  );
};

export default MyReservationScreen;

