const Company = require("../models/Company.model");
const Job = require("../models/Job.model");

const path = require("path");
const { bucket, getDownloadURL } = require("../../config/firebase");

class CompanyController {
  // [GET] /api/company/info/
  async getCompanyInfo(req, res) {
    const companyId = req.user.companyId;

    try {
      const company = await Company.findById(companyId);

      return res.json({
        info: company,
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.toString(),
      });
    }
  }

  // [POST] /api/company/info/
  async updateCompanyInfo(req, res) {
    const companyId = req.user.companyId;
    const info = req.body;

    try {
      delete info.logo;
      delete info.license;

      const company = await Company.findByIdAndUpdate(companyId, {
        ...info
      }, { new: true }).select("-__v");

      return res.json({
        info: company,
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.toString(),
      });
    }
  }

  // [GET] /api/company/jobs?hidden=<boolean>&page=<number>&size=<number>
  async getJobsOfCompany(req, res) {
    const companyId = req.user.companyId;
    const { page = 1, size = 0, hidden = "false" } = req.query;

    try {
      const total = await Job.countDocuments({ 
        company: companyId,
        hidden: hidden === "true",
      });

      const jobs = await Job.find({ 
        company: companyId,
        hidden: hidden === "true",
      })
        .skip((page - 1) * size)
        .limit(size)
        .select("-hiddenAt -hiddenBy -__v")
        .populate("categories");

      return res.json({
        jobs,
        info: {
          total,
          page,
          size,
        }
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.toString(),
      });
    }
  }

  // [POST] /api/company/post-job
  async postJob(req, res) {
    const companyId = req.user.companyId;
    const info = req.body;

    try {
      const job = await Job.create({
        ...info,
        company: companyId,
      });

      return res.json({
        info: job
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.toString(),
      });
    }
  }

  // [POST] /api/company/hidden-job/
  async hiddenPostedJobs(req, res) {
    const companyId = req.user.companyId;
    const { jobs } = req.body;

    try {
      await Job.updateMany({
        _id: { $in: jobs },
        company: companyId,
      }, {
        hidden: true,
        hiddenAt: Date.now(),
      });

      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.toString(),
      });
    }
  }

  // [POST] /api/compnay/enable-job/
  async enablePostedJobs(req, res) {
    const companyId = req.user.companyId;
    const { jobs } = req.body;

    try {
      await Job.updateMany({ _id: { $in: jobs }, company: companyId }, {
        hidden: false,
        hiddenAt: null,
        hiddenBy: null,
      })

      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Có lỗi xảy ra: ${error.code ? "Error code <" + error.code + ">" : error.message}`,
      })
    }
  }

  // [POST] /api/company/logo
  async updateCompanyLogo(req, res) {
    try {
      if (!req.file)
        return res.status(400).json({
          message: "Chưa có file nào được tải lên!",
        });
      
      const fileName = "logo" + path.extname(req.file.originalname);

      const [files] = await bucket.getFiles({ prefix: `employer/${req.user.id}/company/` });
      await Promise.all(files.map(file => file.delete()));

      const blob = bucket.file(`employer/${req.user.id}/company/${fileName}`);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        }
      });

      blobStream.on("error", (err) => {
        return res.status(500).json({
          message: err,
        })
      });

      blobStream.on("finish", async () => {
        const url = await getDownloadURL(blob);
        await Company.updateOne({ _id: req.user.companyId }, {
          logo: url,
        });

        return res.json({
          url,
        });
      });

      blobStream.end(req.file.buffer);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Có lỗi xảy ra: Error code <${error.code}>`,
      });
    }
  }

  // [DELETE] api/company/logo
  async deleteCompanyLogo(req, res) {
    try {
      const [files] = await bucket.getFiles({ prefix: `employer/${req.user.id}/company` });
      await Promise.all(files.map(file => file.delete()));

      await Company.updateOne({ _id: req.user.companyId }, {
        logo: null,
      });

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Có lỗi xảy ra: Error code <${error.code}>`,
      });
    }
  }
}

module.exports = new CompanyController;