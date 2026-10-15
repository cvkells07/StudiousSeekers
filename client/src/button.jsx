import "./button.css";

export default function UpvoteButton({ count, voted, onClick }) {
  return (
    <button
      className={voted ? "upvote-btn voted" : "upvote-btn"}
      onClick={onClick}
    >
      ▲ {count}
    </button>
  );
}