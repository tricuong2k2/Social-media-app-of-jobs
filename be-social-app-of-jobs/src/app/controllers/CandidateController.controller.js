const Member = require("../models/Member.model");
const Candidate = require("../models/Candidate.model");
const Application = require("../models/Application.model");
const Employer = require("../models/Employer.model");
const Company = require("../models/Company.model");
const Job = require("../models/Job.model");

const mongoose = require("mongoose");
const path = require("path");
const { bucket, getDownloadURL } = require("../../config/firebase");
const { application } = require("express");

class CandidateController {

  // [GET] /api/candidate/info/
  async getInfo(req, res) {
    const mid = req.user.id;

    try {
      const candidate = await Candidate.findOne({ member: mid }).select("-__v").populate({
        path: "member",
        select: "-updatedAt -password -hidden -__v"
      })

      return res.json({
        info: candidate,
      });
    } catch (error) {
      console.log(error);
      return res.json(500).json({
        message: error.toString(),
      });
    }
  }

  // [POST] /api/candidate/info/
  async updateInfo(req, res) {
    const mid = req.user.id;

    const info = req.body;

    try {
      const session = await mongoose.startSession();
      session.startTransaction();

      const candidate = await Candidate.findOneAndUpdate({ member: mid }, {
        education: info.education,
      }, { new: true }).select("-__v")

      delete info.resumes;
      delete info.avatar;
      delete info.education;

      const member = await Member.findOneAndUpdate({ _id: mid }, {
        ...info,
      }, { new: true }).select("-updatedAt -password -role -hidden -__v");

      await session.commitTransaction();
      session.endSession();

      return res.json({
        info: { 
          ...candidate.toObject(), 
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

  // [POST] /api/candidate/avatar/
  async updateAvatar(req, res) {
    try {
      if (!req.file)
        return res.status(400).json({
          message: "Chưa có file nào được tải lên!",
        });
      
      const fileName = "avatar" + path.extname(req.file.originalname);

      const [files] = await bucket.getFiles({ prefix: `candidate/${req.user.id}/avatar` });
      await Promise.all(files.map(file => file.delete()));

      const blob = bucket.file(`candidate/${req.user.id}/avatar/${fileName}`);
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

  // [DELETE] api/candidate/avatar
  async deleteAvatar(req, res) {
    try {
      const [files] = await bucket.getFiles({ prefix: `canidate/${req.user.id}/avatar` });
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

  // [GET] /api/candidate/resumes
  async getResumes(req, res) {
    try {
        const candidate = await Candidate.findById(req.user.uid).select('resumes');
        if (!candidate) {
            return res.status(404).json({ message: 'Ứng viên không tìm thấy' });
        }
        res.json({
            resumes: candidate.resumes,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: `Có lỗi xảy ra: ${error.message}`,
        });
    }
  }

  // [POST] /api/candidate/resumes/
  async updateResumes(req, res) {
    try {
      if (!req.file)
        return res.status(400).json({
          message: "Chưa có file nào được tải lên!",
        });
      
      const normalizedFileName = Buffer.from(req.file.originalname, "ascii").toString("utf-8");

      const fileName = `${Date.now()}-${normalizedFileName}`;

      const blob = bucket.file(`candidate/${req.user.id}/resumes/${fileName}`);
      
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
        const resumes = await Candidate.findByIdAndUpdate(req.user.uid, {
          $push: {
            resumes: { 
              name: fileName,
              resume: url,
            }
          }
        }, { new: true }).select("resumes -_id");
        // console.log(resumes.resumes)
        const [newResume] = resumes.resumes.filter(resume => resume.name === fileName)

        return res.json({
          resume: {
            ...newResume.toObject(),
          },
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

  // [DELETE] /api/candidate/resume/:resumeId
  async deleteResume(req, res) {
    const mid = req.user.id;
    const { resumeId } = req.params;

    try {
      const candidateResumesInfo = await Candidate.findById(req.user.uid).select("resumes -_id");
      const [resumeFile] = candidateResumesInfo.resumes.filter(resume => resume._id.toHexString() === resumeId);

      await Candidate.updateOne({ member: mid }, {
        $pull: {
          resumes: {
            _id: resumeId,
          }
        }
      })

      await bucket.file(`candidate/${req.user.id}/resumes/${resumeFile.name}`).delete();

      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.json(500).json({
        message: error.toString(),
      });
    }
  }
  
  // [GET] /api/candidate/applied
  async getJobApplied(req, res) {
    const { uid } = req.user;

    try {
      const applicants = await Application
        .find({ candidate: uid })
        .populate("job");
      
      return res.json({
        applicants,
      })
    } catch (error) {
      console.log(error);
      return res.json(500).json({
        message: error.toString(),
      });
    }
  }

  // [POST] /api/candidate/save-job/
  async saveJob(req, res) {
    const { uid } = req.user;
    const { jobId } = req.body;

    try {
      await Candidate.updateOne({
        _id: uid
      }, {
        $push: {
          saveJobs: jobId,
        }
      });

      return res.status(200);
    } catch (error) {
      console.log(error);
      return res.json(500).json({
        message: error.toString(),
      });
    }
  }

  // [GET] /api/candidate/all-saved-jobs
  async getAllSavedJobs(req, res) {
    const { uid } = req.user;

    try {
      const savedJobs = await Candidate.findById(uid).populate({
        path: "saveJobs"
      });
      
      return res.json({
        savedJobs,
      })
    } catch (error) {
      console.log(error);
      return res.json(500).json({
        message: error.toString(),
      });
    }
  }

  // [GET] /api/candidate/company-applied
  async getCompanyApplied(req, res) {
    const { uid } = req.user;

    try {
      const applications = await Application.find({
        candidate: uid,
      });
      
      const jobs = applications.map(application => application.job);
      
      const companies = await Job.distinct("company", {
        _id: { $in: jobs }
      });

      const employers = await Employer.find({
        company: {
          $in: companies,
        }
      }).populate({
        path: "member",
        select: "-updatedAt -password -role -hidden -__v"
      })
        .populate({
          path: "company",
        });
      
      return res.json({
        employers,
      })
    } catch (error) {
      console.log(error);
      return res.json(500).json({
        message: error.toString(),
      });
    }
  }

    // [GET] /api/candidate/applied-jobs
  async getAppliedJobs(req, res) {
    const { uid } = req.user;

    try {
      const applications = await Application
        .find({ candidate: uid })
        .populate("job");

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

}

module.exports = new CandidateController;
