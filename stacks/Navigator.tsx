import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import NameScreen from '../screens/NameScreen';
import GenderScreen from '../screens/GenderScreen';
import BirthdateScreen from '../screens/BirthdateScreen';
import EmailScreen from '../screens/EmailScreen';
import PhoneNumberScreen from '../screens/PhoneNumberScreen';
import ConfirmationScreen from '../screens/ConfirmationScreen';
import PassWordScreen from '../screens/PassWordScreen';
import LogInScreen from '../screens/LogInScreen';
import HomeScreen from '../screens/HomeScreen';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/FontAwesome';
import MyReservationScreen from '../screens/MyReservationScreen';
import MyInfoScreen from '../screens/MyInfoScreen';
import LandingScreen from '../screens/LandingScreen';
import YNMemberScreen from '../screens/YNMemberScreen';
import RoomSelectScreen from '../screens/RoomSelectScreen';
import RoomADetailScreen from '../screens/RoomADetailScreen';
import RoomBDetailScreen from '../screens/RoomBDetailScreen';
import RoomCDetailScreen from '../screens/RoomCDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import BookedInfoScreen from '../screens/BookedInfoScreen';
import BookingPayment from '../screens/BookingPayment';
import BookingPaymentResult from '../screens/BookingPaymentResult';
import MembershipRoomSelectScreen from '../screens/MembershipRoomSelectScreen';
import MembershipRoomADetailScreen from '../screens/MembershipRoomADetailScreen';
import MembershipRoomBDetailScreen from '../screens/MembershipRoomBDetailScreen';
import MembershipRoomCDetailScreen from '../screens/MembershipRoomCDetailScreen';
import MembershipBookScreen from '../screens/MembershipBookScreen';
import MembershipBookedInfoScreen from '../screens/MembershipBookedInfoScreen';
import MembershipPurchaseScreen from '../screens/MembershipPurchaseScreen';
import MembershipPayment from '../screens/MembershipPayment';
import MembershipPaymentResult from '../screens/MembershipPaymentResult';
import PTProfileScreen from '../screens/PTProfileScreen';
import PayPTScreen from '../screens/PayPTScreen';
import PaymentTest from '../screens/PaymentTest';
import Payment from '../screens/Payment';
import PaymentResult from '../screens/BookingPaymentResult';
import BookingHistory from '../screens/BookingHistory';
import ReviewScreen from '../screens/ReviewScreen';
import MyMembershipScreen from '../screens/MyMembershipScreen';
import PTReviewScreen from '../screens/PTReviewScreen';
import LogInformationScreen from '../screens/LogInformationScreen';
import UsingRuleScreen from '../screens/UsingRuleScreen';
import LogInLoading from '../screens/LogInLoading'
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';

export enum MainScreens {
    Landing='Landing',
    LogIn='LogIn',
    Name= 'Name',
    PassWord = 'PassWord',
    Gender='Gender',
    BirthDate = 'BirthDate',
    Email='Email',
    PhoneNumber ='PhoneNumber',
    Confirmation = 'Confirmation',
    ForgotPassword = 'ForgotPassword',
    NewPassword='NewPassword',
    LogInLoading ='LogInLoading',
    Home = 'Home',
    YNMember= 'YNMember',
    PT = 'PT',
    MyInfo = 'MyInfo',
    MyReservation = 'MyReservation',
    WishList = 'WishList',
    Cart = 'Cart',
    Main = 'Main',
    Book = 'Book',
    BookingHistory= 'BookingHistory',
    MineMembership= 'MineMembership',
    LogInfo= 'LogInfo',
    GymService='GymService',
    Franchise='Franchise',
    Review= 'Review',
    Membership= 'Membership',
    MembershipPurchase1 = 'MembershipPurchase1',
    LogOut= 'LogOut',
};


