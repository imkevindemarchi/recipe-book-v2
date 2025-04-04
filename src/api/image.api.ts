// Assets
import { supabase } from "../supabase";

// Types
import { THTTPResponse } from "../types";

const TABLE = "images";

export const IMAGES_API = {
  add: async (id: string, file: File): Promise<THTTPResponse> => {
    try {
      const { data, error } = await supabase.storage
        .from(TABLE)
        .upload(id, file);

      if (!data || error)
        return {
          hasSuccess: false,
        };

      return {
        hasSuccess: true,
      };
    } catch (error) {
      console.error("🚀 ~ error:", error);
      return {
        hasSuccess: false,
      };
    }
  },

  delete: async (id: string): Promise<THTTPResponse> => {
    try {
      const { data, error } = await supabase.storage.from(TABLE).remove([id]);

      if (!data || error)
        return {
          hasSuccess: false,
        };

      return {
        hasSuccess: true,
      };
    } catch (error) {
      console.error("🚀 ~ error:", error);
      return {
        hasSuccess: false,
      };
    }
  },
};
