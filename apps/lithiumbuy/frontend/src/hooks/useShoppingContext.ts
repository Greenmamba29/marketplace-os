/**
 * useShoppingContext — persists tier/wing/store/filters across navigation
 * so "Continue Shopping" always returns the buyer to exactly where they left off.
 */
import { useCallback } from 'react';

export interface ShoppingContext {
  tier?: number;
  wing?: string;
  storeId?: string;
  storeName?: string;
  storeUrl?: string;
  category?: string;
  search?: string;
  scrollY?: number;
}

const KEY = 'grahmos_shopping_ctx';
const MALL_URL = 'https://marketplace-os-hub.netlify.app';

export function useShoppingContext() {
  const save = useCallback((ctx: ShoppingContext) => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ ...getContext(), ...ctx }));
    } catch {}
  }, []);

  const clear = useCallback(() => {
    try { sessionStorage.removeItem(KEY); } catch {}
  }, []);

  return { save, clear, getContext };
}

export function getContext(): ShoppingContext {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Returns the best "Continue Shopping" URL for the current context */
export function getContinueShoppingUrl(): string {
  const ctx = getContext();
  if (ctx.storeUrl && ctx.category) return `${ctx.storeUrl}/directory?category=${ctx.category}`;
  if (ctx.storeUrl) return `${ctx.storeUrl}/directory`;
  if (ctx.tier) return `${MALL_URL}#tier-${ctx.tier}`;
  return MALL_URL;
}

/** Label for the Continue Shopping button */
export function getContinueShoppingLabel(): string {
  const ctx = getContext();
  if (ctx.storeName && ctx.category) return `Continue in ${ctx.storeName} › ${ctx.category}`;
  if (ctx.storeName) return `Continue Shopping in ${ctx.storeName}`;
  if (ctx.wing) return `Back to ${ctx.wing}`;
  return 'Back to Mall';
}
