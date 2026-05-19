import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { Dealer } from "@/models/Dealer";
import { getAdminFromRequest } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

export async function GET(req: Request) {
  if (!(await getAdminFromRequest(req))) return jsonError("Unauthorized", 401);
  try {
    await connectDB();

    const [totalOrders, totalUsers, activeProducts, activeDealers, recentOrders] =
      await Promise.all([
        Order.countDocuments(),
        User.countDocuments(),
        Product.countDocuments({ isActive: true }),
        Dealer.countDocuments({ isActive: true }),
        Order.find()
          .populate("user", "name phone")
          .sort({ createdAt: -1 })
          .limit(10)
          .lean(),
      ]);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const ordersLast7 = await Order.find({ createdAt: { $gte: sevenDaysAgo } }).lean();

    const chartData: { date: string; orders: number; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayOrders = ordersLast7.filter(
        (o) => new Date(o.createdAt).toISOString().split("T")[0] === dateStr
      );
      chartData.push({
        date: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((s, o) => s + o.total, 0),
      });
    }

    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    return jsonSuccess({
      stats: {
        totalOrders,
        totalUsers,
        activeProducts,
        activeDealers,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      recentOrders,
      chartData,
    });
  } catch (e) {
    console.warn("DB connection failed, returning empty dashboard stats", e);
    return jsonSuccess({
      stats: {
        totalOrders: 0,
        totalUsers: 0,
        activeProducts: 0,
        activeDealers: 0,
        totalRevenue: 0,
      },
      recentOrders: [],
      chartData: [],
    });
  }
}
