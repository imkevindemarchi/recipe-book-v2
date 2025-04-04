// Assets
import { supabase } from "../supabase";

// Types
import { THTTPResponse } from "../types";
import { TCategory } from "../types/category.type";

const TABLE = "categories";

export const CATEGORY_API = {
  getAll: async (): Promise<THTTPResponse> => {
    try {
      const { data, error } = await supabase.from(TABLE).select("*");

      if (!data || error)
        return {
          hasSuccess: false,
        };

      const elabData: TCategory[] = data.sort(
        (a: TCategory, b: TCategory) =>
          ((a.priority as number) - (b.priority as number)) as number
      );

      return {
        data: elabData,
        hasSuccess: true,
      };
    } catch (error) {
      console.error("🚀 ~ error:", error);
      return {
        hasSuccess: false,
      };
    }
  },

  getAllWithFilters: async (
    from: number,
    to: number,
    label: string
  ): Promise<THTTPResponse> => {
    try {
      const {
        data,
        count: totalRecords,
        error,
      } = await supabase
        .from(TABLE)
        .select("*", { count: "exact" })
        .range(from, to)
        .ilike("label", `%${label}%`);

      if (!data || error)
        return {
          hasSuccess: false,
        };

      return {
        data,
        hasSuccess: true,
        totalRecords: totalRecords && totalRecords,
      };
    } catch (error) {
      console.error("🚀 ~ error:", error);
      return {
        hasSuccess: false,
      };
    }
  },

  get: async (id: string): Promise<any> => {
    try {
      const { data, error } = await supabase.from(TABLE).select().eq("id", id);

      if (!data || error)
        return {
          hasSuccess: false,
        };

      return {
        hasSuccess: true,
        data: data[0],
      };
    } catch (error) {
      console.error("🚀 ~ error:", error);
    }
  },

  create: async (data: Partial<TCategory>): Promise<THTTPResponse> => {
    try {
      const { data: response, error } = await supabase
        .from(TABLE)
        .insert([data])
        .select();

      if (!response || error)
        return {
          hasSuccess: false,
        };

      return {
        hasSuccess: true,
        data: response[0].id,
      };
    } catch (error) {
      console.error("🚀 ~ error:", error);
      return {
        hasSuccess: false,
      };
    }
  },

  update: async (
    data: Partial<TCategory>,
    id: string
  ): Promise<THTTPResponse> => {
    try {
      const { data: response, error } = await supabase
        .from(TABLE)
        .update(data)
        .eq("id", id)
        .select();

      if (!response || error)
        return {
          hasSuccess: false,
        };

      return {
        hasSuccess: true,
        data: response[0].id,
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
      const { error } = await supabase.from(TABLE).delete().eq("id", id);

      if (error)
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
