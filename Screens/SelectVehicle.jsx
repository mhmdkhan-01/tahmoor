import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Image,
  TextInput,
} from 'react-native';
import React, { useEffect, useState, version } from 'react';
import db from '../Data/Database';

const SelectVehicle = ({ navigation }) => {
  const [vehicles, setVehicles] = useState();
  const [isShown, setShown] = useState(false);
  const [type, setType] = useState('Bike');
  const [vehicleName, setVehicleName] = useState();
  const images = {
    Bike: require('../images/bike.png'),
    Car: require('../images/car.png'),
  };
  useEffect(() => {
    db.getVehicles(v => {
      setVehicles(v);
    });
  }, []);

  const saveVehicle = () => {
    if (!vehicleName) return;
    db.addVehicle(vehicleName, type, 0, v => {
      setVehicles(v);
      setShown(false);
    });
  };
  const modal = () => {
    return (
      <Modal transparent visible={isShown}>
        <View style={style.modalInner}>
          <View style={style.modalContent}>
            <Text style={style.inplbl}>Vehicle Type</Text>
            <View style={style.radios}>
              <Pressable
                style={type == 'Bike' ? style.selectedRadio : style.radio}
                onPress={() => setType('Bike')}
              >
                <Image
                  source={require('../images/bike.png')}
                  style={style.img}
                />
                <Text
                  style={
                    type == 'Bike' ? style.selectedRadiotxt : style.radiotxt
                  }
                >
                  Bike
                </Text>
              </Pressable>
              <Pressable
                style={type != 'Bike' ? style.selectedRadio : style.radio}
                onPress={() => setType('Car')}
              >
                <Image
                  source={require('../images/car.png')}
                  style={style.img}
                />
                <Text
                  style={
                    type != 'Bike' ? style.selectedRadiotxt : style.radiotxt
                  }
                >
                  Car
                </Text>
              </Pressable>
            </View>
            <View style={style.inpcontainer}>
              <Text style={style.inplbl}>Vehicle Name</Text>
              <TextInput
                style={style.input}
                placeholder="e.g Honda 125"
                onChangeText={setVehicleName}
              />
            </View>
            <View style={style.meterbg}>
              <View style={style.meter}>
                <View style={style.meterUnit}>
                  <Text style={style.meterTxt}>0</Text>
                </View>
                <View style={style.meterUnit}>
                  <Text style={style.meterTxt}>0</Text>
                </View>
                <View style={style.meterUnit}>
                  <Text style={style.meterTxt}>0</Text>
                </View>
                <View style={style.meterUnit}>
                  <Text style={style.meterTxt}>0</Text>
                </View>
                <View style={style.meterUnit}>
                  <Text style={style.meterTxt}>0</Text>
                </View>
                <View style={style.meterUnit}>
                  <Text style={style.meterTxt}>0</Text>
                </View>
              </View>
              <Text>KM</Text>
            </View>
            <Pressable style={style.saveBtn} onPress={saveVehicle}>
              <Text style={style.saveBtnTxt}>Save Vehicle</Text>
            </Pressable>
            <Pressable
              onPress={() => setShown(false)}
              style={[
                style.saveBtn,
                {
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: '#491080',
                },
              ]}
            >
              <Text style={[style.saveBtnTxt, { color: '#491080' }]}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };
  if (!vehicles || vehicles.length < 1) {
    return (
      <View style={style.noDataView}>
        <Text style={style.noDataText}>No Vehicle Added Yet, Add New</Text>

        <Pressable style={style.addNewBtn} onPress={() => setShown(true)}>
          <Text style={style.addBtnTxt}>Add New</Text>
        </Pressable>
        {modal()}
      </View>
    );
  }
  return (
    <View style={style.mainScreen}>
      {vehicles.map((vehicle, index) => {
        return (
          <Pressable
            key={index}
            style={style.carTile}
            onPress={() =>
              navigation.replace('Home', {
                sv: vehicle,
                vhs: vehicles,
              })
            }
          >
            <Image source={images[vehicle.TYPE]} style={style.carimg} />
            <View style={style.carDetails}>
              <Text style={style.carName}>{vehicle.NAME}</Text>
              <Text style={style.carReading}>{vehicle.CURRENT_READING} KM</Text>
            </View>
          </Pressable>
        );
      })}
      <Pressable
        style={[style.addNewBtn, { marginTop: 'auto', marginBottom: 30 }]}
        onPress={() => setShown(true)}
      >
        <Text style={style.addBtnTxt}>Add New</Text>
      </Pressable>
      {modal()}
    </View>
  );
};

const style = StyleSheet.create({
  noDataView: {
    flex: 1,
    backgroundColor: '#F7F3FF', // Light background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#241536', // Dark text heading color
    textAlign: 'center',
    marginBottom: 20,
  },
  addNewBtn: {
    backgroundColor: '#491080', // Primary purple button
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Android shadow
    shadowColor: '#491080', // iOS shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  addBtnTxt: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  }, // Modal Background & Container
  modalInner: {
    flex: 1,
    backgroundColor: 'rgba(36, 21, 54, 0.4)', // Dimmed overlay
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  // Inner White Card Content
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E3D7F7',
    elevation: 5,
    shadowColor: '#491080',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },

  // Input Labels
  inplbl: {
    fontSize: 15,
    fontWeight: '700',
    color: '#241536',
    marginBottom: 10,
  },

  // Radio Buttons Container
  radios: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F3FF', // Light state
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E3D7F7',
  },
  // Apply this inline or dynamically for active item: backgroundColor: '#491080'
  radioActive: {
    backgroundColor: '#491080',
    borderColor: '#491080',
  },
  img: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: 'contain',
  },
  radiotxt: {
    fontSize: 14,
    fontWeight: '600',
    color: '#491080',
  },
  radiotxtActive: {
    color: '#FFFFFF',
  },

  // TextInput Styles
  inpcontainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3D7F7',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#241536',
  },

  // Digital Odometer Styles
  meterbg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7F3FF',
    borderRadius: 16,
    padding: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E3D7F7',
  },
  meter: {
    flexDirection: 'row',
    backgroundColor: '#1E1433',
    padding: 4,
    borderRadius: 8,
  },
  meterUnit: {
    backgroundColor: '#2A1D45',
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginHorizontal: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#423069',
  },
  meterTxt: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  kmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#241536',
    marginRight: 8,
  },

  // Action Button
  saveBtn: {
    backgroundColor: '#491080',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#491080',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    marginBottom: 10,
  },
  saveBtnTxt: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  selectedRadio: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#491080', // Primary purple background when selected
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#491080',
    elevation: 2, // Slight elevation shadow for selected item
    shadowColor: '#491080',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedRadiotxt: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF', // White text when selected
  },
  mainScreen: {
    flex: 1,
    backgroundColor: '#F7F3FF',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  carTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E3D7F7',
    elevation: 2,
    shadowColor: '#491080',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  carimg: {
    width: 65,
    height: 45,
    resizeMode: 'contain',
    marginRight: 16,
  },
  carDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  carName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#241536',
    marginBottom: 4,
  },
  carReading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7627C9',
  },
});

export default SelectVehicle;
