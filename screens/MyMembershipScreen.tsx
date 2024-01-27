import React,{useEffect, useState} from 'react'
import { View,Text,ScrollView,Dimensions,Platform,Image, Button,TouchableOpacity} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { format } from 'date-fns';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens, MainStackParamList, MMScreens, MMStackParamList } from '../stacks/Navigator';
import axios from 'axios';
import config from '../config'

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


type MyMembershipScreenNavigationProps = StackNavigationProp<
  MMStackParamList,
  MMScreens.MyMembership
>;

interface MyMembershipScreenProps {
    navigation: MyMembershipScreenNavigationProps; // 네비게이션 속성에 대한 타입으로 방금 지정해주었던 MainScreenNavigationProps 을 지정
};


const MyMembershipScreen:React.FunctionComponent<MyMembershipScreenProps> = (props) => {
  const {navigation} = props;
  const [periodmembershipData, setperiodMembershipData] = useState([]);
  const [trainerMembershipData, setTrainerMembershipData] = useState([]);
  const [trainerreview, setTrainerReview] = useState([]);

  console.log(trainerreview)
  useEffect(() => {
    const fetchData = async () => {
      try {
        let logId = await AsyncStorage.getItem('logId');
        if (logId) {
          logId = logId.replace(/^['"](.*)['"]$/, '$1');
        const responseReview = await axios.get(`${BASE_URL}/trainermembershipreview/${logId}`);
        const dataReview = responseReview.data;
        console.log(logId)

        setTrainerReview(dataReview);

        const uidResponse = await fetch(`${BASE_URL}/user?logid=${logId}`);
        const uidData = await uidResponse.json();
        const uid = uidData.uid;
        
        const periodMembershipResponse = await fetch(`${BASE_URL}/Myperiodmembership?uid=${uid}&pstate=1`);
        const periodMembershipData = await periodMembershipResponse.json();
        if (periodMembershipData.length > 0) {
          setperiodMembershipData(periodMembershipData);
        } else {
          console.log("No period membership exists.");
        }

        const trainerMembershipResponse = await fetch(`${BASE_URL}/Mytrainingmembership?uid=${uid}&pstate=1`);
        const trainerMembershipData = await trainerMembershipResponse.json();
        if (trainerMembershipData.length > 0) {
          setTrainerMembershipData(trainerMembershipData);
        } else {
          console.log("No trainer membership exists.");
        }
      } }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    
    };

    fetchData();
  }, []);
  return (
  <>
    {periodmembershipData.length === 0 ? (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, height: screenHeight*0.5 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>보유회원권이 없습니다.</Text>
      </View>
    ) : (
      <ScrollView>
        <View style={{ alignItems: 'center',backgroundColor:'white',height:'auto',flex:1,borderBottomColor:'#E5E5E5',borderBottomWidth:1 }}>
          <View style={{width:screenWidth,height:screenWidth*0.15,backgroundColor:'white',justifyContent:'center'}}>
            <Text style={{fontSize:18,fontWeight:'bold',marginLeft:'5%'}}>시설 회원권</Text>
          </View>
          {periodmembershipData.map((item) => {
            // Calculate the difference in days between the expiration date and the current date
            const currentDate = new Date();
            const expirationDate = new Date(item.expiration_date);
            const timeDifference = expirationDate.getTime() - currentDate.getTime();
            const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
            // Format the days difference as "d-31"
            const formattedDaysDifference = daysDifference >= 0 ? `D-${daysDifference}` : "Expired";

            const formattedDate = format(expirationDate, 'yyyy-MM-dd');

            return (
              <TouchableOpacity
                key={item.pmid}
                style={{
                  width: screenWidth * 0.9,
                  height: screenHeight * 0.18,
                  ...shadowStyle,
                  backgroundColor: 'white',
                  borderRadius: 15,
                  marginBottom: screenWidth * 0.08,
                  marginTop: screenWidth * 0.04,
                  paddingHorizontal:'5%',
  
                }}
              >
                {/* Render your membership data here */}
                <View style={{ flex:1,backgroundColor:'white'}}>  
                  <View style={{flex:1,backgroundColor:'white',flexDirection:'row',marginTop:'6%'}}>
                    <View style={{flex:1,backgroundColor:'white'}}>
                      <Text style={{color:'#797676',fontSize:25,fontWeight:'bold'}}>{item.duration}일 기간권</Text>
                    </View>
                    <View style={{flex:1,backgroundColor:'white'}}>
                      <View style={{marginLeft:'auto',width:'32%',height:'42%',backgroundColor:'#1E90FF',borderRadius:20,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:14,fontWeight:'bold',color:'white'}}>{formattedDaysDifference}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{backgroundColor:'white',flex:1}}>
                    <Text style={{marginTop:'auto',color:'#797676'}}>시설 무제한 이용가능</Text>
                    <Text style={{marginBottom:'6%',color:'#797676'}}>{formattedDate}일까지 이용가능</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ alignItems: 'center',backgroundColor:'white',height:'auto',flex:1 }}>
          <View style={{width:screenWidth,height:screenWidth*0.15,backgroundColor:'white',justifyContent:'center'}}>
            <Text style={{fontSize:18,fontWeight:'bold',marginLeft:'5%'}}>PT 회원권</Text>
          </View>
          {trainerMembershipData.length === 0 ? (
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, height: screenHeight*0.5 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>트레이너 회원권이 없습니다.</Text>
            </View>
          ) : (
            trainerMembershipData.map((item) => {
              return (
                <View
                key={item.tmid}
                style={{
                  width: screenWidth * 0.9,
                  height: screenHeight * 0.18,
                  ...shadowStyle,
                  backgroundColor: 'white',
                  borderRadius: 15,
                  marginBottom: screenWidth * 0.08,
                  marginTop: screenWidth * 0.04,
                  
                }}
              >
                {/* Render your membership data here */}
                <View style={{ flex:1,backgroundColor:'white',borderTopLeftRadius:15,borderTopRightRadius:15,borderBottomLeftRadius:15,borderBottomRightRadius:15}}>  
                  <View style={{flex:1,backgroundColor:'white',flexDirection:'row',marginTop:'6%',paddingHorizontal:'5%'}}>
                    <View style={{flex:1,backgroundColor:'white'}}>
                      <Text style={{color:'#797676',fontSize:25,fontWeight:'bold'}}>1:1PT</Text>
                    </View>
                    <View style={{flex:1,backgroundColor:'white'}}>
                      <View style={{marginLeft:'auto',width:'32%',height:'85%',backgroundColor:'#1E90FF',borderRadius:20,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:14,fontWeight:'bold',color:'white'}}>{item.session}회</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{backgroundColor:'white',flex:1,paddingHorizontal:'5%'}}>
                    <Text style={{fontSize:16,color:'#797676'}}>{item.name}트레이너</Text>
                  </View>
                  <View style={{backgroundColor:'white',flex:1.5,borderTopColor:'#E5E5E5',borderTopWidth:1,justifyContent:'center',alignItems:'center',borderBottomLeftRadius:15,borderBottomRightRadius:15}}>
                    <View style={{width:'90%',height:'60%',borderRadius:10,backgroundColor:'#1E90FF'}}>
                    <TouchableOpacity
                        onPress={() => {
                          if (item.rvid === null) {
                            navigation.navigate(MMScreens.PTReview, {
                              name: item.name,
                              merchant_uid: item.merchant_uid,
                              trainer_id: item.trainer_id
                            });
                          }
                        }}
                        disabled={item.rvid !== null}
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: item.rvid !== null ? 'lightgray' : '#1E90FF',
                          borderRadius: 10,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>
                          {item.rvid !== null ? '후기 작성 완료' : '후기 작성하기'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              );
            })
          )}
        </View>
      </ScrollView>
    )}
  </>
);

};

export default MyMembershipScreen