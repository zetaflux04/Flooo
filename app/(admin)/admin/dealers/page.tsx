"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import { adminFetch } from "@/lib/admin-fetch";
import { Download, Package } from "lucide-react";
import { formatPlantLabel, formatPrice } from "@/lib/utils";

interface DealerProduct {
  productId: string;
  stock: number;
  isAvailable: boolean;
}

interface Dealer {
  _id: string;
  name: string;
  code: string;
  plantNumber?: number;
  city: string;
  state: string;
  address: string;
  phone: string;
  manager: string;
  managerPhone?: string;
  email?: string;
  about?: string;
  pincode?: string;
  timings?: string;
  capacity?: number;
  availableProducts?: DealerProduct[];
  isActive: boolean;
}

interface CatalogProduct {
  _id: string;
  name: string;
  size: string;
  price: number;
  category?: string;
  isActive?: boolean;
}

type DealerForm = {
  name: string;
  code: string;
  plantNumber: number | "";
  city: string;
  state: string;
  address: string;
  phone: string;
  manager: string;
  managerPhone: string;
  email: string;
  about: string;
  pincode: string;
  timings: string;
  capacity: number;
};

const emptyDealer: DealerForm = {
  name: "",
  code: "",
  plantNumber: 1,
  city: "",
  state: "",
  address: "",
  phone: "",
  manager: "",
  managerPhone: "",
  email: "",
  about: "",
  pincode: "",
  timings: "9 AM - 6 PM",
  capacity: 1000,
};

const dealerFields: {
  key: keyof DealerForm;
  label: string;
  placeholder: string;
  type?: string;
}[] = [
  { key: "name", label: "Dealer Name", placeholder: "e.g. Flooo Store Noida" },
  { key: "code", label: "Dealer Code", placeholder: "e.g. DL-001" },
  { key: "plantNumber", label: "Plant Number", placeholder: "e.g. 1 for Plant 1", type: "number" },
  { key: "city", label: "City", placeholder: "e.g. Noida" },
  { key: "state", label: "State", placeholder: "e.g. Uttar Pradesh" },
  { key: "address", label: "Address", placeholder: "Full street address" },
  { key: "phone", label: "Phone", placeholder: "e.g. 9876543210" },
  { key: "manager", label: "Manager Name", placeholder: "Contact person name" },
  { key: "managerPhone", label: "Manager Phone", placeholder: "e.g. 9876543210" },
  { key: "email", label: "Email", placeholder: "store@example.com" },
  { key: "pincode", label: "Pincode", placeholder: "e.g. 201310" },
  { key: "about", label: "About", placeholder: "Brief store description" },
  { key: "timings", label: "Timings", placeholder: "e.g. 9 AM - 6 PM" },
  { key: "capacity", label: "Capacity (Litres)", placeholder: "e.g. 1000", type: "number" },
];

