import { Route, Routes } from "react-router-dom";

import socketClient from "socket.io-client";

import Admins from "./components/Admin/Admins/Admins";
import Candidates from "./components/Admin/Candidates/Candidates";
import Companies from "./components/Admin/Companies/Companies";
import Dashboard from "./components/Admin/Dashboard/DashBoard";
import Employers from "./components/Admin/Employers/Employers";
import PostedJob from "./components/Admin/PostedJob/PostedJob";
import PostedJobsOfCompany from "./components/Employer/PostedJob/PostedJob";
import Admin from "./pages/Admin/Admin";
import CandidateSignUp from "./pages/CandidateSignUp/CandidateSignUp";
import CompanyProfile from "./pages/CompanyProfile/CompanyProfile";
import CVManagementPage from "./pages/CVManagement/CVManagementPage";
import Employer from "./pages/Employer/Employer";
import EmployeerIndex from "./pages/EmployerIndex/EmployeerIndex";
import EmployerSignUp from "./pages/EmployerSignUp/EmployerSignUp";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";

import History from "./components/Admin/History/History";
import CompanyCandidateList from "./components/Employer/Candidate-List/Candidate-List";
import CompanyCandidateProflie from "./components/Employer/Candidate-Profile/Candidate-Profile";
import CompanyChat from "./components/Employer/Chat/Chat";
import CompanyEditProflie from "./components/Employer/Company-EditProfile/Company-EditProfile";
import CompanyProflie from "./components/Employer/Company-Profile/Company-Profile";
import EmployerEditProfile from "./components/Employer/Employer-EditProfile/Employer-EditProfile";
import EmployerProfile from "./components/Employer/Employer-Profile/Employer-Profile";
// import CompanyJobDetail from "./components/Employer/Job-Detail/Job-Detail";
import CompanyJobEdit from "./components/Employer/Job-Edit/Job-Edit";
// import CompanyJobPost from "./components/Employer/Job-Post/Job-Post";
// import CompanyJob from "./components/Employer/Job/Job";
import CandidateIndex from "./pages/CandidateIndex/CandidateIndex";

import { ConfigProvider } from "antd";
import Account from "./components/Admin/Account/Account";
import Chat from "./components/Admin/Chat/Chat";
import AppliedJobs from "./components/Candidate/AppliedJobs/AppliedJobs";
import ViewDetailJob from "./components/Candidate/JobDetail/JobDetail";
import SearchJob from "./components/Candidate/Search/SearchJob";
import { themes } from "./helper";
import UpdateCandidateInfo from "./pages/CVManagement/UpdateCandidateInfo";
import Error404 from "./pages/Error/Error404";

// import JobDetail from "./components/Employer/Job-Detail/Job-Detail";

const socket = socketClient("http://127.0.0.1:8000", {
  reconnectionAttempts: 5,
  reconnectionDelay: 10000,
  reconnection: true,
  connectionStateRecovery: {
    maxDisconnectionDuration: 3 * 60 * 1000, // 2 minutes
    skipMiddlewares: true,
  },
  query: {
    uid: new Date().getTime(),
  }
});

function App() {
  return (
    <div className="App">
      <ConfigProvider theme={themes}>
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/employer/index" element={<EmployeerIndex />} />
          <Route path="/candidate/sign-up" element={<CandidateSignUp />} />
          <Route path="/company/company-profile" element={<CompanyProfile />} />
          
          <Route path="/" element={<Home />}>
            <Route index element={<SearchJob />} />
            <Route path="view-detail-job/:jobId" element={<ViewDetailJob />}/>
          </Route>

          <Route path="/candidate" element={<CandidateIndex />}>
            <Route index element={<SearchJob />} />
            <Route path="cv-management" element={<CVManagementPage />} />
            <Route path="update-info" element={<UpdateCandidateInfo />} />
            <Route path="view-detail-job/:jobId" element={<ViewDetailJob />}/>
            <Route path="applied-jobs" element={<AppliedJobs />} />
          </Route>
          
          <Route path="/employer" element={<Employer />}>
            <Route index element={<PostedJobsOfCompany />} />
            <Route path="posted-jobs" element={<PostedJobsOfCompany />} />
            <Route path="company-profile" element={<CompanyProflie />} />
            <Route path="company-editprofile" element={<CompanyEditProflie />} />
            {/* <Route path="companyjob-detail" element={<CompanyJobDetail />} /> */}
            <Route path="companyjob-edit" element={<CompanyJobEdit />} />
            {/* <Route path="post-job" element={<CompanyJobPost />} /> */}
            {/* <Route path="companyjob" element={<CompanyJob />} /> */}
            <Route path="employer-profile" element={<EmployerProfile />} />
            <Route path="employer-editprofile" element={<EmployerEditProfile />} />
            <Route path="chat" element={<CompanyChat />} />
            <Route path="candidate-profile" element={<CompanyCandidateProflie />} />
            <Route path="job/:jobId/candidates-list" element={<CompanyCandidateList />} />
          </Route>

          <Route path="/employer/sign-up" element={<EmployerSignUp />} />
          <Route path="admin/" element={<Admin socket={socket} />}>
            <Route path="dashboard" index element={<Dashboard />} />
            <Route path="management/candidates" element={<Candidates />} />
            <Route path="management/employers" element={<Employers />} />
            <Route path="management/admins" element={<Admins />} />
            <Route path="management/companies" element={<Companies />} />
            <Route path="management/posted-job" element={<PostedJob />} />
            <Route path="account" element={<Account />} />
            <Route path="chat" element={<Chat socket={socket} />} />
            <Route path="history" element={<History />} />
          </Route>
          <Route path="/verify/:status" element={<VerifyEmail />} />
          <Route path='/*' element={<Error404 />} />
        </Routes>
      </ConfigProvider>
    </div>
  );
}

export default App;
