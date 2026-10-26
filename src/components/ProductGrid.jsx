import ProductCard from "./ProductCard";
import useTrackOnce from "../analytics/useTrackOnce";
import { viewItemList } from "../analytics/events";

/** Renders a product list and pushes view_item_list once per list + product set. */
export default function ProductGrid({ list, products }) {
  useTrackOnce(products.length ? [list.id, products.map(p => p.id)] : null, () => viewItemList(list, products), true, true);
  return (
    <div className="grid">
      {products.map((p, i) => <ProductCard key={p.id} product={p} list={list} index={i} />)}
    </div>
  );
}
