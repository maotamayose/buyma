import { Router } from "express";
import { extractImagesFromUrl } from "../services/imageScraper";

const router = Router();

/**
 * POST /image/scrape
 * リクエストボディに指定されたURLから画像を抽出し、画像URL一覧を返す
 *
 * リクエストボディ例:
 * {
 *   "url": "https://example.com"
 * }
 *
 * レスポンス例:
 * {
 *   "images": ["https://example.com/img1.jpg", "https://example.com/img2.png"]
 * }
 */
router.post("/scrape", async (req, res) => {
  const { url } = req.body;
  console.log("📥 /image/scrape にPOSTされたURL:", url);

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const images = await extractImagesFromUrl(url);
    res.json({ images });
  } catch (error) {
    res.status(500).json({ error: "Failed to scrape images" });
  }
});
export default router;
