const JobCategory = require("../models/JobCategory.model");

class JobCategoryController {
  // [POST] /api/job-category/new
  async createJobCategry(req, res) {
    const info = req.body;
    
    try {
      const jobCategory = await JobCategory.create({
        ...info
      })

      return res.json({
        info: jobCategory,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.toString(),
      });
    }
  }

  // [GET] /api/job-category/all
  async getAllJobCategories(req, res) {
    const info = req.body;
    
    try {
      const categories = await JobCategory.find({});

      return res.json({
        categories,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.toString(),
      });
    }
  }
}

module.exports = new JobCategoryController;