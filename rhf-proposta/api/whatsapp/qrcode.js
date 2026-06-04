/**
 * WhatsApp Connection Status — Vercel Serverless Function
 * Using Meta Cloud API (official) — always connected via webhook.
 */

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({
    status: 'connected',
    connected: true,
    instanceName: 'Meta Cloud API',
    profileName: 'RHF Talentos Vale do Sinos',
    phone: '+55 51 9936-9855',
    qrcode: null
  });
};
