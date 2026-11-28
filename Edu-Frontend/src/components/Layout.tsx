import {useEffect,useMemo,useRef,useState} from 'react';import {Link,NavLink,useLocation} from 'react-router-dom';import {Building2,CalendarDays,Clock,FileText,GraduationCap,Menu,X,Search,Send,ChevronDown,ChevronRight,ExternalLink,Mail,MapPin,Phone,Facebook,Instagram,Youtube,ArrowUp,Accessibility,Home,Sun,Moon,Megaphone,Shield,MoreHorizontal} from 'lucide-react';import {navigation as staticNavigation} from '../data/navigation';import {moreLinks} from '../data/moreLinks';import {useFontScale} from '../hooks/useFontScale';import {useThemeToggle} from '../hooks/useThemeToggle';import {getActiveTenantSlug} from '../utils/tenant';import type {NavItem} from '../types';
const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
export function SiteHeader(){
  const [drawer,setDrawer]=useState(false),[expanded,setExpanded]=useState(''),[search,setSearch]=useState('');
  const [closedSection,setClosedSection]=useState('');
  const [moreOpen,setMoreOpen]=useState(false);
  const moreRef=useRef<HTMLDivElement>(null);
  const navRef=useRef<HTMLDivElement>(null);
  const measureRef=useRef<HTMLDivElement>(null);
  const {increase,decrease,reset}=useFontScale();
  const {isDark,toggle:toggleTheme}=useThemeToggle();
  const location=useLocation();
  const [navItems,setNavItems]=useState<NavItem[]>(staticNavigation);
  const [hasApiMenu,setHasApiMenu]=useState(false);
  const [collegeName,setCollegeName]=useState('OUR COLLEGE');
  const [allowedResources,setAllowedResources]=useState<string[]|null>(null);
  const allBarItems=useMemo(()=>{
    const seen=new Set(navItems.map(i=>i.label.trim().toLowerCase()));
    const extra=moreLinks.filter(m=>!seen.has(m.label.trim().toLowerCase()));
    return [...navItems,...extra];
  },[navItems]);
  const [visibleCount,setVisibleCount]=useState<number>(staticNavigation.length);
  const [updates,setUpdates]=useState<{id:string|number;title:string}[]>([]);
  useEffect(()=>{setDrawer(false);setExpanded('');setClosedSection('');setMoreOpen(false)},[location.pathname]);
  useEffect(()=>{document.body.style.overflow=drawer?'hidden':'';return()=>{document.body.style.overflow=''}},[drawer]);
  useEffect(()=>{const fn=(e:KeyboardEvent)=>{if(e.key==='Escape'){setDrawer(false);setClosedSection('');setMoreOpen(false)}};window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn)},[]);
  useEffect(()=>{if(!moreOpen)return;const fn=(e:MouseEvent)=>{if(moreRef.current&&!moreRef.current.contains(e.target as Node))setMoreOpen(false)};document.addEventListener('mousedown',fn);return()=>document.removeEventListener('mousedown',fn)},[moreOpen]);
  useEffect(()=>{
    const calcVisible=()=>{
      const container=navRef.current;
      const measure=measureRef.current;
      if(!container||!measure)return;
      const available=container.clientWidth;
      if(available<=0)return;
      const moreReserved=46;
      const gap=4;
      const children=Array.from(measure.children) as HTMLElement[];
      const totalWidth=children.reduce((acc,el,idx)=>acc+el.offsetWidth+(idx>0?gap:0),0);
      if(totalWidth<=available){
        setVisibleCount(children.length);
        return;
      }
      let used=0;
      let count=0;
      for(let i=0;i<children.length;i++){
        const w=children[i].offsetWidth;
        const needed=used+(count>0?gap:0)+w;
        if(needed+moreReserved<=available){
          used=needed;
          count++;
        }else{
          break;
        }
      }
      setVisibleCount(Math.max(1,count));
    };
    calcVisible();
    document.fonts?.ready?.then(calcVisible);
    const ro=new ResizeObserver(calcVisible);
    if(navRef.current)ro.observe(navRef.current);
    window.addEventListener('resize',calcVisible);
    return()=>{ro.disconnect();window.removeEventListener('resize',calcVisible)};
  },[allBarItems]);
  useEffect(()=>{
    const tenantSlug = getActiveTenantSlug();
    const headers = {'X-Tenant-Slug': tenantSlug};
    Promise.all([
      fetch(`${API}/menu-sections/`, {headers}).then(r=>r.ok?r.json():null),
      fetch(`${API}/pages/`, {headers}).then(r=>r.ok?r.json():null),
      fetch(`${API}/tenant-config/`, {headers}).then(r=>r.ok?r.json():null)
    ]).then(([secData, pagesData, cfgData])=>{
      if(cfgData?.name) setCollegeName(cfgData.name);
      if(Array.isArray(cfgData?.permissions?.resources)) setAllowedResources(cfgData.permissions.resources);
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
        const dropdownPages = matchingPages.filter((p: any) => p.show_in_dropdown !== false);
        const directPage = matchingPages.find((p: any) => p.show_in_dropdown === false);
        let children: NavItem[] | undefined = undefined;
        if (secSlugNorm === 'administration') {
          const adminStatic = staticNavigation.find(n => n.label === 'Administration')?.children || [];
          const groupMap: Record<string, string[]> = {
            Administrator: ['chancellor', 'vice-chancellor', 'chairperson-pg-council', 'registrar', 'deans', 'comptroller-of-finance', 'controller-of-examinations'],
            'Statutory Bodies': ['the-syndicate', 'academic-council', 'college-development-council'],
          };
          const allowedDirect = new Set(['students-welfare', 'organogram']);
          const realPages = dropdownPages.filter((p: any) => p.slug !== 'administration-overview');
          if (realPages.length <= 1) {
            children = adminStatic;
          } else {
            const grouped = new Map<string, NavItem[]>();
            const topLevel: NavItem[] = [];
            realPages.forEach((p: any) => {
              const item: NavItem = { label: p.title, href: `/${sec.slug}/${p.slug}` };
              const grp = Object.keys(groupMap).find(g => groupMap[g].includes(p.slug));
              if (grp) {
                grouped.set(grp, [...(grouped.get(grp) || []), item]);
              } else if (allowedDirect.has(p.slug)) {
                topLevel.push(item);
              }
            });
            children = [
              ...Object.keys(groupMap).filter(g => grouped.has(g)).map(g => {
                const items = grouped.get(g)!;
                return { label: g, href: items[0]?.href || '#', children: items };
              }),
              ...topLevel,
            ];
          }
        } else if (dropdownPages.length > 0) {
          children = dropdownPages.map((p: any) => ({
            label: p.title,
            href: `/${sec.slug}/${p.slug}`
          }));
        }
        const firstChildHref = children?.[0]?.children?.[0]?.href || (children?.[0]?.href && children[0].href !== '#' ? children[0].href : undefined);
        const defaultHref = directPage ? `/${sec.slug}/${directPage.slug}` : (firstChildHref || (sec.slug === 'home' ? '/' : `/${sec.slug}`));
        const resolvedHref = secSlugNorm === 'administration' && (!sec.link || sec.link === '/administration/overview') ? defaultHref : (sec.link || defaultHref);
        return {
          label: sec.title,
          slug: sec.slug,
          href: resolvedHref,
          children
        };
      });
      if(dynamicNav.length) {
        setNavItems(dynamicNav);
        setHasApiMenu(true);
      }
    }).catch(()=>{});
  },[]);
  useEffect(()=>{
    const tenantSlug = getActiveTenantSlug();
    fetch(`${API}/notices/`, {headers:{'X-Tenant-Slug': tenantSlug}}).then(r=>r.ok?r.json():null).then(data=>{
      if(!data) return;
      const raw = Array.isArray(data) ? data : (data.results || []);
      const published = raw.filter((n:any)=>n.is_published!==false).sort((a:any,b:any)=>String(b.date||'').localeCompare(String(a.date||''))).slice(0,8);
      if(published.length) setUpdates(published.map((n:any)=>({id:n.slug||n.id,title:n.title})));
    }).catch(()=>{});
  },[]);
  return <>
    <a className="skip-link" href="#main">Skip to main content</a>
    <div className="utility"><div className="container utility-inner">
      <button className="theme-toggle" role="switch" aria-checked={isDark} aria-label="Toggle dark mode" onClick={toggleTheme}>
        <span className="theme-toggle-track">{isDark?<Moon size={12}/>:<Sun size={12}/>}</span>
      </button>
      <div className="font-tools" aria-label="Font size controls"><Accessibility size={15}/><button onClick={decrease} aria-label="Decrease font size">A-</button><button onClick={reset} aria-label="Reset font size">A</button><button onClick={increase} aria-label="Increase font size">A+</button></div>
      <a href="#main">Skip to Main Content</a>
      <Link to="/contact">Feedback</Link>
      <Link to="/more/caste-based-discrimination">Caste Based Discrimination</Link>
      <Link to="/more/e-office">e-Office</Link>
      <Link to="/contact">Contact Us</Link>
      <Link to="/gallery">Gallery</Link>
      <form className="search-mini" onSubmit={e=>{e.preventDefault();location.pathname!='/search'&&window.location.assign(`/search?q=${encodeURIComponent(search)}`)}}><input aria-label="Search website" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/><button aria-label="Search"><Search size={17}/></button></form>
      <select className="lang-select" aria-label="Select language" defaultValue="en"><option value="en">English</option><option value="or">ଓଡ଼ିଆ</option></select>
    </div></div>
    <header className="brand-header"><div className="container brand-inner">
      <Link to="/" className="brand-mark" aria-label={`${collegeName} home`}><img className="brand-logo" src="/logo.png" alt={`${collegeName} logo`}/><span className="brand-copy"><strong>{collegeName.toUpperCase()}</strong><b lang="or">ଆମ କଲେଜ</b><small>Cuttack, Odisha</small></span></Link>
      <div className="brand-right">
        <div className="accreditation"><span> A+ </span><small>NAAC ACCREDITED</small></div>
        <span className="brand-divider"/>
        <div className="gov-badge"><Shield size={26}/><span><small>Affiliated Department</small><small>State Government</small></span></div>
        <div className="scheme-badge" aria-hidden="true"><small>Scheme</small><b>LOGO</b></div>
        <button className="mobile-menu" onClick={()=>setDrawer(true)} aria-label="Open navigation"><Menu/></button>
      </div>
    </div></header>
    <nav className="main-nav"><div className="container nav-inner" ref={navRef}>
      <div className="nav-measure" ref={measureRef} aria-hidden="true">
        {allBarItems.map(item=>{
          const isHome=item.label==='Home';
          return <div className={`nav-item ${isHome?'nav-item-home':''}`} key={`m-${item.label}`}><span>{isHome?<Home size={17}/>:item.label}{item.children&&item.children.length>0&&<ChevronDown size={13}/>}</span></div>;
        })}
      </div>
      {allBarItems.slice(0,visibleCount).map(item=>{
        const isHome = item.label==='Home';
        const isDirectActive = item.href === '/' ? location.pathname === '/' : (item.href ? (location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)) : false);
        const isChildActive = Boolean(item.children?.some(c => c.href && (location.pathname === c.href || location.pathname.startsWith(`${c.href}/`))));
        const isSectionPrefixActive = item.slug && item.slug !== 'home' ? (location.pathname === `/${item.slug}` || location.pathname.startsWith(`/${item.slug}/`)) : false;
        const isSelected = isDirectActive || isChildActive || isSectionPrefixActive;
        const isClosed = closedSection === item.label;
        return (
          <div
            className={`nav-item ${isClosed ? 'force-closed' : ''} ${isHome ? 'nav-item-home' : ''}`}
            key={item.label}
            onMouseEnter={() => { if(closedSection === item.label) setClosedSection(''); }}
          >
            <Link to={item.href||'#'} className={isSelected ? 'active' : ''} aria-label={isHome?'Home':undefined}>
              {isHome ? <Home size={17}/> : item.label}
              {item.children && item.children.length > 0 && <ChevronDown size={13}/>}
            </Link>
            {item.children && item.children.length > 0 && (
              <div className="dropdown">
                {item.children.map(c => {
                  const hasSub = Boolean(c.children && c.children.length > 0);
                  const isSubActive = location.pathname === c.href || Boolean(c.children?.some(sc => location.pathname === sc.href));
                  if (hasSub) {
                    return (
                      <div className="dropdown-group" key={c.label}>
                        <Link
                          to={c.href || c.children?.[0]?.href || '#'}
                          className={`dropdown-group-label ${isSubActive ? 'sub-active' : ''}`}
                          onClick={() => setClosedSection(item.label)}
                        >
                          {c.label} <ChevronRight size={14}/>
                        </Link>
                        <div className="sub-dropdown">
                          {c.children!.map(sc => (
                            <Link
                              key={sc.label}
                              to={sc.href || '#'}
                              className={location.pathname === sc.href ? 'sub-active' : ''}
                              onClick={() => setClosedSection(item.label)}
                            >
                              {sc.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  }
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
      })}
      {visibleCount < allBarItems.length && (
        <div
          className={`nav-item more-trigger ${moreOpen?'force-open':''} ${closedSection==='__more__'?'force-closed':''}`}
          ref={moreRef}
          onMouseEnter={()=>{if(closedSection==='__more__')setClosedSection('')}}
        >
          <button onClick={()=>setMoreOpen(o=>!o)} aria-expanded={moreOpen} aria-label="More menu sections"><MoreHorizontal size={19}/></button>
          <div className="dropdown more-panel">
            {allBarItems.slice(visibleCount).map(item=>{
              const isOvActive = item.href === '/' ? location.pathname === '/' : (item.href ? (location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)) : false) || (item.slug && item.slug !== 'home' ? (location.pathname === `/${item.slug}` || location.pathname.startsWith(`/${item.slug}/`)) : false);
              return (
                <Link
                  key={`ov-${item.label}`}
                  to={item.href||'#'}
                  className={`more-overflow-item ${isOvActive ? 'sub-active' : ''}`}
                  onClick={()=>{setMoreOpen(false);setClosedSection('__more__')}}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div></nav>
    {updates.length>0 && <div className="updates-bar"><div className="container updates-inner">
      <span className="updates-label"><Megaphone size={16}/> Important Updates</span>
      <div className="marquee"><div className="marquee-track">
        {[...updates,...updates].map((n,i)=><Link key={`${n.id}-${i}`} to={`/notices/${n.id}`}>{n.title}</Link>)}
      </div></div>
    </div></div>}
    {drawer&&<div className="drawer-backdrop" onClick={()=>setDrawer(false)}><aside className="drawer" onClick={e=>e.stopPropagation()}>
      <div className="drawer-head"><b>Explore Our College</b><button onClick={()=>setDrawer(false)} aria-label="Close navigation"><X/></button></div>
      {navItems.map(item=><div className="drawer-item" key={item.label}>{item.children&&item.children.length>0?<><button onClick={()=>setExpanded(expanded===item.label?'':item.label)}>{item.label}<ChevronDown size={16}/></button>{expanded===item.label&&<div className="drawer-sub">{item.children.map(c=>c.children&&c.children.length>0?<div className="drawer-sub-group" key={c.label}><b>{c.label}</b>{c.children.map(sc=><Link key={sc.label} to={sc.href||'#'}>{sc.label}</Link>)}</div>:<Link key={c.label} to={c.href||'#'}>{c.label}</Link>)}</div>}</>:<Link to={item.href||'#'}>{item.label}</Link>}</div>)}
      {!hasApiMenu && <div className="drawer-item" key="more"><button onClick={()=>setExpanded(expanded==='More'?'':'More')}>More<ChevronDown size={16}/></button>{expanded==='More'&&<div className="drawer-sub">{moreLinks.map(c=><Link key={c.label} to={c.href||'#'}>{c.label}</Link>)}</div>}</div>}
    </aside></div>}
    <nav className="quick-action-bar" aria-label="Quick actions">{(!allowedResources||allowedResources.includes('notices'))&&<Link to="/notices"><FileText/><span>Notices</span></Link>}<Link to="/admission/ug"><GraduationCap/><span>Admissions</span></Link>{(!allowedResources||allowedResources.includes('hostels'))&&<Link to="/hostel"><Building2/><span>Hostel</span></Link>}<a href="tel:+911234567890"><Phone/><span>Call</span></a><button onClick={()=>setDrawer(true)} aria-label="Open menu"><Menu/><span>Menu</span></button></nav>
    <Link to="/admission/ug" className="fab-apply" aria-label="Apply now"><Send/><span>Apply</span></Link>
  </>;
}
export function SiteFooter(){return <footer className="footer"><div className="container footer-grid"><div><h3>Contact Us</h3><p><MapPin/> Cuttack, Odisha – 753001</p><p><Phone/> <a href="tel:+911234567890">+91 1234 567890</a></p><p><Mail/> <a href="mailto:info@ourcollege.ac.in">info@ourcollege.ac.in</a></p><a href="https://maps.google.com/?q=Cuttack+Odisha" target="_blank" rel="noreferrer">View on map <ExternalLink size={13}/></a></div><div><h3>Quick Links</h3><Link to="/about/overview">About Us</Link><Link to="/academics/departments">Academics</Link><Link to="/admission/ug">Admission</Link><Link to="/notices">Notices</Link></div><div><h3>Useful Links</h3><Link to="/naac">NAAC</Link><Link to="/iqac">IQAC</Link><Link to="/more/rti">RTI</Link><Link to="/contact">Contact Us</Link></div><div><h3>Follow Us</h3><div className="socials"><a href="#facebook" aria-label="Facebook"><Facebook/></a><a href="#youtube" aria-label="YouTube"><Youtube/></a><a href="#instagram" aria-label="Instagram"><Instagram/></a></div></div></div><div className="footer-bottom"><div className="container"><span className="footer-credit">© {new Date().getFullYear()} Our College. All Rights Reserved. <span className="footer-credit-sep">·</span> Powered by <a href="https://www.intulet.com/" target="_blank" rel="noreferrer">Intulet Technologies</a></span><div><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms & Conditions</Link><Link to="/sitemap">Sitemap</Link></div><a href="#top" aria-label="Back to top"><ArrowUp/></a></div></div></footer>}
