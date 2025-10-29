const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const emailService = {
  /**
   * Send meeting invitation emails to participants
   */
  sendMeetingInvitations: async (meeting) => {
    const emailPromises = [];
    const allParticipants = [
      { email: meeting.participants.judge, role: 'Judge' },
      ...meeting.participants.lawyers.map(email => ({ email, role: 'Lawyer' })),
      ...meeting.participants.litigants.map(email => ({ email, role: 'Litigant' }))
    ];

    for (const participant of allParticipants) {
      const emailOptions = {
        from: `"\${process.env.EMAIL_FROM_NAME}" <\${process.env.EMAIL_FROM}>\`,
        to: participant.email,
        subject: \`Court Meeting Invitation: \${meeting.title}\`,
        html: \`
          <h2>Virtual Court Meeting Invitation</h2>
          <p>You have been invited to attend a virtual court meeting as a \${participant.role}.</p>
          
          <h3>Meeting Details:</h3>
          <ul>
            <li><strong>Case:</strong> \${meeting.caseNumber}</li>
            <li><strong>Date:</strong> \${new Date(meeting.scheduledAt).toLocaleDateString()}</li>
            <li><strong>Time:</strong> \${meeting.startTime}</li>
            <li><strong>Duration:</strong> \${meeting.duration} minutes</li>
          </ul>

          <p>
            <a href="\${process.env.FRONTEND_URL}/meeting/\${meeting.meetingLink}" style="
              background-color: #0066cc;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              display: inline-block;
              margin: 20px 0;
            ">
              Join Meeting
            </a>
          </p>

          <p><small>Please join the meeting 5 minutes before the scheduled time.</small></p>
        `
      };

      emailPromises.push(transporter.sendMail(emailOptions));
    }

    try {
      await Promise.all(emailPromises);
      console.log('Meeting invitations sent successfully');
    } catch (error) {
      console.error('Error sending meeting invitations:', error);
      throw new Error('Failed to send meeting invitations');
    }
  }
};

module.exports = emailService;
