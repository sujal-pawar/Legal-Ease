const express = require('express');
const router = express.Router();
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const { protect } = require('../middleware/auth');
const Meeting = require('../models/Meeting');
const emailService = require('../services/email');

// @route   POST /api/meeting/token
// @desc    Generate token for video call
// @access  Private
router.post('/token', protect, async (req, res) => {
  try {
    const appID = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    
    console.log('Debug: AGORA_APP_ID:', appID ? 'Found' : 'MISSING');
    console.log('Debug: AGORA_APP_CERTIFICATE:', appCertificate ? 'Found' : 'MISSING');
    
    if (!appID || !appCertificate) {
      return res.status(500).json({ 
        message: 'Agora credentials not configured',
        debug: { appID: !!appID, appCertificate: !!appCertificate }
      });
    }
    
    const channelName = `meeting-${Date.now()}`;
    
    // Set token expiry to 1 hour from now
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    
    // Build token with channel name
    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      req.user._id,
      RtcRole.PUBLISHER,
      privilegeExpiredTs
    );
    
    res.json({
      token,
      channel: channelName,
      appId: appID,
      uid: req.user._id
    });
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({ message: 'Error generating meeting token' });
  }
});

// @route   POST /api/meeting/schedule
// @desc    Schedule a new court meeting
// @access  Private
router.post('/schedule', protect, async (req, res) => {
  try {
    const {
      title,
      caseNumber,
      date,
      time,
      duration,
      participants
    } = req.body;

    // Create a new meeting record
    const meeting = new Meeting({
      title,
      caseNumber,
      scheduledAt: date,
      startTime: time,
      duration,
      participants: {
        judge: participants.judgeEmail,
        lawyers: [participants.lawyer1Email, participants.lawyer2Email],
        litigants: [participants.litigant1Email, participants.litigant2Email]
      },
      status: 'scheduled',
      meetingLink: `meeting-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    });

    await meeting.save();

    // Send email notifications to all participants
    const allParticipants = [
      participants.judgeEmail,
      participants.lawyer1Email,
      participants.lawyer2Email,
      participants.litigant1Email,
      participants.litigant2Email
    ];

    // Send email notifications
    try {
      await emailService.sendMeetingInvitations(meeting);
    } catch (emailError) {
      console.error('Failed to send meeting invitations:', emailError);
      // Don't fail the request if emails fail to send
    }

    res.status(201).json(meeting);
  } catch (error) {
    console.error('Meeting scheduling error:', error);
    res.status(500).json({ message: 'Error scheduling meeting' });
  }
});

module.exports = router;
