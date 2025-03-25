import axios from "axios";
import { getGoogleApiConfig } from "../config/env";

const { API_KEY, CX } = getGoogleApiConfig();
const GOOGLE_SEARCH_URL = "https://www.googleapis.com/customsearch/v1";

interface GoogleSearchItem {
  link: string;
}

interface GoogleSearchResponse {
  items?: GoogleSearchItem[];
}

async function googleSearch(query: string): Promise<GoogleSearchItem[]> {
  const res = await axios.get<GoogleSearchResponse>(GOOGLE_SEARCH_URL, {
    params: {
      key: API_KEY,
      cx: CX,
      q: query,
    },
  });

  return res.data.items ?? [];
}

export async function searchOfficialSite(
  brand: string
): Promise<string | null> {
  const query = `${brand} 公式サイト`;
  const items = await googleSearch(query);

  for (const item of items) {
    const link = item.link;
    if (link.includes(brand.toLowerCase())) {
      return new URL(link).origin;
    }
  }

  return null;
}

export async function searchProductInOfficialSite(
  siteUrl: string,
  keyword: string
): Promise<string[]> {
  const query = `site:${siteUrl} ${keyword}`;
  const items = await googleSearch(query);

  return items.slice(0, 5).map((item) => item.link);
}