export type MainStackParamList = {
    Landing: undefined;
    LogIn: undefined;
    Name: undefined;
    PassWord : undefined;
    Gender:undefined;
    BirthDate:undefined;
    Email:undefined;
    PhoneNumber : undefined;
    Confirmation : undefined;
    ForgotPassword : undefined;
    NewPassword: undefined;
    LogInLoading : undefined;
    Home: undefined;
    Event: undefined;
    YNMember: undefined;  
    PT: undefined;
    MyInfo: undefined;
    MyReservation: undefined; 
    Main: undefined;// Booking 스크린은 BookingsParams 라는 지정 타입의 파라미터가 필요함 => BookingsScreen 에서 지정할 것임.
    Book : undefined;
    BookingHistory: undefined;
    MineMembership: undefined;
    LogInfo: undefined;
    GymService:undefined;
    Franchise:undefined;
    Review: undefined;
    Membership : undefined;
    MembershipPurchase1 : undefined;
    LogOut: {data: string};
    } & BookingStackParamList & PTStackParamList;// 이런식으로 메인안에 서브 넣어서 다른 페이지에서 함께 export 가능.


type MainTabParamList= {
    Home: undefined;
    MyInfo: undefined;
    MyReservation: undefined;
};


//

export enum BookingScreens {
    RoomSelect='RoomSelect',
    RoomADetail='RoomADetail',
    RoomBDetail='RoomBDetail',
    RoomCDetail='RoomCDetail',
    Booking = 'Booking',
    BookedInfo = 'BookedInfo',
    BookingPayment = 'BookingPayment',
    BookingPaymentResult = 'BookingPaymentResult',
};

export type BookingStackParamList = {//should defined;
    RoomSelect:undefined;
    RoomADetail:undefined;
    RoomBDetail:undefined;
    RoomCDetail:undefined;
    Booking: undefined; // Booking 스크린은 BookingsParams 라는 지정 타입의 파라미터가 필요함 => BookingsScreen 에서 지정할 것임.
    BookedInfo: {
        selectedDateSlot:string,
        isMorning:boolean,
        isEvening:boolean,
        selectedDayTimeSlot:string,
        selectedNightTimeSlot:string,
        selectedRoomSlot:string,
        selectedStartTime:string,
        selectedEndTime:string,
        selectedUsingTimeSlot:string,
    };
    BookingPayment: undefined;  
    BookingPaymentResult:undefined; 
};

//

export enum MembershipScreens {
    MembershipRoomSelect = 'MembershipRoomSelect',
    MembershipRoomADetail = 'MembershipRoomADetail',
    MembershipRoomBDetail = 'MembershipRoomBDetail',
    MembershipRoomCDetail = 'MembershipRoomCDetail',
    MembershipBooking = 'MembershipBooking',
    MembershipBookedInfo = 'MembershipBookedInfo'
};

export type MembershipStackParamList = {
    MembershipRoomSelect: undefined;
    MembershipRoomADetail: undefined;
    MembershipRoomBDetail: undefined;
    MembershipRoomCDetail: undefined;
    MembershipBooking: undefined; 
    MembershipBookedInfo: {
        selectedDateSlot:string,
        isMorning:boolean,
        isEvening:boolean,
        selectedDayTimeSlot:string,
        selectedNightTimeSlot:string,
        selectedRoomSlot:string,
        selectedStartTime:string,
        selectedEndTime:string,
        selectedUsingTimeSlot:string,
    };
};

//

export enum HistoryScreens {
    History = 'History',
    Review = 'Review',
};

export type HistoryStackParamList = {
    History: undefined; 
    Review: undefined;
};

//

export enum MMScreens {
    MyMembership='MyMembership',
    PTReview='PTReview'
};

export type MMStackParamList = {
    MyMembership:undefined; 
    PTReview:undefined;
};


//


export enum LogInformationScreens {
    LogInformation='LogInformation',
    UsingRule='UsingRule'
};

export type LogInformationStackParamList = {
    LogInformation:undefined;
    UsingRule:undefined;
};


//


export enum MembershipPurchaseScreens {
    MembershipPurchase = 'MembershipPurchase',
    MembershipPayment = 'MembershipPayment',
    MembershipPaymentResult = 'MembershipPaymentResult',
};

export type MembershipPurchaseParamList = {//should defined;
    MembershipPurchase: undefined;
    MembershipPayment: undefined;
    MembershipPaymentResult:undefined
};


//



export enum PTScreens {
    PTProfile = 'PTProfile',
    PayPT = 'PayPT',
    PaymentTest ='PaymentTest',
    Payment= 'Payment',
    PaymentResult = 'PaymentResult',
};

export type PTStackParamList = {//should defined;
    PTProfile : undefined; 
    PayPT : undefined;
    PaymentTest: undefined;
    Payment: undefined; 
    PaymentResult: undefined;
};





