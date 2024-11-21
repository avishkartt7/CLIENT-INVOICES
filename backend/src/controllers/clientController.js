const pool = require('../config/db.config');

const clientController = {
  getAllClients: async (req, res, next) => {
    try {
      const result = await pool.query(
        `SELECT DISTINCT 
          client_name, 
          trn,
          address,
          telephone_no,
          fax_no
        FROM projects 
        ORDER BY client_name`
      );
      console.log('Sending clients:', result.rows);
      res.json(result.rows);
    } catch (error) {
      console.error('Error in getAllClients:', error);
      next(error);
    }
  },

  getClientProjects: async (req, res, next) => {
    try {
      const { client_name } = req.params;
      const result = await pool.query(
        `SELECT 
          project_code,
          project_name,
          trn,
          loa_wo_sub_contract_ref,
          contract_value
        FROM projects 
        WHERE client_name = $1
        ORDER BY project_code`,
        [client_name]
      );
      console.log('Sending projects:', result.rows);
      res.json(result.rows);
    } catch (error) {
      console.error('Error in getClientProjects:', error);
      next(error);
    }
  }
};

module.exports = clientController;