import { getOrdersWithProducts } from "@/actions/orders";

export default async function OrdersPage() {
  const ordersWithProducts = await getOrdersWithProducts();
  if (!ordersWithProducts)
    return <div className="text-center font-bold text-2xl">No orders</div>;
  return <div>Orders</div>;
}
