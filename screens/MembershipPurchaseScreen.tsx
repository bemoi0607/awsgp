import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Platform } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { MembershipPurchaseScreens, MembershipPurchaseParamList, MembershipScreens } from '../stacks/Navigator';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const BASE_URL = "http://172.30.1.15:8080"


const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

type MembershipPurchaseScreenNavigationProps = StackNavigationProp<
  MembershipPurchaseParamList,
  MembershipPurchaseScreens.MembershipPurchase
>;

interface MembershipPurchaseScreenProps {
  route: RouteProp<MembershipPurchaseParamList, 'MembershipPurchase'>;
  navigation: MembershipPurchaseScreenNavigationProps;
}

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

/////////////////////////////////////////////////////////

const MembershipPurchaseScreen: React.FunctionComponent<MembershipPurchaseScreenProps> = (props) => {
  const { navigation } = props;
  

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
    const [buyerTel, setBuyerTel] = useState('01072976384');
    const [buyerEmail, setBuyerEmail] = useState(null);

  useEffect(() => {
    if (userData) {
      setBuyerName(userData.username);
      // setBuyerTel(userData.logId);
      setBuyerEmail(userData.email);
    }
  }, [userData]);

  
  const handlePayment = async (productName, productAmount , productDuration)=> {
    const data = {
      params: {
        pg: 'html5_inicis.INIpayTest',
        pay_method: 'card',
        notice_url:`https://9866-220-127-76-219.ngrok-free.app/portone-webhook`,
        currency: undefined,
        display: undefined,
        merchant_uid: merchantUid,
        name: productName, // Set the value directly
        amount: productAmount,
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
      await AsyncStorage.setItem('productName', productName);
      await AsyncStorage.setItem('productDuration', String(productDuration));
      // 백엔드로 결제 요청 정보 전송
      await axios.post(`${BASE_URL}/payment/requests`, data); //// / ? _

      navigation.navigate(MembershipPurchaseScreens.MembershipPayment, data.params);
      console.log(data)
    } catch (error) {
      console.error('결제 요청 중 오류가 발생했습니다.', error);
    }
  };


  const [membershipProducts, setMembershipProducts] = useState([]);
    
  useEffect(() => {
    const fetchMembershipProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/period_membership_product`);
        setMembershipProducts(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching membership products:', error);
      }
    };

    fetchMembershipProducts();
    
  }, []);

  return (
    <ScrollView>
      <View style={{ height: screenHeight, backgroundColor: 'white' }}>
        <Image
          source={require('../images/secondevent.gif')}
          style={{ width: screenWidth, height: screenHeight * 0.25 }}
        />
        <View style={{marginTop: screenWidth * 0.08 }}>
          <View style={{ backgroundColor: 'white', height: screenHeight * 0.05, marginLeft: screenWidth * 0.06}}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black'}}>
              짐프라이빗 대관 기간권
            </Text>
          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                {membershipProducts.map((product) => (
                    <TouchableOpacity 
                    key={product.id} 
                    style={styles.MemberShipContainer}
                    onPress={() => handlePayment(product.name, product.amount, product.duration)}
                    >
                        <View style={{flexDirection:'row',marginTop:'5%'}}>
                            <Text style={{ fontSize: 21, fontWeight: 'bold',color:'#797676' }}>{product.name}</Text>
                            <View style={{
                              backgroundColor:'#4A7AFF',
                              width:'30%',
                              height: screenHeight*0.028,
                              justifyContent:'center',
                              alignItems:'center',
                              borderRadius:20,
                              marginLeft:'5%',
                              marginTop:'1.5%'
                              
                            }}>
                              <Text style={{color:'white',fontWeight:'bold',fontSize:14}}>무제한이용</Text>
                          </View>
                        </View>

                        <View style={{marginTop:'13%',marginLeft:'77%'}}>
                          <Text style={{fontSize: 12, color: '#C2C2C2', textDecorationLine: 'line-through'}}>
                              {(product.amount * 1.5).toLocaleString()}원
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold',color:'#797676' }}>짐프라이빗 회원가</Text>
                            <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: 'bold',color:'#4A7AFF',marginLeft:'5%' }}>50%</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold',color:'#797676',marginLeft:'2%'  }}>{product.amount.toLocaleString()}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
          </View>
      </View>
    </ScrollView>
  );
};

export default MembershipPurchaseScreen;

const styles = StyleSheet.create({
  membershipContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    
    flex: 1,
  },

  MemberShipContainer: {
    ...shadowStyle,
    height: screenHeight * 0.18,
    width: screenWidth * 0.85,
    marginTop: 20,
    marginBottom:10,
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 15,
  },
  membershipTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
