import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

const CHIPS = [
  { id: '1', icon: '🎨', label: 'Generate Image' },
  { id: '2', icon: '💻', label: 'Refactor Python' },
  { id: '3', icon: '📄', label: 'Summarize PDF' },
  { id: '4', icon: '⚡', label: 'Optimize Latency' },
];

const SuggestionChips = ({ onSelectChip }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CHIPS.map((chip) => (
          <TouchableOpacity
            key={chip.id}
            style={styles.chip}
            onPress={() => onSelectChip?.(chip.label)}
            activeOpacity={0.7}
          >
            <Text style={styles.chipIcon}>{chip.icon}</Text>
            <Text style={styles.chipText}>{chip.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default SuggestionChips;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 31, 51, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(144, 143, 160, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  chipIcon: {
    fontSize: 14,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#c7c4d7',
  },
});
