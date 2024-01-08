import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  Platform,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Animated,
  Easing,
  Image,
  FlatList
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import axios from 'axios';
import {PTScreens, PTStackParamList } from '../stacks/Navigator';
import { StackNavigationProp } from '@react-navigation/stack';
import Constants from 'expo-constants';
import { ItemClick } from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';
import { screenWidth } from './RoomADetailScreen';
import id from 'date-fns/esm/locale/id/index.js';

const BASE_URL = Constants.manifest.extra.BASE_URL;///////

type PayPTScreenNavigationProps = StackNavigationProp<
    PTStackParamList,
    PTScreens.PayPT
    >

interface PayPTScreenProps {
    navigation: PayPTScreenNavigationProps;
}


const WIDTH = Dimensions.get("screen").width
const height =Dimensions.get("screen").height



const PayPtScreen:React.FunctionComponent<PayPTScreenProps> = ({ route, navigation }) => {
  const scrollViewRef = useRef(null);

  const handleScrollToView = (index) => {
    if (scrollViewRef.current) {
      const viewHeight = screenWidth * 0.32;
      const spacing = 15;
      const y = index * (viewHeight + spacing);
      scrollViewRef.current.scrollTo({ y, animated: true });
    }
  };
  
  const { id }  = route.params;
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ptproducts,setptPtoducts] = useState([])

  const [isWishlist, setIsWishlist] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0)).current;
  const [averageRating, setAverageRating] = useState("0.00");

  useEffect(() => {
    console.log(id)
    const fetchAverageRating = async () => {
      try {
        const response = await fetch(`${BASE_URL}/trainer_averagerating/${id}`);
        const data = await response.json();
        const rating = data.average_rating !== null ? data.average_rating.toFixed(2) : "0.00";
        setAverageRating(rating);
      } catch (error) {
        console.error('Error:', error);
        setAverageRating('N/A');
      }
    };
  
    fetchAverageRating();
  }, []);
  


  useEffect(() => {
      const fetchReviews = async () => {
        try {
          const response = await fetch(`${BASE_URL}/trainer_reviews/${id}`);
          const data = await response.json();
          
          setReviews(data);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchReviews();
    }, []);

  // 그림자 효과를 위한 스타일 객체 생성
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

  useEffect(() => {
    fetchTrainerData(); // Retrieve trainer data
    fetchWishlistData(); // Retrieve wishlist data
  }, [id]);

  const fetchTrainerData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/trainer/${id}`);
      console.log(response.data[0])
      setData(response.data[0]); 
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    const fetchPTproduct = async () => {
      try {
        const response = await fetch(`${BASE_URL}/PTproduct/${id}`);
        const data = await response.json();
        
        setptPtoducts(data);
        console.log(data)
      } catch (error) {
        console.error(error);
      }
    };

    fetchPTproduct();
  }, []);

  const fetchWishlistData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/wishlist`);
      const wishlistData = response.data;
      const isTrainerInWishlist = wishlistData.some(
        (item) => item.trainer_id === id
      );
      setIsWishlist(isTrainerInWishlist);

    } catch (error) {
      console.log(error);
    }
  };

  if (!data) {
    return <Text>Loading...</Text>;
  }

  const addToWishlist = async () => {
    try {
      const response = await fetch(`${BASE_URL}/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
        
      });
      const data = await response.json();
      setIsWishlist(true);
      scale();
      console.log(id)
      alert('위시리스트에 추가되었습니다!'); 
      // 위시리스트 추가 결과 처리
    } catch (error) {
      // 에러 처리
    }
  };

  const removeWishlist = async () => {
    try {
      const response = await fetch(`${BASE_URL}/wishlist/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      setIsWishlist(false);
      // 위시리스트 삭제 결과 처리
    } catch (error) {
      // 에러 처리
    }
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [250, 400],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  //하트아이콘 크기조절
  const scale = () => {
    scaleValue.setValue(0);
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 300,
      easing: Easing.easeOutBack,
      useNativeDriver: true,
    }).start();
  };

  const buttonScale = scaleValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.5, 1]
  });

  return (
    <>
      <View style={{ flex: 1, position: 'relative' }}>
        <ImageBackground
          source={{ uri: data.uri }}
          style={{
            width: '100%',
            height: WIDTH*1.2,
            position: 'absolute',
          }}
        >
            <View
              style={{
                paddingHorizontal: 10,
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop:WIDTH*0.123,
                backgroundColor:'transparent'
              }}
            >
              <TouchableOpacity
                style={{
                  width: 10 * 4,
                  height: 10 * 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1,
                }}
                onPress={() => navigation.navigate(PTScreens.PTProfile)}
              >
                <AntDesign name="left" size={10 * 3} color="#131515" />
              </TouchableOpacity>
              <View>
                <TouchableOpacity
                  style={{
                    width: 10 * 4,
                    height: 10 * 4,
                  
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1,
                  }}
                >
                  <AntDesign name="shoppingcart" size={30} color="#131515" />
                </TouchableOpacity>
              </View>
            </View>
        </ImageBackground>
        <Animated.View
            style={{
              opacity: headerOpacity,
              backgroundColor: "white",
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height:WIDTH*0.225,
              zIndex: 2,
            }}
          >
            <View
                style={{
                  paddingHorizontal: 10,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginTop:WIDTH*0.123,
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 10 * 4,
                    height: 10 * 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1,
                  }}
                  onPress={() => navigation.navigate(PTScreens.PTProfile)}
                >
                  <AntDesign name="left" size={10 * 3} color="#7f7f7f" />
                </TouchableOpacity>
                <Text style={{marginTop:8,fontSize:20,fontWeight:'bold',color:'#797676'}}>{data.name} 트레이너</Text>
                <View>
                  <TouchableOpacity
                    style={{
                      width: 10 * 4,
                      height: 10 * 4,
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 1,
                    }}
                  >
                    <AntDesign
                      name="shoppingcart"
                      size={30}
                      color="#7f7f7f"
                    />
                  </TouchableOpacity>
                </View>
              </View>
          </Animated.View>
        
      
        <Animated.ScrollView ref={scrollViewRef}
          style={{ marginTop: height*0.1, flex: 1 }}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        >
          <View
            style={{
              backgroundColor: "white",
              height:'auto',
              borderRadius:20,
              marginTop: WIDTH*0.7,
            }}
          >
            <View
              style={{
                height: 60,
                width: 60,
                position: 'absolute',
                top: -30,
                backgroundColor: 'white',
                borderRadius:30,
                right: 20,
                ...shadowStyle,
                justifyContent: 'center',
                alignItems:'center'
              }}
            >
                <TouchableOpacity
                  style={{
                    backgroundColor: 'white',
                    width: 10 * 4,
                    height: 10 * 4,
                    alignItems: 'center',
                    justifyContent:'center',
                    
                    transform: [ {scale: buttonScale}]
                  }}
                  onPress={() => {
                    if (isWishlist) {
                      removeWishlist(data.id);
                    } else {
                      addToWishlist(data.id);
                    }
                  }}
                >
                  {isWishlist ? (
                    <Ionicons name="heart" size={10 * 3} color="red" />
                  ) : (
                    <Ionicons
                      name="heart-outline"
                      size={10 * 3}
                      color="#7f7f7f"
                    />
                  )}
                </TouchableOpacity>
            </View>
            

            <View style={{width:WIDTH,height:WIDTH*0.9,backgroundColor:'white',marginTop:WIDTH*0.13}}>
              <View style={{flex:1,justifyContent:'center',backgroundColor:'white',flexDirection:'row',paddingHorizontal:'7%',alignItems:'center'}}>
                <Text style={{fontSize:23,color:'black',fontWeight:'bold'}}>{data.name} 트레이너</Text>
                <Fontisto name="star" size={13} color="black" style={{marginLeft:'auto'}} />
                <Text style={{ fontSize: 14 }}>{averageRating}</Text>
              </View>
              <View style={{flex:4,backgroundColor:'white',alignItems:'center',justifyContent:'center',borderBottomWidth:1,borderBottomColor:'#EEEDED'}}>
                <View style={{width:'90%',height:'65%',backgroundColor:'white',borderRadius:15,...shadowStyle,justifyContent:'center',paddingHorizontal:'5%'}}>
                  <View
                    style={{
                      height: '30%',
                      width: '17.5%',
                      position: 'absolute',
                      top: '-15%',
                      backgroundColor: 'white',
                      borderRadius:60,
                      left: '5%',
                      ...shadowStyle,
                      justifyContent: 'center',
                      alignItems:'center'
                    }}
                  >
                    <Image
                      source={{ uri: data.uri }}
                      style={{width:'100%',height:'100%',borderRadius:60}}
                    />
                  </View> 

                    <Text style={{alignSelf:'center',color:'#797676',fontSize:16}}>
                    안녕하세요, 짐프라이빗 {data.name} 트레이너입니다.
                    항상 회원님을 먼저 생각하는 트레이너가 되도록 하겠습니다
                    </Text>
                </View>
              </View>
            </View>
            <View style={{width:screenWidth,height:screenWidth*0.25,backgroundColor:'white'}}>
                <View style={{flex:1,paddingHorizontal:'7%',flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#EEEDED'}}>
                    <Text style={{fontSize:23,fontWeight:'bold',marginTop:'10%'}}>수업가능시간</Text>
                    <View style={{marginLeft:'auto',marginTop:'10%'}}>
                      <Text style={{fontSize:16,color:'#797676'}}>1차 : {data.available_time1}</Text>
                      <Text style={{ fontSize: 15, color: 'gray' }}>{data.available_time2 ? `2차 : ${data.available_time2}` : null}</Text>
                    </View>
                  </View>
            </View>
            <View style={{width:screenWidth,height:screenWidth*0.2,backgroundColor:'white',justifyContent:'center'}}>
                <Text style={{fontSize:23,fontWeight:'bold',marginLeft:'7%'}}>PT</Text>
            </View>
              <View style={{width:screenWidth,height:'auto',backgroundColor:'white',alignItems:'center',borderBottomWidth:1,borderBottomColor:'#EEEDED'}}>
                {ptproducts.map((item, index) => (
                  <TouchableOpacity 
                  key={index} style={{width:'90%',height:screenWidth*0.32,backgroundColor:'white',borderRadius:10,...shadowStyle,justifyContent:'center',paddingHorizontal:'4%',paddingVertical:'3%',marginBottom:25}}
                  onPress={() => {
                    navigation.push('PaymentTest', {
                      amount:item.session*item.price ,
                      trainerId: item.trainer_id,
                      name: item.trainer_name,
                      session:item.session
                    });
                    console.log(item.trainer_name)
                }}
                  >
                    <View style={{flex:1,backgroundColor:'white'}}>
                      <Text style={{fontSize:23,fontWeight:'bold',color:'#1F75FE'}}>1:1PT {item.session}회</Text>
                      <Text style={{fontSize:14,color:'#C2C2C2',textDecorationLine: 'line-through',marginLeft:'auto',marginTop:'auto',marginBottom:'2%'}}>{item.price} 원</Text>
                      <View style={{ flexDirection: 'row',marginLeft:'auto' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold',color:'#797676' }}>짐프라이빗회원가</Text>
                        <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: 'bold',color:'#1F75FE',marginLeft:'3%',marginRight:'1%' }}>10%</Text>
                        <Text style={{ fontSize: 18, fontWeight: 'bold',color:'#797676',marginLeft:'2%'  }}>{item.price.toLocaleString()}원/회</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            
    
            <View style={{width:WIDTH,height:WIDTH*0.8,backgroundColor:'white',borderBottomColor:'#EEEDED',borderBottomWidth:1}}>
              <View style={{flex:1,backgroundColor:'white',justifyContent:'center'}}>
                <Text style={{fontSize: 23,fontWeight:'bold',marginLeft:'7%',}}>이용후기</Text>  
              </View>

              {reviews.length > 0 ? (
                <View style={{ flex: 3 }}>
                <FlatList
                  horizontal
                  keyExtractor={(item) => item.rvid}
                  data={reviews}
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={WIDTH}
                  decelerationRate="fast"
                  renderItem={({ item }) => {
                    return(
                        <View style={{width:WIDTH,height:'100%',backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                            <View style={{width:WIDTH*0.9,height:'80%',borderRadius:20,backgroundColor:'white',...shadowStyle}}>
                              <View style={{flex:1,backgroundColor:'white',flexDirection:'row',alignItems:'center',borderTopRightRadius:20,borderTopLeftRadius:20}}>
                                <Image 
                                  source={item.gender === 'male' ? require('../images/Man.png') : require('../images/woman.png')}
                                  style={{ width: '13%', height: '67%', marginLeft: '5%' }}
                                />
                                <Text style={{fontSize:16,fontWeight:'bold',marginLeft:'3%',color:'#797676'}}>{item.username}</Text>
                              </View>
                              <View style={{flex:1.7,backgroundColor:'white',justifyContent:'center',alignItems:'center',borderTopWidth:1,borderTopColor:'#E5E5E5',borderBottomRightRadius:20,borderBottomLeftRadius:20}}>
                                <Text style={{fontSize:16,color:'#797676'}}>{item.review}</Text>
                              </View>
                            </View>
                        </View>
                    );
                  }}
                />
              </View>
          ) : (
            // 리뷰가 없는 경우
            <View style={{ flex: 3, backgroundColor: 'white' }}>
              <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={require('../images/negative-review.png')}
                  style={{ width: '30%', height: '80%' }}
                />
              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#C2C2C2', fontSize: 22 }}>아직 작성된 리뷰가 없습니다.</Text>
              </View>
            </View>
          )}
        </View>
        <View style={{width:WIDTH,height:WIDTH,backgroundColor:'white'}}>
                  <View style={{backgroundColor:'white',flex:1,justifyContent:'center'}}>
                    <Text style={{fontSize: 21,marginLeft:'6%'}}>자격 및 이력사항</Text>  
                  </View>

                  <View style={{backgroundColor:'white',flex:3,marginLeft:'6%'}}>
                    <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>1</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>유원대학교 스포츠과학과 졸업</Text>
                    </View>
                    <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>2</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>현)가평웨일스 트레이너겸 선수</Text>
                    </View>
                    <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>3</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>바디스짐 퍼스널 트레이너</Text>
                    </View>
                    <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>4</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>에일린 휘트니스 트레이너(여성전용)</Text>
                    </View>
                    <View style={{flexDirection:'row',marginBottom:'3%'}}>
                      <Text style={{fontSize:15,color:'black'}}>5</Text>
                      <Text style={{fontSize:15,color:'#797676',marginLeft:'2.5%'}}>용인시 독립야군단 트레이너 선수.</Text>
                    </View>
                
                  </View>
            </View>


          </View>  
        </Animated.ScrollView>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          width: '100%',
        }}
      >
       <TouchableOpacity
       onPress={() => handleScrollToView(4)}
            style={{
                backgroundColor: '#1E90FF',
                padding: 15,
                marginHorizontal: 16,
                borderRadius: 20,
                alignItems: 'center',
            }}
            >
            <Text
                style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
                }}
            >
                PT 구매하기
            </Text>
            </TouchableOpacity>
    </View>

    </>
  );
};

export default PayPtScreen;

