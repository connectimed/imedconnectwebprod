import "firebase/firestore";

const calculateFutureDate = (timestamp, type) => {
  const date = timestamp.toDate();
  const futureDate = new Date(date);

  if (type === "Y") {
    futureDate.setFullYear(futureDate.getFullYear() + 1);
  } else if (type === "M") {
    futureDate.setMonth(futureDate.getMonth() + 1);
  }

  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Intl.DateTimeFormat("en-GB", options).format(futureDate);
};

export default calculateFutureDate;
