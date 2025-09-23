import { axiosInstance } from "@/utils/axiosInstance";
import { create } from "zustand";

interface SystemStore {
  getStatus: () => Promise<any>;
  getMetrics: () => Promise<any>;
  getUptime: () => Promise<any>;
  updateSettings: (data: { detectionThreshold?: number }) => Promise<any>;
}

export const systemStore = create<SystemStore>(() => ({
  getStatus: async () => {
    try {
      const res = await axiosInstance.get("/security/status");
      return res.data;
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
      return null;
    }
  },

  getMetrics: async () => {
    try {
      const res = await axiosInstance.get("/security/metrics");
      return res.data;
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
      return null;
    }
  },

  getUptime: async () => {
    try {
      const res = await axiosInstance.get("/security/uptime");
      return res.data;
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
      return null;
    }
  },

  updateSettings: async (data) => {
    try {
      const res = await axiosInstance.patch("/security/settings", data);
      return res.data;
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
      return null;
    }
  },
}));
