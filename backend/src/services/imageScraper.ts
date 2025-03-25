import axios from "axios";
import * as cheerio from "cheerio";

export const extractImagesFromUrl = async (url: string): Promise<string[]> => {
  try {
    console.log("🔍 アクセス先URL:", url);

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const html = response.data;
    console.log("📄 HTML取得成功。文字数:", html.length);

    const $ = cheerio.load(html);
    const images: string[] = [];

    const imgTags = $("img");
    console.log("🖼️ <img> タグの数:", imgTags.length);

    imgTags.each((_, img) => {
      let src =
        $(img).attr("src") ||
        $(img).attr("data-src") ||
        $(img).attr("data-lazy") ||
        $(img).attr("data-original") ||
        "";
      if (!src || src.startsWith("data:image")) {
        return;
      }
      if (src) {
        if (!src.startsWith("http")) {
          const baseUrl = new URL(url);
          src = new URL(src, baseUrl).href;
        }
        images.push(src);
      }
    });

    console.log("✅ 抽出された画像数:", images.length);
    return images;
  } catch (error: any) {
    console.error("❌ Image scraping failed:", error.message);
    throw error;
  }
};
