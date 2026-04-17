import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export const CountdownTimer = () => {
  const [secs, setSecs] = useState(8120);

  useEffect(() => {
    const id = setInterval(() => setSecs(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const h = String(Math.floor(secs / 3600)).padStart(2, '0');
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 }}>
      <Ionicons name="flash" size={14} color={COLORS.secondary} />
      <Text style={{ color: 'white', fontWeight: '800', fontSize: 13 }}>{h}:{m}:{s}</Text>
    </View>
  );
};
