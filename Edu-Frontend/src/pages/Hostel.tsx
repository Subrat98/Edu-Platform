import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight, Bed, Building2, Mail, MapPin, Phone, ShieldCheck, UtensilsCrossed, Wallet } from 'lucide-react';
import { ShareButton } from '../components/ShareButton';
import type { Hostel, HostelFee, HostelFeeHead, HostelMessMenuRow, HostelNotice, HostelRoomType } from '../types';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const MEALS: { key: HostelMessMenuRow['meal']; label: string }[] = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'snacks', label: 'Snacks' },
  { key: 'dinner', label: 'Dinner' },
];
const OCCURRENCES: Record<string, number> = { one_time: 1, monthly: 12, term: 2, annual: 1 };
const FEE_GROUP_LABEL: Record<string, string> = { one_time: 'One-time charges', recurring: 'Recurring charges', refundable: 'Refundable deposits' };

function tenantHeaders() {
  const tenantSlug = localStorage.getItem('college_tenant_slug') || 'our-college';
  return { 'X-Tenant-Slug': tenantSlug };
}

async function fetchList<T>(path: string): Promise<T[]> {
  const r = await fetch(`${API}/${path}`, { headers: tenantHeaders() }).catch(() => null);
  if (!r || !r.ok) return [];
  const d = await r.json();
  return Array.isArray(d) ? d : (d.results || []);
}

function Breadcrumb({ trail }: { trail: { label: string; to?: string }[] }) {
  return <div className="breadcrumb"><Link to="/">Home</Link>{trail.map((t, i) => <span key={i}><span>/</span>{t.to ? <Link to={t.to}>{t.label}</Link> : <span>{t.label}</span>}</span>)}</div>;
}

function MessCarousel({ mess }: { mess: HostelMessMenuRow[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start' });
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);
  return <div className="mess-carousel">
    <div className="embla" ref={emblaRef}><div className="embla-container">
      {DAYS.map(day => <div className="embla-slide" key={day}>
        <h4>{day}</h4>
        <dl className="mess-day-meals">{MEALS.map(m => <div key={m.key}>
          <dt>{m.label}</dt><dd>{mess.find(r => r.day === day && r.meal === m.key)?.items || '—'}</dd>
        </div>)}</dl>
      </div>)}
    </div></div>
    <div className="mess-dots">{DAYS.map((day, i) => <button key={day} className={i === selected ? 'selected' : ''} onClick={() => emblaApi?.scrollTo(i)} aria-label={`Go to ${day}`} />)}</div>
  </div>;
}

export function HostelOverview() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchList<Hostel>('hostels/').then(h => { setHostels(h); setLoading(false); }); }, []);
  return <div className="container inner-page">
    <Breadcrumb trail={[{ label: 'Hostel' }]} />
    <div className="page-heading"><span>CAMPUS LIFE</span><h1>Hostel</h1><p>Information on hostels, room types, mess facilities and fee structure.</p></div>
    {loading ? <div className="loading">Loading hostels…</div> : <div className="hostel-grid">
      {hostels.map(h => <Link className="hostel-card" to={`/hostel/${h.slug}`} key={h.id}>
        <div className="hostel-card-icon"><Building2 /></div>
        <span className="hostel-type-tag">{h.hostel_type === 'coed' ? 'Co-ed' : h.hostel_type === 'boys' ? 'Boys' : 'Girls'}</span>
        <h3>{h.name}</h3>
        <p>{h.location}</p>
        <span>View details <ArrowRight size={15} /></span>
      </Link>)}
      {!hostels.length && <div className="empty-state">No hostels are published yet.</div>}
    </div>}
    <div className="hostel-overview-links">
      <Link className="btn btn-primary" to="/hostel/fees">Fee Structure <ArrowRight size={16} /></Link>
      <Link className="btn btn-primary" to="/hostel/notices">Hostel Notices <ArrowRight size={16} /></Link>
    </div>
  </div>;
}

