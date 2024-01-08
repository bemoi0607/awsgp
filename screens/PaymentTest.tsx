import React, { useEffect, useState } from 'react';
import { Button, ScrollView, Text,Image,StyleSheet, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { PTScreens, PTStackParamList } from '../stacks/Navigator';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { RouteProp } from '@react-navigation/native';
import { Dimensions, TextInput, TouchableOpacity, View } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
import {Linking} from 'react-native';
// const BASE_URL = Constants.manifest.extra.BASE_URL;
const WIDTH = Dimensions.get("screen").width


//////////////////////////////////////////////////////////////// 코드 타입정의


type PaymentTestNavigationProps = StackNavigationProp<
    PTStackParamList,
    PTScreens.Payment
    >

    interface PaymentTestProps {
      navigation: PaymentTestNavigationProps;
      route: RouteProp<PTStackParamList, PTScreens.Payment>;
    }
    

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
    });    

    


const PaymentTest: React.FunctionComponent<PaymentTestProps> = ({ route,navigation }) => {
  const [startDate, setStartDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateTimePickerKey, setDateTimePickerKey] = useState(0);


  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().slice(0, 10); // Format date to YYYY-MM-DD
      setStartDate(formattedDate);
    }
  };

  const closeModal = () => {
    setShowDatePicker(false);
  };
   // Add this line

  const openDatePicker = () => {
    setDateTimePickerKey((prevKey) => prevKey + 1); // Increment key to remount the DateTimePicker
    setShowDatePicker(true);
  };
  

  const [gender, setgender] = useState('');
  const handleGenderSelection = (gender) => {
    setgender(gender);
  };
  

   const [userData, setUserData] = useState(null);
    const [logId, setLogId] = useState(null);
 
    useEffect(() => {
        AsyncStorage.getItem('logId')
        .then((data) => {
            if (data) {
                setLogId(data);
            }
        })
        .catch((error) => {
            console.log('Error retrieving logId:', error);
        });
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/user/${logId}`);
            const userData = response.data;
            console.log(response.data)
            setUserData(userData);
        } catch (error) {
            console.log('Error fetching user data:', error);
        }
        };

        if (logId) {
        fetchUserData();
        }
    }, [logId]);




 
  //고유한 주문번호 생성
  const now = new Date();
  const timestamp = now.getTime(); // 밀리초 단위 타임스탬프
  const milliseconds = now.getMilliseconds(); // 현재 밀리초
  const [merchantUid, setMerchantUid] = useState(`mid_${timestamp}_${milliseconds}`);

  const [buyerName, setBuyerName] = useState(null);
  const [buyerTel, setBuyerTel] = useState('');
  const [buyerEmail, setBuyerEmail] = useState(null);
  const { name, amount,session,trainerId } = route.params || {};
  


    useEffect(() => {
    if (userData) {
      setBuyerName(userData.username);
      // setBuyerTel(userData.logId);
      setBuyerEmail(userData.email);
    }
  }, [userData]);


  

  const handlePayment = async (name) => {
    const data = {
      params: {
        pg: 'html5_inicis.INIpayTest',
        pay_method: 'card',
        notice_url:`https://ecf5-220-127-76-219.ngrok-free.app/portone-webhook`,
        currency: undefined,
        display: undefined,
        merchant_uid: merchantUid,
        name,
        amount,
        app_scheme: 'exampleformanagedexpo',
        tax_free: undefined,
        buyer_name: buyerName,
        buyer_tel: buyerTel,
        buyer_email: buyerEmail,
        buyer_addr: undefined,
        buyer_postcode: undefined,
        custom_data: undefined,
        vbank_due: undefined,
        popup: undefined,
        digital: undefined,
        language: undefined,
        biz_num: undefined,
        customer_uid: undefined,
        naverPopupMode: undefined,
        naverUseCfm: undefined,
        naverProducts: undefined,
        escrow: false,
      },
      tierCode: undefined,
    };
    
    try {
      await AsyncStorage.setItem('productName', name);
      await AsyncStorage.setItem('startDate', startDate);
      await AsyncStorage.setItem('Gender', gender);
      const stringifiedSession = String(session);
      await AsyncStorage.setItem('Session', stringifiedSession);
      const stringifeiedTrainerID=String(trainerId)
      console.log(stringifeiedTrainerID)
      await AsyncStorage.setItem('TrainerId', stringifeiedTrainerID);
      await axios.post(`${BASE_URL}/payment/requests`, data); //// / ? _

      navigation.navigate(PTScreens.Payment, data.params);
      console.log(data)
    } catch (error) {
      console.error('결제 요청 중 오류가 발생했습니다.', error);
    }
  };

  return (
  <>
    <ScrollView>
     <View style={{height:1000,backgroundColor:'white'}}>
      <View style={{width:WIDTH,height:WIDTH*0.6,backgroundColor:'white'}}>
        <View style={{flex:1,backgroundColor:'white',flexDirection:'space-between'}}>
          <Text style={{fontSize:23 ,fontWeight:'bold',color:'#4F4F4F',marginLeft:'7%',marginTop:'auto'}}>
          상품 정보
          </Text>
        </View>
        <View style={{flex:3,backgroundColor:'white'}}>
          <View style={{flexDirection:'row',flex:1,backgroundColor:'white'}}>
           <View style={{flex:1,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
              <Image
                style={{
                  width: '68%',
                  height: '71%',
                  borderRadius:15,
                  
                }}
              source={require('../images/Room1.jpeg')}/>
           </View>
          <View style={{justifyContent:'center',flex:1}}>
              <Text style={{fontSize:19,color:'#4F4F4F',fontWeight:'bold'}}>
                {name} 트레이너
              </Text>
              <Text style={{color:'#797676',fontSize:14}}>짐프라이빗</Text>
              <Text style={{color:'#1E90FF',fontSize:15,fontWeight:'bold',marginTop:'30%'}}>1:1PT {session}회 {amount.toLocaleString()}원</Text>
          </View>
          </View>
        </View>
      </View>
      <View style={{width:WIDTH,height:WIDTH*1.25,backgroundColor:'white'}}>
        <View style={{flex:1,justifyContent:'center'}}>
          <Text style={{fontSize:23 ,fontWeight:'bold',color:'#4F4F4F',marginLeft:'7%'}}>
          구매자 정보
          </Text>
        </View>
        <View style={{flex:2,backgroundColor:'white'}}>
           <View style={{flex:1}}>
             <Text style={{fontSize:14,fontWeight:'bold',color:'#797676',marginLeft:'8%',marginTop:'auto'}}>이름</Text>
           </View>
           <View style={{flex:2,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
           <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#1E90FF',
              borderRadius: 5,
              width:'85%',
              height: WIDTH * 0.12,
              paddingHorizontal:10,
              backgroundColor:'#FCF8F8'
            }}
            placeholder="이름을 입력해주세요"
            value={buyerName}
            onChangeText={setBuyerName}
          />
           </View>
        </View>
        <View style={{flex:2,backgroundColor:'white'}}>
           <View style={{flex:1}}>
             <Text style={{fontSize:14,fontWeight:'bold',color:'#797676',marginLeft:'8%',marginTop:'auto'}}>이메일</Text>
           </View>
           <View style={{flex:2,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
           <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#1E90FF',
              borderRadius: 5,
              width:'85%',
              height: WIDTH * 0.12,
              paddingHorizontal:10,
              backgroundColor:'#FCF8F8'
            }}
            placeholder="이메일을 입력해주세요"
            value={buyerEmail}
            onChangeText={setBuyerEmail}
          />
           </View>
        </View>
        <View style={{flex:2,backgroundColor:'white'}}>
           <View style={{flex:1}}>
             <Text style={{fontSize:14,fontWeight:'bold',color:'#797676',marginLeft:'8%',marginTop:'auto'}}>전화번호</Text>
           </View>
           <View style={{flex:2,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
           <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#1E90FF',
              borderRadius: 5,
              width:'85%',
              height: WIDTH * 0.12,
              paddingHorizontal:10,
              backgroundColor:'#FCF8F8'
            }}
            placeholder="전화번호를 입력해주세요"
            keyboardType="phone-pad"
            value={buyerTel}
            onChangeText={setBuyerTel}
          />
           </View>
        </View>
        <View style={{flex:2,backgroundColor:'white'}}>
           <View style={{flex:1}}>
             <Text style={{fontSize:14,fontWeight:'bold',color:'#797676',marginLeft:'8%',marginTop:'auto'}}>운동시작일</Text>
           </View>
           <View style={{flex:2,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: '#1E90FF',
                    borderRadius: 5,
                    width:'85%',
                    height: WIDTH * 0.12,
                    paddingHorizontal:10,
                    backgroundColor:'#FCF8F8',
                    justifyContent:'center'
                  }}
                  onPress={openDatePicker}
            >
              {startDate ? <Text>{startDate}</Text> : <Text style={{color:'#797676'}}>운동시작일을 선택해주세요</Text>}
            </TouchableOpacity>
            <Modal visible={showDatePicker} transparent animationType="slide">
              <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'transparent' }}>
                <View style={{ backgroundColor: 'white' }}>
                <DateTimePicker
                    key={dateTimePickerKey} // Add this line to force remounting the DateTimePicker
                    value={startDate ? new Date(startDate) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                  />
                  <Button title="Close" onPress={closeModal} />
                </View>
              </View>
            </Modal>
           </View>
        </View>
        <View style={{flex:2,backgroundColor:'white'}}>
          <View style={{flex:1,backgroundColor:'white'}}>
            <Text style={{fontSize:14,fontWeight:'bold',color:'#797676',marginLeft:'8%',marginTop:'auto'}}>성별</Text>
          </View>
          <View style={{flexDirection:'row',flex:2,marginLeft:'8%',backgroundColor:'white'}}>
              <TouchableOpacity
                    style={{
                      marginTop:'auto',
                      height: '85%',
                      width: '14%',
                      backgroundColor: gender === 'male' ? '#1E90FF' : 'white',
                      borderWidth:1,
                      borderColor:'#1E90FF',
                      borderRadius: 40,
                      ...shadowStyle,
                      marginRight:15,
                      justifyContent:'center',
                      alignItems:'center'   
                    }}
                    onPress={() => handleGenderSelection('male')}
                  >
                <Text 
                style={{
                  fontSize:21,
                  fontWeight:'bold',
                  color: gender === 'male' ? 'white' : '#797676',}}
                  >남
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                    style={{
                      marginTop:'auto',
                      height: '85%',
                      width: '14%',
                      backgroundColor: gender === 'female' ? '#1E90FF' : 'white',
                      borderRadius: 40,
                      ...shadowStyle,   
                      borderWidth:1,
                      borderColor:'#1E90FF',  
                      justifyContent:'center',
                      alignItems:'center'  
                    }}
                    onPress={() => handleGenderSelection('female')}
                  >
                <Text style={{
                  fontSize:21,
                  fontWeight:'bold',
                  color:'#797676',
                  color: gender === 'female' ? 'white' : '#797676',}}
                  >여
                  </Text>
              </TouchableOpacity>
            </View>
          </View>
      </View>
       
     </View>
     
    </ScrollView>
    <View
      style={{
        position: 'absolute',
        bottom: 20,
        width: '100%',
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: !name || !amount || !buyerName || !buyerTel || !buyerEmail || !gender || !startDate ? 'lightgray' : '#1E90FF',
          padding: 15,
          marginHorizontal: 16,
          borderRadius: 20,
          alignItems: 'center',
        }}
        onPress={() => handlePayment(name)}
        disabled={!name || !amount || !buyerName || !buyerTel || !buyerEmail || !gender || !startDate}
      >

        <Text
          style={{
            color:'white',
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          {amount.toLocaleString()}원 결제하기
        </Text>
      </TouchableOpacity>
    </View>
  </>


  );

}


const styles = StyleSheet.create({
  input: {
    marginTop:15,
    borderWidth: 1,
    borderColor: '#1E90FF',
    borderRadius: 5,
    width: WIDTH * 0.85,
    height: WIDTH * 0.12,
    paddingHorizontal:10,
    backgroundColor:'#FCF8F8'
  },
  inputText:{
    marginTop:20,
    fontSize:14,
    fontWeight:'bold',
    color:'#797676'
  }
})

export default PaymentTest