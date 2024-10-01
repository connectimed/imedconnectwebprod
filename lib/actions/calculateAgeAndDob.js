// utils/ageAndDate.js

export const calculateAgeAndDob = (timestamp) => {
  const currentTime = new Date();
  const birthDate = timestamp.toDate(); // Convert Firebase timestamp to JavaScript Date object
  let age = currentTime.getFullYear() - birthDate.getFullYear();
  const m = currentTime.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && currentTime.getDate() < birthDate.getDate())) {
    age--;
  }

  const formattedDob = birthDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return `${age} years, ${formattedDob}`;
};
