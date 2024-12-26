import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";

export default function Feed({ posts, feedStyle = "default" }) {
  console.log('posts: ', posts)
  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        <div className={`wrapperFeed ${feedStyle === "profile" ? "profile-feed" : ""}`}>
          {posts.map((p) => (
            <Post key={p.id} post={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
