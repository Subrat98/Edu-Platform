import {useEffect,useState} from 'react';import {Link,NavLink,useLocation} from 'react-router-dom';import {BookOpen,CalendarDays,Clock,FileText,GraduationCap,Menu,X,Search,ChevronDown,ExternalLink,Mail,MapPin,Phone,Facebook,Instagram,Youtube,ArrowUp,Accessibility} from 'lucide-react';import {navigation as staticNavigation} from '../data/navigation';import {useFontScale} from '../hooks/useFontScale';import type {NavItem} from '../types';
const quick=[['Academic Calendar','/academics/calendar'],['Time Table','/examination/timetable'],['Syllabus','/academics/syllabus'],['Fee Structure UG','/admission/fees'],['Fee Structure PG','/admission/fees'],['Student Login','/examination/student-login'],['Library Login','/library/login'],['Latest News','/notices'],['Online Grievance','/contact'],['Notice','/notices']];
const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
export function SiteHeader(){const [drawer,setDrawer]=useState(false),[expanded,setExpanded]=useState(''),[search,setSearch]=useState('');const [closedSection,setClosedSection]=useState('');const {increase,decrease,reset}=useFontScale();const location=useLocation();const [navItems,setNavItems]=useState<NavItem[]>(staticNavigation);useEffect(()=>{setDrawer(false);setExpanded('');setClosedSection('')},[location.pathname]);useEffect(()=>{document.body.style.overflow=drawer?'hidden':'';return()=>{document.body.style.overflow=''}},[drawer]);useEffect(()=>{const fn=(e:KeyboardEvent)=>{if(e.key==='Escape'){setDrawer(false);setClosedSection('')}};window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn)},[]);
useEffect(()=>{
  const tenantSlug = localStorage.getItem('college_tenant_slug') || 'our-college';
  const headers = {'X-Tenant-Slug': tenantSlug};
  Promise.all([
    fetch(`${API}/menu-sections/`, {headers}).then(r=>r.ok?r.json():null),
    fetch(`${API}/pages/`, {headers}).then(r=>r.ok?r.json():null)
  ]).then(([secData, pagesData])=>{
    if(!secData) return;
    const rawSections = Array.isArray(secData) ? secData : (secData.results || []);
    if(!rawSections.length) return;
    const activeSections = rawSections.filter((s:any)=>s.is_active!==false).sort((a:any,b:any)=>(a.sort_order||0)-(b.sort_order||0));
    const rawPages = pagesData ? (Array.isArray(pagesData) ? pagesData : (pagesData.results || [])) : [];
    const staticMap = new Map<string, NavItem>();
    staticNavigation.forEach(item => {
      const slugKey = item.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      staticMap.set(slugKey, item);
      if(item.href) {
        const hrefSlug = item.href.replace(/^\//, '').split('/')[0];
        if(hrefSlug) staticMap.set(hrefSlug, item);
      }
    });
    const dynamicNav: NavItem[] = activeSections.map((sec: any) => {
      const secSlugNorm = String(sec.slug || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const matchingPages = rawPages.filter((p: any) => {
        const pageSecNorm = String(p.section || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return (pageSecNorm === secSlugNorm || p.section === sec.slug) && p.is_published !== false;
      });
      let children: NavItem[] | undefined = undefined;
      if (matchingPages.length > 0) {
        children = matchingPages.map((p: any) => ({
          label: p.title,
          href: `/${sec.slug}/${p.slug}`
        }));
      }
      return {
        label: sec.title,
        href: sec.link || (children?.length ? children[0].href : (sec.slug === 'home' ? '/' : `/${sec.slug}`)),
        children
      };
    });
    if(dynamicNav.length) {
      setNavItems(dynamicNav);
    }
  }).catch(()=>{});
},[]);
return <><a className="skip-link" href="#main">Skip to main content</a><div className="topbar"><div className="container ticker">{quick.map(([t,h])=><Link key={t} to={h}>{t}</Link>)}</div></div><div className="utility"><div className="container utility-inner"><div className="font-tools" aria-label="Font size controls"><Accessibility size={15}/><button onClick={decrease} aria-label="Decrease font size">A-</button><button onClick={reset} aria-label="Reset font size">A</button><button onClick={increase} aria-label="Increase font size">A+</button></div><a href="#main">Skip to Main Content</a><Link to="/contact">Feedback</Link><Link to="/contact">Contact Us</Link><Link to="/gallery">Gallery</Link><form className="search-mini" onSubmit={e=>{e.preventDefault();location.pathname!='/search'&&window.location.assign(`/search?q=${encodeURIComponent(search)}`)}}><input aria-label="Search website" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/><button aria-label="Search"><Search size={17}/></button></form></div></div><header className="brand-header"><div className="container brand-inner"><Link to="/" className="brand-mark" aria-label="Our College home"><span className="crest"><BookOpen size={31}/><span>✦</span></span><span className="brand-copy"><strong>OUR COLLEGE</strong><b lang="or">ଆମ କଲେଜ</b><small>Cuttack, Odisha</small></span></Link><div className="accreditation"><span> A+ </span><small>NAAC ACCREDITED</small></div><button className="mobile-menu" onClick={()=>setDrawer(true)} aria-label="Open navigation"><Menu/></button></div></header><nav className="main-nav"><div className="container nav-inner">{navItems.map(item=>{
  const isDirectActive = item.href === '/' ? location.pathname === '/' : (item.href ? location.pathname === item.href : false);
  const isChildActive = Boolean(item.children?.some(c => c.href && (location.pathname === c.href || location.pathname.startsWith(`${c.href}/`))));
  const isSectionPrefixActive = item.href && item.href !== '/' ? location.pathname.startsWith(item.href.split('/')[1] ? `/${item.href.split('/')[1]}` : item.href) : false;
  const isSelected = isDirectActive || isChildActive || isSectionPrefixActive;
  const isClosed = closedSection === item.label;
  return (
    <div 
      className={`nav-item ${isClosed ? 'force-closed' : ''}`} 
      key={item.label}
      onMouseEnter={() => { if(closedSection === item.label) setClosedSection(''); }}
    >
      <Link to={item.href||'#'} className={isSelected ? 'active' : ''}>
        {item.label}
        {item.children && item.children.length > 0 && <ChevronDown size={13}/>}
      </Link>
      {item.children && item.children.length > 0 && (
        <div className="dropdown">
          {item.children.map(c => {
            const isSubActive = location.pathname === c.href;
            return (
              <Link 
                key={c.label} 
                to={c.href||'#'} 
                className={isSubActive ? 'sub-active' : ''}
                onClick={() => setClosedSection(item.label)}
              >
                {c.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
})}</div></nav>{drawer&&<div className="drawer-backdrop" onClick={()=>setDrawer(false)}><aside className="drawer" onClick={e=>e.stopPropagation()}><div className="drawer-head"><b>Explore Our College</b><button onClick={()=>setDrawer(false)} aria-label="Close navigation"><X/></button></div>{navItems.map(item=><div className="drawer-item" key={item.label}>{item.children&&item.children.length>0?<><button onClick={()=>setExpanded(expanded===item.label?'':item.label)}>{item.label}<ChevronDown size={16}/></button>{expanded===item.label&&<div className="drawer-sub">{item.children.map(c=><Link key={c.label} to={c.href||'#'}>{c.label}</Link>)}</div>}</>:<Link to={item.href||'#'}>{item.label}</Link>}</div>)}</aside></div>}</>}
export function SiteFooter(){return <footer className="footer"><div className="container footer-grid"><div><h3>Contact Us</h3><p><MapPin/> Cuttack, Odisha – 753001</p><p><Phone/> +91 1234 567890</p><p><Mail/> info@ourcollege.ac.in</p><a href="https://maps.google.com/?q=Cuttack+Odisha" target="_blank" rel="noreferrer">View on map <ExternalLink size={13}/></a></div><div><h3>Quick Links</h3><Link to="/about/overview">About Us</Link><Link to="/academics/departments">Academics</Link><Link to="/admission/ug">Admission</Link><Link to="/notices">Notices</Link></div><div><h3>Useful Links</h3><Link to="/naac">NAAC</Link><Link to="/iqac">IQAC</Link><Link to="/more/rti">RTI</Link><Link to="/contact">Contact Us</Link></div><div><h3>Follow Us</h3><div className="socials"><a href="#facebook" aria-label="Facebook"><Facebook/></a><a href="#youtube" aria-label="YouTube"><Youtube/></a><a href="#instagram" aria-label="Instagram"><Instagram/></a></div></div></div><div className="footer-bottom"><div className="container"><span>© {new Date().getFullYear()} Our College. All Rights Reserved.</span><div><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms & Conditions</Link><Link to="/sitemap">Sitemap</Link></div><a href="#top" aria-label="Back to top"><ArrowUp/></a></div></div></footer>}
