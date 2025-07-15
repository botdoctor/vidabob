import express from 'express';
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} from '../controllers/contacts';
import authenticate, { authorize } from '../middleware/auth';

const router = express.Router();

// Public route - anyone can submit a contact form
router.post('/', createContact);

// Admin only routes
router.use(authenticate);
router.use(authorize(['admin']));

router.get('/', getAllContacts);
router.get('/:id', getContactById);
router.patch('/:id/status', updateContactStatus);
router.delete('/:id', deleteContact);

export default router;