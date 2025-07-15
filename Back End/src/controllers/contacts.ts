import { Request, Response } from 'express';
import Contact from '../models/Contact';
import { asyncHandler } from '../middleware/error';

// Create new contact message
export const createContact = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, phone, subject, message } = req.body;

  const contact = new Contact({
    name,
    email,
    phone,
    subject,
    message,
  });

  await contact.save();

  res.status(201).json({
    success: true,
    message: 'Thank you for your message. We will get back to you soon!',
    contact: {
      id: contact._id,
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      createdAt: contact.createdAt,
    },
  });
});

// Get all contacts (admin only)
export const getAllContacts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { status, search } = req.query;

  let query: any = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
    ];
  }

  const contacts = await Contact.find(query).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: contacts.length,
    contacts,
  });
});

// Get single contact (admin only)
export const getContactById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const contact = await Contact.findById(id);

  if (!contact) {
    res.status(404).json({
      error: 'Contact not found',
      message: 'Contact message with this ID does not exist',
    });
    return;
  }

  // Mark as read if it's new
  if (contact.status === 'new') {
    contact.status = 'read';
    await contact.save();
  }

  res.json({
    success: true,
    contact,
  });
});

// Update contact status (admin only)
export const updateContactStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  const contact = await Contact.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!contact) {
    res.status(404).json({
      error: 'Contact not found',
      message: 'Contact message with this ID does not exist',
    });
    return;
  }

  res.json({
    success: true,
    message: 'Contact status updated successfully',
    contact,
  });
});

// Delete contact (admin only)
export const deleteContact = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const contact = await Contact.findByIdAndDelete(id);

  if (!contact) {
    res.status(404).json({
      error: 'Contact not found',
      message: 'Contact message with this ID does not exist',
    });
    return;
  }

  res.json({
    success: true,
    message: 'Contact message deleted successfully',
  });
});