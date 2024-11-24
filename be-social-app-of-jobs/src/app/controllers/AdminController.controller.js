const Candidate = require("../models/Candidate.model");
const Employer = require("../models/Employer.model");
const Admin = require("../models/Admin.model");
const Member = require("../models/Member.model");
const Company = require("../models/Company.model");
const Job = require("../models/Job.model");

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { bucket, getDownloadURL } = require("../../config/firebase");

const mailer = require("../../utils/mail/mailing");

class AdminController {
  // [GET] /api/admin/info
  async getAdminInfo(req, res) {
    const uid = req.user.uid;

    try {
      const admin = await Admin.findById(uid).populate({
        path: "member",
        select: "-updatedAt -password -hiddenAt -hiddenBy"
      }).select("-__v");

      return res.json({
        info: {
          uid: admin._id,
          ...admin.member.toObject(),
        },
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Có lỗi xảy ra: Error code <${error.code}>`,
      });
    }
  }

  // [POST] /api/admin/info
  async updateAdminInfo(req, res) {
    const mid = req.user.id;
    const info = req.body;

    try {
      const member = await Member.findOneAndUpdate({ _id: mid }, {
        ...info,
      }, { new: true }).select("-updatedAt -password -role -hidden -__v");

      return res.json({
        info: {
          uid: req.user.uid,
          ...member.toObject(),
        },
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Có lỗi xảy ra: Error code <${error.code}>`,
      });
    }
  }

