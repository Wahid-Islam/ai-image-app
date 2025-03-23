"use client";

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';

export default function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(null);

  useEffect(() => {
    mobilenet.load().then(setModel);
  }, []);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !model) return;

    const imgUrl = URL.createObjectURL(file);
    setSelectedImage(imgUrl);
    setLoading(true);
    setPrediction('');

    const img = new Image();
    img.src = imgUrl;
    img.onload = async () => {
      const tensor = tf.browser.fromPixels(img);
      const predictions = await model.classify(tensor);
      setPrediction(predictions[0].className);
      setLoading(false);
    };
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 10,
        backgroundColor: '#31473A',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4, // Rounded container
        overflow: 'hidden',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          textAlign: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: 4,
          boxShadow: '0 4px 12px rgba(49,71,58,0.2)',
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom color="#31473A">
          📸 AI Image Classifier
        </Typography>

        <Box
          my={3}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="upload-button-file"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="upload-button-file">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
              sx={{
                bgcolor: 'rgba(49,71,58,0.8)',
                '&:hover': { bgcolor: 'rgba(49,71,58,0.9)' },
                backdropFilter: 'blur(8px)',
                color: '#EDF4F2',
                borderRadius: 2,
                px: 3,
                py: 1.5,
                textTransform: 'none',
              }}
            >
              Upload Image
            </Button>
          </label>
        </Box>

        {selectedImage && (
          <Box
            mt={3}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <img
              src={selectedImage}
              alt="Uploaded"
              width="100%"
              style={{ borderRadius: 8 }}
            />
          </Box>
        )}

        {loading && (
          <Box
            mt={3}
            sx={{
              borderRadius: 2,
              p: 2,
              backgroundColor: 'rgba(255,255,255,0.3)',
            }}
          >
            <CircularProgress sx={{ color: '#31473A' }} />
            <Typography variant="body1" mt={2} color="#31473A">
              Classifying...
            </Typography>
          </Box>
        )}

        {prediction && !loading && (
          <Box
            mt={3}
            sx={{
              borderRadius: 2,
              p: 2,
              backgroundColor: 'rgba(255,255,255,0.3)',
            }}
          >
            <Typography variant="h6" color="#31473A">
              Result: {prediction}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
