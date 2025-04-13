export default async function useRemainingClasses(classesTaken) {
  const response = await fetch("/cseClasses.json");
  const jsonData = await response.json();
  const allClasses = jsonData.classes;

  const takenClassSet = new Set(classesTaken);

  const remainingClasses = allClasses.filter((course) => {
    const courseCode = course.code.split("-")[0].trim();

    const hasTaken = takenClassSet.has(courseCode);

    // Temporarily remove async classes as they are not supported
    const isAsync =
      course.schedule.dayAndTime === "Not specified" ||
      course.schedule.instructionMode === "Asynchronous Online";

    return !hasTaken && !isAsync;
  });

  return remainingClasses;
}
