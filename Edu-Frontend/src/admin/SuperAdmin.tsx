import { useEffect, useMemo, useState } from 'react';
import { Building2, Copy, ExternalLink, Eye, Globe, KeyRound, LogOut, Monitor, Plus, RefreshCw, Save, Shield, Smartphone, Trash2, Users, X } from 'lucide-react';
import Admin, { configs, type ActionPerm, type Resource } from './Admin';
import './admin.css';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

interface TenantRow {
  id: number;
  name: string;
  slug: string;
  database_name: string;
  domain: string | null;
  is_active: boolean;
  permissions: {
    resources?: string[];
    actions?: Record<string, ActionPerm>;
    sections?: string[];
  };
  admin_usernames: string[];
  created_at: string;
}

interface CatalogModule { key: string; label: string; }
interface CatalogSection { title: string; slug: string; link: string; }

const emptySuperToken = () => localStorage.getItem('platform_super_token') || '';

function buildActions(mods: CatalogModule[], preset: Partial<ActionPerm>): Record<string, ActionPerm> {
  const out: Record<string, ActionPerm> = {};
  mods.forEach((m) => {
    out[m.key] = {
      read: Boolean(preset.read),
      create: Boolean(preset.create),
      edit: Boolean(preset.edit),
      delete: Boolean(preset.delete),
    };
  });
  return out;
}

function deriveResources(actions: Record<string, ActionPerm>): string[] {
  return Object.keys(actions).filter((k) => actions[k]?.read);
}

