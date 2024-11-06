import { getOrdersWithProducts } from "@/actions/orders";
import PageComponent from "@/app/admin/orders/page-component";

export default async function OrdersPage() {
  const ordersWithProducts = await getOrdersWithProducts();
  if (!ordersWithProducts)
    return <div className="text-center font-bold text-2xl">No orders</div>;
  return (
    <div>
      <PageComponent ordersWithProducts={ordersWithProducts} />
    </div>
  );
}
