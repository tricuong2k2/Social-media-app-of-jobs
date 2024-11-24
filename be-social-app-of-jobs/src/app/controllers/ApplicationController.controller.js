const Application = require("../models/Application.model");
const Job = require("../models/Job.model");
const Employer = require("../models/Employer.model");

const path = require("path");
const { bucket, getDownloadURL } = require("../../config/firebase");

class ApplicationController {
  // [POST] /api/application/apply/uploaded-resume
  async applyForJob(req, res) {
    const { uid } = req.user;
    // resume is name: abc.pdf, xyz.docx, ...
    const { job, resume, description } = req.body;

    try {
      const jobInfo = await Job.findById(job).select("deadlineForSubmission company");
      const docs = await Application.countDocuments({ candidate: uid, job: job });
      
      if (docs === 0 && (new Date(jobInfo.deadlineForSubmission)).getTime() >= (new Date()).getTime()) {
        const employer = await Employer.findOne({ company: jobInfo.company });
        const fileType = path.extname(resume);
        const srcFilePath = `candidate/${req.user.id}/resumes/${resume}`;
        const destFilePath = `employer/${employer.member}/jobs/${job}/${req.user.id}${fileType}`;

        await bucket.file(srcFilePath).copy(bucket.file(destFilePath));

        const url = await getDownloadURL(bucket.file(destFilePath));

        await Application.create({
          candidate: uid,
          job: job,
          resume: url,
          description: description,
        });
  
        return res.sendStatus(200);
      } else {
        if (docs > 0)
          return res.status(404).json({
            message: "Công việc này đã được bạn ứng tuyển trước đó",
          });
        else
          return res.status(404).json({
            message: "Đã hết hạn ứng tuyển cho công việc này",
          });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.toString(),
      });
    }
  }

  // [POST] /api/application/apply/new-resume
  async applyForJobWithUploadNewResume(req, res) {
    const { uid } = req.user;
    // resume is name: abc.pdf, xyz.docx, ...
    const { job, description } = req.body;

    try {
      const jobInfo = await Job.findById(job).select("deadlineForSubmission company");
      const docs = await Application.countDocuments({ candidate: uid, job: job });
      
      if (docs === 0 && (new Date(jobInfo.deadlineForSubmission)).getTime() >= (new Date()).getTime()) {
        if (!req.file)
          return res.status(400).json({
            message: "Chưa có file nào được tải lên!",
          });
        
        // const normalizedFileName = Buffer.from(req.file.originalname, "ascii").toString("utf-8");
  
        // const fileName = `${Date.now()}-${normalizedFileName}`;
        const employer = await Employer.findOne({ company: jobInfo.company });
        const fileType = path.extname(req.file.originalname);
  
        const blob = bucket.file(`employer/${employer.member}/jobs/${job}/${req.user.id}${fileType}`);
        
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
          await Application.create({
            candidate: uid,
            job: job,
            resume: url,
            description: description,
          });
  
          return res.sendStatus(200);
        });
  
        blobStream.end(req.file.buffer);
      } else {
        if (docs > 0)
          return res.status(404).json({
            message: "Công việc này đã được bạn ứng tuyển trước đó",
          });
        else
          return res.status(404).json({
            message: "Đã hết hạn ứng tuyển cho công việc này",
          });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.toString(),
      });
    }
  }
}

module.exports = new ApplicationController;
