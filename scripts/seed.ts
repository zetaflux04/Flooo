import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { getMongoUri } from "../lib/mongodb-uri";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const ProductSchema = new mongoose.Schema({
  name: String,
  slug: String,
  category: String,
  size: String,
  packQty: Number,
  price: Number,
  description: String,
  image: String,
  images: [String],
  stock: Number,
  isActive: Boolean,
});

const DealerSchema = new mongoose.Schema({
  name: String,
  code: String,
  type: String,
  city: String,
  state: String,
  address: String,
  fssaiLicenseNo: String,
  factoryLicenseNo: String,
  manager: String,
  managerPhone: String,
  email: String,
  about: String,
  pincode: String,
  timings: String,
  capacity: Number,
  availableProducts: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      stock: Number,
      isAvailable: Boolean,
    },
  ],
  isActive: Boolean,
});

const AdminSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const Dealer = mongoose.models.Dealer || mongoose.model("Dealer", DealerSchema);
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

const products = [
  {
    name: "Floo 250 ml",
    slug: "floo-250ml",
    category: "bottle",
    size: "250ml",
    packQty: 24,
    price: 85,
    description:
      "Premium FSSAI-certified mineral water in convenient 250ml bottles. Perfect for events, offices, and on-the-go hydration.",
    image: "/flooo-bottle.png",
    stock: 500,
    isActive: true,
  },
  {
    name: "Floo 500 ml",
    slug: "floo-500ml",
    category: "bottle",
    size: "500ml",
    packQty: 24,
    price: 105,
    description:
      "Our bestselling 500ml pack — ideal for daily home and office use. RO+UV+UF purified, mineral enriched.",
    image: "/2.png",
    stock: 500,
    isActive: true,
  },
  {
    name: "Floo 1000 ml",
    slug: "floo-1l",
    category: "bottle",
    size: "1000 ml",
    packQty: 12,
    price: 120,
    description:
      "Family-size 1000 ml bottles for maximum value. FSSAI certified, sourced from state-of-the-art manufacturing units.",
    image: "/3.png",
    stock: 500,
    isActive: true,
  },
  {
    name: "Flowers 250 ml",
    slug: "flowers-250ml",
    category: "bottle",
    size: "250ml",
    packQty: 24,
    price: 80,
    description: "Flowers brand FSSAI-certified mineral water in convenient 250ml bottles.",
    image: "/flooo-bottle.png",
    stock: 500,
    isActive: true,
  },
  {
    name: "Flowers 500 ml",
    slug: "flowers-500ml",
    category: "bottle",
    size: "500ml",
    packQty: 24,
    price: 100,
    description: "Flowers brand 500ml pack — ideal for daily home and office use.",
    image: "/2.png",
    stock: 500,
    isActive: true,
  },
  {
    name: "Flowers 1000 ml",
    slug: "flowers-1l",
    category: "bottle",
    size: "1000 ml",
    packQty: 12,
    price: 115,
    description: "Flowers brand 1000 ml bottles for maximum value.",
    image: "/3.png",
    stock: 500,
    isActive: true,
  },
  {
    name: "Flooo T-Shirt",
    slug: "flooo-tshirt",
    category: "apparel",
    size: "Standard",
    packQty: 1,
    price: 499,
    description:
      "Premium cotton Flooo branded T-shirt. Comfortable fit, vibrant logo — show your love for pure water.",
    image: "/shirt_front.png",
    images: ["/shirt_front.png", "/shirt_back.png"],
    stock: 200,
    isActive: true,
  },
];

const dealers = [
  {
    name: "BOHRA SALES & TRADING",
    code: "BST-002",
    plantNumber: 1,
    city: "Barabanki",
    state: "UP",
    address: "0-312, UPSIDC, Kursi Road, Distt.: Barabanki, UP 225302",
    pincode: "225302",
    fssaiLicenseNo: "12721034000123",
    factoryLicenseNo: "FL-UP-2024-001",
    email: "bohra@aquapure.in",
    manager: "Manish Kumar Pandey",
    managerPhone: "+919651063155",
    about: "Authorized Flooo retail partner serving Barabanki and nearby areas with FSSAI-certified mineral water.",
    timings: "8:00 AM - 9:00 PM",
    capacity: 10000,
    isActive: true,
  },
  {
    name: "Bohra Beverages Pvt. Ltd.",
    code: "BB-001",
    plantNumber: 2,
    city: "Barabanki",
    state: "UP",
    address: "H-37/38, Agro Park-II, UPSIOC Kursi Road, Barabanki (U.P.) 225302",
    pincode: "225302",
    fssaiLicenseNo: "12721034000456",
    factoryLicenseNo: "FL-UP-2024-002",
    email: "beverages@aquapure.in",
    manager: "Manish Kumar Pandey",
    managerPhone: "+919651063155",
    about: "Wholesale distribution hub for Flooo bottled water across eastern Uttar Pradesh.",
    timings: "8:00 AM - 8:00 PM",
    capacity: 10000,
    isActive: true,
  },
  {
    name: "Vijay & Sons",
    code: "VS-003",
    plantNumber: 3,
    city: "Gurugram",
    state: "Haryana",
    address: "PH-11 NEAR HERITAGE SCHOOL PALLAVPURAM - 250110",
    pincode: "250110",
    fssaiLicenseNo: "12721034000789",
    factoryLicenseNo: "FL-HR-2024-003",
    email: "sohna@aquapure.in",
    manager: "Amit Verma",
    managerPhone: "+91-9876540013",
    about: "Retail store offering Flooo mineral water bottles and cans for families and offices in Gurugram.",
    timings: "8:30 AM - 8:30 PM",
    capacity: 8000,
    isActive: true,
  },
  {
    name: "FLOOO - Vyaan Industries Pvt. Ltd.",
    code: "VI-004",
    plantNumber: 4,
    city: "Greater Noida",
    state: "UP",
    address: "Plot A-70, Ecotech 6, Greater Noida, UP 201310",
    pincode: "201310",
    fssaiLicenseNo: "12721034001012",
    factoryLicenseNo: "FL-UP-2024-004",
    email: "vyaan@aquapure.in",
    manager: "Priya Singh",
    managerPhone: "+91-9876540014",
    about: "Distribution centre for Flooo products across NCR with bulk supply capabilities.",
    timings: "9:00 AM - 6:00 PM",
    capacity: 15000,
    isActive: true,
  },
];

async function seed() {
  const uri = await getMongoUri();
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  await Product.deleteMany({});
  for (const p of products) {
    await Product.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true });
    console.log(`Product: ${p.name}`);
  }

  const bottleProducts = await Product.find({ category: "bottle", isActive: true }).lean();
  const defaultAvailableProducts = bottleProducts.map((p) => ({
    productId: p._id,
    stock: 100,
    isAvailable: true,
  }));

  for (const d of dealers) {
    await Dealer.findOneAndUpdate(
      { code: d.code },
      { ...d, availableProducts: defaultAvailableProducts },
      { upsert: true, new: true }
    );
    console.log(`Dealer: ${d.name}`);
  }

  const hashed = await bcrypt.hash("flooo@admin123", 12);
  await Admin.findOneAndUpdate(
    { email: "admin@flooo.in" },
    { email: "admin@flooo.in", password: hashed },
    { upsert: true, new: true }
  );
  console.log("Admin: admin@flooo.in");

  console.log("\nSeed complete!");
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
