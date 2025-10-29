const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const EFiledCase = require('../models/EFiledCase');
const Meeting = require('../models/Meeting');
const User = require('../models/User');

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    // Get basic case counts
    const totalCases = await EFiledCase.countDocuments();
    const activeCases = await EFiledCase.countDocuments({ status: 'approved' });
    const processingCases = await EFiledCase.countDocuments({ status: 'processing' });
    const pendingCases = await EFiledCase.countDocuments({ status: 'pending' });

    // Get role-specific data
    let roleSpecificData = {};
    
    if (userRole === 'judge') {
      // For judges, get cases they might be assigned to and meetings they host
      const judgeMeetings = await Meeting.find()
        .populate('participants', 'fullName email')
        .sort({ scheduledAt: 1 })
        .limit(10);
      
      // Get recent cases (judges would see all cases for now, but in real system would be assigned cases)
      const recentCases = await EFiledCase.find({ status: 'approved' })
        .sort({ createdAt: -1 })
        .limit(5);

      roleSpecificData = {
        assignedCases: activeCases,
        todayHearings: judgeMeetings.filter(m => {
          const today = new Date();
          const meetingDate = new Date(m.scheduledAt);
          return meetingDate.toDateString() === today.toDateString();
        }).length,
        casesResolved: await EFiledCase.countDocuments({ status: 'approved' }),
        caseBacklog: pendingCases,
        upcomingHearings: judgeMeetings.slice(0, 3).map(meeting => ({
          id: meeting._id,
          title: meeting.title,
          date: meeting.scheduledAt,
          participants: meeting.participants.length,
          type: meeting.agenda || 'Hearing'
        })),
        recentRulings: recentCases.map(case_ => ({
          id: case_._id,
          caseNumber: case_.caseNumber,
          title: `${case_.litigant.name} vs ${case_.case.causeAgainstWhom}`,
          status: case_.status,
          date: case_.updatedAt
        }))
      };
    } else if (userRole === 'lawyer') {
      // For lawyers, get their cases and meetings
      const lawyerMeetings = await Meeting.find()
        .populate('participants', 'fullName email')
        .sort({ scheduledAt: 1 })
        .limit(10);

      roleSpecificData = {
        clientCases: activeCases,
        upcomingMeetings: lawyerMeetings.slice(0, 3).map(meeting => ({
          id: meeting._id,
          title: meeting.title,
          date: meeting.scheduledAt,
          participants: meeting.participants.length
        })),
        activeClients: await EFiledCase.distinct('litigant.name').length,
        casesWon: Math.floor(activeCases * 0.7) // Mock data for now
      };
    } else if (userRole === 'litigant') {
      // For litigants, get their specific cases
      const userCases = await EFiledCase.find({ 'litigant.name': req.user.fullName });
      
      roleSpecificData = {
        myCases: userCases,
        upcomingMeetings: await Meeting.find()
          .populate('participants', 'fullName email')
          .limit(3)
      };
    } else if (userRole === 'admin') {
      // For admins, get system-wide statistics
      const userStats = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]);

      roleSpecificData = {
        totalUsers: await User.countDocuments(),
        totalMeetings: await Meeting.countDocuments(),
        systemStats: userStats
      };
    }

    // Get cases by type
    const casesByType = await EFiledCase.aggregate([
      {
        $group: {
          _id: '$case.caseType',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          type: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    const analyticsData = {
      casesCount: {
        total: totalCases,
        active: activeCases,
        processing: processingCases,
        pending: pendingCases
      },
      casesByType: casesByType.length > 0 ? casesByType : [
        { type: 'Civil', count: Math.floor(totalCases * 0.4) },
        { type: 'Criminal', count: Math.floor(totalCases * 0.3) },
        { type: 'Family', count: Math.floor(totalCases * 0.2) },
        { type: 'Commercial', count: Math.floor(totalCases * 0.1) }
      ],
      roleSpecific: roleSpecificData,
      userRole
    };

    res.json(analyticsData);
  } catch (error) {
    console.error('Analytics dashboard error:', error);
    res.status(500).json({ message: 'Error fetching dashboard analytics' });
  }
});

// @route   GET /api/analytics/court-performance
// @desc    Get court performance metrics
// @access  Private
router.get('/court-performance', protect, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Mock data - replace with real court performance calculations
    const courtPerformance = [
      {
        court: 'District Court A',
        disposalRate: 75 + Math.floor(Math.random() * 10),
        pendingCases: 120 + Math.floor(Math.random() * 20),
        period
      },
      {
        court: 'District Court B',
        disposalRate: 68 + Math.floor(Math.random() * 10),
        pendingCases: 95 + Math.floor(Math.random() * 15),
        period
      },
      {
        court: 'High Court',
        disposalRate: 82 + Math.floor(Math.random() * 8),
        pendingCases: 200 + Math.floor(Math.random() * 30),
        period
      }
    ];

    res.json(courtPerformance);
  } catch (error) {
    console.error('Court performance error:', error);
    res.status(500).json({ message: 'Error fetching court performance' });
  }
});

// @route   GET /api/analytics/case-trends
// @desc    Get case resolution trends
// @access  Private
router.get('/case-trends', protect, async (req, res) => {
  try {
    const { start, end } = req.query;
    
    // Generate mock trend data for the last 30 days
    const dates = [];
    const resolved = [];
    const newCases = [];
    
    const startDate = new Date(start || Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = new Date(end || Date.now());
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
      resolved.push(Math.floor(Math.random() * 15) + 5);
      newCases.push(Math.floor(Math.random() * 20) + 8);
    }

    res.json({
      dates,
      resolved,
      new: newCases
    });
  } catch (error) {
    console.error('Case trends error:', error);
    res.status(500).json({ message: 'Error fetching case trends' });
  }
});

// @route   GET /api/analytics/user-stats
// @desc    Get user statistics by role
// @access  Private (Admin only)
router.get('/user-stats', protect, async (req, res) => {
  try {
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          role: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json(userStats);
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({ message: 'Error fetching user statistics' });
  }
});

module.exports = router;