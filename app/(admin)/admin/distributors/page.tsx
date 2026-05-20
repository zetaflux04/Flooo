"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import { adminFetch } from "@/lib/admin-fetch";
import { Package } from "lucide-react";
import { formatDistributorFullLocation } from "@/lib/distributor-display";
import { formatPrice } from "@/lib/utils";

interface DistributorProduct {
  productId: string;
  stock: number;
  isAvailable: boolean;
}

interface Distributor {
  _id: string;
  name: string;
  code: string;
  area?: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  capacity?: number;
  about?: string;
  mobileNumber: string;
  availableProducts?: DistributorProduct[];
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

type DistributorForm = {
  name: string;
  code: string;
  area: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  capacity: number | "";
  about: string;
  mobileNumber: string;
};

const emptyDistributor: DistributorForm = {
  name: "",
  code: "",
  area: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  capacity: "",
  about: "",
  mobileNumber: "",
};

const distributorFields: {
  key: keyof DistributorForm;
  label: string;
  placeholder: string;
  type?: string;
}[] = [
  { key: "name", label: "Name", placeholder: "e.g. Ashutosh Pandey" },
  { key: "code", label: "Code", placeholder: "e.g. PRJ" },
  { key: "mobileNumber", label: "Mobile Number", placeholder: "e.g. 9651457472" },
  { key: "area", label: "Area", placeholder: "e.g. Naini" },
  { key: "address", label: "Address", placeholder: "Street / building address" },
  { key: "city", label: "City", placeholder: "e.g. Prayagraj" },
  { key: "state", label: "State", placeholder: "e.g. Uttar Pradesh" },
  { key: "pincode", label: "Pincode", placeholder: "e.g. 221008" },
  { key: "capacity", label: "Capacity (Litres)", placeholder: "e.g. 5000", type: "number" },
];

export default function AdminDistributorsPage() {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [catalog, setCatalog] = useState<CatalogProduct[]>([]);
  const [modal, setModal] = useState(false);
  const [productsModal, setProductsModal] = useState(false);
  const [editing, setEditing] = useState<Distributor | null>(null);
  const [productsDistributor, setProductsDistributor] = useState<Distributor | null>(null);
  const [form, setForm] = useState<DistributorForm>(emptyDistributor);
  const [storeProducts, setStoreProducts] = useState<Record<string, { enabled: boolean; stock: number }>>({});
  const [loading, setLoading] = useState(false);

  const load = () => adminFetch("/api/admin/distributors").then((r) => r.json()).then(setDistributors);

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

  const buildPayload = () => {
    const capacity =
      form.capacity === "" ? 0 : Number(form.capacity);
    const payload: Record<string, unknown> = {
      name: form.name,
      code: form.code,
      area: form.area,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      about: form.about,
      mobileNumber: form.mobileNumber,
      capacity: Number.isFinite(capacity) ? capacity : 0,
    };
    if (!editing) payload.isActive = true;
    return payload;
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyDistributor);
    setModal(true);
  };

  const openEdit = (d: Distributor) => {
    setEditing(d);
    setForm({
      name: d.name,
      code: d.code,
      area: d.area ?? "",
      address: d.address,
      city: d.city ?? "",
      state: d.state ?? "",
      pincode: d.pincode ?? "",
      capacity: d.capacity ?? "",
      about: d.about ?? "",
      mobileNumber: d.mobileNumber,
    });
    setModal(true);
  };

  const openProducts = (d: Distributor) => {
    setProductsDistributor(d);
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
    if (!productsDistributor) return;
    setLoading(true);
    try {
      const availableProducts: DistributorProduct[] = Object.entries(storeProducts)
        .filter(([, v]) => v.enabled)
        .map(([productId, v]) => ({
          productId,
          stock: v.stock,
          isAvailable: true,
        }));

      const res = await adminFetch(`/api/admin/distributors/${productsDistributor._id}`, {
        method: "PATCH",
        body: JSON.stringify({ availableProducts }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Products updated");
      setProductsModal(false);
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save products");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!form.name.trim() || !form.code.trim() || !form.mobileNumber.trim()) {
      toast.error("Name, code, and mobile number are required");
      return;
    }
    if (!form.address.trim() || !form.city.trim() || !form.state.trim()) {
      toast.error("Address, city, and state are required");
      return;
    }
    setLoading(true);
    try {
      const url = editing ? `/api/admin/distributors/${editing._id}` : "/api/admin/distributors";
      const res = await adminFetch(url, {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(editing ? "Distributor updated" : "Distributor added");
      setModal(false);
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (d: Distributor) => {
    await adminFetch(`/api/admin/distributors/${d._id}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: !d.isActive }),
    });
    load();
  };

  const remove = async (d: Distributor) => {
    if (!confirm(`Delete distributor "${d.name}"? This cannot be undone.`)) return;
    try {
      const res = await adminFetch(`/api/admin/distributors/${d._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Distributor deleted");
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  const productCount = (d: Distributor) =>
    d.availableProducts?.filter((p) => p.isAvailable).length ?? 0;

  return (
    <>
      <AdminHeader title="Distributors" />
      <div className="flex flex-wrap gap-3 mb-6">
        <button type="button" onClick={openAdd} className="btn-primary">
          + Add Distributor
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-light-blue text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Code</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Location</th>
              <th className="p-3">Capacity</th>
              <th className="p-3">Products</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {distributors.map((d) => (
              <tr key={d._id} className="border-t">
                <td className="p-3 font-medium">{d.name}</td>
                <td className="p-3">{d.code}</td>
                <td className="p-3">{d.mobileNumber}</td>
                <td className="p-3">
                  <span className="block text-secondary">{formatDistributorFullLocation(d)}</span>
                  {d.address && (
                    <span className="text-xs text-muted">{d.address}</span>
                  )}
                </td>
                <td className="p-3">
                  {d.capacity != null && d.capacity > 0
                    ? `${d.capacity.toLocaleString("en-IN")} L`
                    : "—"}
                </td>
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
                  <button
                    type="button"
                    onClick={() => remove(d)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? "Edit Distributor" : "Add Distributor"} size="md">
        <div className="grid gap-4">
          {distributorFields.map(({ key, label, placeholder, type }) => (
            <FormField
              key={key}
              label={label}
              id={`distributor-${key}`}
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
                } as DistributorForm);
              }}
            />
          ))}
          <FormField
            as="textarea"
            label="About"
            id="distributor-about"
            placeholder="Brief description of this distributor"
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
          />
        </div>
        <button type="button" onClick={save} disabled={loading} className="btn-primary w-full mt-4">
          {loading ? "Saving..." : "Save"}
        </button>
      </Modal>

      <Modal
        isOpen={productsModal}
        onClose={() => setProductsModal(false)}
        title={`Available Products — ${productsDistributor?.name ?? ""}`}
        size="lg"
      >
        <p className="text-sm text-muted mb-4">
          Select which products this distributor carries and set stock for each. Products appear on the public distributor detail page.
        </p>
        {catalog.length === 0 ? (
          <p className="text-muted text-sm py-4">No bottle products in catalog. Add products first.</p>
        ) : (
          <div className="space-y-3">
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
