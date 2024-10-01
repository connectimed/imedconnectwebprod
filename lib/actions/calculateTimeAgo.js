import "firebase/firestore";

const calculateTimeAgo = (timestamp) => {
  // Check if timestamp is null or undefined
  if (!timestamp) {
    return "Loading...";
  }

  const currentTime = new Date();
  const lastInteractionTime = timestamp.toDate(); // Convert Firebase timestamp to JavaScript Date object
  const timeDifference = currentTime - lastInteractionTime;
  const minutesDifference = Math.floor(timeDifference / (1000 * 60));

  if (minutesDifference <= 2) {
    return "Now";
  } else if (minutesDifference > 2 && minutesDifference <= 60) {
    // Calculate minutes ago
    const minutesAgo = Math.floor(minutesDifference);
    return `${minutesAgo}m ago`;
  } else if (minutesDifference > 60 && minutesDifference <= 1440) {
    // Calculate hours ago
    const hoursAgo = Math.floor(minutesDifference / 60);
    return `${hoursAgo}h ago`;
  } else if (minutesDifference > 1440 && minutesDifference <= 43200) {
    // Calculate days ago
    const daysAgo = Math.floor(minutesDifference / (60 * 24));
    return `${daysAgo}d ago`;
  } else {
    // Calculate months ago
    return "Long ago";
  }
};

export default calculateTimeAgo;
