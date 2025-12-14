// src/controllers/activityController.js
import pool from '../config/db.js';

// @route   GET /api/trips/:tripId/activities
// @desc    Get all activities for a trip
// @access  Private
export const getActivities = async (req, res) => {
  try {
    const { tripId } = req.params;

    // Check if trip belongs to user
    const tripCheck = await pool.query(
      'SELECT * FROM trips WHERE id = $1 AND user_id = $2',
      [tripId, req.user.userId]
    );

    if (tripCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Trip not found' 
      });
    }

    const result = await pool.query(
      'SELECT * FROM activities WHERE trip_id = $1 ORDER BY day_number, time',
      [tripId]
    );

    res.json({ 
      success: true,
      activities: result.rows 
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error.message 
    });
  }
};

// @route   POST /api/trips/:tripId/activities
// @desc    Add activity to trip
// @access  Private
export const createActivity = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { 
      dayNumber, 
      activityDate, 
      time, 
      title, 
      location, 
      description, 
      cost = 0, 
      category 
    } = req.body;

    // Validation
    if (!dayNumber || !title) {
      return res.status(400).json({ 
        success: false,
        error: 'Day number and title are required' 
      });
    }

    // Check if trip belongs to user
    const tripCheck = await pool.query(
      'SELECT * FROM trips WHERE id = $1 AND user_id = $2',
      [tripId, req.user.userId]
    );

    if (tripCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Trip not found' 
      });
    }

    const result = await pool.query(
      `INSERT INTO activities (trip_id, day_number, activity_date, time, title, location, description, cost, category) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [tripId, dayNumber, activityDate, time, title, location, description, cost, category]
    );

    res.status(201).json({ 
      success: true,
      message: 'Activity created successfully',
      activity: result.rows[0] 
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error.message 
    });
  }
};

// @route   PUT /api/activities/:id
// @desc    Update activity
// @access  Private
export const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      dayNumber, 
      activityDate, 
      time, 
      title, 
      location, 
      description, 
      cost, 
      category 
    } = req.body;

    // Check if activity's trip belongs to user
    const activityCheck = await pool.query(
      `SELECT a.* FROM activities a
       JOIN trips t ON a.trip_id = t.id
       WHERE a.id = $1 AND t.user_id = $2`,
      [id, req.user.userId]
    );

    if (activityCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Activity not found' 
      });
    }

    const result = await pool.query(
      `UPDATE activities 
       SET day_number = COALESCE($1, day_number),
           activity_date = COALESCE($2, activity_date),
           time = COALESCE($3, time),
           title = COALESCE($4, title),
           location = COALESCE($5, location),
           description = COALESCE($6, description),
           cost = COALESCE($7, cost),
           category = COALESCE($8, category)
       WHERE id = $9
       RETURNING *`,
      [dayNumber, activityDate, time, title, location, description, cost, category, id]
    );

    res.json({ 
      success: true,
      message: 'Activity updated successfully',
      activity: result.rows[0] 
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error.message 
    });
  }
};

// @route   DELETE /api/activities/:id
// @desc    Delete activity
// @access  Private
export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if activity's trip belongs to user
    const result = await pool.query(
      `DELETE FROM activities 
       WHERE id = $1 
       AND trip_id IN (SELECT id FROM trips WHERE user_id = $2)
       RETURNING *`,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Activity not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Activity deleted successfully' 
    });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error.message 
    });
  }
};