export default function SuperAdmin() {
  const [token, setToken] = useState(emptySuperToken);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const [viewMode, setViewMode] = useState<'colleges' | Resource>('colleges');
  const [tenants, setTenants] = useState<TenantRow[]>([]);
  const [modules, setModules] = useState<CatalogModule[]>([]);
  const [sections, setSections] = useState<CatalogSection[]>([]);
  const [masterSlug, setMasterSlug] = useState('our-college');

  const [createOpen, setCreateOpen] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [newForm, setNewForm] = useState({
    name: '',
    slug: '',
    domain: '',
    admin_username: '',
    admin_email: '',
    admin_password: '',
    template_slug: 'our-college',
    actions: {} as Record<string, ActionPerm>,
    sections: [] as string[],
  });

  const [permTarget, setPermTarget] = useState<TenantRow | null>(null);
  const [permActions, setPermActions] = useState<Record<string, ActionPerm>>({});
  const [permSections, setPermSections] = useState<string[]>([]);

  const [adminTarget, setAdminTarget] = useState<TenantRow | null>(null);
  const [adminForm, setAdminForm] = useState({ username: '', email: '', password: '' });

  const [previewTenant, setPreviewTenant] = useState<TenantRow | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const headers = useMemo(() => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }), [token]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const r = await fetch(`${API}/platform/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.detail || 'Invalid super admin credentials');
      localStorage.setItem('platform_super_token', d.access);
      setToken(d.access);
    } catch (err: any) {
      setError(err.message);
    }
  }

  function logout() {
    localStorage.removeItem('platform_super_token');
    setToken('');
    setTenants([]);
  }

  async function loadAll() {
    if (!token) return;
    setBusy(true);
    setError('');
    try {
      const [tRes, cRes] = await Promise.all([
        fetch(`${API}/platform/tenants/`, { headers }),
        fetch(`${API}/platform/master-catalog/`, { headers }),
      ]);
      if (tRes.status === 401 || tRes.status === 403) {
        logout();
        return;
      }
      if (!tRes.ok) throw new Error('Failed to load colleges');
      const tData = await tRes.json();
      setTenants(Array.isArray(tData) ? tData : (tData.results || []));
      if (cRes.ok) {
        const cData = await cRes.json();
        setModules(cData.modules || []);
        setSections(cData.sections || []);
        if (cData.master_slug) setMasterSlug(cData.master_slug);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, [token]);

  function openCreate() {
    setSlugTouched(false);
    setNewForm({
      name: '',
      slug: '',
      domain: '',
      admin_username: '',
      admin_email: '',
      admin_password: '',
      template_slug: masterSlug || 'our-college',
      actions: buildActions(modules, { read: true, create: true, edit: true, delete: false }),
      sections: sections.map((s) => s.slug),
    });
    setCreateOpen(true);
  }

  async function submitCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const r = await fetch(`${API}/platform/tenants/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: newForm.name,
          slug: newForm.slug,
          domain: newForm.domain,
          admin_username: newForm.admin_username,
          admin_email: newForm.admin_email,
          admin_password: newForm.admin_password,
          template_slug: newForm.template_slug,
          permissions: {
            resources: deriveResources(newForm.actions),
            actions: newForm.actions,
            sections: newForm.sections,
          },
        }),
      });
      const text = await r.text();
      let d: any = {};
      try { d = text ? JSON.parse(text) : {}; } catch { throw new Error(`Server error (${r.status}): ${r.statusText || 'Invalid response'}`); }
      if (!r.ok) throw new Error(d.detail || JSON.stringify(d));
      setCreateOpen(false);
      setNotice(`Created college "${d.name}" from master format.`);
      await loadAll();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function openPermissions(t: TenantRow) {
    setPermTarget(t);
    const p = t.permissions || {};
    const existingRes = Array.isArray(p.resources) ? p.resources : modules.map((m) => m.key);
    const nextActions: Record<string, ActionPerm> = {};
    modules.forEach((m) => {
      if (p.actions && p.actions[m.key]) {
        nextActions[m.key] = { ...p.actions[m.key] };
      } else {
        const hasMod = existingRes.includes(m.key);
        nextActions[m.key] = { read: hasMod, create: hasMod, edit: hasMod, delete: hasMod };
      }
    });
    setPermActions(nextActions);
    setPermSections(Array.isArray(p.sections) ? p.sections : sections.map((s) => s.slug));
  }

  async function savePermissions(e: React.FormEvent) {
    e.preventDefault();
    if (!permTarget) return;
    setBusy(true);
    setError('');
    try {
      const r = await fetch(`${API}/platform/tenants/${permTarget.id}/`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          permissions: {
            resources: deriveResources(permActions),
            actions: permActions,
            sections: permSections,
          },
        }),
      });
      const text = await r.text();
      let d: any = {};
      try { d = text ? JSON.parse(text) : {}; } catch { throw new Error(`Server error (${r.status}): ${r.statusText || 'Invalid response'}`); }
      if (!r.ok) throw new Error(d.detail || JSON.stringify(d));
      setPermTarget(null);
      setNotice(`Updated RBAC permissions for "${permTarget.name}".`);
      await loadAll();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitAdminCreds(e: React.FormEvent) {
    e.preventDefault();
    if (!adminTarget) return;
    setBusy(true);
    setError('');
    try {
      const r = await fetch(`${API}/platform/tenants/${adminTarget.id}/set-admin/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(adminForm),
      });
      const text = await r.text();
      let d: any = {};
      try { d = text ? JSON.parse(text) : {}; } catch { throw new Error(`Server error (${r.status}): ${r.statusText || 'Invalid response'}`); }
      if (!r.ok) throw new Error(d.detail || JSON.stringify(d));
      setAdminTarget(null);
      setNotice(`Updated admin credentials for "${adminTarget.name}".`);
      await loadAll();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function syncFromMaster(t: TenantRow) {
    if (!confirm(`Replicate any new master format items from "${masterSlug}" into "${t.name}"?`)) return;
    setBusy(true);
    setError('');
    try {
      const r = await fetch(`${API}/platform/tenants/${t.id}/sync-master/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ template_slug: masterSlug }),
      });
      const text = await r.text();
      let d: any = {};
      try { d = text ? JSON.parse(text) : {}; } catch { throw new Error(`Server error (${r.status}): ${r.statusText || 'Invalid response'}`); }
      if (!r.ok) throw new Error(d.detail || JSON.stringify(d));
      setNotice(d.detail || 'Synced from master format.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteCollege(t: TenantRow) {
    if (!confirm(`Delete "${t.name}" (${t.slug}) and its database "${t.database_name}"? This cannot be undone.`)) return;
    setBusy(true);
    setError('');
    try {
      const r = await fetch(`${API}/platform/tenants/${t.id}/`, {
        method: 'DELETE',
        headers,
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.detail || 'Delete failed');
      }
      setNotice(`Deleted college "${t.name}".`);
      await loadAll();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function toggleSection(list: string[], val: string, setter: (next: string[]) => void) {
    if (list.includes(val)) setter(list.filter((x) => x !== val));
    else setter([...list, val]);
  }

  function toggleAction(
    state: Record<string, ActionPerm>,
    modKey: string,
    actKey: keyof ActionPerm,
    setter: (next: Record<string, ActionPerm>) => void
  ) {
    const cur = state[modKey] || { read: false, create: false, edit: false, delete: false };
    const nextVal = !cur[actKey];
    const updated: ActionPerm = { ...cur, [actKey]: nextVal };
    if (actKey !== 'read' && nextVal) updated.read = true;
    if (actKey === 'read' && !nextVal) {
      updated.create = false;
      updated.edit = false;
      updated.delete = false;
    }
    setter({ ...state, [modKey]: updated });
  }

  function renderRbacMatrix(
    state: Record<string, ActionPerm>,
    setter: (next: Record<string, ActionPerm>) => void
  ) {
    return (
      <div className="rbac-box">
        <div className="rbac-head">
          <b>Module Permissions (Read / Write / Edit / Delete)</b>
          <div>
            <button type="button" onClick={() => setter(buildActions(modules, { read: true, create: true, edit: true, delete: true }))}>Full Access</button>
            <button type="button" onClick={() => setter(buildActions(modules, { read: true, create: true, edit: true, delete: false }))}>Read/Write/Edit</button>
            <button type="button" onClick={() => setter(buildActions(modules, { read: true, create: false, edit: false, delete: false }))}>Read Only</button>
            <button type="button" onClick={() => setter(buildActions(modules, { read: false, create: false, edit: false, delete: false }))}>Clear</button>
          </div>
        </div>
        <div className="table-wrap">
          <table className="rbac-matrix">
            <thead>
              <tr>
                <th>CMS Module</th>
                <th>Read</th>
                <th>Write (Create)</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => {
                const a = state[m.key] || {};
                return (
                  <tr key={m.key}>
                    <td><b>{m.label}</b></td>
                    <td><input type="checkbox" checked={Boolean(a.read)} onChange={() => toggleAction(state, m.key, 'read', setter)} /></td>
                    <td><input type="checkbox" checked={Boolean(a.create)} onChange={() => toggleAction(state, m.key, 'create', setter)} /></td>
                    <td><input type="checkbox" checked={Boolean(a.edit)} onChange={() => toggleAction(state, m.key, 'edit', setter)} /></td>
                    <td><input type="checkbox" checked={Boolean(a.delete)} onChange={() => toggleAction(state, m.key, 'delete', setter)} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="admin-login">
        <form onSubmit={login} className="login-card">
          <div className="admin-mark">SA</div>
          <p className="eyebrow">PLATFORM CONTROL PLANE</p>
          <h1>Super Admin Sign In</h1>
          <p className="muted">Manage the Master College Format, provision new colleges, assign Read/Write/Edit/Delete RBAC, and preview college websites.</p>
          {error && <div className="admin-error">{error}</div>}
          <label>Superuser Username<input value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" /></label>
          <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></label>
          <button className="admin-primary">Sign in to Super Admin</button>
          <a href="/admin" className="back-site">← Go to College Admin Login</a>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-mark">SA</div>
          <div><b>Super Admin</b><small>MASTER & RBAC</small></div>
        </div>
        <div className="side-caption">PLATFORM CONTROL</div>
        <button className={`side-link ${viewMode === 'colleges' ? 'active' : ''}`} onClick={() => setViewMode('colleges')}>
          <Building2 size={18} /> Colleges & RBAC
        </button>

        <div className="side-caption" style={{ marginTop: 10 }}>MASTER COLLEGE BASE ({masterSlug})</div>
        {(Object.keys(configs) as Resource[]).map((k) => {
          const I = configs[k].icon;
          return (
            <button key={k} className={`side-link ${viewMode === k ? 'active' : ''}`} onClick={() => setViewMode(k)}>
              <I size={18} /> {configs[k].label}
            </button>
          );
        })}

        <div className="side-bottom">
          <a href={`/?tenant=${encodeURIComponent(masterSlug)}`} target="_blank" rel="noreferrer" className="side-link">← View master site</a>
          <button className="side-link" onClick={logout}><LogOut size={18} /> Sign out</button>
        </div>
      </aside>

      {viewMode !== 'colleges' ? (
        <Admin
          embeddedToken={token}
          embeddedTenantSlug={masterSlug}
          embeddedResource={viewMode}
          embeddedSuperuser={true}
        />
      ) : (
        <main className="admin-main">
          <header className="admin-top">
            <div>
              <span className="eyebrow">SUPER ADMIN CONTROL PLANE</span>
              <h1>Colleges & Role-Based Access</h1>
            </div>
            <div className="admin-actions">
              <button className="admin-icon" onClick={loadAll} title="Refresh"><RefreshCw size={17} /></button>
              <button className="admin-primary" onClick={openCreate}><Plus size={17} /> Create College</button>
            </div>
          </header>

          <section className="stats-grid">
            <div className="stat-card"><div className="stat-icon"><Building2 size={18} /></div><span>Total Colleges</span><strong>{tenants.length}</strong></div>
            <div className="stat-card"><div className="stat-icon"><Shield size={18} /></div><span>Master Base Format</span><strong style={{ fontSize: 16 }}>{masterSlug}</strong></div>
            <div className="stat-card"><div className="stat-icon"><Users size={18} /></div><span>CMS Modules</span><strong>{modules.length}</strong></div>
            <div className="stat-card"><div className="stat-icon"><Globe size={18} /></div><span>Master Sections</span><strong>{sections.length}</strong></div>
          </section>

          {error && <div className="admin-error inline-error">{error}<button onClick={() => setError('')}><X size={15} /></button></div>}
          {notice && <div className="admin-success inline-error">{notice}<button onClick={() => setNotice('')}><X size={15} /></button></div>}

          <section className="data-card">
            <div className="data-heading">
              <div>
                <h2>Registered Colleges</h2>
                <p>Edit your Master College Base in the left sidebar, then replicate it to any college with Read / Write / Edit / Delete RBAC permissions and preview how each college looks.</p>
              </div>
              <span className="record-count">{tenants.length} colleges</span>
            </div>

            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>College Name & ID</th>
                    <th>Database</th>
                    <th>Admin Login</th>
                    <th>RBAC Permissions</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((t) => {
                    const resCount = Array.isArray(t.permissions?.resources) ? t.permissions.resources.length : modules.length;
                    const secCount = Array.isArray(t.permissions?.sections) ? t.permissions.sections.length : sections.length;
                    return (
                      <tr key={t.id}>
                        <td data-label="College">
                          <b>{t.name}</b>
                          <small>slug: {t.slug}{t.domain ? ` · ${t.domain}` : ''}</small>
                        </td>
                        <td data-label="Database"><small>{t.database_name}</small></td>
                        <td data-label="Admin Login">
                          <span className="published-tag">{t.admin_usernames?.length ? t.admin_usernames.join(', ') : 'No admin set'}</span>
                        </td>
                        <td data-label="RBAC Permissions">
                          <small>{resCount}/{modules.length} modules · {secCount}/{sections.length} sections</small>
                        </td>
                        <td className="row-actions" data-label="Actions">
                          <button type="button" onClick={() => setPreviewTenant(t)} title="View College Website" style={{ background: '#e0f2fe', color: '#0369a1', display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 10px', fontWeight: 700, fontSize: 11 }}>
                            <Eye size={14} /> View
                          </button>
                          <button type="button" onClick={() => openPermissions(t)} title="Assign CRUD RBAC Permissions" style={{ background: '#fef3c7', color: '#92400e', display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 10px', fontWeight: 700, fontSize: 11 }}>
                            <Shield size={14} /> RBAC
                          </button>
                          {t.slug !== masterSlug && (
                            <button type="button" onClick={() => syncFromMaster(t)} title="Sync New Items from Master Format">
                              <Copy size={14} />
                            </button>
                          )}
                          <button type="button" onClick={() => { setAdminTarget(t); setAdminForm({ username: t.admin_usernames?.[0] || '', email: '', password: '' }); }} title="Set Admin Username & Password">
                            <KeyRound size={15} />
                          </button>
                          {t.slug !== masterSlug && (
                            <button type="button" onClick={() => deleteCollege(t)} title="Delete College & Database" style={{ color: '#b33b3b' }}>
                              <Trash2 size={15} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {createOpen && (
            <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setCreateOpen(false); }}>
              <form className="edit-modal wide-modal" onSubmit={submitCreate}>
                <div className="modal-title">
                  <div><span className="eyebrow">REPLICATE FROM MASTER BASE</span><h2>Create College & Assign RBAC</h2></div>
                  <button type="button" className="admin-icon" onClick={() => setCreateOpen(false)}><X /></button>
                </div>

                <div className="two-inputs" style={{ marginTop: 12 }}>
                  <label>College Name *
                    <input required value={newForm.name} placeholder="e.g. St. Xavier's College" onChange={(e) => {
                      const val = e.target.value;
                      const auto = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setNewForm((f) => ({ ...f, name: val, slug: slugTouched ? f.slug : auto }));
                    }} />
                  </label>
                  <label>College ID / Slug *
                    <input required value={newForm.slug} placeholder="e.g. st-xaviers" onChange={(e) => { setSlugTouched(e.target.value.length > 0); setNewForm({ ...newForm, slug: e.target.value.toLowerCase() }); }} />
                  </label>
                </div>

                <div className="two-inputs">
                  <label>College Admin Username *
                    <input required value={newForm.admin_username} placeholder="e.g. xavier_admin" onChange={(e) => setNewForm({ ...newForm, admin_username: e.target.value })} />
                  </label>
                  <label>College Admin Password *
                    <input required type="password" value={newForm.admin_password} placeholder="Strong password" onChange={(e) => setNewForm({ ...newForm, admin_password: e.target.value })} />
                  </label>
                </div>

                <div className="two-inputs">
                  <label>Admin Email (optional)
                    <input type="email" value={newForm.admin_email} placeholder="admin@college.edu" onChange={(e) => setNewForm({ ...newForm, admin_email: e.target.value })} />
                  </label>
                  <label>Replicate Master Base From
                    <select value={newForm.template_slug} onChange={(e) => setNewForm({ ...newForm, template_slug: e.target.value })}>
                      {tenants.map((t) => <option key={t.slug} value={t.slug}>{t.name} ({t.slug})</option>)}
                    </select>
                  </label>
                </div>

                {renderRbacMatrix(newForm.actions, (next) => setNewForm({ ...newForm, actions: next }))}

                <div className="rbac-box">
                  <div className="rbac-head">
                    <b>Allowed Website Menu Sections ({newForm.sections.length}/{sections.length})</b>
                    <div>
                      <button type="button" onClick={() => setNewForm({ ...newForm, sections: sections.map((s) => s.slug) })}>Select All</button>
                      <button type="button" onClick={() => setNewForm({ ...newForm, sections: ['home'] })}>Home Only</button>
                    </div>
                  </div>
                  <div className="rbac-grid">
                    {sections.map((s) => (
                      <label key={s.slug} className="rbac-check">
                        <input type="checkbox" checked={newForm.sections.includes(s.slug)} onChange={() => toggleSection(newForm.sections, s.slug, (next) => setNewForm({ ...newForm, sections: next }))} />
                        <span>{s.title}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="admin-secondary" onClick={() => setCreateOpen(false)}>Cancel</button>
                  <button className="admin-primary" disabled={busy}><Save size={16} /> {busy ? 'Provisioning…' : 'Create College'}</button>
                </div>
              </form>
            </div>
          )}

          {permTarget && (
            <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setPermTarget(null); }}>
              <form className="edit-modal wide-modal" onSubmit={savePermissions}>
                <div className="modal-title">
                  <div><span className="eyebrow">ROLE-BASED ACCESS CONTROL</span><h2>Permissions for {permTarget.name}</h2></div>
                  <button type="button" className="admin-icon" onClick={() => setPermTarget(null)}><X /></button>
                </div>

                {renderRbacMatrix(permActions, setPermActions)}

                <div className="rbac-box">
                  <div className="rbac-head">
                    <b>Allowed Website Menu Sections & Pages ({permSections.length}/{sections.length})</b>
                    <div>
                      <button type="button" onClick={() => setPermSections(sections.map((s) => s.slug))}>Select All</button>
                      <button type="button" onClick={() => setPermSections(['home'])}>Home Only</button>
                    </div>
                  </div>
                  <div className="rbac-grid">
                    {sections.map((s) => (
                      <label key={s.slug} className="rbac-check">
                        <input type="checkbox" checked={permSections.includes(s.slug)} onChange={() => toggleSection(permSections, s.slug, setPermSections)} />
                        <span>{s.title}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="admin-secondary" onClick={() => setPermTarget(null)}>Cancel</button>
                  <button type="button" className="admin-secondary" onClick={() => { const t = permTarget; setPermTarget(null); setPreviewTenant(t); }}><Eye size={15} /> Preview College</button>
                  <button className="admin-primary" disabled={busy}><Save size={16} /> Save Permissions</button>
                </div>
              </form>
            </div>
          )}

          {adminTarget && (
            <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setAdminTarget(null); }}>
              <form className="edit-modal" onSubmit={submitAdminCreds}>
                <div className="modal-title">
                  <div><span className="eyebrow">COLLEGE CREDENTIALS</span><h2>Set Admin for {adminTarget.name}</h2></div>
                  <button type="button" className="admin-icon" onClick={() => setAdminTarget(null)}><X /></button>
                </div>
                <label>Username *<input required value={adminForm.username} onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })} /></label>
                <label>Email (optional)<input type="email" value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} /></label>
                <label>New Password *<input required type="password" value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} /></label>
                <div className="modal-footer">
                  <button type="button" className="admin-secondary" onClick={() => setAdminTarget(null)}>Cancel</button>
                  <button className="admin-primary" disabled={busy}><Save size={16} /> Save Credentials</button>
                </div>
              </form>
            </div>
          )}

          {previewTenant && (
            <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setPreviewTenant(null); }}>
              <div className="edit-modal preview-modal">
                <div className="modal-title">
                  <div>
                    <span className="eyebrow">LIVE COLLEGE PREVIEW</span>
                    <h2>{previewTenant.name} ({previewTenant.slug})</h2>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button type="button" className={`admin-icon ${previewDevice === 'desktop' ? 'active-dev' : ''}`} onClick={() => setPreviewDevice('desktop')} title="Desktop view"><Monitor size={16} /></button>
                    <button type="button" className={`admin-icon ${previewDevice === 'mobile' ? 'active-dev' : ''}`} onClick={() => setPreviewDevice('mobile')} title="Mobile view"><Smartphone size={16} /></button>
                    <a href={`/?tenant=${encodeURIComponent(previewTenant.slug)}`} target="_blank" rel="noreferrer" className="admin-primary" style={{ textDecoration: 'none' }}>
                      <ExternalLink size={14} /> Open Full Tab
                    </a>
                    <button type="button" className="admin-icon" onClick={() => setPreviewTenant(null)}><X /></button>
                  </div>
                </div>
                <div className={`preview-frame-wrap ${previewDevice}`}>
                  <iframe
                    title={`Preview ${previewTenant.name}`}
                    src={`/?tenant=${encodeURIComponent(previewTenant.slug)}`}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
