import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  if (isUser) {
    return (
      <View style={styles.userWrapper}>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message.text}</Text>
          <View style={styles.userMeta}>
            <Text style={styles.userTime}>{message.status || `Read ${message.time}`}</Text>
          </View>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.aiWrapper}>
      <View style={styles.aiAvatar}>
        <Text style={styles.aiAvatarIcon}>⚡</Text>
      </View>
      <View style={styles.aiBubble}>
        <View style={styles.shimmerLine} />
        {message.highlightText ? (
          <Text style={styles.aiText}>
            {message.textBefore}
            <Text style={styles.highlightedText}>{message.highlightText}</Text>
            {message.textAfter}
          </Text>
        ) : (
          <Text style={styles.aiText}>{message.text}</Text>
        )}
        {message.metrics && (
          <View style={styles.metricsCard}>
            <View style={styles.metricsHeader}>
              <Text style={styles.metricsHeaderIcon}>✨</Text>
              <Text style={styles.metricsTitle}>Key Performance Metrics</Text>
            </View>
            <View style={styles.metricsGrid}>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>LATENT DELAY</Text>
                <Text style={[styles.metricValue, styles.cyanText]}>{message.metrics.latentDelay || '-42%'}</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>CREATIVE THROUGHPUT</Text>
                <Text style={[styles.metricValue, styles.purpleText]}>{message.metrics.throughput || '+120%'}</Text>
              </View>
            </View>
          </View>
        )}
        {message.secondaryText && (
          <Text style={[styles.aiText, styles.secondarySpacing]}>{message.secondaryText}</Text>
        )}
      </View>
    </View>
  );
};
export default MessageBubble;
const styles = StyleSheet.create({
  userWrapper: {
    width: '100%',
    alignItems: 'flex-end',
    marginVertical: 6,
  },
  userBubble: {
    maxWidth: '82%',
    backgroundColor: '#531394',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 18,
    borderTopRightRadius: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  userText: {
    color: '#dae2fd',
    fontSize: 15,
    lineHeight: 22,
  },
  userMeta: {
    alignItems: 'flex-end',
    marginTop: 6,
  },
  userTime: {
    fontSize: 10,
    color: 'rgba(214, 169, 255, 0.7)',
    fontWeight: '500',
  },

  aiWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginVertical: 8,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#c0c1ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#c0c1ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  aiAvatarIcon: {
    fontSize: 16,
  },
  aiBubble: {
    flex: 1,
    maxWidth: '85%',
    backgroundColor: 'rgba(23, 31, 51, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(192, 193, 255, 0.15)',
    borderRadius: 18,
    borderTopLeftRadius: 2,
    paddingHorizontal: 16,
    paddingVertical: 14,
    overflow: 'hidden',
  },
  shimmerLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#c0c1ff',
    opacity: 0.4,
  },
  aiText: {
    color: '#dae2fd',
    fontSize: 15,
    lineHeight: 22,
  },
  highlightedText: {
    color: '#4cd7f6',
    fontWeight: '700',
    fontStyle: 'italic',
  },
  metricsCard: {
    backgroundColor: 'rgba(6, 14, 32, 0.85)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    marginTop: 12,
  },
  metricsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  metricsHeaderIcon: {
    fontSize: 14,
  },
  metricsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#c0c1ff',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  metricBox: {
    flex: 1,
    backgroundColor: 'rgba(49, 57, 77, 0.3)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#908fa0',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 14,
  },
  actionBtn: {
    padding: 2,
  },
  actionIcon: {
    fontSize: 15,
    color: '#908fa0',
  },
  aiTime: {
    fontSize: 10,
    color: '#908fa0',
  },
  cyanText: {
    color: '#4cd7f6',
  },
  purpleText: {
    color: '#c0c1ff',
  },
  secondarySpacing: {
    marginTop: 10,
  },
  pinkText: {
    color: '#ffb4ab',
  },
});
