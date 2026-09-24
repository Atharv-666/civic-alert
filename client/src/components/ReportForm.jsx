import React, { useState } from 'react';
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AiAutoFillHelper from './AiAutoFillHelper';

export default function ReportForm({ onIssueCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [landmark, setLandmark] = useState('');
  const [category, setCategory] = useState('Roads & Potholes');
  const [priority, setPriority] = useState('Medium');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);

  const categories = [
    'Roads & Potholes',
    'Water Supply',
    'Waste Management',
    'Street Lighting',
    'Drainage & Sewage',
    'Public Safety',
    'Other'
  ];

  const handleApplyAiFields = (aiFields) => {
    if (aiFields.title) setTitle(aiFields.title);
    if (aiFields.category) setCategory(aiFields.category);
    if (aiFields.priority) setPriority(aiFields.priority);
    if (aiFields.landmark) setLandmark(aiFields.landmark);
    if (aiFields.description) setDescription(aiFields.description);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setAlertInfo({ severity: 'error', text: 'File size exceeds 5MB limit.' });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setAlertInfo(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !landmark) {
      setAlertInfo({ severity: 'error', text: 'Please complete all required text fields.' });
      return;
    }

    setIsSubmitting(true);
    setAlertInfo(null);

    setTimeout(() => {
      const newIssue = {
        _id: `issue_${Date.now()}`,
        title,
        description,
        landmark,
        category,
        priority,
        imageUrl: imagePreview || '/images/pothole.jpg',
        status: 'Pending',
        reportedBy: {
          clerkUserId: 'user_citizen_salokhenagar_01',
          name: 'Resident Amit Salokhe',
          email: 'amit.salokhe@salokhenagar.org'
        },
        upvotedBy: ['user_citizen_salokhenagar_01'],
        upvoteCount: 1,
        statusHistory: [
          {
            status: 'Pending',
            changedByClerkId: 'user_citizen_salokhenagar_01',
            comment: 'Initial issue report submitted by resident.',
            timestamp: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString()
      };

      setIsSubmitting(false);
      setAlertInfo({ severity: 'success', text: '🎉 Report submitted successfully to Salokhenagar Municipal Queue!' });

      // Reset form
      setTitle('');
      setDescription('');
      setLandmark('');
      setImageFile(null);
      setImagePreview(null);

      if (onIssueCreated) {
        onIssueCreated(newIssue);
      }
    }, 1200);
  };

  return (
    <Box
      className="glass-panel"
      sx={{
        p: { xs: 3, sm: 5 },
        borderRadius: '24px',
        maxWidth: '720px',
        mx: 'auto',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '16px',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#818cf8'
          }}
        >
          <ReportProblemIcon />
        </Box>
        <Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit' }}>
            Report a Civic Issue
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            Salokhenagar Municipal Ward • Kolhapur
          </Typography>
        </Box>
      </Box>

      {/* AI Assistant Section */}
      <AiAutoFillHelper onApplyFields={handleApplyAiFields} />

      {alertInfo && (
        <Alert severity={alertInfo.severity} sx={{ mb: 3, borderRadius: '12px' }}>
          {alertInfo.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Title */}
          <TextField
            label="Issue Title *"
            placeholder="e.g. Deep Pothole on Water Tank Main Road"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '12px',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.4)' }
              }
            }}
          />

          {/* Category & Priority Grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              select
              label="Category *"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
              sx={{
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '12px',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' }
                }
              }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Priority Level"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              fullWidth
              sx={{
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '12px',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' }
                }
              }}
            >
              <MenuItem value="Low">Low - Regular Maintenance</MenuItem>
              <MenuItem value="Medium">Medium - Standard Issue</MenuItem>
              <MenuItem value="High">High - Hazardous Risk</MenuItem>
              <MenuItem value="Urgent">Urgent - Emergency Action</MenuItem>
            </TextField>
          </Box>

          {/* Landmark */}
          <TextField
            label="Landmark / Location in Salokhenagar *"
            placeholder="e.g. Near Kalamba Water Filter Plant, Ward No. 4"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            required
            fullWidth
            sx={{
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '12px',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' }
              }
            }}
          />

          {/* Description */}
          <TextField
            label="Detailed Description *"
            placeholder="Describe the issue size, hazard, or timing..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            multiline
            rows={3}
            fullWidth
            sx={{
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '12px',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' }
              }
            }}
          />

          {/* File Picker & Image Preview */}
          <Box>
            <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 600, mb: 1, display: 'block' }}>
              Photo Evidence Upload (Cloudinary CDN Integration)
            </Typography>
            <Box
              sx={{
                p: 3,
                border: '2px dashed rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                textAlign: 'center',
                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                cursor: 'pointer',
                position: 'relative',
                '&:hover': { borderColor: '#6366f1' }
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
              />
              {imagePreview ? (
                <Box>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxHeight: '180px', borderRadius: '12px', margin: '0 auto', objectFit: 'cover' }}
                  />
                  <Typography variant="caption" sx={{ color: '#818cf8', mt: 1, display: 'block' }}>
                    Click or drag to change image
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <CloudUploadIcon sx={{ fontSize: 40, color: '#64748b', mb: 1 }} />
                  <Typography variant="body2" sx={{ color: '#e2e8f0' }}>
                    <span style={{ color: '#818cf8', fontWeight: 600 }}>Click to upload</span> or drag and drop photo
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    PNG, JPG, WEBP up to 5MB (Multer memory buffer $\rightarrow$ Cloudinary)
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="contained"
            size="large"
            sx={{
              py: 1.8,
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '1rem',
              textTransform: 'none',
              backgroundColor: '#4f46e5',
              backgroundImage: 'linear-gradient(to right, #4f46e5, #7c3aed)',
              boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.4)',
              '&:hover': {
                backgroundColor: '#4338ca',
                backgroundImage: 'linear-gradient(to right, #4338ca, #6d28d9)'
              }
            }}
          >
            {isSubmitting ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CircularProgress size={20} color="inherit" />
                <span>Uploading Image & Submitting...</span>
              </Box>
            ) : (
              'Submit Report to Municipal Queue'
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
