import AntDesign from '@expo/vector-icons/AntDesign';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

interface ModalMediaViewerProps {
  visible: boolean;
  onClose: () => void;
  uri: string;
  type: 'image' | 'video';
}

export default function ModalMediaViewer({ visible, onClose, uri, type }: ModalMediaViewerProps) {
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
      transparent={true}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <AntDesign name="close" size={30} color="#fff" />
        </TouchableOpacity>
        <View style={styles.content}>
          {type === 'image' ? (
            <Image
              source={{ uri }}
              style={styles.media}
              contentFit="contain"
              placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
            />
          ) : (
            <VideoComponent uri={uri} />
          )}
        </View>
      </View>
    </Modal>
  );
}

function VideoComponent({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.play();
  });

  return (
    <VideoView
      key={`${uri}-modal`}
      style={styles.media}
      player={player}
      allowsPictureInPicture
      fullscreenOptions={{ enable: true }}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  media: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
  },
});
