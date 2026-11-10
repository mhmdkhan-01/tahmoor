import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import React from 'react';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const AddPetrol = ({ navigation, route }) => {
  const { vehicle } = route.params;
  const images = {
    Bike: require('../images/bike.png'),
    Car: require('../images/car.png'),
  };
  const currentReading = String(vehicle.CURRENT_READING)
    .padStart(6, '0')
    .split('');
  console.log(vehicle);
  return (
    <View style={style.mainScreen}>
      <View style={style.vehicleCard}>
        <Image
          source={images[vehicle.TYPE]}
          style={{ height: 60, width: 60 }}
        />
        <Text style={style.vehicleName}>{vehicle.NAME}</Text>
      </View>
      <View>
        <Text style={style.sectionHeader}>Current Meter Reading</Text>
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
        <View style={style.inpmaincont}>
          <Text style={style.inptlbl}>Petrol Amount</Text>
          <View style={style.inptrow}>
            <FontAwesome6 name="gas-pump" size={20} color="#491080" />
            <TextInput style={style.inptbx} />
            <Text style={style.inptUnit}>L</Text>
          </View>
        </View>
        <View style={style.inpmaincont}>
          <Text style={style.inptlbl}>Price Per Liter</Text>
          <View style={style.inptrow}>
            <FontAwesome6 name="dollar-sign" size={20} color="#491080" />
            <TextInput style={style.inptbx} />
            <Text style={style.inptUnit}>RS.</Text>
          </View>
        </View>
        <Pressable style={style.savebtn}>
          <Text style={style.savebtntxt}>Save Petrol</Text>
        </Pressable>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
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
    flexDirection: 'row',
    gap: 20,
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
  // Main Outer Container
  mainScreen: {
    flex: 1,
    backgroundColor: '#F7F3FF',
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Top Selected Vehicle Header Card
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9DCFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E3D7F7',
  },
  vehicleImg: {
    height: 45,
    width: 65,
    resizeMode: 'contain',
    marginRight: 12,
  },
  vehicleName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#241536',
  },

  // Section Label ("Current Meter Reading")
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#241536',
    marginBottom: 10,
  },

  // Input Field Outer Container
  inpmaincont: {
    marginTop: 16,
  },

  // Input Field Label ("Petrol Amount" / "Price Per Liter")
  inptlbl: {
    fontSize: 15,
    fontWeight: '700',
    color: '#241536',
    marginBottom: 8,
  },

  // Rounded Input Bar Row Container
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

  // Main Text Input Area
  inptbx: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#241536',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  // Unit Text on the Right side ("L" / "Rs.")
  inptUnit: {
    fontSize: 16,
    fontWeight: '700',
    color: '#241536',
    marginLeft: 8,
  },

  // Save Petrol Button
  savebtn: {
    backgroundColor: '#491080',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 16,
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

export default AddPetrol;
