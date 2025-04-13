export default function useRemainingClasses(classesTaken, allClasses) {
  const takenClassSet = new Set(classesTaken);
  const remainingClasses = allClasses.filter((course) => {
    const courseCode = course.code.split("-")[0].trim();
    return !takenClassSet.has(courseCode);
  });

  return remainingClasses;
}
