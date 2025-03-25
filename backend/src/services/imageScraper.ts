import axios from "axios";
import * as cheerio from "cheerio";

/**
 * 指定されたURLのHTMLから画像URL一覧を抽出します。
 * - <img src="..."> に加え、data-src / data-lazy などにも対応
 * - 相対パスも絶対URLに変換して返します
 */
export const extractImagesFromUrl = async (url: string): Promise<string[]> => {
  try {
    console.log(`🔍 URLへアクセス中: ${url}`);

    const response = await axios.get<string>(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      responseType: "text",
    });

    const html = response.data;
    console.log(`📄 HTML取得完了 (文字数: ${html.length})`);

    const images = extractImagesFromHtml(html, url);
    console.log(`✅ 抽出された画像数: ${images.length}`);

    return images;
  } catch (error: any) {
    console.error("❌ 画像抽出に失敗しました:", error.message);
    throw new Error("Failed to extract images");
  }
};

/**
 * HTML文字列から画像URLを抽出し、絶対パスに変換します。
 */
const extractImagesFromHtml = (html: string, baseUrl: string): string[] => {
  const $ = cheerio.load(html);
  const images: string[] = [];

  $("img").each((_, img) => {
    let src =
      $(img).attr("src") ||
      $(img).attr("data-src") ||
      $(img).attr("data-lazy") ||
      $(img).attr("data-original") ||
      "";

    if (!src || src.startsWith("data:image")) {
      return; // Base64などは除外
    }

    try {
      const absoluteUrl = src.startsWith("http")
        ? src
        : new URL(src, baseUrl).href;

      images.push(absoluteUrl);
    } catch {
      // 無効なURLはスキップ
    }
  });

  return images;
};
