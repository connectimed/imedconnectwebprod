export function getOtherUserName(userId, userArray) {
  // Loop through the array and split each string by the first hyphen only
  for (const user of userArray) {
    const [id, name] = user.split("-", 2); // Split into two parts: userId and name

    // If the id does not match the passed userId, return the corresponding name
    if (id !== userId) {
      return name;
    }
  }

  // If no match is found, return null or a fallback value
  return null;
}
