import { Router } from "express";
import {
  searchOfficialSite,
  searchProductInOfficialSite,
} from "../services/googleSearch";

const router = Router();

router.get("/", async (req, res) => {
  const brand = req.query.brand as string;
  const keyword = req.query.keyword as string;

  if (!brand || !keyword) {
    return res.status(400).json({ error: "brand and keyword are required" });
  }

  try {
    const brandUrl = await searchOfficialSite(brand);
    if (!brandUrl) {
      return res
        .status(404)
        .json({ error: "Official site not found for this brand" });
    }

    const results = await searchProductInOfficialSite(brandUrl, keyword);

    res.json({
      brand,
      keyword,
      officialSite: brandUrl,
      results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
