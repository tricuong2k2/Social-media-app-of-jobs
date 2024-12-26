import "./rightbar-online.css";

export default function RightbarOnline({user}) {
  return (
    <li className="rightbarFriend">
        <div className="rightbarFollowing">
            <img
                src={user.profilePicture}
                alt=""
                className="rightbarFollowingImg"
            />
            <span className="rightbarFollowingName">{user.username}</span>
        </div>
    </li>
  );
}
