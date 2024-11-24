const path = require("path");
const { bucket, getDownloadURL } = require("../../config/firebase");

const Member = require("../models/Member.model");
const Employer = require("../models/Employer.model");
const Job = require("../models/Job.model");
const Application = require("../models/Application.model");
const Candidate = require("../models/Candidate.model");


class EmployerController {
  // [GET] /api/employer/info/
  async getInfo(req, res) {
    const mid = req.user.id;

    try {
      const employer = await Employer.findOne({ member: mid }).select("-__v").populate({
        path: "member",
        select: "-updatedAt -password -role -hidden -__v"
      })

      return res.json({
        info: employer,
      });
    } catch (error) {
      console.log(error);
      return res.json(500).json({
        message: error.toString(),
      });
    }
  }

  // [POST] /api/employer/info/
  async updateInfo(req, res) {
    const mid = req.user.id;

    const info = req.body;

    try {
      const session = await mongoose.startSession();
      session.startTransaction();

      const employer = await Employer.findOneAndUpdate({ member: mid }, {
        department: info.department,
      }, { new: true }).select("-__v")

      delete info.department;

      const member = await Member.findOneAndUpdate({ _id: mid }, {
        ...info,
      }, { new: true }).select("-updatedAt -password -role -hidden -__v");

      await session.commitTransaction();
      session.endSession();

      return res.json({
        info: { 
          ...employer.toObject(), 
          member,
        },
      });
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      session.endSession();

      return res.json(500).json({
        message: error.toString(),
      });
    }
  }

  // [POST] api/employer/avatar
  async updateAvatar(req, res) {
    try {
      if (!req.file)
        return res.status(400).json({
          message: "Chưa có file nào được tải lên!",
        });
      
      const fileName = "avatar" + path.extname(req.file.originalname);

      const [files] = await bucket.getFiles({ prefix: `employer/${req.user.id}/avatar` });
      await Promise.all(files.map(file => file.delete()));

      const blob = bucket.file(`employer/${req.user.id}/avatar/${fileName}`);
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
        await Member.updateOne({ _id: req.user.id }, {
          avatar: url,
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

  // [DELETE] api/employer/avatar
  async deleteAvatar(req, res) {
    try {
      const [files] = await bucket.getFiles({ prefix: `employer/${req.user.id}/avatar` });
      await Promise.all(files.map(file => file.delete()));

      await Member.updateOne({ _id: req.user.id }, {
        avatar: null,
      });

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Có lỗi xảy ra: Error code <${error.code}>`,
      });
    }
  }

  // [POST] /api/employer/job/:jobId
  async updateJobInfo(req, res) {
    const { jobId } = req.params;
    const info = req.body;
    try {
      const { company } = await Employer.findById(req.user.uid);

      const job = await Job.findOneAndUpdate({
        _id: jobId,
        company: company,
      }, info, { new: true }).select("-__v -updatedAt -hiddenAt -hiddenBy").populate({
        path: "categories"
      });

      return res.json({
        info: job,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.toString(),
      });
    }
  }

  // [GET] api/employer/job/applied/:jobId
  async getListCandidateApplied(req, res) {
    const { jobId } = req.params;
    try {
      const applications = await Application.find({
        job: jobId
      })
        .populate({
          path: "candidate",
          select: "-__v",
          populate: {
            path: "member",
            select: "-updatedAt -password -role -hidden -__v",
          }
        });

      // const candidates = await Promise.all(applications.map(application => Candidate.findById(application.candidate).select("-__v").populate({
      //   path: "member",
      //   select: "-updatedAt -password -role -hidden -__v"
      // })));

      return res.json({
        applications,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.toString(),
      });
    }
  }

  // [GET] api/employer/candidate-applied
  async getAllCandidateApplied(req, res) {
    const { companyId } = req.user;
    try {
      console.log(companyId);

      const jobs = await Job.find({
        company: companyId,
      });

      const jobIds = jobs.map(job => job._id);
      console.log(jobIds);

      const candidateIds = await Application.distinct("candidate", {
        job: { $in: jobIds }
      });

      const candidates = await Candidate.find({
        _id: { $in: candidateIds }
      })
        .populate({
          path: "member",
          select: "-updatedAt -password -role -hidden -__v"
        });

      return res.json({
        candidates: candidates.map(candidate => ({
          _id: candidate.member._id,
          uid: candidate._id,
          fullName: candidate.member.fullName,
          avatar: candidate.member.avatar
        })),
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.toString(),
      });
    }
  }
}

module.exports = new EmployerController;