const MainStack = createNativeStackNavigator<MainStackParamList>();
const MainTab = createMaterialBottomTabNavigator<MainTabParamList>();
const BookingStack = createNativeStackNavigator<BookingStackParamList>();
const MembershipStack = createNativeStackNavigator<MembershipStackParamList>();
const MembershipPurchase = createNativeStackNavigator<MembershipPurchaseParamList>();
const HistoryStack = createNativeStackNavigator<HistoryStackParamList>();
const MMStack = createNativeStackNavigator<MMStackParamList>();
const LogInformationStack = createNativeStackNavigator<LogInformationStackParamList>();
const PTStack = createNativeStackNavigator<PTStackParamList>();


function MainTabNavigator(): React.ReactElement {
    return (
        <MainTab.Navigator
            initialRouteName={MainScreens.Home}
            >
            <MainTab.Screen
                name={MainScreens.Home}
                component={HomeScreen}
                options={{
                    title:'홈',
                    tabBarLabel: '홈',
                    tabBarIcon: ({ color }) => (
                        <Icon name="home" size={24} color={color} />
                    )
                }}
            />
            <MainTab.Screen
                name={MainScreens.MyReservation}
                component={MyReservationScreen}
                options={{
                    title:'내 예약',
                    tabBarLabel: '내 예약',
                    tabBarIcon: ({ color }) => (
                        <Icon3 name="calendar" size={24} color={color} />
                    )
                }}
            />
    
            
            <MainTab.Screen
                name={MainScreens.MyInfo}
                component={MyInfoScreen}
                options={{
                    title:'내 정보',
                    tabBarLabel: '내 정보',
                    tabBarIcon: ({ color }) => (
                        <Icon2 name="user" size={24} color={color} />
                    )
                }}
            />
        </MainTab.Navigator>
    );
};

const MainStackNavigator: React.FunctionComponent = () => {
    return (
    <NavigationContainer>
        <MainStack.Navigator initialRouteName="Landing" screenOptions={{headerShown: false}}>
            <MainStack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }}/>
            <MainStack.Screen name="LogIn" component={LogInScreen} options={{ headerShown: false }}/>
            <MainStack.Screen name="Name" component={NameScreen} options={{ headerShown: false }}/>
            <MainStack.Screen name="PassWord" component={PassWordScreen} options={{ headerShown: false }}/>
            <MainStack.Screen name="Gender" component={GenderScreen} options={{ headerShown: false }}/>
            <MainStack.Screen name="BirthDate" component={BirthdateScreen} options={{ headerShown: false }}/>
            <MainStack.Screen name="Email" component={EmailScreen} options={{ headerShown: false }}/>
            <MainStack.Screen name="PhoneNumber" component={PhoneNumberScreen} options={{ headerShown: false }}/>
            <MainStack.Screen name="Confirmation" component={ConfirmationScreen} options={{ headerShown: false }}/>
            <MainStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }}/>
            <MainStack.Screen name="NewPassword" component={NewPasswordScreen} options={{ headerShown: false }}/>
            <MainStack.Screen name="LogInLoading" component={LogInLoading} options={{ headerShown: false }}/>
            <MainStack.Screen name ={MainScreens.Main} component={MainTabNavigator}/>
            <MainStack.Screen name="YNMember" component={YNMemberScreen} options={{ headerShown: false }}/>
            <MainStack.Screen name="Book" component={BookingStackNavigator} />
            <MainStack.Screen name={MainScreens.LogInfo} options={{headerShown:false}} component={LogInformationStackNavigator}/>
            <MainStack.Screen name="Membership" component={MembershipStackNavigator} />
            <MainStack.Screen name="MembershipPurchase1" component={MembershipPurchaseNavigator}/>
            <MainStack.Screen name={MainScreens.BookingHistory} component={BookingHistoryStackNavigator}/>
            <MainStack.Screen name={MainScreens.PT} component={PTStackNavigator} /> 
            <MainStack.Screen name={MainScreens.MineMembership} component={MMStackNavigator}/>
        </MainStack.Navigator>
    </NavigationContainer>
    );
}

