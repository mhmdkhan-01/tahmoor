import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import db from '../Data/Database';

const AddOilChange = ({ navigation, route }) => {
  const { vehicle, onReturn } = route.params;

  const [date, setDate] = useState('');
  const [intervalKm, setIntervalKm] = useState('5000');
  const [nextDueReading, setNextDueReading] = useState(0);

  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    setDate(`${day}-${month}-${year}`);
  }, []);

  useEffect(() => {
    const currentReading = Number(vehicle?.CURRENT_READING) || 0;
    const interval = Number(intervalKm) || 0;
    setNextDueReading(currentReading + interval);
  }, [intervalKm, vehicle?.CURRENT_READING]);

  const handleSave = () => {
    if (!intervalKm || Number(intervalKm) <= 0) return;

    db.addOilLog(vehicle.ID, date, vehicle.CURRENT_READING, intervalKm, () => {
      onReturn();
      navigation.goBack();
    });
  };

  return (
    <ScrollView style={style.container}>
      <View style={style.bannerCard}>
        <Feather
          name="tool"
          size={32}
          color="#491080"
          style={style.bannerIcon}
        />
        <View style={style.bannerTextContainer}>
          <Text style={style.bannerTitle}>Oil Change</Text>
          <Text style={style.bannerSubtitle}>Keep your engine healthy</Text>
        </View>
      </View>

      <View style={style.inpmaincont}>
        <Text style={style.inptlbl}>Date</Text>
        <View style={style.inptrow}>
          <Feather name="calendar" size={20} color="#491080" />
          <TextInput
            style={style.inptbx}
            value={date}
            onChangeText={setDate}
            placeholder="DD-MM-YYYY"
            placeholderTextColor="#6A5683"
          />
          <Feather name="calendar" size={20} color="#491080" />
        </View>
      </View>

      <View style={style.inpmaincont}>
        <Text style={style.inptlbl}>Next Oil Change After</Text>
        <View style={style.inptrow}>
          <FontAwesome6 name="money-bill-1" size={20} color="#491080" />
          <TextInput
            style={style.inptbx}
            value={intervalKm}
            onChangeText={setIntervalKm}
            keyboardType="numeric"
            placeholder="5000"
            placeholderTextColor="#6A5683"
          />
          <Text style={style.inptUnit}>kms</Text>
        </View>
      </View>

      <View style={style.infoCard}>
        <Feather name="info" size={24} color="#7627C9" style={style.infoIcon} />
        <Text style={style.infoText}>
          You will be notified when you reach{' '}
          <Text style={style.infoHighlight}>
            {nextDueReading.toLocaleString()} km
          </Text>
        </Text>
      </View>

      <Pressable style={style.savebtn} onPress={handleSave}>
        <Text style={style.savebtntxt}>Save</Text>
      </Pressable>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3FF',
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Banner Header Card
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9DCFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E3D7F7',
  },
  bannerIcon: {
    marginRight: 16,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#241536',
  },
  bannerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6A5683',
    marginTop: 2,
  },

  // Input Field Container
  inpmaincont: {
    marginBottom: 20,
  },
  inptlbl: {
    fontSize: 15,
    fontWeight: '700',
    color: '#241536',
    marginBottom: 8,
  },
  inptrow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E3D7F7',
    elevation: 2,
    shadowColor: '#491080',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  inptbx: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#241536',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inptUnit: {
    fontSize: 15,
    fontWeight: '700',
    color: '#241536',
    marginLeft: 8,
  },

  // Notification Info Alert Box
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9DCFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E3D7F7',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#241536',
    lineHeight: 20,
  },
  infoHighlight: {
    fontWeight: '800',
    color: '#241536',
  },

  // Action Button
  savebtn: {
    backgroundColor: '#491080',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#491080',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  savebtntxt: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AddOilChange;
