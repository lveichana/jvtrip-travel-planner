// src/controllers/tripController.js
import pool from '../config/db.js';

// @route   GET /api/trips
// @desc    Get all trips for logged-in user
// @access  Private
export const getAllTrips = async (req, res) => {
  try {
    const { status } = req.query; // Filter by status (optional)
    
    let query = 'SELECT * FROM trips WHERE user_id = $1';
    const params = [req.user.userId];
    
    if (status) {
      query += ' AND status = $2';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);

    res.json({ 
      success: true,
      trips: result.rows 
    });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error.message 
    });
  }
};

// @route   GET /api/trips/current
// @desc    Get current in-progress trip
// @access  Private
export const getCurrentTrip = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, 
        (SELECT json_agg(json_build_object(
          'day', a.day_number,
          'activity', a.title
        ) ORDER BY a.day_number, a.time) 
        FROM activities a WHERE a.trip_id = t.id) as itinerary
      FROM trips t 
      WHERE t.user_id = $1 AND t.status = 'in-progress' 
      ORDER BY t.created_at DESC 
      LIMIT 1`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.json({ 
        success: true,
        trip: null 
      });
    }

    const trip = result.rows[0];
    
    // Calculate budget
    const budgetResult = await pool.query(
      'SELECT SUM(cost) as spent FROM activities WHERE trip_id = $1',
      [trip.id]
    );
    
    trip.budget = {
      spent: parseFloat(budgetResult.rows[0].spent) || 0,
      total: parseFloat(trip.total_budget) || 0
    };

    res.json({ 
      success: true,
      trip 
    });
  } catch (error) {
    console.error('Get current trip error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error.message 
    });
  }
};

// @route   GET /api/trips/:id
// @desc    Get single trip with activities
// @access  Private
export const getTripById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get trip
    const tripResult = await pool.query(
      'SELECT * FROM trips WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (tripResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Trip not found' 
      });
    }

    const trip = tripResult.rows[0];

    // Get activities grouped by day
    const activitiesResult = await pool.query(
      `SELECT 
        day_number as day,
        activity_date as date,
        json_agg(
          json_build_object(
            'id', id,
            'time', time,
            'title', title,
            'location', location,
            'description', description,
            'cost', cost,
            'category', category
          ) ORDER BY time
        ) as activities
      FROM activities 
      WHERE trip_id = $1 
      GROUP BY day_number, activity_date
      ORDER BY day_number`,
      [id]
    );

    trip.itinerary = activitiesResult.rows;

    // Calculate budget breakdown
    const budgetResult = await pool.query(
      `SELECT 
        category,
        SUM(cost) as amount
      FROM activities 
      WHERE trip_id = $1 
      GROUP BY category`,
      [id]
    );

    const totalSpent = await pool.query(
      'SELECT SUM(cost) as total FROM activities WHERE trip_id = $1',
      [id]
    );

    trip.budget = {
      spent: parseFloat(totalSpent.rows[0].total) || 0,
      total: parseFloat(trip.total_budget) || 0,
      breakdown: budgetResult.rows.reduce((acc, row) => {
        acc[row.category] = parseFloat(row.amount);
        return acc;
      }, {})
    };

    res.json({ 
      success: true,
      trip 
    });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error.message 
    });
  }
};

// @route   POST /api/trips
// @desc    Create new trip
// @access  Private
export const createTrip = async (req, res) => {
  try {
    const { 
      title, 
      destination, 
      startDate, 
      endDate, 
      totalBudget, 
      status = 'wishlist',
      coverImage,
      description 
    } = req.body;

    // Validation
    if (!title || !destination) {
      return res.status(400).json({ 
        success: false,
        error: 'Title and destination are required' 
      });
    }

    const result = await pool.query(
      `INSERT INTO trips (user_id, title, destination, start_date, end_date, total_budget, status, cover_image, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [req.user.userId, title, destination, startDate, endDate, totalBudget, status, coverImage, description]
    );

    res.status(201).json({ 
      success: true,
      message: 'Trip created successfully',
      trip: result.rows[0] 
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error.message 
    });
  }
};

// @route   PUT /api/trips/:id
// @desc    Update trip
// @access  Private
export const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      destination, 
      startDate, 
      endDate, 
      totalBudget, 
      status,
      coverImage,
      description 
    } = req.body;

    // Check if trip exists and belongs to user
    const tripCheck = await pool.query(
      'SELECT * FROM trips WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (tripCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Trip not found' 
      });
    }

    const result = await pool.query(
      `UPDATE trips 
       SET title = COALESCE($1, title),
           destination = COALESCE($2, destination),
           start_date = COALESCE($3, start_date),
           end_date = COALESCE($4, end_date),
           total_budget = COALESCE($5, total_budget),
           status = COALESCE($6, status),
           cover_image = COALESCE($7, cover_image),
           description = COALESCE($8, description)
       WHERE id = $9 AND user_id = $10
       RETURNING *`,
      [title, destination, startDate, endDate, totalBudget, status, coverImage, description, id, req.user.userId]
    );

    res.json({ 
      success: true,
      message: 'Trip updated successfully',
      trip: result.rows[0] 
    });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error.message 
    });
  }
};

// @route   PATCH /api/trips/:id/status
// @desc    Change trip status
// @access  Private
export const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['wishlist', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid status. Must be: wishlist, in-progress, or completed' 
      });
    }

    const result = await pool.query(
      'UPDATE trips SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [status, id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Trip not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Trip status updated successfully',
      trip: result.rows[0] 
    });
  } catch (error) {
    console.error('Change status error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error.message 
    });
  }
};

// @route   DELETE /api/trips/:id
// @desc    Delete trip
// @access  Private
export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Trip not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Trip deleted successfully' 
    });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error.message 
    });
  }
};