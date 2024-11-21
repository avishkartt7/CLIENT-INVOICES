 
const pool = require('../config/db.config');

const projectController = {
  getAllProjects: async (req, res, next) => {
    try {
      const result = await pool.query(
        'SELECT project_code, project_name, client_name, trn FROM projects ORDER BY project_code'
      );
      res.json(result.rows);
    } catch (error) {
      next(error);
    }
  },

  getProjectById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'SELECT project_code, project_name, client_name, trn FROM projects WHERE project_code = $1',
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = projectController;