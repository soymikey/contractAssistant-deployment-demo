import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PhotoPreviewStripProps {
  photos: string[];
  onRemove: (index: number) => void;
  onPreview?: (index: number) => void;
}

export const PhotoPreviewStrip: React.FC<PhotoPreviewStripProps> = ({
  photos,
  onRemove,
  onPreview,
}) => {
  if (photos.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {photos.map((uri, index) => (
          <View key={`${uri}-${index}`} style={styles.thumbnailContainer}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => onPreview?.(index)}>
              <Image source={{ uri }} style={styles.thumbnail} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemove(index)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 12,
  },
  thumbnailContainer: {
    width: 70,
    height: 70,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
});
