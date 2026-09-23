import React from "react";

// Simple clickable 1-5 star selector
const StarRating = ({ value, onChange }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <span>
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          style={{
            cursor: "pointer",
            fontSize: "20px",
            color: star <= value ? "#f5a623" : "#ccc",
          }}
        >
          &#9733;
        </span>
      ))}
    </span>
  );
};

export default StarRating;
