import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Runs a tracking call once per unique key (e.g. product id, search term).
 * Prevents duplicate pushes from re-renders or React StrictMode double effects.
 *
 * Ordering: page-level events (view_item, search, view_cart, view_promotion) use a
 * layout effect so they land right after page_view. Lists inside the page
 * (ProductGrid -> view_item_list) pass deferred=true and fire afterwards.
 */
export default function useTrackOnce(key, fn, enabled = true, deferred = false) {
  const last = useRef(null);
  const k = JSON.stringify(key);
  const useAnyEffect = deferred ? useEffect : useLayoutEffect;
  useAnyEffect(() => {
    if (!enabled || key === null || key === undefined) return;
    if (last.current === k) return;
    last.current = k;
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k, enabled]);
}
