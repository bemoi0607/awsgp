// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, KeyboardAvoidingView,Image, Dimensions, TextInput } from 'react-native';
// import { Input } from 'native-base';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { MainScreens,MainStackParamList } from '../stacks/Navigator';

// type GenderScreenNavigationProps = StackNavigationProp<
//     MainStackParamList, 
//     'Gender'
// >;

// interface GenderScreenProps {
//     navigation: GenderScreenNavigationProps;
// };
// const screenWidth = Dimensions.get('screen').width;
// const screenHeight = Dimensions.get('screen').height;


// const NameScreen: React.FunctionComponent<GenderScreenProps> = ({navigation}) => {
    
//     const [gender, setGender] = useState<string>('');

//     const handleContinue = async () => {
//     try {
//         await AsyncStorage.setItem('Gender', gender);
//         console.log(gender)
//         navigation.navigate(MainScreens.BirthDate);
//     } catch (error) {
//         console.error('Error saving name to AsyncStorage:', error);
//     }
// };


//     return (
//         <KeyboardAvoidingView style={{flex:1,backgroundColor:'white'}} behavior='padding'>
        
//         <View style={{justifyContent:'space-between',alignItems:'center',flex:1, backgroundColor:'white'}} >
//                 <View style={{justifyContent:'center',alignItems:'center'}}>
//                     <Image source={require('../images/3.png')} style={{width:screenWidth,height:80}} resizeMode='contain' />
//                     <Text style={{fontSize:20, fontWeight:'bold', }}>
//                         성별을 선택해주세요.
//                     </Text>
//                     <TextInput
//                         style={{ borderBottomWidth: 0.5, borderColor: 'gray', fontSize: 35, fontWeight: 'bold',width:screenWidth*0.9, marginTop:'10%' }}
//                         placeholder="성별"
//                         onChangeText={(text) => setGender(text)}
//                     />  
//                 </View>

//             <View style={{ height:screenHeight*0.3,justifyContent:'flex-end'}}>
//                 <TouchableOpacity 
//                 style={{ borderRadius:15,backgroundColor:'#4A7AFF',width:screenWidth*0.9,justifyContent:'center',alignItems:'center',height:screenHeight*0.05,marginBottom:'3%' }} 
//                 onPress={handleContinue}>
//                     <Text style={{ fontSize: 18,color:'white' }}>확인</Text>
//                 </TouchableOpacity>
//             </View>

//         </View>
//         </KeyboardAvoidingView>
        
//     );
// };

// export default NameScreen;


import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreens, MainStackParamList } from '../stacks/Navigator';

type GenderScreenNavigationProps = StackNavigationProp<
    MainStackParamList, 
    'Gender'
>;

interface GenderScreenProps {
    navigation: GenderScreenNavigationProps;
};

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const GenderScreen: React.FunctionComponent<GenderScreenProps> = ({ navigation }) => {
    const [gender, setGender] = useState<string>('');

    const handleSetGender = async (selectedGender: string) => {
        try {
            await AsyncStorage.setItem('Gender', selectedGender);
            console.log(selectedGender);
            setGender(selectedGender); // 현재 선택된 성별 업데이트
            navigation.navigate(MainScreens.BirthDate);
        } catch (error) {
            console.error('Error saving gender to AsyncStorage:', error);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'white' }} behavior='padding'>
            <View style={{ justifyContent: 'space-between', alignItems: 'center', flex: 1, backgroundColor: 'white' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../images/3.png')} style={{ width: screenWidth, height: 80 }} resizeMode='contain' />
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                        성별을 선택해주세요.
                    </Text>

                    <View style={{ flexDirection: 'row', marginTop: '10%' }}>
                    <TouchableOpacity 
                        style={{ borderRadius: 25, backgroundColor: gender === '남자' ? 'blue' : '#4A7AFF', width: screenWidth * 0.4, justifyContent: 'center', alignItems: 'center', height: 40, margin: 10 }} 
                        onPress={() => handleSetGender('남자')}
                    >
                        <Text style={{ fontSize: 18, color: 'white' ,fontWeight:'bold'}}>남자</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{ borderRadius: 25, backgroundColor: gender === '여자' ? 'blue' : '#4A7AFF', width: screenWidth * 0.4, justifyContent: 'center', alignItems: 'center', height: 40, margin: 10 }} 
                        onPress={() => handleSetGender('여자')}
                    >
                        <Text style={{ fontSize: 18, color: 'white' ,fontWeight:'bold'}}>여자</Text>
                    </TouchableOpacity>
                </View>
                </View>

                
                

                {/* <View style={{ height: screenHeight * 0.3, justifyContent: 'flex-end' }}>
                    
                    <TouchableOpacity 
                        style={{ borderRadius: 15, backgroundColor: '#4A7AFF', width: screenWidth * 0.9, justifyContent: 'center', alignItems: 'center', height: screenHeight * 0.05, marginBottom: '3%' }} 
                        onPress={() => navigation.navigate(MainScreens.BirthDate)} 
                        disabled={gender === ''}
                    >
                        <Text style={{ fontSize: 18, color: 'white' }}>확인</Text>
                    </TouchableOpacity>
                </View> */}

            </View>
        </KeyboardAvoidingView>
    );
};

export default GenderScreen;
