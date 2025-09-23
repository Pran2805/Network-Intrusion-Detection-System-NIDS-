import { axiosInstance } from "@/utils/axiosInstance";
import { create } from "zustand";

interface ThreatStore {
  getStatistics: () => Promise<any[]>;
  getTypes: () => Promise<any[]>;
}

export const threatStore = create<ThreatStore>(() => ({
  getStatistics: async () => {
    try {
      const res = await axiosInstance("/threats/statistics");
      return Array.isArray(res.data) ? res.data : [];
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Statistics Error:", err.message);
      } else {
        console.error("An unknown error occurred", err);
      }
      return [];
    }
  },

  getTypes: async () => {
    try {
      const res = await axiosInstance("/threats/types");
      return Array.isArray(res.data) ? res.data : [];
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Types Error:", err.message);
      } else {
        console.error("An unknown error occurred", err);
      }
      return [];
    }
  },
}));
