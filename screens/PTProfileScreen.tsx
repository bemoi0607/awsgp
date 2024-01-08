import { StyleSheet, Text, TouchableOpacity, View,Image, TextInput, ScrollView,} from 'react-native';
import {PTScreens, PTStackParamList } from '../stacks/Navigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios'
import Constants from 'expo-constants';
import React from 'react';
import { screenWidth } from './RoomADetailScreen';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';

// const BASE_URL = Constants.manifest.extra.BASE_URL;
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
    }
  };
  
  useEffect(() => {
    getTrainer();
  }, []);
  
  

  



  return (
    <ScrollView>
      <View style={{height:"auto",width:screenWidth, backgroundColor:'white' }}>
          {trainer.map(item => (
            <View key={item.trainer_id} style={{width:screenWidth,height:screenWidth*1.2,backgroundColor:'white',marginBottom:'10%'}}>
              <TouchableOpacity style={{flex:1,backgroundColor:'white'}} onPress={() => navigation.navigate(PTScreens.PayPT, { id: item.trainer_id })}>
                <View style={{flex:4,justifyContent:'center',alignItems:'center'}}>
                  <Image source={{ uri: item.uri }} style={{width:'85%',height:'90%',borderRadius:15}} />
                  <View style={{ position: 'absolute', top: '8%', right: '12%' }}>
                    {item.wid === null ? (
                      <Image
                        source={require('../images/heartblackicon.png')}
                        style={{ width: 28, height: 25 }}
                      />
                    ) : (
                      <Image
                        source={require('../images/red-hearicon.png')}
                        style={{ width: 28, height: 25 }}
                      />
                    )}
                  </View>
                </View>
                <View style={{flex:1.3,backgroundColor:'white',paddingHorizontal:'7%'}}>
                  <View style={{flex:1,backgroundColor:'white',flexDirection:'row',alignItems:'center'}}>
                      <Text style={{ fontSize: 21, color: 'black' }}>
                        {item.trainer_name} 트레이너
                      </Text>
                      <Fontisto name="star" size={13} color="black" style={{marginLeft:'auto'}} />
                      <Text style={{ fontSize: 14, color: 'gray' }}>{averageRatings[item.trainer_id] || 'N/A'}</Text>
                  </View>
                  <View style={{flex:2,backgroundColor:'white',marginBottom:'7%'}}>
                      <Text style={{fontSize:18,color:'#797676'}}>수업가능시간</Text>
                      <Text style={{ fontSize: 15, color: 'gray',marginTop:'1%' }}>1차 : {item.available_time1}</Text>
                      <Text style={{ fontSize: 15, color: 'gray' }}>{item.available_time2 ? `2차 : ${item.available_time2}` : null}</Text>
                      <Text style={{fontSize:16,marginTop:'2%',fontWeight:'bold'}}>{item.min_price.toLocaleString()}원/회</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}
          
      </View>
    </ScrollView>
  );
};

export default PTProfileScreen;



const styles = StyleSheet.create({
  container:{
    flex:1,
    height:"100%",
    width:"100%",
    backgroundColor:'white',
    alignSelf:'center',
    justifyContent:'center',
    

  },
  container2:{
    flex:1,
    backgroundcolor:'white',
  },
  image: {
    width: 120,
    height: 120,
    borderBottomLeftRadius:15,
    borderBottomRightRadius:15,
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
    flexDirection:'row',
  },
  Button:{
    margin:10,
    width:"90%",
    height:140,
    borderBottomLeftRadius:15,
    borderBottomRightRadius:15,
    borderTopLeftRadius:15,
    borderTopRightRadius:15, 
    justifyContent:'center',
    
  }
});

