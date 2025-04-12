import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

// scrapes the given URL and returns the full page content
export async function POST(request) {
  let fullPageContent;
  const reqeustBody = await request.json();
  const url = reqeustBody.url;
  try {
    const { data: urlData } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
    });

    const $ = cheerio.load(urlData);
    fullPageContent = $.html();
  } catch (error) {
    throw new Error("Fail to request job details URL");
  }
  return NextResponse.json({ message: fullPageContent });
}
