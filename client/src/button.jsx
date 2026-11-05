import "./button.css";

export default function UpvoteButton({ spot, voted = false, onBoost, disabled = false }) {
  const upvotes = spot?.upvotes ?? 0;

  return (
    <button
      aria-label={`Boost this spot; ${upvotes} ${upvotes === 1 ? "boost" : "boosts"}`}
      aria-pressed={voted}
      className={voted ? "upvote-btn voted" : "upvote-btn"}
      disabled={disabled || !spot || !onBoost}
      onClick={() => onBoost(spot.id)}
      type="button"
    >
      <span aria-hidden="true">▲</span> {upvotes}
    </button>
  );
}