import { StyleSheet, Text, TouchableOpacity, View,Image, TextInput, ScrollView,} from 'react-native';
import {PTScreens, PTStackParamList } from '../stacks/Navigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios'
import React from 'react';
import { screenWidth } from './RoomADetailScreen';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import config from '../config'
import { height, width } from './HomeScreen';
import LottieView from 'lottie-react-native';

const BASE_URL = config.SERVER_URL;


///////////////////////////////

type PTProfileScreenNavigationProps = StackNavigationProp<
    PTStackParamList,
    PTScreens.PTProfile
    >

interface PTProfileScreenProps {
    navigation: PTProfileScreenNavigationProps;
}


//////////////////////////////////////////////////////////////// 코드 타입정의


const PTProfileScreen = ({ navigation }: Props) => {
  const [trainer, setTrainer] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  

  const fetchAverageRating = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/trainer_averagerating/${id}`);
      const data = await response.json();
      const rating = data.average_rating !== null ? data.average_rating.toFixed(2) : "0.00";
      return rating;
    } catch (error) {
      console.error('Error:', error);
      return 'N/A';
    }
  };

  const getTrainer = async () => {
    try {
      const response = await Axios.get(`${BASE_URL}/PTproductminprice`);
      const trainers = response.data;
  
      // 별점값을 가져와서 averageRatings 객체에 저장
      const ratingsPromises = trainers.map(trainer => fetchAverageRating(trainer.trainer_id));
      const ratings = await Promise.all(ratingsPromises);
      const averageRatingsObj = trainers.reduce((result, trainer, index) => {
        result[trainer.trainer_id] = ratings[index];
        return result;
      }, {});
      setAverageRatings(averageRatingsObj);
  
      setTrainer(trainers);
      console.log(trainer); // Make sure to use 'trainers' instead of 'trainer' since 'trainer' is an array.
  
      
    } catch (error) {
      console.log(error.response);
    }finally {
      setIsLoading(false); // 데이터 로딩 완료
    }
  };
  
  useEffect(() => {
    getTrainer();
  }, []);
  
  if (isLoading) {
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <LottieView
          source={require('../src/lottie/loading.json')} 
          loop
          autoPlay
          style={{width:100,height:100}}
        />
      </View>
    );
  }

  
  return (
    <ScrollView>
      <View style={{height:"auto",width:screenWidth, backgroundColor:'white',paddingHorizontal:24,paddingTop:36 }}>
          {trainer.map(item => (
              <TouchableOpacity key={item.trainer_id} style={{flex:1,backgroundColor:'white',marginTop:24}} onPress={() => navigation.navigate(PTScreens.PayPT, { id: item.trainer_id })}>
                <View style={{flexDirection:'row',flex:1,borderBottomColor:'#DEE2E6',borderBottomWidth:1,paddingBottom:24}}>
                  <View style={{flex:3}}>
                    <Text style={styles.Body2}>{item.trainer_name} 트레이너</Text>
                    <View style={{flexDirection:'row',marginTop:16,}}>
                      <AntDesign name="star" size={16} color="#F8D000" />
                      <Text style={styles.Caption1}>{averageRatings[item.trainer_id] || 'N/A'}</Text>
                    </View>
                    <Text  
                    numberOfLines={1} 
                    ellipsizeMode='tail'
                    style={styles.Caption2}>
                    {item.introduction.replace(/\n/g, ' ')}
                  </Text>

                  </View>
                  <View style={{flex:1}}>
                   <Image source={{ uri: item.uri }} style={styles.trainerimage}/>
                  </View>
                </View>
              </TouchableOpacity>
          ))}
      </View>
    </ScrollView>
  );
};

export default PTProfileScreen;



const styles = StyleSheet.create({
 Body2:{
    fontSize:20,
    fontWeight:'600',
    color:'#333333'
  },
  Caption1:{
    fontSize:16,
    fontWeight: '500',
    color:'#333333',
    marginLeft:4
  },
  Caption2:{
    fontSize:12,
    marginTop:16,
    color:'#868E96'
  },
  trainerimage:{
   width:80/height,
   height:80/height,
   borderRadius:8
  }
});

