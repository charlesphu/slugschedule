export default async function useRemainingClasses(classesTaken) {
  const response = await fetch("/cseClasses.json");
  const jsonData = await response.json();
  const allClasses = jsonData.classes;

  const takenClassSet = new Set(classesTaken);

  const remainingClasses = allClasses.filter((course) => {
    const courseCode = course.code.split("-")[0].trim();
    return !takenClassSet.has(courseCode);
  });

  return remainingClasses;
}
