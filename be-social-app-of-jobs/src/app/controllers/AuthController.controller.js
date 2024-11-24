const Member = require("../models/Member.model");
const Candidate = require("../models/Candidate.model");
const Employer = require("../models/Employer.model");
const Admin = require("../models/Admin.model");
const Company = require("../models/Company.model");

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const keys = require("../../config/secrets");
const mailer = require("../../utils/mail/mailing");
const { getErrorMessage } = require("../../utils/errors");

class AuthController {
  // [POST] /auth/login
  async loginWithPassword(req, res) {
    const { email, password, role } = req.body;
    const member = await Member.findOneAndUpdate(
      { email: email },
      {
        onlineAt: Date.now(),
      },
      { new: true }
    );

    if (
      member &&
      !member.hidden &&
      member.verifiedAt !== null &&
      member.role === role
    ) {
      bcrypt.compare(password, member.password, async (err, result) => {
        if (result) {
          const payload = {
            id: member.id,
            role: member.role,
            fullName: member.fullName,
            email: member.email,
          };

          switch (payload.role) {
            case "employer":
              const employer = await Employer.findOne({ member: member.id });
              payload.uid = employer.id;
              payload.companyId = employer.company;
              break;
            case "admin":
              const admin = await Admin.findOne({ member: member.id });
              payload.uid = admin.id;
              break;
            default:
              const candidate = await Candidate.findOne({ member: member.id });
              payload.uid = candidate.id;
              break;
          }
          let token = jwt.sign(payload, keys.jwtSecretKey, { expiresIn: "7d" });
          res.cookie("jwt", token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
          });

          return res.json({
            ...payload,
            avatar: member.avatar,
          });
        } else {
          return res.status(401).json({
            message: "Email hoặc password không chính xác!",
          });
        }
      });
    } else {
      // console.log(member);
      return res.status(401).json({
        message: member
          ? member.hidden
            ? "Tài khoản của bạn đã bị vô hiệu hóa!"
            : member.verifiedAt
              ? "Email hoặc password không chính xác!"
              : "Tài khoản của bạn chưa được xác minh"
          : "Email hoặc password không chính xác!",
      });
    }
  }

  // [POST] /auth/sign-up/candidate
  async candidateRegister(req, res) {
    let info = req.body;
    if (info.password !== info["confirm-password"]) {
      return res.status(409).json({
        message: "Mật khẩu xác nhận không khớp!",
      });
    }

    await bcrypt
      .hash(info.password, keys.BCRYPT_SALT_ROUND)
      .then((hashPassword) => (info = { ...info, password: hashPassword }));

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const newMember = (
        await Member.create(
          [
            {
              ...info,
              role: "candidate",
            },
          ],
          { session }
        )
      )[0];

      await Candidate.create(
        [
          {
            member: newMember.id,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      const emailTemplatePath = path.join(
        __dirname,
        "../../resources/views/form-verify.html"
      );
      const emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");
      await bcrypt
        .hash(info.email, keys.BCRYPT_SALT_ROUND)
        .then((hashEmail) => {
          const emailContent = emailTemplate.replace(
            "{{verificationLink}}",
            `${process.env.APP_URL}/auth/verify?email=${info.email}&token=${hashEmail}`
          );
          mailer.sendMail(info.email, "Verify Email", emailContent);
        });

      console.log("Email Sent!");

      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      session.endSession();

      const msg = getErrorMessage(error);
      return res.status(500).json({
        message: msg,
      });
    }
  }

  // [POST] /auth/send-mail
  async sendMail(req, res) {
    const { email } = req.body;
    const member = await Member.findOne({ email: email });

    if (member) {
      if (member.verifiedAt === null) {
        const emailTemplatePath = path.join(
          __dirname,
          "../../resources/views/form-verify.html"
        );
        const emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");
        await bcrypt.hash(email, keys.BCRYPT_SALT_ROUND).then((hashEmail) => {
          const emailContent = emailTemplate.replace(
            "{{verificationLink}}",
            `${process.env.APP_URL}/auth/verify?email=${email}&token=${hashEmail}`
          );
          mailer.sendMail(email, "Verify Email", emailContent);
        });

        console.log("Email Sent!");
        return res.sendStatus(200);
      } else {
        return res.status(401).json({
          message: "Email đã được xác minh!",
        });
      }
    } else {
      return res.status(409).json({
        message: "Email chưa được đăng ký!",
      });
    }
  }

  // [POST] /auth/sign-up/employer
  async employerRegister(req, res) {
    let info = req.body;
    if (info.password !== info["confirm-password"]) {
      return res.status(409).json({
        message: "Mật khẩu xác nhận không khớp!",
      });
    }
    await bcrypt
      .hash(info.password, keys.BCRYPT_SALT_ROUND)
      .then((hashPassword) => (info = { ...info, password: hashPassword }));

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const newMember = (
        await Member.create(
          [
            {
              fullName: info.fullName,
              email: info.email,
              password: info.password,
              tel: info.tel,
              gender: info.gender,
              role: "employer",
            },
          ],
          { session }
        )
      )[0];

      const newCompany = (
        await Company.create(
          [
            {
              name: info.company,
              address: {
                province: info.province,
                district: info.district,
                ward: info.ward,
              },
            },
          ],
          { session }
        )
      )[0];

      await Employer.create(
        [
          {
            member: newMember.id,
            company: newCompany.id,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      const emailTemplatePath = path.join(
        __dirname,
        "../../resources/views/form-verify.html"
      );
      const emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");
      await bcrypt
        .hash(info.email, keys.BCRYPT_SALT_ROUND)
        .then((hashEmail) => {
          const emailContent = emailTemplate.replace(
            "{{verificationLink}}",
            `${process.env.APP_URL}/auth/verify?email=${info.email}&token=${hashEmail}`
          );
          mailer.sendMail(info.email, "Verify Email", emailContent);
        });

      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      session.endSession();

      const msg = getErrorMessage(error);
      return res.status(500).json({
        message: msg,
      });
    }
  }

  // [GET] /auth/verify
  verifyEmail(req, res) {
    const { email, token } = req.query;
    bcrypt.compare(email, token, async (err, result) => {
      if (result) {
        const member = await Member.findOne({ email: email });

        if (member && member.verifiedAt === null) {
          await Member.updateOne(
            { email: email },
            {
              verifiedAt: new Date(),
            }
          );

          return res.redirect(`${process.env.URL_CLIENT}/verify/success`);
        }
      }

      return res.redirect(`${process.env.URL_CLIENT}/verify/error`);
    });
  }

  // [GET] /auth/logout
  async logout(req, res) {
    await Member.updateOne(
      { email: req.user.email },
      {
        online: false,
        onlineAt: Date.now(),
      }
    );
    res.clearCookie("jwt");
    res.sendStatus(200);
  }

  // [POST] /auth/navigation
  async navigation(req, res) {
    const token = req.cookies.jwt;

    if (token) {
      let isAllow = true, info;
      jwt.verify(token, keys.jwtSecretKey, (err, decoded) => {
        // err.name === "TokenExpiredError"

        if (err) {
          isAllow = false;
        }

        info = decoded;
      })

      if (isAllow) {
        return res.json({
          info,
        })
      }
    }

    return res.sendStatus(404);
  }
}

module.exports = new AuthController();
