import React,{useEffect, useState} from 'react';
import IMP from 'iamport-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loading from '../Loading';
import { BookingScreens, BookingStackParamList } from '../stacks/Navigator';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const BASE_URL = "http://172.30.1.15:8080"
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const BookingPayment = ({ navigation, route }) => {

    const [selectedUsingTimeSlot, setSelectedUsingTimeSlot] = useState(null);
    const [selectedDateSlot, setSelectedDateSlot] = useState(null);
    const [isMorning, setIsMorning] = useState(false);
    const [isEvening, setIsEvening] = useState(false);
    const [selectedDayTimeSlot, setSelectedDayTimeSlot] = useState(null);
    const [selectedNightTimeSlot, setSelectedNightTimeSlot] = useState(null);
    const [selectedRoomSlot, setSelectedRoomSlot] = useState(null);
    const [selectedEndTime, setSelectedEndTime] = useState(null);

    const loadData = async () => {
    try {
        const data = await AsyncStorage.getItem('bookingData');
        if (data) {
        const parsedData = JSON.parse(data);
        setSelectedUsingTimeSlot(parsedData.selectedUsingTimeSlot);
        setIsMorning(parsedData.isMorning);
        setIsEvening(parsedData.isEvening);
        setSelectedDayTimeSlot(parsedData.selectedDayTimeSlot);
        setSelectedNightTimeSlot(parsedData.selectedNightTimeSlot);
        setSelectedEndTime(parsedData.selectedEndTime);
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
    };

    useEffect(() => {
        loadData();
    }, []);

      // contains order history information
const params = route.params; // route.params에서 params 직접 가져오기
console.log(params);

const fetchUpdatedPaymentRequest = async (merchantUid) => {
    try {
        await delay(1000); // 나중에 변경합시다.
        const response = await axios.get(
        `${BASE_URL}/payment/requests/${merchantUid}`
        );
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('결제 요청을 업데이트하는 데 실패했습니다.');
    }
};

const handlePaymentComplete = async (response) => {
    try {
        const merchantUid = response.merchant_uid;
        const paymentRequest = await fetchUpdatedPaymentRequest(merchantUid);
        const amount = paymentRequest[0].amount
        console.log(paymentRequest[0].state);

        if (paymentRequest[0].state === 'paid') {
        await handleSubmit(merchantUid, amount);
        console.log(paymentRequest[0].state);
        navigation.replace(BookingScreens.BookingPaymentResult, response);
        } else {
        navigation.replace(BookingScreens.BookingPaymentResult, response);
        }
    } catch (error) {
        console.error(error.response);
    }
};

// 결제 요청 데이터를 가져오기 위한 새로운 함수 생성

const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        const fetchSelectedRoomNumber = async () => {
        try {
            const roomNumber = await AsyncStorage.getItem('selectedRoomNumber');
            setSelectedRoomNumber(roomNumber);
        } catch (error) {
            console.log('Error fetching selected room number from AsyncStorage:', error);
        }
        };

        fetchSelectedRoomNumber();
    }, []);
    
    useEffect(() => {
        const fetchSelectedDate = async () => {
        try {
            const savedDate = await AsyncStorage.getItem('selectedDateSlot');
            setSelectedDate(savedDate || '');
        } catch (error) {
            console.error('Failed to fetch selected date:', error);
        }
        };

        fetchSelectedDate();
}, []);


////////////////////////////////////////////////////////////////  
const handleSubmit = async (merchantUid, amount) => {
    try {
        const logId = await AsyncStorage.getItem('logId');

        let startTime, endTime;

        if (isMorning && selectedDayTimeSlot) {
            startTime = selectedDayTimeSlot;
            endTime = selectedEndTime;
            } else if (isEvening && selectedNightTimeSlot) {
            startTime = selectedNightTimeSlot;
            endTime = selectedEndTime;
            } else {
            return; // 시간 슬롯이 올바르게 선택되지 않은 경우 처리
            }

    await axios.post(`${BASE_URL}/reservation`, {
        room: selectedRoomNumber,
        date: selectedDate,
        startTime: startTime,
        endTime: endTime,
        usingTime: selectedUsingTimeSlot,
        logId: logId,
        merchantUid: merchantUid,
        amount: amount,
        });

        console.log('Reservation created successfully');
    // 응답에 대한 처리
    } catch (error) {
        console.error(error);
    }
};

    return (
        <SafeAreaView style={{ flex: 1, marginTop: -35 }}>
        <IMP.Payment
            userCode="imp11480521"
            loading={<Loading />}
            data={params}
            callback={handlePaymentComplete} // handlePaymentComplete 함수로 변경
        />
        </SafeAreaView>
    )
}

export default BookingPayment