  // [GET] /api/admin/overview
  async overviewInfo(req, res) {

    // await new Promise((resolve) => setTimeout(resolve, 5000));

    try {
      const today = new Date();

      const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const firstDayOfCurrMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDayOfCurrMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      await Promise.all([
        await Job.find({
          createdAt: {
            $gte: firstDayOfLastMonth,
            $lte: lastDayOfCurrMonth,
          },
        }),
        await Member.find({
          createdAt: {
            $gte: firstDayOfLastMonth,
            $lte: lastDayOfCurrMonth,
          },
          $or: [
            { role: "candidate", },
            { role: "employer", },
          ]
        })
      ]).then(([jobs, members]) => {
        let [currCandidate, currEmployer, lastCandidate, lastEmployer, currJob, lastJob] = [0, 0, 0, 0, 0, 0];
        members.forEach((member) => {
          if (member.role === "candidate") {
            if (firstDayOfCurrMonth <= member.createdAt && member.createdAt <= lastDayOfCurrMonth)
              currCandidate++;
            else lastCandidate++;
          } else {
            if (firstDayOfCurrMonth <= member.createdAt && member.createdAt <= lastDayOfCurrMonth)
              currEmployer++;
            else lastEmployer++;
          }
        });

        jobs.forEach((job) => {
          if (firstDayOfCurrMonth <= job.createdAt && job.createdAt <= lastDayOfCurrMonth)
            currJob++;
          else lastJob++;
        })

        return res.json({
          candidates: {
            currAmount: currCandidate,
            lastAmount: lastCandidate,
          },
          employers: {
            currAmount: currEmployer,
            lastAmount: lastEmployer,
          },
          jobs: {
            currAmount: currJob,
            lastAmount: lastJob,
          }
        });
      })

      // await Member.find({
      //   createdAt: {
      //     $gte: firstDayOfLastMonth,
      //     $lte: lastDayOfCurrMonth,
      //   },
      //   $or: [
      //     { role: "candidate", },
      //     { role: "employer", },
      //   ]
      // }).then(members => {
      //   let [currCandidate, currEmployer, lastCandidate, lastEmployer] = [0, 0, 0, 0];
      //   members.forEach((member) => {
      //     if (member.role === "candidate") {
      //       if (firstDayOfCurrMonth <= member.createdAt && member.createdAt <= lastDayOfCurrMonth)
      //         currCandidate++;
      //       else lastCandidate++;
      //     } else {
      //       if (firstDayOfCurrMonth <= member.createdAt && member.createdAt <= lastDayOfCurrMonth)
      //         currEmployer++;
      //       else lastEmployer++;
      //     }
      //   });

      //   return res.json({
      //     candidates: {
      //       currAmount: currCandidate,
      //       lastAmount: lastCandidate,
      //     },
      //     employers: {
      //       currAmount: currEmployer,
      //       lastAmount: lastEmployer,
      //     }
      //   });
      // })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Có lỗi xảy ra: Error code <${error.code}>`,
      });
    }
  }

  // [GET] /api/admin/statistic/<role>
  async statisticByMonth(req, res) {

    // await new Promise((resolve) => setTimeout(resolve, 5000));

    const pos = req.params.role;

    const months = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    const today = new Date();
    const currentMonth = today.getMonth();

    await Member.find({
      createdAt: {
        $gte: new Date(today.getFullYear(), 0, 1),
        $lte: new Date(today.getFullYear(), currentMonth + 1, 0),
      },
      role: pos,
    }).then(members => {
      const data = Array(currentMonth + 1).fill(0);
      members.forEach((member) => data[new Date(member.createdAt).getMonth()]++);

      return res.json({
        labels: months.slice(0, today.getMonth() + 1),
        statistic: data,
      });
    })
  }

  // [GET] /api/admin/statistic/jobs
  async statisticPostedJobs(req, res) {

    // await new Promise((resolve) => setTimeout(resolve, 5000));

    const pos = req.params.role;

    const months = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    const today = new Date();
    const currentMonth = today.getMonth();

    await Job.find({
      createdAt: {
        $gte: new Date(today.getFullYear(), 0, 1),
        $lte: new Date(today.getFullYear(), currentMonth + 1, 0),
      },
    }).then(jobs => {
      const data = Array(currentMonth + 1).fill(0);
      jobs.forEach((job) => data[new Date(job.createdAt).getMonth()]++);

      return res.json({
        labels: months.slice(0, today.getMonth() + 1),
        statistic: data,
      });
    })
  }

  // [GET] /api/admin/list/<role>?hidden=<boolean>&page=<number>&size=<number>
  async getListMembers(req, res) {
    const { role } = req.params;
    const { hidden, page, size } = req.query;

    try {
      const total = await Member.countDocuments({
        role: role,
        hidden: hidden === "true",
      });

      let members = [];
      const excludeFields = '-password -createdAt -updatedAt -hiddenAt -hiddenBy';
      switch (role) {
        case "employer":
          const employers = await Employer.find({}).populate({
            path: "member",
            match: {
              hidden: hidden === "true",
            },
            options: { skip: (page - 1) * size, limit: size },
            select: excludeFields,
          }).populate({
            path: "company",
            select: "-_id name",
          });
          members = employers.filter(candidate => candidate.member !== null);
          break;
        case "admin":
          const admins = await Admin.find({}).populate({
            path: "member",
            match: {
              hidden: hidden === "true",
            },
            options: { skip: (page - 1) * size, limit: size },
            select: excludeFields,
          });
          members = admins.filter(candidate => candidate.member !== null);
          break;
        case "candidate":
          const candidates = await Candidate.find({}).populate({
            path: "member",
            match: {
              hidden: hidden === "true",
            },
            options: { skip: (page - 1) * size, limit: size },
            select: excludeFields,
          });
          members = candidates.filter(candidate => candidate.member !== null);
          break;
        default:
          break;
      }

      return res.json({
        members,
        info: {
          page,
          size,
          total,
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Có lỗi xảy ra: Error code <${error.code}>`,
      });
    }
  }

  // [POST] /api/admin/hidden
  async hiddenMembers(req, res) {
    const { members, adminId } = req.body;
    const emails = members?.map((mem) => mem.email);
    const memIds = members?.map((mem) => mem.mbid);

    try {
      await Member.updateMany({ _id: { $in: memIds } }, {
        hidden: true,
        hiddenAt: new Date(),
        hiddenBy: adminId,
      })

      const emailTemplatePath = path.join(__dirname, '../../resources/views/form-notify.html');
      const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
      const emailContent = emailTemplate.replace('{{message}}', `
        Tài khoản của bạn đã bị quản trị viên vô hiệu hóa. 
        Hiện tại bạn không thể truy cập trang web của chúng tôi thông qua tài khoản đăng ký bởi email này.
      `);

      emails.forEach((email) => mailer.sendMail(email, "Vô hiệu hóa tài khoản", emailContent));

      console.log("Send all mails!");

      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Có lỗi xảy ra: ${error.code ? "Error code <" + error.code + ">" : error.message}`,
      })
    }
  }

  // [POST] /api/admin/enable
  async enableMembers(req, res) {
    const { members } = req.body;
    const emails = members?.map((mem) => mem.email);
    const memIds = members?.map((mem) => mem.mbid);

    try {
      await Member.updateMany({ _id: { $in: memIds } }, {
        hidden: false,
        hiddenAt: null,
        hiddenBy: null,
      })

      const emailTemplatePath = path.join(__dirname, '../../resources/views/form-notify.html');
      const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
      const emailContent = emailTemplate.replace('{{message}}', `
        Tài khoản của bạn đã được quản trị viên khôi phục sau khi bị vô hiệu hóa.
        Bạn có thể tiếp tục sử dụng tài khoản để đăng nhập vào trang web của chúng tôi.  
      `);
      emails.forEach((email) => mailer.sendMail(email, "Khôi phục tài khoản", emailContent));

      console.log("Send all mails!");

      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Có lỗi xảy ra: ${error.code ? "Error code <" + error.code + ">" : error.message}`,
      })
    }
  }

  // [POST] /api/admin/verify
  async verifyMembers(req, res) {
    const { members } = req.body;
    const emails = members?.map((mem) => mem.email);
    const memIds = members?.map((mem) => mem.mbid);

    try {
      await Member.updateMany({ _id: { $in: memIds } }, {
        verifiedAt: new Date(),
      })

      const emailTemplatePath = path.join(__dirname, '../../resources/views/form-notify.html');
      const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
      const emailContent = emailTemplate.replace('{{message}}', `
        Tài khoản của bạn đã được quản trị viên xác minh thủ công.
        Giờ đây bạn có thể sử dụng tài khoản đã đăng ký dựa trên email này để đăng nhập vào website của chúng tôi.  
      `);
      emails.forEach((email) => mailer.sendMail(email, "Tài khoản đã được xác minh", emailContent));

      console.log("Send all mails!");

      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Có lỗi xảy ra: ${error.code ? "Error code <" + error.code + ">" : error.message}`,
      })
    }
  }

  // [GET] /api/admin/list/companies?hidden=<boolean>&page=<number>&size=<number>
  async getListCompanies(req, res) {
    const { hidden, page, size } = req.query;

    try {
      const total = await Member.countDocuments({
        role: "employer",
        hidden: hidden === "true",
      });

      const employers = await Employer.find({})
        .populate({
          path: "member",
          match: {
            hidden: hidden === "true",
          },
          options: { skip: (page - 1) * size, limit: size },
          select: "tel email verifiedAt",
        })
        .populate({
          path: "company",
        })

      const companies = employers.filter(employer => employer.member !== null);

      return res.json({
        companies,
        info: {
          page,
          size,
          total,
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Có lỗi xảy ra: Error code <${error.code}>`,
      });
    }
  }

  // [GET] /api/admin/list/posted-job?hidden=<boolean>&page=<number>&size=<number>
  async getListPostedJob(req, res) {
    const { hidden, page, size } = req.query;

    try {
      const total = await Job.countDocuments({
        hidden: hidden === "true",
      });

      const jobs = await Job.find({
        hidden: hidden === "true",
      })
        .skip((page - 1) * size)
        .limit(size)
        .populate({
          path: "categories",
        })
        .populate({
          path: "company",
        })

      return res.json({
        jobs,
        info: {
          page,
          size,
          total,
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Có lỗi xảy ra: Error code <${error.code}>`,
      });
    }
  }

  // [POST] /api/admin/posted-job/hidden
  async hiddenPostedJobs(req, res) {
    const { jobs, adminId } = req.body;

    try {
      await Job.updateMany({ _id: { $in: jobs } }, {
        hidden: true,
        hiddenAt: new Date(),
        hiddenBy: adminId,
      })

      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Có lỗi xảy ra: ${error.code ? "Error code <" + error.code + ">" : error.message}`,
      })
    }
  }

  // [POST] /api/admin/posted-job/enable
  async enablePostedJobs(req, res) {
    const { jobs } = req.body;

    try {
      await Job.updateMany({ _id: { $in: jobs } }, {
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

  // [DELETE] /api/admin/posted-job/delete
  async deletePostedJob(req, res) {
    const { jobs } = req.body;
    try {
      await Job.deleteMany({
        _id: { $in: jobs }
      });

      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: `Có lỗi xảy ra: Error code <${error.code}>`,
      });
    }
  }

  // [DELETE] /api/admin/:role/delete
  async deleteMembers(req, res) {
    const { role } = req.params;
    const { members } = req.body;
    const emails = members?.map((mem) => mem.email);
    const memIds = members?.map((mem) => mem.mbid);

    try {
      const session = await mongoose.startSession();
      session.startTransaction();

      switch (role) {
        case "employers":
          let employers = await Employer.find({}).select("_id company").populate({
            path: "member",
            match: { _id: { $in: memIds } },
            select: "",
          });
          // console.log(employers);
          employers = employers.filter(employer => employer.member)
          const employerIds = employers.map(employer => employer._id);
          const companies = employers.map(employer => employer.company);

          await Promise.all([
            await Company.deleteMany({ _id: { $in: companies } }),
            await Employer.deleteMany({ _id: { $in: employerIds } }),
            await Job.deleteMany({ company: { $elemMatch: { _id: { $in: companies } } } })
          ]);
          break;
        case "candidates":
          const candidates = await Candidate.find({}).select("_id").populate({
            path: "member",
            match: { _id: { $in: memIds } },
            select: "",
          });
          console.log(candidates);

          const candidateIds = candidates.filter(candidate => candidate.member);
          await Candidate.deleteMany({ _id: { $in: candidateIds } });
          break;
        default:
          break;
      }

      await Member.deleteMany({ _id: { $in: memIds } });

      const emailTemplatePath = path.join(__dirname, '../../resources/views/form-notify.html');
      const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
      const emailContent = emailTemplate.replace('{{message}}', `
        Tài khoản của bạn đã bị quản trị viên xóa khỏi hệ thống.
        Bạn phải đăng ký lại nếu muốn tiếp tục đăng nhập vào website của chúng tôi.  
      `);
      emails.forEach((email) => mailer.sendMail(email, "Tài khoản đã bị xóa", emailContent));

      console.log("Send all mails!");

      await session.commitTransaction();
      session.endSession();
      return res.sendStatus(200);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      return res.status(500).json({
        message: `Có lỗi xảy ra: Error code <${error.code}>`,
      });
    }
  }

  // [POST] /api/admin/avatar
  async updateAvatar(req, res) {
    try {
      if (!req.file)
        return res.status(400).json({
          message: "Chưa có file nào được tải lên!",
        });

      const fileName = "avatar" + path.extname(req.file.originalname);

      const [files] = await bucket.getFiles({ prefix: `admin/${req.user.id}/avatar` });
      await Promise.all(files.map(file => file.delete()));

      const blob = bucket.file(`admin/${req.user.id}/avatar/${fileName}`);
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

  // [DELETE] api/admin/avatar
  async deleteAvatar(req, res) {
    try {
      const [files] = await bucket.getFiles({ prefix: `admin/${req.user.id}/avatar` });
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

  // [POST] /api/admin/member/avatar/:mid
  async updateMemberAvatar(req, res) {
    const { mid } = req.params;

    try {
      if (!req.file)
        return res.status(400).json({
          message: "Chưa có file nào được tải lên!",
        });

      const fileName = "avatar" + path.extname(req.file.originalname);

      const [files] = await bucket.getFiles({ prefix: `candidate/${mid}/avatar` });
      await Promise.all(files.map(file => file.delete()));

      const blob = bucket.file(`candidate/${mid}/avatar/${fileName}`);
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
        await Member.updateOne({ _id: mid }, {
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

  // [DELETE] api/admin/member/avatar/:mid
  async deleteMemberAvatar(req, res) {
    const { mid } = req.params;

    try {
      const [files] = await bucket.getFiles({ prefix: `candidate/${mid}/avatar` });
      await Promise.all(files.map(file => file.delete()));

      await Member.updateOne({ _id: mid }, {
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

  // [POST] /api/admin/member/info/:mid
  async updateMemberInfo(req, res) {
    const { mid } = req.params;
    const info = req.body;
    console.log(info);
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
}

module.exports = new AdminController;
