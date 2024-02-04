import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Platform,ScrollView, TouchableOpacity } from 'react-native';
import { MembershipPurchaseScreens, MembershipPurchaseParamList} from '../stacks/Navigator';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config'
import { height,width } from './HomeScreen';
import { background } from 'native-base/lib/typescript/theme/styled-system';

const BASE_URL = config.SERVER_URL;


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
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  android: {
    elevation: 3,
  },
});

/////////////////////////////////////////////////////////

const MembershipPurchaseScreen: React.FunctionComponent<MembershipPurchaseScreenProps> = (props) => {
  const { navigation } = props;
  

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
    }, []);


  //고유한 주문번호 생성
    const now = new Date();
    const timestamp = now.getTime(); // 밀리초 단위 타임스탬프
    const milliseconds = now.getMilliseconds(); // 현재 밀리초
    const [merchantUid, setMerchantUid] = useState(`mid_${timestamp}_${milliseconds}`);
    const [buyerName, setBuyerName] = useState(null);
    const [buyerTel, setBuyerTel] = useState(null);
    const [buyerEmail, setBuyerEmail] = useState(null);

  useEffect(() => {
    if (userData) {
      setBuyerName(userData.username);
      setBuyerTel(userData.phone_number);
      setBuyerEmail(userData.email);
    }
  }, [userData]);

  
  const handlePayment = async (productName ,productAmount,productDuration,producttype,productTotaltime)=> {
    const data = {
      params: {
        pg: 'html5_inicis.INIpayTest',
        pay_method: 'card',
        notice_url:`${BASE_URL}/portone-webhook`,
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
      await AsyncStorage.setItem('type', producttype);
      await AsyncStorage.setItem('productTotaltime',String(productTotaltime));
      // 백엔드로 결제 요청 정보 전송
      await axios.post(`${BASE_URL}/payment/requests`, data); //// / ? _
      console.log(producttype)
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
      <View style={{ height: screenHeight, backgroundColor: '#F8F9FA',paddingHorizontal:24 }}>       
        <Text style={styles.subtitle}>
              짐프라이빗 대관 기간권
        </Text>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                {membershipProducts.map((product) => (
                    <TouchableOpacity 
                    key={product.id} 
                    style={styles.MemberShipContainer}
                    onPress={() => handlePayment(product.name, product.amount,product.duration, product.type , product.total_time)}
                    >
                    <View style={{flex:1,paddingHorizontal:24,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                      <View>
                        <Text style={styles.Body1}>{product.name}</Text>
                        <Text style={styles.caption2}>10% 할인가</Text>
                      </View>
                      <TouchableOpacity style={styles.PriceContainer}>
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                          <Text style={styles.caption1}>{product.amount.toLocaleString()}원</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    </TouchableOpacity>
                ))}
            </View>
          </View>

    </ScrollView>
  );
};

export default MembershipPurchaseScreen;

const styles = StyleSheet.create({
  subtitle:{
    fontSize:24,
    fontWeight:'bold',
    marginTop:40
},
  membershipContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  PriceContainer:{
   width:100/width,
   height:40/height,
   borderRadius:8,
   backgroundColor:'#F1F3F5'
  },
  MemberShipContainer: {
    ...shadowStyle,
    height:88/height,
    width: '100%',
    marginTop: 24,
    borderRadius: 16,
    backgroundColor: 'white',
  },
  Body1:{
   fontSize:20,
   color:'black',
   fontWeight:'bold'
  },
  caption1:{
    fontSize:16,
    fontWeight:'500'
  },
  caption2:{
    fontSize:12,
    color:'#4169E1'
  }
});
