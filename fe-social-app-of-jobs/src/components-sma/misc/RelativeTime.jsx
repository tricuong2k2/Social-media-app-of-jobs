import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

const RelativeTime = ({ timestamp }) => {
  const [relativeTime, setRelativeTime] = useState("");

  useEffect(() => {
    const updateRelativeTime = () => {
      setRelativeTime(formatDistanceToNow(new Date(timestamp), { addSuffix: true }));
    };

    updateRelativeTime(); // Set initial relative time
    const interval = setInterval(updateRelativeTime, 60000); // Update every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, [timestamp]);

  return {relativeTime}
  };

export default RelativeTime;