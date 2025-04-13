export async function UseWebscrape(url) {
  let fullPageContent;
  try {
    const response = await fetch("/api/webscraper", {
      method: "POST",
      body: JSON.stringify({ url: url }),
    });
    const data = await response.json();
    fullPageContent = data.message;
  } catch (error) {
    return "Invalid URL. Please provide a valid job description URL.";
  }
  return fullPageContent;
}
