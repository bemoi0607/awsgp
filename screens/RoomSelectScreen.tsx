import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react'
import { View,Text,TouchableOpacity,StyleSheet,ScrollView, Dimensions, Platform,Image } from 'react-native'
import { BookingScreens, BookingStackParamList } from '../stacks/Navigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Fontisto } from '@expo/vector-icons';
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
        elevation: 10,
    },
})

////////////////////////////////////////////////////////////////////////


type BookedInfoScreenNavigationProps = StackNavigationProp<
    BookingStackParamList,
    BookingScreens.RoomSelect
>;

interface BookedInfoScreenProps {
    navigation: BookedInfoScreenNavigationProps;
};

////////////////////////////////////////////////////////////////////////

const saveRoomTypeToAsyncStorage = async (roomNumber: number) => {
    try {
        // roomType에 대한 정보를 AsyncStorage에 저장
        await AsyncStorage.setItem('selectedRoomNumber', JSON.stringify(roomNumber));
        console.log('Saved selected room number');
        console.log(roomNumber);


        console.log('POST request sent successfully');
    } catch (error) {
        console.log('Error saving room type to AsyncStorage:', error);
    }
};

const RoomSelectScreen:React.FunctionComponent<BookedInfoScreenProps> = (props) => {
  const { navigation } = props;
  const [averageRatings, setAverageRatings] = useState([]);

      useEffect(() => {
        const roomNumbers = [1, 2, 3]; // 가져올 방번호들을 배열로 설정

        const fetchAverageRatings = async () => {
          const promises = roomNumbers.map((roomNumber) =>
            fetch(`${BASE_URL}/average_rating/${roomNumber}`)
              .then((response) => response.json())
              .then((data) => (data.average_rating !== null ? data.average_rating.toFixed(2) : "0.00")) // 리뷰값이 없을 경우 "0.00"으로 표현
              .catch((error) => {
                console.error('Error:', error);
                return 'N/A';
              })
          );

          const ratings = await Promise.all(promises);
          setAverageRatings(ratings);
        };

        fetchAverageRatings();
      }, [])

    return (
    <ScrollView>
        <View style={{justifyContent:'center', alignItems:'center',height:'auto',backgroundColor:'white'}}>
            <View style={{width:screenWidth,height:screenWidth*0.9,backgroundColor:'white'}}>
              <View style={{flex:3.6,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity 
                    onPress={()=>{navigation.navigate(BookingScreens.RoomADetail)
                    saveRoomTypeToAsyncStorage(1);}}
                    style={styles.roomContainer}>
                        <Image 
                        style={styles.roomImage}
                        source = {require('../images/rooms1.png')}
                        resizeMode='cover'/>
                </TouchableOpacity>
              </View>

              <View style={{flex:1.7,backgroundColor:'white'}}>
              <View style={{ flexDirection: 'row', alignItems: 'center',paddingHorizontal:screenWidth*0.06 }}>
                <Text style={{ fontSize: 21 }}>짐프라이빗 1번방</Text>              
                <Fontisto name="star" size={13} color="black" style={{marginLeft:'auto'}} />
                <Text style={{ fontSize: 14 }}>{averageRatings[0]}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft:'6%',marginTop:'1%'  }}>
                <Image
                source={require('../images/placeholder.png')}
                style={{ width: screenWidth * 0.037, height: screenWidth * 0.04 }}
                />
                <Text style={{ fontSize: 16, color: '#797676',marginLeft:'1%'}}>봉천역 1번출구 도보 5분</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:'5%',marginLeft:'6%'}}>
                <Text style={{ fontSize: 18}}>₩5,000/30분</Text>
                    <View style={{ backgroundColor: '#1F75FE', height: screenWidth * 0.05, borderRadius: 10, justifyContent: 'center', alignItems: 'center',marginLeft:'1.5%' }}>
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', paddingHorizontal: '2.5%' }}>할인쿠폰</Text>
                    </View>
              </View>
            </View>
            </View>
          
            <View style={{width:screenWidth,height:screenWidth*0.9,backgroundColor:'white'}}>
              <View style={{flex:3.6,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity 
                    onPress={()=>{navigation.navigate(BookingScreens.RoomBDetail)
                        saveRoomTypeToAsyncStorage(2);}}
                    style={styles.roomContainer}>
                        <Image 
                        style={{width:'100%',height:'100%',borderRadius:20}}
                        source = {require('../images/rooms2.png')}
                        resizeMode='cover'/>
                </TouchableOpacity>
              </View>

              <View style={{flex:1.7,backgroundColor:'white'}}>
              <View style={{ flexDirection: 'row', alignItems: 'center',paddingHorizontal:screenWidth*0.06 }}>
                <Text style={{ fontSize: 21 }}>짐프라이빗 2번방</Text>              
                <Fontisto name="star" size={13} color="black" style={{marginLeft:'auto'}} />
                <Text style={{ fontSize: 14 }}>{averageRatings[1]}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft:'6%',marginTop:'1%'  }}>
                <Image
                source={require('../images/placeholder.png')}
                style={{ width: screenWidth * 0.035, height: screenWidth * 0.045 }}
                />
                <Text style={{ fontSize: 16, color: '#797676',marginLeft:'1%'}}>봉천역 1번출구 도보 5분</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:'5%',marginLeft:'6%'}}>
                <Text style={{ fontSize: 18}}>₩5,000/30분</Text>
                    <View style={{ backgroundColor: '#1F75FE', height: screenWidth * 0.05, borderRadius: 10, justifyContent: 'center', alignItems: 'center',marginLeft:'1.5%' }}>
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', paddingHorizontal: '2.5%' }}>할인쿠폰</Text>
                    </View>
              </View>
              </View>
            </View>
            <View style={{width:screenWidth,height:screenWidth*0.9,backgroundColor:'white'}}>
              <View style={{flex:3.6,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity 
                    onPress={()=>{navigation.navigate(BookingScreens.RoomCDetail)
                        saveRoomTypeToAsyncStorage(3);}}
                    style={styles.roomContainer}>
                        <Image 
                        style={{width:'100%',height:'100%',borderRadius:20}}
                        source = {require('../images/rooms3.jpeg')}
                        resizeMode='cover'/>
                </TouchableOpacity>
              </View>

              <View style={{flex:1.7,backgroundColor:'white'}}>
              <View style={{ flexDirection: 'row', alignItems: 'center',paddingHorizontal:screenWidth*0.06 }}>
                <Text style={{ fontSize: 21 }}>짐프라이빗 3번방</Text>              
                <Fontisto name="star" size={13} color="black" style={{marginLeft:'auto'}} />
                <Text style={{ fontSize: 14 }}>{averageRatings[2]}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft:'6%',marginTop:'1%'  }}>
                <Image
                source={require('../images/placeholder.png')}
                style={{ width: screenWidth * 0.035, height: screenWidth * 0.045 }}
                />
                <Text style={{ fontSize: 16, color: '#797676',marginLeft:'1%'}}>봉천역 1번출구 도보 5분</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:'5%',marginLeft:'6%'}}>
                <Text style={{ fontSize: 18}}>₩5,000/30분</Text>
                    <View style={{ backgroundColor: '#1F75FE', height: screenWidth * 0.05, borderRadius: 10, justifyContent: 'center', alignItems: 'center',marginLeft:'1.5%' }}>
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', paddingHorizontal: '2.5%' }}>할인쿠폰</Text>
                    </View>
              </View>
              </View>
            </View>

            {/* <View style={{width:screenWidth,height:screenWidth*0.9,backgroundColor:'white'}}>
              <View style={{flex:3.6,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity 
                    onPress={()=>{navigation.navigate(BookingScreens.RoomDDetail)
                        saveRoomTypeToAsyncStorage(4);}}
                    style={styles.roomContainer}>
                        <Image 
                        style={{width:'100%',height:'100%',borderRadius:20}}
                        source = {require('../../src/images/Room1.jpeg')}
                        resizeMode='cover'/>
                </TouchableOpacity>
              </View>

              <View style={{flex:1.7,backgroundColor:'white'}}>
              <View style={{ flexDirection: 'row', alignItems: 'center',paddingHorizontal:screenWidth*0.06 }}>
                <Text style={{ fontSize: 21 }}>짐프라이빗 4번룸</Text>              
                <Fontisto name="star" size={13} color="black" style={{marginLeft:'auto'}} />
                <Text style={{ fontSize: 14 }}>{averageRatings[3]}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft:'6%',marginTop:'1%'  }}>
                <Image
                source={require('../../src/images/placeholder.png')}
                style={{ width: screenWidth * 0.035, height: screenWidth * 0.045 }}
                />
                <Text style={{ fontSize: 16, color: '#797676',marginLeft:'1%'}}>역삼역 3번출구 도보 1분</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:'5%',marginLeft:'6%'}}>
                <Text style={{ fontSize: 18}}>₩7,500/30분</Text>
                    <View style={{ backgroundColor: '#1F75FE', height: screenWidth * 0.05, borderRadius: 10, justifyContent: 'center', alignItems: 'center',marginLeft:'1.5%' }}>
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', paddingHorizontal: '2.5%' }}>할인쿠폰</Text>
                    </View>
              </View>
              </View>
            </View>
            <View style={{width:screenWidth,height:screenWidth*0.9,backgroundColor:'white'}}>
              <View style={{flex:3.6,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity 
                    onPress={()=>{navigation.navigate(BookingScreens.RoomEDetail)
                        saveRoomTypeToAsyncStorage(5);}}
                    style={styles.roomContainer}>
                        <Image 
                        style={{width:'100%',height:'100%',borderRadius:20}}
                        source = {require('../../src/images/Room1.jpeg')}
                        resizeMode='cover'/>
                </TouchableOpacity>
              </View>

              <View style={{flex:1.7,backgroundColor:'white'}}>
              <View style={{ flexDirection: 'row', alignItems: 'center',paddingHorizontal:screenWidth*0.06 }}>
                <Text style={{ fontSize: 21 }}>짐프라이빗 5번룸</Text>              
                <Fontisto name="star" size={13} color="black" style={{marginLeft:'auto'}} />
                <Text style={{ fontSize: 14 }}>{averageRatings[4]}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft:'6%',marginTop:'1%'  }}>
                <Image
                source={require('../../src/images/placeholder.png')}
                style={{ width: screenWidth * 0.035, height: screenWidth * 0.045 }}
                />
                <Text style={{ fontSize: 16, color: '#797676',marginLeft:'1%'}}>역삼역 3번출구 도보 1분</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:'5%',marginLeft:'6%'}}>
                <Text style={{ fontSize: 18}}>₩7,500/30분</Text>
                    <View style={{ backgroundColor: '#1F75FE', height: screenWidth * 0.05, borderRadius: 10, justifyContent: 'center', alignItems: 'center',marginLeft:'1.5%' }}>
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', paddingHorizontal: '2.5%' }}>할인쿠폰</Text>
                    </View>
              </View>
              </View>
            </View>
            <View style={{width:screenWidth,height:screenWidth*0.9,backgroundColor:'white'}}>
              <View style={{flex:3.6,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity 
                    onPress={()=>{navigation.navigate(BookingScreens.RoomFDetail)
                        saveRoomTypeToAsyncStorage(6);}}
                    style={styles.roomContainer}>
                        <Image 
                        style={{width:'100%',height:'100%',borderRadius:20}}
                        source = {require('../../src/images/Room1.jpeg')}
                        resizeMode='cover'/>
                </TouchableOpacity>
              </View>

              <View style={{flex:1.7,backgroundColor:'white',marginBottom:'5%'}}>
              <View style={{ flexDirection: 'row', alignItems: 'center',paddingHorizontal:screenWidth*0.06 }}>
                <Text style={{ fontSize: 21 }}>짐프라이빗 6번룸</Text>              
                <Fontisto name="star" size={13} color="black" style={{marginLeft:'auto'}} />
                <Text style={{ fontSize: 14 }}>{averageRatings[5]}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft:'6%',marginTop:'1%'  }}>
                <Image
                source={require('../../src/images/placeholder.png')}
                style={{ width: screenWidth * 0.035, height: screenWidth * 0.045 }}
                />
                <Text style={{ fontSize: 16, color: '#797676',marginLeft:'1%'}}>역삼역 3번출구 도보 1분</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:'5%',marginLeft:'6%'}}>
                <Text style={{ fontSize: 18}}>₩7,500/30분</Text>
                    <View style={{ backgroundColor: '#1F75FE', height: screenWidth * 0.05, borderRadius: 10, justifyContent: 'center', alignItems: 'center',marginLeft:'1.5%' }}>
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', paddingHorizontal: '2.5%' }}>할인쿠폰</Text>
                    </View>
              </View>
              </View>
            </View> */}
    
      </View>
    </ScrollView>
    );
}

export default RoomSelectScreen

const styles = StyleSheet.create({
    roomContainer: {
        ...shadowStyle,
        height:'80%',
        width:'90%',
        borderRadius:20,
        backgroundColor: 'white',
    },
    roomImage:{
        width:'100%',
        height:'100%',
        borderRadius:20
    }
    
})