export default function AdminDealersPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [catalog, setCatalog] = useState<CatalogProduct[]>([]);
  const [modal, setModal] = useState(false);
  const [productsModal, setProductsModal] = useState(false);
  const [editing, setEditing] = useState<Dealer | null>(null);
  const [productsDealer, setProductsDealer] = useState<Dealer | null>(null);
  const [form, setForm] = useState<DealerForm>(emptyDealer);
  const [storeProducts, setStoreProducts] = useState<Record<string, { enabled: boolean; stock: number }>>({});
  const [loading, setLoading] = useState(false);

  const load = () => adminFetch("/api/admin/dealers").then((r) => r.json()).then(setDealers);

  useEffect(() => {
    load();
    adminFetch("/api/admin/products")
      .then((r) => r.json())
      .then((list: CatalogProduct[]) => {
        if (Array.isArray(list)) {
          setCatalog(list.filter((p) => p.category !== "apparel" && p.isActive !== false));
        }
      });
  }, []);

  const nextPlantNumber = () =>
    dealers.length > 0
      ? Math.max(0, ...dealers.map((d) => d.plantNumber ?? 0)) + 1
      : 1;

  const buildPayload = () => {
    const plantNumber = Number(form.plantNumber);
    const payload: Record<string, unknown> = {
      ...form,
      isActive: true,
      capacity: Number(form.capacity) || 0,
    };
    if (Number.isFinite(plantNumber) && plantNumber >= 1) {
      payload.plantNumber = Math.floor(plantNumber);
    } else if (!editing) {
      payload.plantNumber = nextPlantNumber();
    } else {
      delete payload.plantNumber;
    }
    return payload;
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyDealer, plantNumber: nextPlantNumber() });
    setModal(true);
  };

  const openEdit = (d: Dealer) => {
    setEditing(d);
    const plantNumber =
      d.plantNumber != null && d.plantNumber >= 1 ? d.plantNumber : nextPlantNumber();
    setForm({
      name: d.name,
      code: d.code,
      plantNumber,
      city: d.city,
      state: d.state,
      address: d.address,
      phone: d.phone,
      manager: d.manager,
      managerPhone: d.managerPhone || "",
      email: d.email || "",
      about: d.about || "",
      pincode: d.pincode || "",
      timings: d.timings || "",
      capacity: d.capacity ?? 0,
    });
    setModal(true);
  };

  const openProducts = (d: Dealer) => {
    setProductsDealer(d);
    const map: Record<string, { enabled: boolean; stock: number }> = {};
    catalog.forEach((p) => {
      const existing = d.availableProducts?.find(
        (ap) => String(ap.productId) === String(p._id)
      );
      map[p._id] = {
        enabled: existing?.isAvailable ?? false,
        stock: existing?.stock ?? 100,
      };
    });
    setStoreProducts(map);
    setProductsModal(true);
  };

  const toggleProduct = (productId: string) => {
    setStoreProducts((prev) => ({
      ...prev,
      [productId]: {
        enabled: !prev[productId]?.enabled,
        stock: prev[productId]?.stock ?? 100,
      },
    }));
  };

  const setProductStock = (productId: string, stock: number) => {
    setStoreProducts((prev) => ({
      ...prev,
      [productId]: {
        enabled: prev[productId]?.enabled ?? false,
        stock: Math.max(0, stock),
      },
    }));
  };

  const saveProducts = async () => {
    if (!productsDealer) return;
    setLoading(true);
    try {
      const availableProducts: DealerProduct[] = Object.entries(storeProducts)
        .filter(([, v]) => v.enabled)
        .map(([productId, v]) => ({
          productId,
          stock: v.stock,
          isAvailable: true,
        }));

      const res = await adminFetch(`/api/admin/dealers/${productsDealer._id}`, {
        method: "PATCH",
        body: JSON.stringify({ availableProducts }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Store products updated");
      setProductsModal(false);
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save products");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    setLoading(true);
    try {
      const url = editing ? `/api/admin/dealers/${editing._id}` : "/api/admin/dealers";
      const res = await adminFetch(url, {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(editing ? "Dealer updated" : "Dealer added");
      setModal(false);
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (d: Dealer) => {
    await adminFetch(`/api/admin/dealers/${d._id}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: !d.isActive }),
    });
    load();
  };

  const productCount = (d: Dealer) =>
    d.availableProducts?.filter((p) => p.isAvailable).length ?? 0;

  return (
    <>
      <AdminHeader title="Business Partners" />
      <div className="flex flex-wrap gap-3 mb-6">
        <button type="button" onClick={openAdd} className="btn-primary">
          + Add Business Partner
        </button>
        <a href="/api/qr" download="flooo-qr.png" className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" /> Download QR Code
        </a>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-light-blue text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Plant</th>
              <th className="p-3">City</th>
              <th className="p-3">Products</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dealers.map((d) => (
              <tr key={d._id} className="border-t">
                <td className="p-3 font-medium">{d.name}</td>
                <td className="p-3">
                  {d.plantNumber != null && d.plantNumber >= 1
                    ? formatPlantLabel(d.plantNumber)
                    : "—"}
                </td>
                <td className="p-3">{d.city}</td>
                <td className="p-3">
                  <span className="text-xs bg-light-blue text-secondary px-2 py-1 rounded-full">
                    {productCount(d)} available
                  </span>
                </td>
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => toggle(d)}
                    className={`text-xs px-2 py-1 rounded-full ${d.isActive ? "bg-green-100 text-green-700" : "bg-gray-100"}`}
                  >
                    {d.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="p-3 space-x-3">
                  <button type="button" onClick={() => openEdit(d)} className="text-primary hover:underline">
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => openProducts(d)}
                    className="text-secondary hover:underline inline-flex items-center gap-1"
                  >
                    <Package className="w-3.5 h-3.5" />
                    Products
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? "Edit Dealer" : "Add Dealer"} size="lg">
        <div className="grid sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {dealerFields.map(({ key, label, placeholder, type }) => (
            <FormField
              key={key}
              label={label}
              id={`dealer-${key}`}
              type={type}
              placeholder={placeholder}
              value={String(form[key] ?? "")}
              onChange={(e) => {
                const raw = e.target.value;
                setForm({
                  ...form,
                  [key]:
                    type === "number"
                      ? raw === ""
                        ? ""
                        : Number(raw)
                      : raw,
                } as DealerForm);
              }}
            />
          ))}
        </div>
        <button type="button" onClick={save} disabled={loading} className="btn-primary w-full mt-4">
          {loading ? "Saving..." : "Save"}
        </button>
      </Modal>

      <Modal
        isOpen={productsModal}
        onClose={() => setProductsModal(false)}
        title={`Available Products — ${productsDealer?.name ?? ""}`}
        size="lg"
      >
        <p className="text-sm text-muted mb-4">
          Select which products this store carries and set stock for each. Only checked products appear on the public store page.
        </p>
        {catalog.length === 0 ? (
          <p className="text-muted text-sm py-4">No bottle products in catalog. Add products first.</p>
        ) : (
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            {catalog.map((p) => {
              const entry = storeProducts[p._id] ?? { enabled: false, stock: 100 };
              return (
                <div
                  key={p._id}
                  className={`flex items-center gap-4 p-3 rounded-lg border ${
                    entry.enabled ? "border-primary/40 bg-light-blue/30" : "border-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={entry.enabled}
                    onChange={() => toggleProduct(p._id)}
                    className="w-4 h-4 accent-primary shrink-0"
                    id={`product-${p._id}`}
                  />
                  <label htmlFor={`product-${p._id}`} className="flex-1 min-w-0 cursor-pointer">
                    <p className="font-medium text-secondary">{p.name}</p>
                    <p className="text-xs text-muted">
                      {p.size} · {formatPrice(p.price)}
                    </p>
                  </label>
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="text-xs text-muted">Stock</label>
                    <input
                      type="number"
                      min={0}
                      disabled={!entry.enabled}
                      value={entry.stock}
                      onChange={(e) => setProductStock(p._id, +e.target.value)}
                      className="w-20 border border-gray-200 rounded px-2 py-1 text-sm disabled:bg-gray-50"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <button
          type="button"
          onClick={saveProducts}
          disabled={loading || catalog.length === 0}
          className="btn-primary w-full mt-4"
        >
          {loading ? "Saving..." : "Save Products"}
        </button>
      </Modal>
    </>
  );
}
