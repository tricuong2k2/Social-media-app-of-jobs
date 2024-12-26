import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import RightbarOnline from "../rightbar-online/Rightbar-online";

export default function Rightbar({ profile }) {
  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          {/*
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
          */}
        </div>
        {/*
        <img className="rightbarAd" src="assets/ad.png" alt="" />
        */}
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        <h4 className="rightbarTitle">Thông tin người dùng</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Thành phố:</span>
            <br></br>
            <span className="rightbarInfoValue">New York</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Quê quán:</span>
            <br></br>
            <span className="rightbarInfoValue">Madrid</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Công việc hiện tại:</span>
            <br></br>
            <span className="rightbarInfoValue">Sinh viên</span>
          </div>
        </div>
        <h4 className="rightbarTitle">Bạn bè</h4>
        <div className="rightbarFollowings">
          {Users.slice(0, 6).map((u) => (
            <RightbarOnline key={u.id} user={u} />
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {profile ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
