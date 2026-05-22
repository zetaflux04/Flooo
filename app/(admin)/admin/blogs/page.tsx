"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import { adminFetch } from "@/lib/admin-fetch";
import { formatDate } from "@/lib/utils";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  image: string;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt?: string;
}

const emptyForm = {
  title: "",
  excerpt: "",
  body: "",
  isPublished: false,
  imageBase64: "",
};

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const load = () => adminFetch("/api/admin/blogs").then((r) => r.json()).then(setPosts);
  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModal(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditing(p);
    setForm({
      title: p.title,
      excerpt: p.excerpt,
      body: p.body,
      isPublished: p.isPublished,
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
      const url = editing ? `/api/admin/blogs/${editing._id}` : "/api/admin/blogs";
      const method = editing ? "PATCH" : "POST";
      const res = await adminFetch(url, {
        method,
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(editing ? "Blog post updated" : "Blog post created");
      setModal(false);
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (p: BlogPost) => {
    await adminFetch(`/api/admin/blogs/${p._id}`, {
      method: "PATCH",
      body: JSON.stringify({ isPublished: !p.isPublished }),
    });
    toast.success(p.isPublished ? "Unpublished" : "Published");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    await adminFetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    load();
  };

  return (
    <>
      <AdminHeader title="Blog" />
      <button type="button" onClick={openAdd} className="btn-primary mb-6">
        + Add Blog Post
      </button>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-light-blue text-left">
              <th className="p-3">Image</th>
              <th className="p-3">Title</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3">
                  <Image
                    src={p.image || "/1.png"}
                    alt=""
                    width={48}
                    height={32}
                    className="rounded object-cover w-12 h-8"
                  />
                </td>
                <td className="p-3 font-medium max-w-xs truncate">{p.title}</td>
                <td className="p-3 text-muted">
                  {p.publishedAt
                    ? formatDate(p.publishedAt)
                    : p.createdAt
                      ? formatDate(p.createdAt)
                      : "—"}
                </td>
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => togglePublished(p)}
                    className={`text-xs px-2 py-1 rounded-full ${p.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    {p.isPublished ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="p-3 space-x-2">
                  <button type="button" onClick={() => openEdit(p)} className="text-primary hover:underline">
                    Edit
                  </button>
                  <button type="button" onClick={() => remove(p._id)} className="text-red-500 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
          <p className="p-8 text-center text-muted">No blog posts yet. Add your first post above.</p>
        )}
      </div>

      <Modal
        isOpen={modal}
        onClose={() => setModal(false)}
        title={editing ? "Edit Blog Post" : "Add Blog Post"}
        size="lg"
      >
        <div className="space-y-4">
          <FormField
            label="Title"
            id="blog-title"
            placeholder="Post title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <FormField
            label="Excerpt"
            id="blog-excerpt"
            as="textarea"
            placeholder="Short summary for cards (optional)"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
          <FormField
            label="Body"
            id="blog-body"
            as="textarea"
            placeholder="Full article content"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
          />
          <div className="flex items-center gap-2">
            <input
              id="blog-published"
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="blog-published" className="text-sm font-medium text-secondary">
              Publish immediately
            </label>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="blog-image" className="text-sm font-medium text-secondary block">
              Cover Image
            </label>
            <input id="blog-image" type="file" accept="image/*" onChange={handleImage} className="text-sm w-full" />
            {editing?.image && !form.imageBase64 && (
              <div className="mt-2 relative w-32 h-20 rounded overflow-hidden">
                <Image src={editing.image} alt="Current cover" fill className="object-cover" />
              </div>
            )}
            <p className="text-xs text-muted">
              {editing ? "Leave empty to keep the current image" : "Upload a cover photo for the post"}
            </p>
          </div>
          <button type="button" onClick={save} disabled={loading} className="btn-primary w-full">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </Modal>
    </>
  );
}
