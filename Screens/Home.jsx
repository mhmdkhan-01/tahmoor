import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Feather from 'react-native-vector-icons/Feather';
import db from '../Data/Database';
const Home = ({ navigation, route }) => {
  const { sv, vhs } = route.params;
  const [selectedVehicle, setSelectedVehicle] = useState(sv);
  const [vehicles, setVehicles] = useState(vhs);
  const [petrolLogs, setPetrolLogs] = useState();
  const [initReading, setinitreading] = useState();
  const totalPetrol = calculateTotalPetrol();
  const currentReading = String(selectedVehicle.CURRENT_READING)
    .padStart(6, '0')
    .split('');

  function calculateTotalPetrol() {
    if (!petrolLogs) return 0;
    let t = 0;
    for (let i = 0; i < petrolLogs.length; i++) {
      t += petrolLogs.LITERS;
    }
    return t;
  }
  const show = selectedVehicle.CURRENT_READING == 0;
  const [isShown, setIsShown] = useState(show);

  useEffect(() => {
    db.getPetrolLog(selectedVehicle.ID, pl => {
      setPetrolLogs(pl);
    });
  }, []);

  const saveInitialReading = () => {
    db.saveInitialReading(selectedVehicle.ID, initReading, () => {
      db.getVehicles(vhs => {
        setVehicles(vhs);
        const selveh = vhs.filter(v => v.ID == selectedVehicle.ID);
        setSelectedVehicle(selveh);
        setIsShown(false);
      });
    });
  };
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#F7F3FF' }}>
      <Dropdown
        style={style.dropdown}
        containerStyle={style.dropdownContainer}
        placeholderStyle={style.placeholderStyle}
        selectedTextStyle={style.selectedTextStyle}
        itemTextStyle={style.itemTextStyle}
        activeColor="#E9DCFF"
        data={vehicles}
        labelField="NAME"
        valueField="ID"
        value={selectedVehicle}
        onChange={item => setSelectedVehicle(item)}
      />
      <View style={style.meterbg}>
        <View style={style.meter}>
          {currentReading.map((i, index) => {
            return (
              <View style={style.meterUnit} key={index}>
                <Text style={style.meterTxt}>{i}</Text>
              </View>
            );
          })}
        </View>
        <Text style={style.kmText}>km</Text>
      </View>
      <Text
        style={{
          textAlign: 'center',
          marginVertical: 10,
          fontWeight: 'bold',
          fontSize: 16,
        }}
      >
        Current Reading
      </Text>
      <View style={style.mileagebg}>
        <FontAwesome6 name="gas-pump" size={20} color="#491080" />
        <View style={style.mileagetxtcont}>
          <Text style={style.mileagelbl}>Mileage</Text>
          <Text style={style.mileagetxt}>
            {' '}
            {petrolLogs
              ? petrolLogs.MILEAGE
                ? petrolLogs.MILEAGE
                : '0'
              : 'Loading...'}{' '}
            KM/L
          </Text>
        </View>
      </View>
      <View style={style.costpetrolbg}>
        <View style={style.detailbox}>
          <View style={style.detailtop}>
            <FontAwesome6 name="droplet" size={20} color="#F5B942" />
            <Text style={style.detaillbl}>Total Petrol</Text>
          </View>
          <Text style={style.detailtxt}>{totalPetrol} L</Text>
        </View>
        <View style={style.detailbox}>
          <View style={style.detailtop}>
            <FontAwesome6 name="dollar-sign" size={20} color="#7627C9" />
            <Text style={style.detaillbl}>Total Cost</Text>
          </View>
          <Text style={style.detailtxt}>
            RS.
            {petrolLogs ? petrolLogs.TOTAL_COST ?? '0' : 'Loading...'}
          </Text>
        </View>
      </View>
      <View style={style.btnsrow}>
        <Pressable
          style={style.btn}
          onPress={() =>
            navigation.navigate('AddPetrol', { vehicle: selectedVehicle })
          }
        >
          <FontAwesome6 name="gas-pump" size={20} color="#FFFFFF" />
          <Text style={style.btntxt}>Add Petrol</Text>
        </Pressable>
        <Pressable
          style={style.btn}
          onPress={() => {
            navigation.navigate('AddOilChange', { vehicle: selectedVehicle });
          }}
        >
          <Feather name="tool" size={20} color="#FFFFFF" />
          <Text style={style.btntxt}>Add Oil Change</Text>
        </Pressable>
      </View>
      <Modal visible={isShown} transparent animationType="fade">
        <View style={style.modalOverlay}>
          <View style={style.modalinner}>
            <Text style={style.modallbl}>
              Please Enter Initial (Current) Reading
            </Text>
            <TextInput
              style={style.modalInput}
              onChangeText={setinitreading}
              placeholder="045732"
              placeholderTextColor="#6A5683"
              keyboardType="numeric"
            />
            <Pressable
              style={style.saveinitialreadingbtn}
              onPress={() => {
                saveInitialReading();
              }}
            >
              <Text style={style.saveinitialreadingbtntxt}>Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const style = StyleSheet.create({
  // Main Outer Card Container (Rounded slate/lavender background)
  meterbg: {
    backgroundColor: '#C8BDD4', // Outer frame color matching mockup
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BBAEC9',
    elevation: 4,
    shadowColor: '#491080',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  // Inner Dark Framed Box
  meter: {
    flexDirection: 'row',
    backgroundColor: '#161B22', // Dark metallic bezel
    borderRadius: 12,
    padding: 6,
    borderWidth: 3,
    borderColor: '#484F58',
  },

  // Individual Digit Reel Tile
  meterUnit: {
    backgroundColor: '#0D1117', // Dark slot background
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginHorizontal: 1.5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#21262D',
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Odometer Number Text
  meterTxt: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'monospace', // Gives authentic digital/mechanical look
  },

  // Centered "km" Text Below Meter
  kmText: {
    marginTop: 8,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  // Outer Card Container (Light lavender card)
  mileagebg: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9DCFF', // Light lavender background
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E3D7F7',
  },

  // Text Container Stacked Next to Icon
  mileagetxtcont: {
    marginLeft: 16,
    justifyContent: 'center',
  },

  // "Mileage" Label Text
  mileagelbl: {
    fontSize: 14,
    fontWeight: '600',
    color: '#241536', // Dark text heading
    marginBottom: 2,
  },

  // Mileage Value Text (e.g. 16.8 km/L)
  mileagetxt: {
    fontSize: 22,
    fontWeight: '800',
    color: '#241536',
  },
  costpetrolbg: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  // Individual White Card (48% width each)
  detailbox: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E3D7F7',
    elevation: 2,
    shadowColor: '#491080',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  // Header row inside card (Icon + Label side-by-side)
  detailtop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  // "Total Petrol" / "Total Cost" Label
  detaillbl: {
    fontSize: 13,
    fontWeight: '600',
    color: '#241536',
    marginLeft: 6,
  },

  // Large Bold Value Text (e.g. 35.0 L / Rs. 6,650)
  detailtxt: {
    fontSize: 18,
    fontWeight: '800',
    color: '#241536',
  },
  // Container row holding both action buttons
  btnsrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 16,
  },

  // Individual action button (48% width)
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    backgroundColor: '#491080', // Primary purple
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    elevation: 3, // Android shadow
    shadowColor: '#491080', // iOS shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  // Button text next to icon
  btntxt: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  // Main Dropdown Container Pill
  dropdown: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E3D7F7',
    marginBottom: 16,
    elevation: 3, // Android shadow
    shadowColor: '#491080', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  // Dropdown Menu Overlay / Items Container
  dropdownContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderColor: '#E3D7F7',
    borderWidth: 1,
    marginTop: 4,
    overflow: 'hidden',
  },

  // Text Style for Currently Selected Vehicle Name
  selectedTextStyle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#241536',
  },

  // Placeholder Text Style (fallback)
  placeholderStyle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6A5683',
  },

  // Text Style for Options Inside Menu List
  itemTextStyle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#241536',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(36, 21, 54, 0.5)', // Dimmed dark purple overlay
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  // Main white modal card container
  modalinner: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3D7F7',
    elevation: 5, // Android shadow
    shadowColor: '#491080', // iOS shadow
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },

  // Label text at top of modal
  modallbl: {
    fontSize: 16,
    fontWeight: '700',
    color: '#241536',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },

  // Number input box
  modalInput: {
    width: '100%',
    backgroundColor: '#F7F3FF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3D7F7',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: '600',
    color: '#241536',
    textAlign: 'center',
    fontFamily: 'monospace', // Gives reading input an odometer look
    marginBottom: 20,
  },

  // Save action button
  saveinitialreadingbtn: {
    width: '100%',
    backgroundColor: '#491080', // Primary purple
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#491080',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  // Save button text
  saveinitialreadingbtntxt: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
export default Home;
