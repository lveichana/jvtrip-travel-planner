import pool from '../config/db.js';

class Trip {
  static async findByUserId(userId) {
    const result = await pool.query(
      `SELECT * FROM trips 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async findByUserIdAndStatus(userId, status) {
    const result = await pool.query(
      `SELECT * FROM trips 
       WHERE user_id = $1 AND status = $2 
       ORDER BY start_date ASC`,
      [userId, status]
    );
    return result.rows;
  }

  static async findById(tripId) {
    const result = await pool.query(
      'SELECT * FROM trips WHERE id = $1',
      [tripId]
    );
    return result.rows[0];
  }

  static async findByIdWithDetails(tripId, userId) {
    const result = await pool.query(
      `SELECT t.*, 
              COUNT(a.id) as activities_count,
              COALESCE(SUM(a.cost), 0) as total_spent
       FROM trips t
       LEFT JOIN activities a ON t.id = a.trip_id
       WHERE t.id = $1 AND t.user_id = $2
       GROUP BY t.id`,
      [tripId, userId]
    );
    return result.rows[0];
  }

  static async create(tripData) {
    const {
      user_id,
      title,
      destination,
      start_date,
      end_date,
      total_budget,
      status,
      cover_image,
      description
    } = tripData;

    const result = await pool.query(
      `INSERT INTO trips 
       (user_id, title, destination, start_date, end_date, total_budget, status, cover_image, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [user_id, title, destination, start_date, end_date, total_budget, status || 'wishlist', cover_image, description]
    );
    return result.rows[0];
  }

  static async update(tripId, userId, tripData) {
    const {
      title,
      destination,
      start_date,
      end_date,
      total_budget,
      status,
      cover_image,
      description
    } = tripData;

    const result = await pool.query(
      `UPDATE trips 
       SET title = $1, destination = $2, start_date = $3, end_date = $4,
           total_budget = $5, status = $6, cover_image = $7, description = $8,
           updated_at = NOW()
       WHERE id = $9 AND user_id = $10
       RETURNING *`,
      [title, destination, start_date, end_date, total_budget, status, cover_image, description, tripId, userId]
    );
    return result.rows[0];
  }

  static async updateStatus(tripId, userId, status) {
    const result = await pool.query(
      `UPDATE trips 
       SET status = $1, updated_at = NOW()
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [status, tripId, userId]
    );
    return result.rows[0];
  }

  static async delete(tripId, userId) {
    const result = await pool.query(
      'DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING *',
      [tripId, userId]
    );
    return result.rows[0];
  }

  static async findCurrentTrip(userId) {
    const result = await pool.query(
      `SELECT * FROM trips 
       WHERE user_id = $1 AND status = 'in-progress' 
       ORDER BY start_date DESC 
       LIMIT 1`,
      [userId]
    );
    return result.rows[0];
  }

  static async getDashboardStats(userId) {
    const result = await pool.query(
      `SELECT 
         COUNT(*) FILTER (WHERE status = 'wishlist') as wishlist_count,
         COUNT(*) FILTER (WHERE status = 'in-progress') as inprogress_count,
         COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
         COUNT(*) as total_trips,
         COALESCE(SUM(total_budget), 0) as total_budget_all
       FROM trips 
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  }
}

export default Trip;