export function HostelDetail() {
  const { slug = '' } = useParams();
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [roomTypes, setRoomTypes] = useState<HostelRoomType[]>([]);
  const [mess, setMess] = useState<HostelMessMenuRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/hostels/${slug}/`, { headers: tenantHeaders() }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetchList<HostelRoomType>(`hostel-room-types/?hostel=${encodeURIComponent(slug)}`),
      fetchList<HostelMessMenuRow>(`hostel-mess-menu/?hostel=${encodeURIComponent(slug)}`),
    ]).then(([h, rt, m]) => { setHostel(h); setRoomTypes(rt); setMess(m); setLoading(false); });
  }, [slug]);

  if (loading) return <div className="container inner-page"><div className="loading">Loading hostel…</div></div>;
  if (!hostel) return <div className="container inner-page"><div className="empty-state">Hostel not found.</div></div>;

  return <div className="container inner-page">
    <Breadcrumb trail={[{ label: 'Hostel', to: '/hostel' }, { label: hostel.name }]} />
    <div className="page-heading"><span>{hostel.hostel_type === 'coed' ? 'CO-ED HOSTEL' : hostel.hostel_type === 'boys' ? 'BOYS HOSTEL' : 'GIRLS HOSTEL'}</span><h1>{hostel.name}</h1><p>{hostel.description}</p><ShareButton title={hostel.name} text={`${hostel.name} — Our College Hostel`} /></div>
    <div className="two-col-content">
      <article className="content-card">
        <h2>Facilities</h2>
        <ul className="facility-list">{hostel.facilities.map(f => <li key={f}><ShieldCheck size={15} /> {f}</li>)}</ul>
        {hostel.rules_text && <><h3>Rules &amp; regulations</h3><p>{hostel.rules_text}</p></>}
        {hostel.admission_process && <><h3>Admission process</h3><p>{hostel.admission_process}</p></>}
        {hostel.important_dates && <><h3>Important dates</h3><p>{hostel.important_dates}</p></>}

        <h3>Room types</h3>
        <div className="room-type-grid">
          {roomTypes.map(rt => <div className="room-type-card" key={rt.id}>
            <Bed size={18} />
            <b>{rt.category[0].toUpperCase() + rt.category.slice(1)}{rt.is_ac ? ' (AC)' : ''}</b>
            <span>{rt.seats_per_room} seat(s) per room · {rt.bathroom_type} bathroom</span>
            <span className={`vacancy-badge ${rt.vacant_count > 0 ? '' : 'full'}`}>{rt.vacant_count > 0 ? `${rt.vacant_count} of ${rt.room_count} vacant` : 'Full'}</span>
          </div>)}
          {!roomTypes.length && <p>Room type details will be published soon.</p>}
        </div>

        {mess.length > 0 && <>
          <h3><UtensilsCrossed size={16} /> Weekly mess menu</h3>
          <div className="mess-table-wrap">
            <table className="mess-table">
              <thead><tr><th>Day</th>{MEALS.map(m => <th key={m.key}>{m.label}</th>)}</tr></thead>
              <tbody>{DAYS.map(day => <tr key={day}><th>{day}</th>{MEALS.map(m => <td key={m.key}>{mess.find(r => r.day === day && r.meal === m.key)?.items || '—'}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <MessCarousel mess={mess} />
        </>}

        <Link className="btn btn-primary" to={`/hostel/fees?hostel=${hostel.slug}`}><Wallet size={16} /> View fee structure <ArrowRight size={15} /></Link>
      </article>
      <aside className="side-card">
        <h3>Warden</h3>
        <p>{hostel.warden_name}</p>
        {hostel.warden_phone && <p><Phone size={14} /> <a href={`tel:${hostel.warden_phone.replace(/[^+\d]/g, '')}`}>{hostel.warden_phone}</a></p>}
        {hostel.warden_email && <p><Mail size={14} /> <a href={`mailto:${hostel.warden_email}`}>{hostel.warden_email}</a></p>}
        <h3>Location</h3>
        <p><MapPin size={14} /> {hostel.location}</p>
        <h3>Capacity</h3>
        <p>{hostel.capacity} students</p>
        {hostel.payment_instructions && <><h3>Payment instructions</h3><p>{hostel.payment_instructions}</p></>}
        {hostel.bank_details && <><h3>Bank details</h3><p>{hostel.bank_details}</p></>}
      </aside>
    </div>
  </div>;
}

export function HostelFees() {
  const [params, setParams] = useSearchParams();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [feeHeads, setFeeHeads] = useState<HostelFeeHead[]>([]);
  const [fees, setFees] = useState<HostelFee[]>([]);
  const [roomTypes, setRoomTypes] = useState<HostelRoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const hostelSlug = params.get('hostel') || '';
  const year = params.get('year') || '';
  const category = params.get('category') || 'general';
  const roomType = params.get('room_type') || '';

  useEffect(() => { fetchList<Hostel>('hostels/').then(setHostels); fetchList<HostelFeeHead>('hostel-fee-heads/').then(setFeeHeads); }, []);
  useEffect(() => {
    if (!hostelSlug && hostels.length) { setParams(prev => { const n = new URLSearchParams(prev); n.set('hostel', hostels[0].slug); return n; }, { replace: true }); }
  }, [hostels, hostelSlug]);
  useEffect(() => {
    if (!hostelSlug) return;
    setLoading(true);
    Promise.all([
      fetchList<HostelFee>(`hostel-fees/?hostel=${encodeURIComponent(hostelSlug)}`),
      fetchList<HostelRoomType>(`hostel-room-types/?hostel=${encodeURIComponent(hostelSlug)}`),
    ]).then(([f, rt]) => {
      setFees(f); setRoomTypes(rt); setLoading(false);
      // Default to the first room type when one isn't already selected: an "All room types"
      // default would sum fee rows across different room types into one misleading total.
      if (!params.get('room_type') && rt.length) {
        setParams(prev => { const n = new URLSearchParams(prev); n.set('room_type', String(rt[0].id)); return n; }, { replace: true });
      }
    });
  }, [hostelSlug]);

  const years = useMemo(() => Array.from(new Set(fees.map(f => f.academic_year))).sort().reverse(), [fees]);
  const effectiveYear = year || years[0] || '';

  const filtered = useMemo(() => fees.filter(f =>
    f.academic_year === effectiveYear &&
    f.category === category &&
    (!roomType || String(f.room_type) === roomType || f.room_type === null)
  ), [fees, effectiveYear, category, roomType]);

  const grouped = useMemo(() => {
    const groups: Record<string, { head: HostelFeeHead; fee: HostelFee }[]> = { one_time: [], recurring: [], refundable: [] };
    filtered.forEach(fee => {
      const head = feeHeads.find(h => h.id === fee.fee_head);
      if (!head) return;
      groups[head.fee_type]?.push({ head, fee });
    });
    return groups;
  }, [filtered, feeHeads]);

  const total = useMemo(() => {
    let sum = 0;
    [...grouped.one_time, ...grouped.refundable].forEach(({ fee }) => { sum += Number(fee.amount); });
    grouped.recurring.forEach(({ head, fee }) => { sum += Number(fee.amount) * (OCCURRENCES[head.frequency] ?? 1); });
    return sum;
  }, [grouped]);

  function updateParam(key: string, value: string) {
    setParams(prev => { const n = new URLSearchParams(prev); if (value) n.set(key, value); else n.delete(key); return n; });
  }

  return <div className="container inner-page">
    <Breadcrumb trail={[{ label: 'Hostel', to: '/hostel' }, { label: 'Fee Structure' }]} />
    <div className="page-heading"><span>HOSTEL ADMISSION</span><h1>Hostel Fee Structure</h1><p>Select a hostel, academic year and category to view the fee breakdown and estimated annual cost.</p></div>
    <div className="fee-filter-bar">
      <label>Hostel<select value={hostelSlug} onChange={e => updateParam('hostel', e.target.value)}>{hostels.map(h => <option key={h.slug} value={h.slug}>{h.name}</option>)}</select></label>
      <label>Academic year<select value={effectiveYear} onChange={e => updateParam('year', e.target.value)}>{years.map(y => <option key={y} value={y}>{y}</option>)}</select></label>
      <label>Category<select value={category} onChange={e => updateParam('category', e.target.value)}>{['general', 'sc_st', 'obc', 'outstation', 'scholarship', 'staff_ward'].map(c => <option key={c} value={c}>{c.replace('_', '/').toUpperCase()}</option>)}</select></label>
      <label>Room type<select value={roomType} onChange={e => updateParam('room_type', e.target.value)}><option value="">All room types</option>{roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.category}{rt.is_ac ? ' (AC)' : ''}</option>)}</select></label>
    </div>
    {loading ? <div className="loading">Loading fee structure…</div> : <>
      {(['one_time', 'recurring', 'refundable'] as const).map(type => grouped[type].length > 0 && <div key={type}>
        <h3 className="fee-group-heading">{FEE_GROUP_LABEL[type]}</h3>
        <table className="fee-table">
          <thead><tr><th>Fee head</th><th>Frequency</th><th>Amount (₹)</th></tr></thead>
          <tbody>{grouped[type].map(({ head, fee }) => <tr key={fee.id}><td data-label="Fee head">{head.name}{head.is_optional ? ' (optional)' : ''}</td><td data-label="Frequency">{head.frequency.replace('_', '-')}</td><td data-label="Amount (₹)">{fee.amount}</td></tr>)}</tbody>
        </table>
      </div>)}
      {!filtered.length && <div className="empty-state">No fee data published for this selection yet.</div>}
      {filtered.length > 0 && <div className="fee-estimate-summary"><span>Estimated annual cost</span><strong>₹ {total.toLocaleString('en-IN')}</strong></div>}
    </>}
  </div>;
}

export function HostelNotices() {
  const [params, setParams] = useSearchParams();
  const [notices, setNotices] = useState<HostelNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const noticeType = params.get('notice_type') || '';
  const year = params.get('year') || '';

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (noticeType) qs.set('notice_type', noticeType);
    if (year) qs.set('year', year);
    fetchList<HostelNotice>(`hostel-notices/?${qs.toString()}`).then(n => { setNotices(n); setLoading(false); });
  }, [noticeType, year]);

  function updateParam(key: string, value: string) {
    setParams(prev => { const n = new URLSearchParams(prev); if (value) n.set(key, value); else n.delete(key); return n; });
  }

  return <div className="container inner-page">
    <Breadcrumb trail={[{ label: 'Hostel', to: '/hostel' }, { label: 'Notices' }]} />
    <div className="page-heading"><span>STAY INFORMED</span><h1>Hostel Notices</h1><p>Selection lists, waiting lists, final allotment and spot-round notices.</p><ShareButton title="Our College Hostel Notices" text="Hostel notices from Our College" /></div>
    <div className="filter-bar">
      <select value={noticeType} onChange={e => updateParam('notice_type', e.target.value)} aria-label="Filter by type">
        <option value="">All types</option>
        {['selection_list', 'waiting_list', 'final_list', 'spot_round', 'general'].map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
      </select>
      <input placeholder="Academic year (e.g. 2026-2027)" value={year} onChange={e => updateParam('year', e.target.value)} />
    </div>
    {loading ? <div className="loading">Loading notices…</div> : <div className="hostel-notice-list">
      {notices.map(n => <article className="hostel-notice-row" key={n.id}>
        <time>{new Date(n.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</time>
        <span className={`notice-type-tag ${n.notice_type}`}>{n.notice_type.replace('_', ' ')}</span>
        <div><h3>{n.title}</h3><small>{n.academic_year}</small></div>
      </article>)}
      {!notices.length && <div className="empty-state">No hostel notices match your filters.</div>}
    </div>}
  </div>;
}
