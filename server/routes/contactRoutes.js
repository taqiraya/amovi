import { Router } from 'express';
import { 
  createContactMessage, 
  getContactMessages, 
  updateContactStatus, 
  deleteContactMessage 
} from '../controllers/contactController.js';

const router = Router();

// مسیرهای فرم تماس با ما
router.post('/', createContactMessage);
router.get('/', getContactMessages);
router.patch('/:id/status', updateContactStatus);
router.delete('/:id', deleteContactMessage);

export default router;
