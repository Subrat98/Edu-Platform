import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Activity, Bell, BookOpen, Building2, Compass, FileText, Image, LogOut, Mail, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react';
import './admin.css';

type Resource = 'notices'|'departments'|'pages'|'menu-sections'|'contact-messages';
type Row = Record<string, any>;
const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const DEFAULT_MENU_SECTIONS = [
  { slug: 'about', title: 'About Us' },
  { slug: 'administration', title: 'Administration' },
  { slug: 'academics', title: 'Academics' },
  { slug: 'admission', title: 'Admission' },
  { slug: 'examination', title: 'Examination' },
  { slug: 'naac', title: 'NAAC' },
  { slug: 'iqac', title: 'IQAC' },
  { slug: 'research', title: 'R&D' },
  { slug: 'extension-activities', title: 'Extn. Activities' },
  { slug: 'library', title: 'Library' },
  { slug: 'alumni', title: 'Alumni Cell' },
  { slug: 'cells-centers', title: 'Cells and Centers' },
  { slug: 'more', title: 'More' }
];

const configs: Record<Resource,{label:string;icon:any;fields:{name:string;label:string;type?:string;required?:boolean;options?:string[]}[]}> = {
  'menu-sections':{label:'Menu Bar',icon:Compass,fields:[{name:'title',label:'Section name (e.g. About Us, Academics)',required:true},{name:'slug',label:'Section identifier / URL slug (e.g. about, academics)',required:true},{name:'link',label:'Direct link (optional, e.g. /about/overview)'},{name:'sort_order',label:'Bar position order (1, 2, 3...)',type:'number'},{name:'is_active',label:'Visible on website bar',type:'checkbox'}]},
  pages:{label:'Content pages',icon:FileText,fields:[{name:'title',label:'Page title',required:true},{name:'slug',label:'URL slug',required:true},{name:'section',label:'Menu section (Parent bar item)'},{name:'content',label:'Page content',type:'textarea'},{name:'meta_description',label:'SEO description'},{name:'is_published',label:'Published',type:'checkbox'}]},
  departments:{label:'Departments',icon:Building2,fields:[{name:'name',label:'Department name',required:true},{name:'slug',label:'URL slug',required:true},{name:'faculty',label:'Faculty'},{name:'hod',label:'Head of department'},{name:'description',label:'Description',type:'textarea'},{name:'programmes',label:'Programmes (comma separated)'},{name:'is_published',label:'Published',type:'checkbox'}]},
  notices:{label:'Notices',icon:Bell,fields:[{name:'title',label:'Notice title',required:true},{name:'description',label:'Description',type:'textarea'},{name:'date',label:'Publish date',type:'date',required:true},{name:'category',label:'Category',type:'select',options:['admission','examination','result','tender','recruitment','event','general']},{name:'is_published',label:'Published',type:'checkbox'}]},
  'contact-messages':{label:'Messages',icon:Mail,fields:[]}
};
const emptyToken = () => localStorage.getItem('college_admin_token') || '';
export default function Admin(){
 const [token,setToken]=useState(emptyToken); const [username,setUsername]=useState(''); const [password,setPassword]=useState(''); const [tenantSlug,setTenantSlug]=useState(localStorage.getItem('college_tenant_slug')||''); const [error,setError]=useState('');
 const [resource,setResource]=useState<Resource>('notices'); const [rows,setRows]=useState<Row[]>([]); const [stats,setStats]=useState<Row>({}); const [busy,setBusy]=useState(false); const [editing,setEditing]=useState<Row|null>(null); const [form,setForm]=useState<Row>({});
 const [menuSections,setMenuSections]=useState<{slug:string;title:string}[]>(DEFAULT_MENU_SECTIONS);
 const headers=useMemo(()=>({Authorization:`Bearer ${token}`,'Content-Type':'application/json','X-Tenant-Slug':tenantSlug}),[token,tenantSlug]);
 async function login(e:React.FormEvent){e.preventDefault();setError('');try{const r=await fetch(`${API}/auth/token/`,{method:'POST',headers:{'Content-Type':'application/json','X-Tenant-Slug':tenantSlug},body:JSON.stringify({username,password})});if(!r.ok)throw new Error('Invalid credentials or API unavailable');const d=await r.json();localStorage.setItem('college_admin_token',d.access);localStorage.setItem('college_tenant_slug',tenantSlug);setToken(d.access)}catch(e:any){setError(e.message)}}
 async function load(){
  if(!token)return;
  setBusy(true);
  try{
   const [list,summary,secRes]=await Promise.all([
    fetch(`${API}/${resource}/`,{headers}),
    fetch(`${API}/dashboard/`,{headers}),
    fetch(`${API}/menu-sections/`,{headers}).catch(()=>null)
   ]);
   if(list.status===401||summary.status===401){logout();return}
   if(!list.ok)throw new Error('Could not load records');
   const d=await list.json();
   setRows(Array.isArray(d)?d:(d.results||[]));
   if(summary.ok)setStats(await summary.json());
   if(secRes&&secRes.ok){
    const sData=await secRes.json();
    const sList=Array.isArray(sData)?sData:(sData.results||[]);
    if(sList.length){
     setMenuSections(sList.map((s:any)=>({slug:s.slug,title:s.title})));
    }
   }
  }catch(e:any){setError(e.message)}finally{setBusy(false)}
 }
 useEffect(()=>{load()},[resource,token]);
 function logout(){localStorage.removeItem('college_admin_token');setToken('');setRows([])}
 function openNew(){
  setEditing({});
  const initial:Row={};
  configs[resource].fields.forEach(f=>{
   if(f.name==='section'&&resource==='pages'){
    initial[f.name]=menuSections[0]?.slug||'about';
   }else{
    initial[f.name]=f.type==='checkbox'?true:(f.name==='date'?new Date().toISOString().slice(0,10):'');
   }
  });
  setForm(initial);
 }
 function openEdit(row:Row){setEditing(row);const copy={...row};if(resource==='departments'&&Array.isArray(copy.programmes))copy.programmes=copy.programmes.join(', ');setForm(copy)}
 async function save(e:React.FormEvent){e.preventDefault();setBusy(true);try{const payload={...form};if(resource==='departments')payload.programmes=String(payload.programmes||'').split(',').map((x:string)=>x.trim()).filter(Boolean);if(resource==='menu-sections'){payload.sort_order=payload.sort_order!==undefined&&payload.sort_order!==''?Number(payload.sort_order):0;if(!payload.slug&&payload.title){payload.slug=String(payload.title).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}}if(resource==='pages'){if(!payload.slug&&payload.title){payload.slug=String(payload.title).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}}const isEdit=Boolean(editing?.id||editing?.slug);const key=editing?.id??editing?.slug;const url=isEdit?`${API}/${resource}/${key}/`:`${API}/${resource}/`;const r=await fetch(url,{method:isEdit?'PATCH':'POST',headers,body:JSON.stringify(payload)});if(!r.ok){const d=await r.json();throw new Error(typeof d==='object'?JSON.stringify(d):String(d))}setEditing(null);await load()}catch(e:any){setError(e.message)}finally{setBusy(false)}}
 async function remove(row:Row){if(!confirm('Delete this record? This cannot be undone.'))return;const key=row.id??row.slug;const r=await fetch(`${API}/${resource}/${key}/`,{method:'DELETE',headers});if(!r.ok){setError('Delete failed');return}load()}
 async function toggleStatus(row:Row){
  const isMenuSec = resource === 'menu-sections';
  const currentActive = isMenuSec ? Boolean(row.is_active) : Boolean(row.is_published);
  const nextActive = !currentActive;
  const payload = isMenuSec ? { is_active: nextActive } : { is_published: nextActive };
  const key = row.id ?? row.slug;
  try {
    const r = await fetch(`${API}/${resource}/${key}/`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(payload)
    });
    if(!r.ok){
      const d = await r.json();
      throw new Error(typeof d==='object' ? JSON.stringify(d) : String(d));
    }
    setRows(prev => prev.map(r => ((r.id ?? r.slug) === key ? { ...r, ...(isMenuSec ? { is_active: nextActive } : { is_published: nextActive }) } : r)));
  } catch(e:any){
    setError(e.message);
  }
 }
 if(!token)return <div className="admin-login"><form onSubmit={login} className="login-card"><div className="admin-mark">OC</div><p className="eyebrow">COLLEGE CONTENT MANAGEMENT</p><h1>Admin sign in</h1><p className="muted">Sign in with an account assigned to this college or company.</p>{error&&<div className="admin-error">{error}</div>}<label>College / company ID<input value={tenantSlug} onChange={e=>setTenantSlug(e.target.value.toLowerCase())} required placeholder="e.g. our-college" autoComplete="organization"/></label><label>Username<input value={username} onChange={e=>setUsername(e.target.value)} required autoComplete="username"/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/></label><button className="admin-primary">Sign in</button><a href="/" className="back-site">← Back to college website</a></form></div>;
 const cfg=configs[resource];
 return <div className="admin-shell"><aside className="admin-sidebar"><div className="admin-brand"><div className="admin-mark">OC</div><div><b>College CMS</b><small>ADMINISTRATION</small></div></div><div className="side-caption">CONTENT MANAGEMENT</div>{(Object.keys(configs) as Resource[]).map(k=>{const I=configs[k].icon;return <button key={k} className={`side-link ${resource===k?'active':''}`} onClick={()=>{setResource(k);setEditing(null)}}><I size={18}/>{configs[k].label}</button>})}<div className="side-bottom"><a href="/" className="side-link">← View website</a><button className="side-link" onClick={logout}><LogOut size={18}/>Sign out</button></div></aside>
 <main className="admin-main"><header className="admin-top"><div><span className="eyebrow">CONTENT WORKSPACE</span><h1>{cfg.label}</h1></div><div className="admin-actions"><button className="admin-icon" onClick={load} title="Refresh"><RefreshCw size={17}/></button>{resource!=='contact-messages'&&<button className="admin-primary" onClick={openNew}><Plus size={17}/> Add {cfg.label.slice(0,-1)}</button>}</div></header>
 <section className="stats-grid">{[['Notices',stats.notices,Bell],['Departments',stats.departments,BookOpen],['Content pages',stats.pages,FileText],['Menu Bar Items',stats.menu_sections,Compass],['Unread messages',stats.unread_messages,Mail]].map(([label,value,Icon]:any)=><div className="stat-card" key={label}><div className="stat-icon"><Icon size={18}/></div><span>{label}</span><strong>{value??'—'}</strong></div>)}</section>
 {error&&<div className="admin-error inline-error">{error}<button onClick={()=>setError('')}><X size={15}/></button></div>}
 <section className="data-card"><div className="data-heading"><div><h2>{cfg.label}</h2><p>{resource==='contact-messages'?'Enquiries submitted through the public contact form.':resource==='menu-sections'?'Manage top navigation bar items (Home, About Us, Academics, etc.).':'Create, edit, publish or remove website content.'}</p></div><span className="record-count">{rows.length} records</span></div>{busy?<div className="admin-empty"><Activity className="spin"/> Loading records…</div>:resource==='contact-messages'?<div className="message-list">{rows.map(row=><article className="message-row" key={row.id}><div><b>{row.subject}</b><p>{row.message}</p><small>{row.name} · {row.email} · {new Date(row.created_at).toLocaleString()}</small></div><span className={row.is_read?'read-tag':'unread-tag'}>{row.is_read?'Read':'Unread'}</span></article>)}</div>:<div className="table-wrap"><table className="admin-table"><thead><tr><th>Title / Name</th><th>{resource==='pages'?'Menu Section (Parent)':resource==='menu-sections'?'Order & Status':'Category / Section'}</th><th>Status & Visibility</th><th>Updated</th><th></th></tr></thead><tbody>{rows.map(row=>{const isActive=Boolean(resource==='menu-sections'?row.is_active:row.is_published);return <tr key={row.id??row.slug}><td><b>{row.title||row.name}</b><small>{row.slug||row.description||row.link||''}</small></td><td>{resource==='pages'?(menuSections.find(s=>s.slug===row.section)?.title||row.section||'General'):resource==='menu-sections'?`Order: ${row.sort_order ?? 0}`:(row.category||row.section||row.faculty||'—')}</td><td><button type="button" className={`status-toggle-btn ${isActive?'is-active':'is-inactive'}`} onClick={()=>toggleStatus(row)} title={`Click to ${isActive?'hide from':'show on'} website`}><span className="toggle-switch-slider"><span className="toggle-switch-thumb"/></span><span className="toggle-label-text">{resource==='menu-sections'?(isActive?'Visible in Bar':'Hidden from Bar'):(isActive?'Published':'Draft')}</span></button></td><td>{row.updated_at?new Date(row.updated_at).toLocaleDateString():'—'}</td><td className="row-actions"><button onClick={()=>openEdit(row)} aria-label="Edit"><FileText size={16}/></button><button onClick={()=>remove(row)} aria-label="Delete"><Trash2 size={16}/></button></td></tr>})}</tbody></table>{!rows.length&&<div className="admin-empty">No records yet. Add your first item.</div>}</div>}</section>
 {editing!==null&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setEditing(null)}}><form className="edit-modal" onSubmit={save}><div className="modal-title"><div><span className="eyebrow">CONTENT EDITOR</span><h2>{editing.id||editing.slug?'Edit':'Create'} {cfg.label.slice(0,-1)}</h2></div><button type="button" className="admin-icon" onClick={()=>setEditing(null)}><X/></button></div>{cfg.fields.map(f=>f.name==='section'&&resource==='pages'?<label key={f.name}><span>{f.label} *</span><select value={form[f.name]??''} onChange={e=>setForm({...form,[f.name]:e.target.value})} required><option value="">-- Select Menu Bar Section --</option>{menuSections.map(s=><option key={s.slug} value={s.slug}>{s.title} (/{s.slug})</option>)}</select><small style={{color:'#687790',fontSize:'11px',marginTop:'4px',display:'block'}}>This page will be placed as a subsection under the <strong>{menuSections.find(s=>s.slug===form.section)?.title||'selected'}</strong> menu bar item.</small></label>:<label className={f.type==='checkbox'?'check-field':''} key={f.name}>{f.type==='checkbox'?<><input type="checkbox" checked={Boolean(form[f.name])} onChange={e=>setForm({...form,[f.name]:e.target.checked})}/>{f.label}</>:<>{f.label}{f.type==='textarea'?<textarea rows={4} required={f.required} value={form[f.name]??''} onChange={e=>setForm({...form,[f.name]:e.target.value})}/>:f.type==='select'?<select value={form[f.name]??''} onChange={e=>setForm({...form,[f.name]:e.target.value})}>{f.options?.map(o=><option key={o}>{o}</option>)}</select>:<input type={f.type||'text'} required={f.required} value={form[f.name]??''} onChange={e=>setForm({...form,[f.name]:e.target.value})}/>}</>}</label>)}<div className="modal-footer"><button type="button" className="admin-secondary" onClick={()=>setEditing(null)}>Cancel</button><button className="admin-primary" disabled={busy}><Save size={16}/> Save changes</button></div></form></div>}
 </main></div>
}
