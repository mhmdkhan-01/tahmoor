import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import db from '../Data/Database';

const History = ({ navigation, route }) => {
  const { vehicle } = route.params;
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (vehicle?.ID) {
      db.getAllLogs(vehicle.ID, combinedLogs => {
        setLogs(combinedLogs);
      });
    }
  }, [vehicle?.ID]);

  const renderLogItem = ({ item }) => {
    if (item.type === 'PETROL') {
      return (
        <View style={style.card}>
          <View style={style.cardLeft}>
            <View style={style.iconContainer}>
              <FontAwesome6 name="gas-pump" size={24} color="#F5B942" />
            </View>
            <View style={style.textContainer}>
              <Text style={style.title}>Petrol Added</Text>
              <Text style={style.subtext}>
                {Number(item.LITERS).toFixed(1)} L • Rs.{' '}
                {Number(item.TOTAL_COST).toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={style.cardRight}>
            <Text style={style.dateText}>{item.DATE}</Text>
            <Text style={style.readingText}>
              @ {Number(item.CURRENT_READING).toLocaleString()} km
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={style.card}>
          <View style={style.cardLeft}>
            <View style={style.iconContainer}>
              <FontAwesome6 name="wrench" size={22} color="#491080" />
            </View>
            <View style={style.textContainer}>
              <Text style={style.title}>Oil Change</Text>
              <Text style={style.subtext}>
                Next: {Number(item.NEXT_DUE_READING).toLocaleString()} km
              </Text>
            </View>
          </View>
          <View style={style.cardRight}>
            <Text style={style.dateText}>{item.DATE}</Text>
          </View>
        </View>
      );
    }
  };

  return (
    <View style={style.container}>
      <FlatList
        data={logs}
        keyExtractor={(item, index) => item.type + '_' + item.ID + '_' + index}
        renderItem={renderLogItem}
        contentContainerStyle={style.listPadding}
        ListEmptyComponent={
          <View style={style.emptyContainer}>
            <Text style={style.emptyText}>No history available</Text>
          </View>
        }
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3FF',
  },
  listPadding: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E3D7F7',
    elevation: 2,
    shadowColor: '#491080',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A0B2E',
    marginBottom: 2,
  },
  subtext: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A5683',
  },
  cardRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A0B2E',
    marginBottom: 2,
  },
  readingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A5683',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6A5683',
  },
});

export default History;
