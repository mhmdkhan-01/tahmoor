import { View, Text } from 'react-native';
import React from 'react';

const AddOilChange = ({ navigation, route }) => {
  const { vehicle } = route.params;
  return (
    <View>
      <Text>AddOilChange</Text>
    </View>
  );
};

export default AddOilChange;
