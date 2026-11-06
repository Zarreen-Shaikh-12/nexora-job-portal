const Contact = require("../models/Contact");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

// @route  POST /api/contact   (public)
const createContact = asyncHandler(async (req, res) => {
  // Whitelist fields: a client must not be able to set `status`
  const { name, email, message } = req.body;
  await Contact.create({ name, email, message });

  res.status(201).json({
    success: true,
    message: "Thank you! Your message has been received.",
  });
});

// @route  GET /api/contact   (Admin)
// Query: status (Unread|Replied), page, limit
const getContacts = asyncHandler(async (req, res) => {
  const filter = {};
  if (["Unread", "Replied"].includes(req.query.status)) filter.status = req.query.status;

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);

  const [contacts, total] = await Promise.all([
    Contact.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Contact.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: contacts.length,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    contacts,
  });
});

// @route  PATCH /api/contact/:id/status   (Admin)
const updateContactStatus = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) throw new AppError("Message not found", 404);

  contact.status = req.body.status;
  await contact.save();

  res.status(200).json({ success: true, contact });
});

module.exports = { createContact, getContacts, updateContactStatus };