const BookingStackNavigator: React.FunctionComponent = () => {
    return (
            <BookingStack.Navigator screenOptions={{ headerShown : true }}>
                <BookingStack.Screen name="RoomSelect" component={RoomSelectScreen}/>
                <BookingStack.Screen name="RoomADetail" component={RoomADetailScreen}/>
                <BookingStack.Screen name="RoomBDetail" component={RoomBDetailScreen}/>
                <BookingStack.Screen name="RoomCDetail" component={RoomCDetailScreen}/>
                <BookingStack.Screen name="Booking" component={BookingScreen}/>
                <BookingStack.Screen name="BookedInfo" component={BookedInfoScreen}/>
                <BookingStack.Screen name="BookingPayment" component={BookingPayment}/> 
                <BookingStack.Screen name={BookingScreens.BookingPaymentResult} component={BookingPaymentResult}/> 
            </BookingStack.Navigator>
    );
};


const MembershipStackNavigator: React.FunctionComponent = () => {
    return (
            <MembershipStack.Navigator screenOptions={{ headerShown : true }}>
                <MembershipStack.Screen name={MembershipScreens.MembershipRoomSelect} component={MembershipRoomSelectScreen}/>
                <MembershipStack.Screen name={MembershipScreens.MembershipRoomADetail} component={MembershipRoomADetailScreen}/>
                <MembershipStack.Screen name={MembershipScreens.MembershipRoomBDetail} component={MembershipRoomBDetailScreen}/>
                <MembershipStack.Screen name={MembershipScreens.MembershipRoomCDetail} component={MembershipRoomCDetailScreen}/>
                <MembershipStack.Screen name={MembershipScreens.MembershipBooking} component={MembershipBookScreen}/>
                <MembershipStack.Screen name={MembershipScreens.MembershipBookedInfo} component={MembershipBookedInfoScreen}/>
            </MembershipStack.Navigator>
    );
};

const MembershipPurchaseNavigator: React.FunctionComponent = () => {
    return (
            <MembershipPurchase.Navigator screenOptions={{ headerShown : true }}>
                <MembershipPurchase.Screen name={MembershipPurchaseScreens.MembershipPurchase} component={MembershipPurchaseScreen}/>
                <MembershipPurchase.Screen name={MembershipPurchaseScreens.MembershipPayment} component={MembershipPayment}/>
                <MembershipPurchase.Screen name={MembershipPurchaseScreens.MembershipPaymentResult} component={MembershipPaymentResult}/> 
            </MembershipPurchase.Navigator>
    );
};

const PTStackNavigator: React.FunctionComponent = () => {
    return (
            <PTStack.Navigator screenOptions={{ headerShown : true }}>
                <PTStack.Screen name={PTScreens.PTProfile} component={PTProfileScreen}/>
                <PTStack.Screen name={PTScreens.PayPT} component={PayPTScreen} options={{ headerShown : false }}/>
                <PTStack.Screen name={PTScreens.PaymentTest} component={PaymentTest}/>
                <PTStack.Screen name={PTScreens.Payment} component={Payment}/>
                <PTStack.Screen name={PTScreens.PaymentResult} component={PaymentResult}/> 
            </PTStack.Navigator>
    );
};

const BookingHistoryStackNavigator: React.FunctionComponent = () => {
    return (
            <HistoryStack.Navigator screenOptions={{ headerShown : true }}>
                <HistoryStack.Screen name={HistoryScreens.History} component={BookingHistory}/>
                <HistoryStack.Screen name={HistoryScreens.Review} component={ReviewScreen}/>
            </HistoryStack.Navigator>
    );
}

const MMStackNavigator: React.FunctionComponent = () => {
    return (
            <MMStack.Navigator screenOptions={{ headerShown : true }}>
                <MMStack.Screen name={MMScreens.MyMembership} component={MyMembershipScreen}/>
                <MMStack.Screen name={MMScreens.PTReview} component={PTReviewScreen}/> 
            </MMStack.Navigator>
    );
};

const LogInformationStackNavigator: React.FunctionComponent = () => {
    return (
            <LogInformationStack.Navigator screenOptions={{ headerShown : true }}>
                <LogInformationStack.Screen name={LogInformationScreens.LogInformation} component={LogInformationScreen}/>
                <LogInformationStack.Screen name={LogInformationScreens.UsingRule} component={UsingRuleScreen}/>
            </LogInformationStack.Navigator>
    );
}


export default MainStackNavigator;