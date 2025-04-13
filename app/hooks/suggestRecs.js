
export async function suggestRecs(takenClasses) {
  const pdfText = takenClasses
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          pdfText,
          requestType: "rankings",
      }),
    });
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error:", error);
  }
}
