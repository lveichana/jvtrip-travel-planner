import pool from '../config/db.js';

class Activity {
  static async findByTripId(tripId) {
    const result = await pool.query(
      `SELECT * FROM activities 
       WHERE trip_id = $1 
       ORDER BY day_number ASC, time ASC`,
      [tripId]
    );
    return result.rows;
  }

  static async findByTripIdGroupedByDay(tripId) {
    const result = await pool.query(
      `SELECT * FROM activities 
       WHERE trip_id = $1 
       ORDER BY day_number ASC, time ASC`,
      [tripId]
    );
    
    const grouped = result.rows.reduce((acc, activity) => {
      const day = activity.day_number;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(activity);
      return acc;
    }, {});
    
    return grouped;
  }

  static async findById(activityId) {
    const result = await pool.query(
      'SELECT * FROM activities WHERE id = $1',
      [activityId]
    );
    return result.rows[0];
  }

  static async create(activityData) {
    const {
      trip_id,
      day_number,
      activity_date,
      time,
      title,
      location,
      description,
      cost,
      category
    } = activityData;

    const result = await pool.query(
      `INSERT INTO activities 
       (trip_id, day_number, activity_date, time, title, location, description, cost, category) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [trip_id, day_number, activity_date, time, title, location, description, cost || 0, category]
    );
    return result.rows[0];
  }

  static async update(activityId, activityData) {
    const {
      day_number,
      activity_date,
      time,
      title,
      location,
      description,
      cost,
      category
    } = activityData;

    const result = await pool.query(
      `UPDATE activities 
       SET day_number = $1, activity_date = $2, time = $3, title = $4,
           location = $5, description = $6, cost = $7, category = $8,
           updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [day_number, activity_date, time, title, location, description, cost, category, activityId]
    );
    return result.rows[0];
  }

  static async delete(activityId) {
    const result = await pool.query(
      'DELETE FROM activities WHERE id = $1 RETURNING *',
      [activityId]
    );
    return result.rows[0];
  }

  static async getTotalCost(tripId) {
    const result = await pool.query(
      'SELECT COALESCE(SUM(cost), 0) as total_cost FROM activities WHERE trip_id = $1',
      [tripId]
    );
    return result.rows[0].total_cost;
  }

  static async getCostByCategory(tripId) {
    const result = await pool.query(
      `SELECT category, COALESCE(SUM(cost), 0) as total_cost 
       FROM activities 
       WHERE trip_id = $1 
       GROUP BY category 
       ORDER BY total_cost DESC`,
      [tripId]
    );
    return result.rows;
  }

  static async verifyOwnership(activityId, userId) {
    const result = await pool.query(
      `SELECT a.* FROM activities a
       JOIN trips t ON a.trip_id = t.id
       WHERE a.id = $1 AND t.user_id = $2`,
      [activityId, userId]
    );
    return result.rows[0];
  }
}

export default Activity;