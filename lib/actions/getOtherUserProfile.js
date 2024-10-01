export function getOtherUserProfile(userId, userArray) {
  for (const user of userArray) {
    // Split only at the first occurrence of the hyphen
    const firstHyphenIndex = user.indexOf("-");
    const id = user.slice(0, firstHyphenIndex); // User ID
    const profile = user.slice(firstHyphenIndex + 1); // Full profile URL (rest of the string)

    // If the id does not match the passed userId, return the corresponding profile URL
    if (id !== userId) {
      return profile;
    }
  }

  // If no match is found, return null or a fallback value
  return null;
}
