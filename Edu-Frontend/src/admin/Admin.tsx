import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Activity, Bed, Bell, BookOpen, Building2, Compass, FileText, Home, Image, LogOut, Mail, Plus, Receipt, RefreshCw, Save, Trash2, UtensilsCrossed, Wallet, X } from 'lucide-react';
import './admin.css';

type Resource = 'notices'|'departments'|'pages'|'menu-sections'|'contact-messages'|'hostels'|'hostel-room-types'|'hostel-fee-heads'|'hostel-fees'|'hostel-mess-menu'|'hostel-notices';
type Row = Record<string, any>;
type FieldCfg = {name:string;label:string;type?:string;required?:boolean;options?:string[];relation?:Resource};
const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const configs: Record<Resource,{label:string;icon:any;fields:FieldCfg[];statusField?:'is_published'|'is_active'}> = {
  'menu-sections':{label:'Menu Bar',icon:Compass,statusField:'is_active',fields:[{name:'title',label:'Section name (e.g. About Us, Academics)',required:true},{name:'slug',label:'Section identifier / URL slug (e.g. about, academics)',required:true},{name:'link',label:'Direct link (optional, e.g. /about/overview)'},{name:'sort_order',label:'Bar position order (1, 2, 3...)',type:'number'},{name:'is_active',label:'Visible on website bar',type:'checkbox'}]},
  pages:{label:'Content pages',icon:FileText,statusField:'is_published',fields:[{name:'title',label:'Page title',required:true},{name:'slug',label:'URL slug',required:true},{name:'section',label:'Menu section (Parent bar item)',type:'select',relation:'menu-sections'},{name:'content',label:'Page content',type:'textarea'},{name:'meta_description',label:'SEO description'},{name:'is_published',label:'Published',type:'checkbox'}]},
  departments:{label:'Departments',icon:Building2,statusField:'is_published',fields:[{name:'name',label:'Department name',required:true},{name:'slug',label:'URL slug',required:true},{name:'faculty',label:'Faculty'},{name:'hod',label:'Head of department'},{name:'description',label:'Description',type:'textarea'},{name:'programmes',label:'Programmes (comma separated)'},{name:'is_published',label:'Published',type:'checkbox'}]},
  notices:{label:'Notices',icon:Bell,statusField:'is_published',fields:[{name:'title',label:'Notice title',required:true},{name:'description',label:'Description',type:'textarea'},{name:'date',label:'Publish date',type:'date',required:true},{name:'category',label:'Category',type:'select',options:['admission','examination','result','tender','recruitment','event','general']},{name:'is_published',label:'Published',type:'checkbox'}]},
  'contact-messages':{label:'Messages',icon:Mail,fields:[]},
  hostels:{label:'Hostels',icon:Home,statusField:'is_published',fields:[
    {name:'name',label:'Hostel name',required:true},
    {name:'slug',label:'URL slug',required:true},
    {name:'hostel_type',label:'Type',type:'select',options:['boys','girls','coed']},
    {name:'capacity',label:'Total capacity',type:'number'},
    {name:'location',label:'Location'},
    {name:'warden_name',label:'Warden name'},
    {name:'warden_phone',label:'Warden phone'},
    {name:'warden_email',label:'Warden email'},
    {name:'description',label:'Description',type:'textarea'},
    {name:'facilities',label:'Facilities (comma separated)'},
    {name:'rules_text',label:'Rules & regulations',type:'textarea'},
    {name:'admission_process',label:'Admission process (informational)',type:'textarea'},
    {name:'important_dates',label:'Important dates',type:'textarea'},
    {name:'payment_instructions',label:'Payment instructions',type:'textarea'},
    {name:'bank_details',label:'Bank details',type:'textarea'},
    {name:'sort_order',label:'Display order',type:'number'},
    {name:'is_published',label:'Published',type:'checkbox'}
  ]},
  'hostel-room-types':{label:'Room Types',icon:Bed,statusField:'is_published',fields:[
    {name:'hostel',label:'Hostel',type:'select',relation:'hostels',required:true},
    {name:'category',label:'Category',type:'select',options:['single','double','triple','dormitory']},
    {name:'seats_per_room',label:'Seats per room',type:'number'},
    {name:'is_ac',label:'AC',type:'checkbox'},
    {name:'bathroom_type',label:'Bathroom',type:'select',options:['attached','common']},
    {name:'room_count',label:'Total rooms',type:'number'},
    {name:'vacant_count',label:'Vacant rooms',type:'number'},
    {name:'is_published',label:'Published',type:'checkbox'}
  ]},
  'hostel-fee-heads':{label:'Fee Heads',icon:Receipt,statusField:'is_active',fields:[
    {name:'name',label:'Fee head name',required:true},
    {name:'slug',label:'URL slug',required:true},
    {name:'fee_type',label:'Type',type:'select',options:['one_time','recurring','refundable']},
    {name:'frequency',label:'Frequency',type:'select',options:['one_time','monthly','term','annual']},
    {name:'is_optional',label:'Optional',type:'checkbox'},
    {name:'description',label:'Description'},
    {name:'sort_order',label:'Display order',type:'number'},
    {name:'is_active',label:'Active',type:'checkbox'}
  ]},
  'hostel-fees':{label:'Fee Amounts',icon:Wallet,statusField:'is_active',fields:[
    {name:'hostel',label:'Hostel',type:'select',relation:'hostels',required:true},
    {name:'room_type',label:'Room type (optional)',type:'select',relation:'hostel-room-types'},
    {name:'fee_head',label:'Fee head',type:'select',relation:'hostel-fee-heads',required:true},
    {name:'academic_year',label:'Academic year (e.g. 2026-2027)',required:true},
    {name:'category',label:'Category',type:'select',options:['general','sc_st','obc','outstation','scholarship','staff_ward']},
    {name:'amount',label:'Amount (₹)',type:'number',required:true},
    {name:'is_active',label:'Active',type:'checkbox'}
  ]},
  'hostel-mess-menu':{label:'Mess Menu',icon:UtensilsCrossed,fields:[
    {name:'hostel',label:'Hostel',type:'select',relation:'hostels',required:true},
    {name:'day',label:'Day',type:'select',options:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']},
    {name:'meal',label:'Meal',type:'select',options:['breakfast','lunch','snacks','dinner']},
    {name:'items',label:'Items',type:'textarea'}
  ]},
  'hostel-notices':{label:'Hostel Notices',icon:Bell,statusField:'is_published',fields:[
    {name:'hostel',label:'Hostel (leave blank = all hostels)',type:'select',relation:'hostels'},
    {name:'title',label:'Title',required:true},
    {name:'notice_type',label:'Type',type:'select',options:['selection_list','waiting_list','final_list','spot_round','general']},
    {name:'academic_year',label:'Academic year (e.g. 2026-2027)'},
    {name:'date',label:'Date',type:'date',required:true},
    {name:'description',label:'Description',type:'textarea'},
    {name:'is_published',label:'Published',type:'checkbox'}
  ]}
};
const emptyToken = () => localStorage.getItem('college_admin_token') || '';
export default function Admin(){
 const [token,setToken]=useState(emptyToken); const [username,setUsername]=useState(''); const [password,setPassword]=useState(''); const [tenantSlug,setTenantSlug]=useState(localStorage.getItem('college_tenant_slug')||''); const [error,setError]=useState('');
 const [resource,setResource]=useState<Resource>('notices'); const [rows,setRows]=useState<Row[]>([]); const [stats,setStats]=useState<Row>({}); const [busy,setBusy]=useState(false); const [editing,setEditing]=useState<Row|null>(null); const [form,setForm]=useState<Row>({});
 const [relatedData,setRelatedData]=useState<Record<string,{id:number;slug?:string;label:string}[]>>({});
 const headers=useMemo(()=>({Authorization:`Bearer ${token}`,'Content-Type':'application/json','X-Tenant-Slug':tenantSlug}),[token,tenantSlug]);
 async function login(e:React.FormEvent){e.preventDefault();setError('');try{const r=await fetch(`${API}/auth/token/`,{method:'POST',headers:{'Content-Type':'application/json','X-Tenant-Slug':tenantSlug},body:JSON.stringify({username,password})});if(!r.ok)throw new Error('Invalid credentials or API unavailable');const d=await r.json();localStorage.setItem('college_admin_token',d.access);localStorage.setItem('college_tenant_slug',tenantSlug);setToken(d.access)}catch(e:any){setError(e.message)}}
 async function load(){
  if(!token)return;
  setBusy(true);
  try{
   const [list,summary]=await Promise.all([
    fetch(`${API}/${resource}/`,{headers}),
    fetch(`${API}/dashboard/`,{headers})
   ]);
   if(list.status===401||summary.status===401){logout();return}
   if(!list.ok)throw new Error('Could not load records');
   const d=await list.json();
   setRows(Array.isArray(d)?d:(d.results||[]));
   if(summary.ok)setStats(await summary.json());
   const relResources=Array.from(new Set(configs[resource].fields.map(f=>f.relation).filter(Boolean))) as Resource[];
   await Promise.all(relResources.map(async rk=>{
    const r=await fetch(`${API}/${rk}/`,{headers}).catch(()=>null);
    if(r&&r.ok){
     const rd=await r.json();
     const rList=Array.isArray(rd)?rd:(rd.results||[]);
     setRelatedData(prev=>({...prev,[rk]:rList.map((x:any)=>({id:x.id,slug:x.slug,label:x.title||x.name||x.slug}))}));
    }
   }));
  }catch(e:any){setError(e.message)}finally{setBusy(false)}
 }
 useEffect(()=>{load()},[resource,token]);
 function logout(){localStorage.removeItem('college_admin_token');setToken('');setRows([])}
 function openNew(){
  setEditing({});
  const initial:Row={};
  configs[resource].fields.forEach(f=>{
   if(f.relation){
    initial[f.name]=f.required?(relatedData[f.relation]?.[0]?.id??''):'';
   }else{
    initial[f.name]=f.type==='checkbox'?true:(f.name==='date'?new Date().toISOString().slice(0,10):'');
   }
  });
  setForm(initial);
 }
 function openEdit(row:Row){setEditing(row);const copy={...row};if(resource==='departments'&&Array.isArray(copy.programmes))copy.programmes=copy.programmes.join(', ');if(resource==='hostels'&&Array.isArray(copy.facilities))copy.facilities=copy.facilities.join(', ');setForm(copy)}
 async function save(e:React.FormEvent){e.preventDefault();setBusy(true);try{const payload={...form};if(resource==='departments')payload.programmes=String(payload.programmes||'').split(',').map((x:string)=>x.trim()).filter(Boolean);if(resource==='hostels')payload.facilities=String(payload.facilities||'').split(',').map((x:string)=>x.trim()).filter(Boolean);if(resource==='menu-sections'){payload.sort_order=payload.sort_order!==undefined&&payload.sort_order!==''?Number(payload.sort_order):0;if(!payload.slug&&payload.title){payload.slug=String(payload.title).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}}if(resource==='pages'){if(!payload.slug&&payload.title){payload.slug=String(payload.title).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}}if(resource==='hostel-fees'&&(payload.room_type===''||payload.room_type===undefined))payload.room_type=null;if(resource==='hostel-notices'&&(payload.hostel===''||payload.hostel===undefined))payload.hostel=null;const isEdit=Boolean(editing?.id||editing?.slug);const key=editing?.id??editing?.slug;const url=isEdit?`${API}/${resource}/${key}/`:`${API}/${resource}/`;const r=await fetch(url,{method:isEdit?'PATCH':'POST',headers,body:JSON.stringify(payload)});if(!r.ok){const d=await r.json();throw new Error(typeof d==='object'?JSON.stringify(d):String(d))}setEditing(null);await load()}catch(e:any){setError(e.message)}finally{setBusy(false)}}
 async function remove(row:Row){if(!confirm('Delete this record? This cannot be undone.'))return;const key=row.id??row.slug;const r=await fetch(`${API}/${resource}/${key}/`,{method:'DELETE',headers});if(!r.ok){setError('Delete failed');return}load()}
 async function toggleStatus(row:Row){
  const field=configs[resource].statusField;
  if(!field)return;
  const nextActive=!Boolean(row[field]);
  const payload={[field]:nextActive};
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
    setRows(prev => prev.map(r => ((r.id ?? r.slug) === key ? { ...r, [field]: nextActive } : r)));
  } catch(e:any){
    setError(e.message);
  }
 }
 if(!token)return <div className="admin-login"><form onSubmit={login} className="login-card"><div className="admin-mark">OC</div><p className="eyebrow">COLLEGE CONTENT MANAGEMENT</p><h1>Admin sign in</h1><p className="muted">Sign in with an account assigned to this college or company.</p>{error&&<div className="admin-error">{error}</div>}<label>College / company ID<input value={tenantSlug} onChange={e=>setTenantSlug(e.target.value.toLowerCase())} required placeholder="e.g. our-college" autoComplete="organization"/></label><label>Username<input value={username} onChange={e=>setUsername(e.target.value)} required autoComplete="username"/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/></label><button className="admin-primary">Sign in</button><a href="/" className="back-site">← Back to college website</a></form></div>;
 const cfg=configs[resource];
 return <div className="admin-shell"><aside className="admin-sidebar"><div className="admin-brand"><div className="admin-mark">OC</div><div><b>College CMS</b><small>ADMINISTRATION</small></div></div><div className="side-caption">CONTENT MANAGEMENT</div>{(Object.keys(configs) as Resource[]).map(k=>{const I=configs[k].icon;return <button key={k} className={`side-link ${resource===k?'active':''}`} onClick={()=>{setResource(k);setEditing(null)}}><I size={18}/>{configs[k].label}</button>})}<div className="side-bottom"><a href="/" className="side-link">← View website</a><button className="side-link" onClick={logout}><LogOut size={18}/>Sign out</button></div></aside>
 <main className="admin-main"><header className="admin-top"><div><span className="eyebrow">CONTENT WORKSPACE</span><h1>{cfg.label}</h1></div><div className="admin-actions"><button className="admin-icon" onClick={load} title="Refresh"><RefreshCw size={17}/></button>{resource!=='contact-messages'&&<button className="admin-primary" onClick={openNew}><Plus size={17}/> Add {cfg.label.slice(0,-1)}</button>}</div></header>
 <section className="stats-grid">{[['Notices',stats.notices,Bell],['Departments',stats.departments,BookOpen],['Content pages',stats.pages,FileText],['Menu Bar Items',stats.menu_sections,Compass],['Unread messages',stats.unread_messages,Mail],['Hostels',stats.hostels,Home],['Hostel Notices',stats.hostel_notices,Bell]].map(([label,value,Icon]:any)=><div className="stat-card" key={label}><div className="stat-icon"><Icon size={18}/></div><span>{label}</span><strong>{value??'—'}</strong></div>)}</section>
 {error&&<div className="admin-error inline-error">{error}<button onClick={()=>setError('')}><X size={15}/></button></div>}
 <section className="data-card"><div className="data-heading"><div><h2>{cfg.label}</h2><p>{resource==='contact-messages'?'Enquiries submitted through the public contact form.':resource==='menu-sections'?'Manage top navigation bar items (Home, About Us, Academics, etc.).':'Create, edit, publish or remove website content.'}</p></div><span className="record-count">{rows.length} records</span></div>{busy?<div className="admin-empty"><Activity className="spin"/> Loading records…</div>:resource==='contact-messages'?<div className="message-list">{rows.map(row=><article className="message-row" key={row.id}><div><b>{row.subject}</b><p>{row.message}</p><small>{row.name} · {row.email} · {new Date(row.created_at).toLocaleString()}</small></div><span className={row.is_read?'read-tag':'unread-tag'}>{row.is_read?'Read':'Unread'}</span></article>)}</div>:<div className="table-wrap">{(()=>{const col2Label=resource==='pages'?'Menu Section (Parent)':resource==='menu-sections'?'Order & Status':'Category / Section';return <table className="admin-table"><thead><tr><th>Title / Name</th><th>{col2Label}</th><th>Status & Visibility</th><th>Updated</th><th></th></tr></thead><tbody>{rows.map(row=>{const statusField=cfg.statusField;const isActive=Boolean(statusField&&row[statusField]);return <tr key={row.id??row.slug}><td data-label="Title / Name"><b>{row.title||row.name}</b><small>{row.slug||row.description||row.link||''}</small></td><td data-label={col2Label}>{resource==='pages'?(relatedData['menu-sections']?.find(s=>s.id===Number(row.section)||s.slug===row.section)?.label||row.section||'General'):resource==='menu-sections'?`Order: ${row.sort_order ?? 0}`:(row.category||row.notice_type||row.section||row.faculty||row.fee_type||row.day||'—')}</td><td data-label="Status & Visibility">{statusField?<button type="button" className={`status-toggle-btn ${isActive?'is-active':'is-inactive'}`} onClick={()=>toggleStatus(row)} title={`Click to ${isActive?'hide from':'show on'} website`}><span className="toggle-switch-slider"><span className="toggle-switch-thumb"/></span><span className="toggle-label-text">{resource==='menu-sections'?(isActive?'Visible in Bar':'Hidden from Bar'):(isActive?'Published':'Draft')}</span></button>:'—'}</td><td data-label="Updated">{row.updated_at?new Date(row.updated_at).toLocaleDateString():'—'}</td><td className="row-actions" data-label="Actions"><button onClick={()=>openEdit(row)} aria-label="Edit"><FileText size={16}/></button><button onClick={()=>remove(row)} aria-label="Delete"><Trash2 size={16}/></button></td></tr>})}</tbody></table>})()}{!rows.length&&<div className="admin-empty">No records yet. Add your first item.</div>}</div>}</section>
 {editing!==null&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setEditing(null)}}><form className="edit-modal" onSubmit={save}><div className="modal-title"><div><span className="eyebrow">CONTENT EDITOR</span><h2>{editing.id||editing.slug?'Edit':'Create'} {cfg.label.slice(0,-1)}</h2></div><button type="button" className="admin-icon" onClick={()=>setEditing(null)}><X/></button></div>{cfg.fields.map(f=>f.relation?<label key={f.name}><span>{f.label}{f.required?' *':''}</span><select value={form[f.name]??''} onChange={e=>setForm({...form,[f.name]:e.target.value})} required={f.required}><option value="">-- Select {configs[f.relation].label} --</option>{(relatedData[f.relation]||[]).map(r=><option key={r.id} value={r.id}>{r.label}</option>)}</select></label>:<label className={f.type==='checkbox'?'check-field':''} key={f.name}>{f.type==='checkbox'?<><input type="checkbox" checked={Boolean(form[f.name])} onChange={e=>setForm({...form,[f.name]:e.target.checked})}/>{f.label}</>:<>{f.label}{f.type==='textarea'?<textarea rows={4} required={f.required} value={form[f.name]??''} onChange={e=>setForm({...form,[f.name]:e.target.value})}/>:f.type==='select'?<select value={form[f.name]??''} onChange={e=>setForm({...form,[f.name]:e.target.value})}>{f.options?.map(o=><option key={o}>{o}</option>)}</select>:<input type={f.type||'text'} required={f.required} value={form[f.name]??''} onChange={e=>setForm({...form,[f.name]:e.target.value})}/>}</>}</label>)}<div className="modal-footer"><button type="button" className="admin-secondary" onClick={()=>setEditing(null)}>Cancel</button><button className="admin-primary" disabled={busy}><Save size={16}/> Save changes</button></div></form></div>}
 </main></div>
}
