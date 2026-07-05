import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, BookOpen, Download, Megaphone, Users, Settings, Trash2, Plus, X } from "lucide-react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Button3D from "../components/Button3D";

const TABS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "modules", label: "Modules", icon: BookOpen },
  { key: "resources", label: "Resources", icon: Download },
  { key: "announcements", label: "Announcements", icon: Megaphone },
  { key: "users", label: "Users", icon: Users },
  { key: "settings", label: "Settings", icon: Settings },
];

const inputCls =
  "w-full bg-ink-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-mist focus:border-violet outline-none";
const selectCls = inputCls;

export default function Admin() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 grid md:grid-cols-[220px_1fr] gap-8">
        <aside className="space-y-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-mono transition-colors ${
                  tab === t.key ? "bg-violet/15 text-violet-light" : "text-mist-dim hover:bg-white/5"
                }`}
              >
                <Icon size={16} /> {t.label}
              </button>
            );
          })}
        </aside>

        <main>
          {tab === "overview" && <Overview />}
          {tab === "modules" && <ModulesAdmin />}
          {tab === "resources" && <ResourcesAdmin />}
          {tab === "announcements" && <AnnouncementsAdmin />}
          {tab === "users" && <UsersAdmin />}
          {tab === "settings" && <SettingsAdmin />}
        </main>
      </div>
    </div>
  );
}

function Card({ children, className = "" }) {
  return <div className={`bg-ink-700 border border-white/10 rounded-2xl p-6 ${className}`}>{children}</div>;
}

function Overview() {
  const [summary, setSummary] = useState(null);
  useEffect(() => {
    api.get("/admin/summary").then((r) => setSummary(r.data)).catch(() => {});
  }, []);
  if (!summary) return <p className="text-mist-dim font-mono text-sm">loading...</p>;

  const stats = [
    { label: "Total users", value: summary.users },
    { label: "Modules", value: summary.modules },
    { label: "Resources", value: summary.resources },
    { label: "Announcements", value: summary.announcements },
  ];

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-mist mb-6">Admin overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-mist-dim text-xs font-mono mb-1">{s.label}</p>
            <p className="font-display font-bold text-3xl text-mist">{s.value}</p>
          </Card>
        ))}
      </div>
      <Card>
        <p className="font-display font-semibold text-mist mb-4">Users by tier</p>
        <div className="flex gap-6">
          {summary.tierCounts.map((t) => (
            <div key={t._id}>
              <p className="text-2xl font-display font-bold text-violet-light">{t.count}</p>
              <p className="text-xs text-mist-dim capitalize font-mono">{t._id}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ---------------- MODULES ----------------
function ModulesAdmin() {
  const [modules, setModules] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => api.get("/admin/modules").then((r) => setModules(r.data));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Delete this module and all its lessons?")) return;
    await api.delete(`/admin/modules/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-mist">Modules</h1>
        <Button3D size="sm" onClick={() => setEditing({ title: "", slug: "", language: "", description: "", tier: "free", order: 0, lessons: [] })}>
          <Plus size={16} className="inline mr-1" /> New module
        </Button3D>
      </div>

      <div className="space-y-3">
        {modules.map((m) => (
          <Card key={m._id} className="flex items-center justify-between">
            <div>
              <p className="font-display font-semibold text-mist">{m.title} <span className="text-xs text-mist-faint font-mono ml-2">/{m.slug}</span></p>
              <p className="text-xs text-mist-dim font-mono mt-1">{m.language} · {m.tier} · {m.lessons.length} lessons</p>
            </div>
            <div className="flex gap-2">
              <Button3D size="sm" variant="ghost" onClick={() => setEditing(m)}>Edit</Button3D>
              <button onClick={() => remove(m._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg">
                <Trash2 size={16} />
              </button>
            </div>
          </Card>
        ))}
        {modules.length === 0 && <p className="text-mist-dim font-mono text-sm">No modules yet.</p>}
      </div>

      {editing && <ModuleEditor module={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function ModuleEditor({ module, onClose, onSaved }) {
  const [form, setForm] = useState(module);

  const updateLesson = (i, patch) => {
    const lessons = [...form.lessons];
    lessons[i] = { ...lessons[i], ...patch };
    setForm({ ...form, lessons });
  };
  const addLesson = () =>
    setForm({ ...form, lessons: [...form.lessons, { title: "", filePath: "notes.md", content: "", videoUrl: "", tier: "free" }] });
  const removeLesson = (i) => setForm({ ...form, lessons: form.lessons.filter((_, idx) => idx !== i) });

  const save = async () => {
    if (form._id) await api.put(`/admin/modules/${form._id}`, form);
    else await api.post("/admin/modules", form);
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-ink-700 border border-white/10 rounded-2xl p-6 w-full max-w-2xl my-8 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="font-display font-semibold text-lg text-mist">{form._id ? "Edit module" : "New module"}</p>
          <button onClick={onClose}><X className="text-mist-dim" /></button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <input className={inputCls} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className={inputCls} placeholder="Slug (unique url)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <input className={inputCls} placeholder="Language / tech (e.g. Python)" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} />
          <select className={selectCls} value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>
        </div>
        <textarea className={`${inputCls} mb-4`} rows={2} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <p className="font-mono text-xs text-mist-dim mb-2">Lessons</p>
        <div className="space-y-3 mb-4">
          {form.lessons.map((l, i) => (
            <div key={i} className="bg-ink-800 rounded-lg p-3 border border-white/5">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input className={inputCls} placeholder="Lesson title" value={l.title} onChange={(e) => updateLesson(i, { title: e.target.value })} />
                <input className={inputCls} placeholder="File path e.g. dsa/01.md" value={l.filePath} onChange={(e) => updateLesson(i, { filePath: e.target.value })} />
              </div>
              <textarea className={`${inputCls} mb-2`} rows={2} placeholder="Notes / snippet content" value={l.content} onChange={(e) => updateLesson(i, { content: e.target.value })} />
              <div className="flex gap-2 items-center">
                <select className={selectCls} value={l.tier} onChange={(e) => updateLesson(i, { tier: e.target.value })}>
                  <option value="free">Free</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                </select>
                <button onClick={() => removeLesson(i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          <Button3D size="sm" variant="ghost" onClick={addLesson}><Plus size={14} className="inline mr-1" />Add lesson</Button3D>
        </div>

        <div className="flex gap-3 justify-end">
          <Button3D variant="ghost" onClick={onClose}>Cancel</Button3D>
          <Button3D onClick={save}>Save module</Button3D>
        </div>
      </motion.div>
    </div>
  );
}

// ---------------- RESOURCES ----------------
function ResourcesAdmin() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState(null);

  const load = () => api.get("/admin/resources").then((r) => setResources(r.data));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Delete this resource?")) return;
    await api.delete(`/admin/resources/${id}`);
    load();
  };

  const save = async () => {
    if (form._id) await api.put(`/admin/resources/${form._id}`, form);
    else await api.post("/admin/resources", form);
    setForm(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-mist">Resources</h1>
        <Button3D size="sm" onClick={() => setForm({ title: "", description: "", category: "", filePath: "resource.pdf", fileUrl: "", tier: "free", price: 0, isSellable: false })}>
          <Plus size={16} className="inline mr-1" /> New resource
        </Button3D>
      </div>

      <div className="space-y-3">
        {resources.map((r) => (
          <Card key={r._id} className="flex items-center justify-between">
            <div>
              <p className="font-display font-semibold text-mist">{r.title}</p>
              <p className="text-xs text-mist-dim font-mono mt-1">{r.category} · {r.tier}{r.isSellable ? ` · ₹${r.price}` : ""}</p>
            </div>
            <div className="flex gap-2">
              <Button3D size="sm" variant="ghost" onClick={() => setForm(r)}>Edit</Button3D>
              <button onClick={() => remove(r._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 size={16} /></button>
            </div>
          </Card>
        ))}
        {resources.length === 0 && <p className="text-mist-dim font-mono text-sm">No resources yet.</p>}
      </div>

      {form && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-ink-700 border border-white/10 rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <p className="font-display font-semibold text-lg text-mist">{form._id ? "Edit resource" : "New resource"}</p>
              <button onClick={() => setForm(null)}><X className="text-mist-dim" /></button>
            </div>
            <div className="space-y-3">
              <input className={inputCls} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <textarea className={inputCls} rows={2} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input className={inputCls} placeholder="Category e.g. DSA" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                <input className={inputCls} placeholder="File path e.g. dsa-300.pdf" value={form.filePath} onChange={(e) => setForm({ ...form, filePath: e.target.value })} />
              </div>
              <input className={inputCls} placeholder="File URL / drive link" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <select className={selectCls} value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>
                  <option value="free">Free</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                </select>
                <input type="number" className={inputCls} placeholder="Price (₹) if sellable" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
              <label className="flex items-center gap-2 text-sm text-mist-dim">
                <input type="checkbox" checked={form.isSellable} onChange={(e) => setForm({ ...form, isSellable: e.target.checked })} />
                Sellable as one-off purchase
              </label>
            </div>
            <div className="flex gap-3 justify-end mt-5">
              <Button3D variant="ghost" onClick={() => setForm(null)}>Cancel</Button3D>
              <Button3D onClick={save}>Save resource</Button3D>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ---------------- ANNOUNCEMENTS ----------------
function AnnouncementsAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null);

  const load = () => api.get("/admin/announcements").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    await api.delete(`/admin/announcements/${id}`);
    load();
  };
  const save = async () => {
    if (form._id) await api.put(`/admin/announcements/${form._id}`, form);
    else await api.post("/admin/announcements", form);
    setForm(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-mist">Announcements</h1>
        <Button3D size="sm" onClick={() => setForm({ title: "", body: "", pinned: false, audience: "all" })}>
          <Plus size={16} className="inline mr-1" /> New announcement
        </Button3D>
      </div>
      <div className="space-y-3">
        {items.map((a) => (
          <Card key={a._id} className="flex items-center justify-between">
            <div>
              <p className="font-display font-semibold text-mist">{a.title} {a.pinned && <span className="text-amber text-xs">· pinned</span>}</p>
              <p className="text-xs text-mist-dim mt-1">{a.body}</p>
            </div>
            <div className="flex gap-2">
              <Button3D size="sm" variant="ghost" onClick={() => setForm(a)}>Edit</Button3D>
              <button onClick={() => remove(a._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 size={16} /></button>
            </div>
          </Card>
        ))}
        {items.length === 0 && <p className="text-mist-dim font-mono text-sm">No announcements yet.</p>}
      </div>

      {form && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-ink-700 border border-white/10 rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <p className="font-display font-semibold text-lg text-mist">{form._id ? "Edit" : "New"} announcement</p>
              <button onClick={() => setForm(null)}><X className="text-mist-dim" /></button>
            </div>
            <div className="space-y-3">
              <input className={inputCls} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <textarea className={inputCls} rows={3} placeholder="Body" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
              <select className={selectCls} value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
                <option value="all">All students</option>
                <option value="basic">Basic & above</option>
                <option value="premium">Premium only</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-mist-dim">
                <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} />
                Pin to top
              </label>
            </div>
            <div className="flex gap-3 justify-end mt-5">
              <Button3D variant="ghost" onClick={() => setForm(null)}>Cancel</Button3D>
              <Button3D onClick={save}>Save</Button3D>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ---------------- USERS ----------------
function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const load = () => api.get("/admin/users").then((r) => setUsers(r.data));
  useEffect(() => { load(); }, []);

  const setTier = async (id, tier) => {
    await api.put(`/admin/users/${id}/tier`, { tier });
    load();
  };

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-mist mb-6">Users</h1>
      <Card className="!p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-mist-dim font-mono text-xs border-b border-white/10">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Tier</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-white/5 last:border-0">
                <td className="p-4 text-mist">{u.name}</td>
                <td className="p-4 text-mist-dim">{u.email}</td>
                <td className="p-4 text-mist-dim capitalize">{u.role}</td>
                <td className="p-4">
                  <select className={selectCls} value={u.tier} onChange={(e) => setTier(u._id, e.target.value)}>
                    <option value="free">Free</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ---------------- SETTINGS ----------------
function SettingsAdmin() {
  const [settings, setSettings] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/settings").then((r) => setSettings(r.data));
  }, []);

  const save = async () => {
    const res = await api.put("/admin/settings", settings);
    setSettings(res.data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!settings) return <p className="text-mist-dim font-mono text-sm">loading...</p>;

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-mist mb-6">Site settings</h1>
      <Card className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm text-mist-dim mb-1.5">About video URL</label>
          <input
            className={inputCls}
            placeholder="https://... (mp4 link or hosted video URL)"
            value={settings.aboutVideoUrl}
            onChange={(e) => setSettings({ ...settings, aboutVideoUrl: e.target.value })}
          />
          <p className="text-xs text-mist-faint font-mono mt-1">Upload your video anywhere (Cloudinary, YouTube direct link, etc.) and paste the URL here.</p>
        </div>
        <div>
          <label className="block text-sm text-mist-dim mb-1.5">About text</label>
          <textarea className={inputCls} rows={4} value={settings.aboutText} onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-mist-dim mb-1.5">Basic price (₹/mo)</label>
            <input type="number" className={inputCls} value={settings.basicPriceINR} onChange={(e) => setSettings({ ...settings, basicPriceINR: Number(e.target.value) })} />
          </div>
          <div>
            <label className="block text-sm text-mist-dim mb-1.5">Premium price (₹/mo)</label>
            <input type="number" className={inputCls} value={settings.premiumPriceINR} onChange={(e) => setSettings({ ...settings, premiumPriceINR: Number(e.target.value) })} />
          </div>
        </div>
        <Button3D onClick={save}>{saved ? "Saved ✓" : "Save settings"}</Button3D>
      </Card>
    </div>
  );
}
