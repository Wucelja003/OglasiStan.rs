import { errorHandler } from '../utils/error.js';
import { sendMail } from '../utils/mailer.js';
import Listing from '../models/listing.module.js';
import User from '../models/user.module.js';

// Escapuje korisnički unos pre ubacivanja u HTML mejla (sprečava HTML injection)
const escapeHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const MAX_MESSAGE_LENGTH = 2000;

export const contactLandlord = async (req, res, next) => {
  try {
    const { listingId, message } = req.body;

    if (!listingId || typeof message !== 'string' || !message.trim()) {
      return next(errorHandler(400, 'Message cannot be empty.'));
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return next(errorHandler(400, `Message is too long (max ${MAX_MESSAGE_LENGTH} characters).`));
    }

    const listing = await Listing.findById(listingId);
    if (!listing) return next(errorHandler(404, 'Listing not found.'));

    const landlord = await User.findById(listing.userRef);
    if (!landlord) return next(errorHandler(404, 'Listing owner not found.'));

    const sender = await User.findById(req.user.id);
    if (!sender) return next(errorHandler(404, 'User not found.'));

    if (sender._id.toString() === landlord._id.toString()) {
      return next(errorHandler(400, "You can't message yourself."));
    }

    const name = escapeHtml(listing.name);
    const fromName = escapeHtml(sender.username);
    const fromEmail = escapeHtml(sender.email);
    const body = escapeHtml(message.trim());

    const subject = `New inquiry: ${listing.name}`;
    const text =
      `You have a new inquiry about your listing "${listing.name}".\n\n` +
      `From: ${sender.username} (${sender.email})\n\n` +
      `Message:\n${message.trim()}\n\n` +
      `Just hit reply to answer them directly.\n— OglasiStan`;
    const html = `
      <div style="font-family:Inter,Arial,sans-serif;background:#0A0908;padding:32px;color:#F4EEE6">
        <div style="max-width:560px;margin:0 auto;background:#100E0C;border:1px solid #2A251F;border-radius:16px;padding:28px">
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#FF6B1F">New inquiry</p>
          <h1 style="margin:0 0 20px;font-size:22px;color:#F4EEE6">${name}</h1>
          <p style="margin:0 0 6px;font-size:13px;color:#A39A8E">From</p>
          <p style="margin:0 0 20px;font-size:15px;color:#F4EEE6"><strong>${fromName}</strong> &lt;${fromEmail}&gt;</p>
          <p style="margin:0 0 6px;font-size:13px;color:#A39A8E">Message</p>
          <p style="margin:0;font-size:15px;line-height:1.6;white-space:pre-line;color:#F4EEE6">${body}</p>
          <hr style="border:none;border-top:1px solid #2A251F;margin:24px 0"/>
          <p style="margin:0;font-size:12px;color:#6E665C">Just hit reply to answer ${fromName} directly.</p>
        </div>
      </div>`;

    await sendMail({
      to: landlord.email,
      replyTo: sender.email,
      subject,
      text,
      html,
    });

    res.status(200).json({ success: true, message: 'Message sent.' });
  } catch (error) {
    next(error);
  }
};
