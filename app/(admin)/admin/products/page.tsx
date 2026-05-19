"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import { adminFetch } from "@/lib/admin-fetch";
import { formatPrice } from "@/lib/utils";

interface Product {
  _id: string;
  name: string;
  slug: string;
  category?: string;
  size: string;
  packQty: number;
  price: number;
  description: string;
  image: string;
  stock: number;
  isActive: boolean;
}

const emptyForm = {
  name: "",
  category: "bottle",
  size: "500ml",
  packQty: 24,
  price: 0,
  description: "",
  stock: 100,
  imageBase64: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const load = () => adminFetch("/api/admin/products").then((r) => r.json()).then(setProducts);
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category || "bottle",
      size: p.size,
      packQty: p.packQty,
      price: p.price,
      description: p.description,
      stock: p.stock,
      imageBase64: "",
    });
    setModal(true);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, imageBase64: reader.result as string });
    reader.readAsDataURL(file);
  };

  const save = async () => {
    setLoading(true);
    try {
      const url = editing ? `/api/admin/products/${editing._id}` : "/api/admin/products";
      const method = editing ? "PATCH" : "POST";
      const res = await adminFetch(url, { method, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(editing ? "Product updated" : "Product added");
      setModal(false);
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (p: Product) => {
    await adminFetch(`/api/admin/products/${p._id}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await adminFetch(`/api/admin/products/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    load();
  };

  return (
    <>
      <AdminHeader title="Products" />
      <button type="button" onClick={openAdd} className="btn-primary mb-6">
        + Add Product
      </button>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-light-blue text-left">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Size</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3">
                  <Image src={p.image || "/1.png"} alt="" width={40} height={40} className="rounded object-cover" />
                </td>
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{p.size}</td>
                <td className="p-3">{formatPrice(p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <button type="button" onClick={() => toggleActive(p)} className={`text-xs px-2 py-1 rounded-full ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>
                    {p.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="p-3 space-x-2">
                  <button type="button" onClick={() => openEdit(p)} className="text-primary hover:underline">Edit</button>
                  <button type="button" onClick={() => remove(p._id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? "Edit Product" : "Add Product"} size="lg">
        <div className="space-y-4">
          <FormField label="Product Name" id="product-name" placeholder="e.g. Flooo 500ml" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <FormField label="Category" id="product-category" as="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="bottle">Bottle</option>
            <option value="apparel">Apparel</option>
          </FormField>
          <FormField label="Size" id="product-size" as="select" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}>
            <option value="100ml">100ml</option>
            <option value="250ml">250ml</option>
            <option value="500ml">500ml</option>
            <option value="1L">1L</option>
            <option value="Standard">Standard (T-shirt)</option>
          </FormField>
          <FormField label="Pack Quantity" id="product-packQty" type="number" placeholder="e.g. 24" value={form.packQty} onChange={(e) => setForm({ ...form, packQty: +e.target.value })} />
          <FormField label="Price (INR)" id="product-price" type="number" placeholder="e.g. 502" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} />
          <FormField label="Stock" id="product-stock" type="number" placeholder="e.g. 100" value={form.stock} onChange={(e) => setForm({ ...form, stock: +e.target.value })} />
          <FormField label="Description" id="product-description" as="textarea" placeholder="Product description for customers" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="space-y-1.5">
            <label htmlFor="product-image" className="text-sm font-medium text-secondary block">
              Product Image
            </label>
            <input id="product-image" type="file" accept="image/*" onChange={handleImage} className="text-sm w-full" />
            <p className="text-xs text-muted">{editing ? "Leave empty to keep the current image" : "Upload a product photo"}</p>
          </div>
          <button type="button" onClick={save} disabled={loading} className="btn-primary w-full">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </Modal>
    </>
  );
}
