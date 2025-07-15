import express from 'express';
import { uploadSingle, uploadMultiple } from '../middleware/upload';
import authenticate, { authorize } from '../middleware/auth';

const router = express.Router();

// Single image upload endpoint
router.post('/single', authenticate, authorize(['admin']), uploadSingle, (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a file to upload'
      });
    }

    // Return the file URL
    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Upload failed',
      message: error.message
    });
  }
});

// Multiple images upload endpoint
router.post('/multiple', authenticate, authorize(['admin']), uploadMultiple, (req: any, res: any) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded',
        message: 'Please select files to upload'
      });
    }

    // Return the file URLs
    const files = (req.files as Express.Multer.File[]).map(file => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size
    }));
    
    res.json({
      message: 'Files uploaded successfully',
      files: files
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Upload failed',
      message: error.message
    });
  }
});

export default router;