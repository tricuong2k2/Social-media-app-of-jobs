const authRoute = require("./auth.route");
const adminRoute = require("./admin.route");
const candidateRoute = require("./candidate.route");
const employerRoute = require("./employer.route");
const companyRoute = require("./company.route");
const jobCategoryRoute = require("./jobCategory.route");
const jobRoute = require("./job.route");
const applicationRoute = require("./application.route");
const postsRoute = require("./posts.route");


const { verifyJwt } = require("../app/middlewares/jwtMiddleware");
const { roleVerify } = require("../app/middlewares/roleMiddleware");

module.exports = (app) => {
  app.use("/api/posts", postsRoute)
  app.use("/api/application", verifyJwt, applicationRoute);
  app.use("/api/job", jobRoute);
  app.use("/api/job-category", jobCategoryRoute);
  app.use("/api/company", verifyJwt, roleVerify("employer"), companyRoute);
  app.use("/api/employer", verifyJwt, roleVerify("employer"), employerRoute);
  app.use("/api/candidate", verifyJwt, roleVerify("candidate"), candidateRoute);
  app.use("/api/admin", verifyJwt, roleVerify("admin"), adminRoute);
  app.use("/auth", authRoute);
  app.get("/", (req, res) => {
    res.json({
      message: "Initial backend for job protal website",
    })
  })
};
