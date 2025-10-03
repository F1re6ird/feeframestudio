import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ImageFile {
    url: string;
    publicId: string;
}

interface HomePageData {
    heroText: string;
    heroVideo: ImageFile[];
    whyChoose: string;
    whyChooseUsPic: ImageFile[];
    aboutPic: ImageFile[];
    showreelUrl: string;
    shortAbout: string;
}
interface HomeStore {
    data: HomePageData[] | null;
    loading: boolean;
    lastFetched: number | null;
    fetchData: () => Promise<void>;
    clearData: () => void;
}

const EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

export const useHomeStore = create<HomeStore>()(
    persist(
        (set, get) => ({
            data: null,
            loading: false,
            lastFetched: null,

            fetchData: async () => {
                const { data, lastFetched } = get();
                const now = Date.now();

                // ✅ Use cache if valid
                if (data && lastFetched && now - lastFetched < EXPIRATION_TIME) {
                    return;
                }

                set({ loading: true });

                try {
                    const res = await fetch("/api/home"); // <-- Your API endpoint
                    if (!res.ok) throw new Error("Failed to fetch home data");
                    const json = await res.json();

                    set({
                        data: json,       // should match HomePageData shape
                        lastFetched: now,
                        loading: false,
                    });
                } catch (err) {
                    console.error("Error fetching home data:", err);
                    set({ loading: false });
                }
            },

            clearData: () => set({ data: null, lastFetched: null }),
        }),
        {
            name: "home-storage", // localStorage key
            storage: {
                getItem: (name) => {
                    const value = localStorage.getItem(name);
                    return value ? JSON.parse(value) : null;
                },
                setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
                removeItem: (name) => localStorage.removeItem(name),
            },
        }
    )
);
