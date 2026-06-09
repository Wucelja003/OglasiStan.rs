import { errorHandler } from '../utils/error.js';
import { sendMail } from '../utils/mailer.js';
import Listing from '../models/listing.module.js';
import User from '../models/user.module.js';

export const contactLandlord = async (req, res, next) => {
  try {
    const { listingId, message } = req.body;

    if (!listingId || !message || !message.trim()) {
      return next(errorHandler(400, 'Poruka ne može biti prazna.'));
    }

    const listing = await Listing.findById(listingId);
    if (!listing) return next(errorHandler(404, 'Oglas nije pronađen.'));

    const landlord = await User.findById(listing.userRef);
    if (!landlord) return next(errorHandler(404, 'Vlasnik oglasa nije pronađen.'));

    const sender = await User.findById(req.user.id);
    if (!sender) return next(errorHandler(404, 'Korisnik nije pronađen.'));

    if (sender._id.toString() === landlord._id.toString()) {
      return next(errorHandler(400, 'Ne možete poslati poruku sami sebi.'));
    }

    const subject = `Upit za oglas: ${listing.name}`;
    const text =
      `Imate novi upit za vaš oglas "${listing.name}".\n\n` +
      `Od: ${sender.username} (${sender.email})\n\n` +
      `Poruka:\n${message}\n\n` +
      `Možete odgovoriti direktno na ovaj mejl.`;
    const html =
      `<p>Imate novi upit za vaš oglas <strong>${listing.name}</strong>.</p>` +
      `<p><strong>Od:</strong> ${sender.username} (${sender.email})</p>` +
      `<p><strong>Poruka:</strong></p>` +
      `<p style="white-space:pre-line">${message}</p>` +
      `<hr/><p style="color:#888">Možete odgovoriti direktno na ovaj mejl.</p>`;

    await sendMail({
      to: landlord.email,
      replyTo: sender.email,
      subject,
      text,
      html,
    });

    res.status(200).json({ success: true, message: 'Poruka je poslata.' });
  } catch (error) {
    next(error);
  }
};
