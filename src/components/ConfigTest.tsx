import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { supabase } from '../config/supabase';
import { pickImage, uploadToCloudinary } from '../utils/media';

export const ConfigTest = () => {
  const [supabaseStatus, setSupabaseStatus] = useState<string>('Not tested');
  const [cloudinaryStatus, setCloudinaryStatus] = useState<string>('Not tested');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const testSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('count')
        .limit(1);
      
      if (error) throw error;
      setSupabaseStatus('Connected successfully');
    } catch (error) {
      console.error('Supabase test error:', error);
      setSupabaseStatus('Connection failed');
    }
  };

  const testCloudinary = async () => {
    try {
      const image = await pickImage();
      if (!image) {
        setCloudinaryStatus('Image selection cancelled');
        return;
      }

      const result = await uploadToCloudinary(image.uri);
      setImageUrl(result.url);
      setCloudinaryStatus('Upload successful');
    } catch (error) {
      console.error('Cloudinary test error:', error);
      setCloudinaryStatus('Upload failed');
    }
  };

  useEffect(() => {
    testSupabase();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuration Test</Text>
      
      <View style={styles.statusContainer}>
        <Text>Supabase Status: {supabaseStatus}</Text>
        <TouchableOpacity style={styles.button} onPress={testSupabase}>
          <Text style={styles.buttonText}>Test Supabase</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusContainer}>
        <Text>Cloudinary Status: {cloudinaryStatus}</Text>
        <TouchableOpacity style={styles.button} onPress={testCloudinary}>
          <Text style={styles.buttonText}>Test Cloudinary</Text>
        </TouchableOpacity>
      </View>

      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statusContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
});
