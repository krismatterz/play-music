import { type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export class CookieManager {
  async get(name: string): Promise<string | undefined> {
    try {
      const cookieStore = await cookies();
      const cookie = cookieStore.get(name);
      return cookie?.value;
    } catch (error) {
      console.error("Error getting cookie:", error);
      return undefined;
    }
  }

  async set(
    name: string,
    value: string,
    options: CookieOptions,
  ): Promise<void> {
    try {
      const cookieStore = await cookies();
      cookieStore.set(name, value, options);
    } catch (error) {
      console.error("Error setting cookie:", error);
    }
  }

  async remove(name: string, options?: CookieOptions): Promise<void> {
    try {
      const cookieStore = await cookies();
      if (options) {
        cookieStore.set(name, "", { ...options, maxAge: 0 });
      } else {
        cookieStore.delete(name);
      }
    } catch (error) {
      console.error("Error removing cookie:", error);
    }
  }
}

export const cookieManager = new CookieManager();
