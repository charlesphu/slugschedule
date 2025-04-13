

export async function getClassData(takenClasses) {
  console.log("Fetching class data...");
  const nonTakenClasses = OfferedClass.classes.filter(
    (offeredClass) => !takenClasses.includes(offeredClass.code)
  );

  return {
    metadata: {
      totalClasses: nonTakenClasses.length,
    },
    classes: nonTakenClasses,
  };
}