import { IHome } from "../type";

const EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes

export async function getHomePageData(): Promise<IHome[]> {
  const cached = localStorage.getItem("homePageData");

  if (cached) {
    try {
      const { data, lastFetched } = JSON.parse(cached);
      const now = Date.now();

      if (now - lastFetched < EXPIRATION_TIME) {
        return data as IHome[]; // ✅ cached list
      }
    } catch (err) {
      console.error("Error parsing cached home data:", err);
    }
  }

  // ❌ expired or not cached → fetch new
  const res = await fetch("/api/homepage");
  if (!res.ok) throw new Error("Failed to fetch homepage data");

  const json: IHome[] | IHome = await res.json();

  // Always normalize into a list
  const home = Array.isArray(json) ? json : [json];

  localStorage.setItem(
    "homePageData",
    JSON.stringify({ data: home, lastFetched: Date.now() })
  );

  return home;
}

export function clearHomePageData() {
  localStorage.removeItem("homePageData");
}
