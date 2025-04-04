// Assets
import { supabase } from "../supabase";

// Types
import { THTTPResponse } from "../types";

export const AUTH_API = {
  login: async (email: string, password: string): Promise<THTTPResponse> => {
    try {
      const res: any = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!res?.data || res?.error) {
        return {
          hasSuccess: false,
        };
      }

      return {
        data: res.data.session,
        hasSuccess: true,
      };
    } catch (error) {
      console.error("🚀 ~ error:", error);
      return {
        hasSuccess: false,
      };
    }
  },

  checkSession: async (): Promise<THTTPResponse> => {
    try {
      const res: any = await supabase.auth.refreshSession();

      if (!res?.data || res?.error) {
        return {
          hasSuccess: false,
        };
      }

      return {
        data: res.data.session,
        hasSuccess: true,
      };
    } catch (error) {
      console.error("🚀 ~ error:", error);
      return {
        hasSuccess: false,
      };
    }
  },

  logout: async (): Promise<THTTPResponse> => {
    try {
      const res: any = await supabase.auth.signOut();
      if (!res || res?.error)
        return {
          hasSuccess: false,
        };

      return { hasSuccess: true };
    } catch (error) {
      console.error("🚀 ~ error:", error);
      return {
        hasSuccess: false,
      };
    }
  },
};
