export function joinUserIds(userIds) {
  // Sort the array in alphabetical order and join the elements with '_'
  return userIds.sort().join("_");
}
