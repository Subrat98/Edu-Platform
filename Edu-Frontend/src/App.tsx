import {Suspense,lazy} from 'react';import {BrowserRouter,Routes,Route,Link,useLocation} from 'react-router-dom';import {Helmet,HelmetProvider} from 'react-helmet-async';import {useRegisterSW} from 'virtual:pwa-register/react';import {SiteHeader,SiteFooter} from './components/Layout';import {UpdatePrompt} from './components/UpdatePrompt';import {InstallPrompt} from './components/InstallPrompt';
const Home=lazy(()=>import('./pages/Pages').then(m=>({default:m.Home})));const Notices=lazy(()=>import('./pages/Pages').then(m=>({default:m.Notices})));const GenericPage=lazy(()=>import('./pages/Pages').then(m=>({default:m.GenericPage})));const SearchPage=lazy(()=>import('./pages/Pages').then(m=>({default:m.SearchPage})));const Gallery=lazy(()=>import('./pages/Pages').then(m=>({default:m.Gallery})));const Contact=lazy(()=>import('./pages/Pages').then(m=>({default:m.Contact})));const Admin=lazy(()=>import('./admin/Admin'));const SuperAdmin=lazy(()=>import('./admin/SuperAdmin'));
const HostelOverview=lazy(()=>import('./pages/Hostel').then(m=>({default:m.HostelOverview})));const HostelDetail=lazy(()=>import('./pages/Hostel').then(m=>({default:m.HostelDetail})));const HostelFees=lazy(()=>import('./pages/Hostel').then(m=>({default:m.HostelFees})));const HostelNotices=lazy(()=>import('./pages/Hostel').then(m=>({default:m.HostelNotices})));
function NotFound(){return <div className="container inner-page not-found"><span>404</span><h1>Page not found</h1><p>The page you are looking for may have moved or is not available.</p><Link className="btn btn-primary" to="/">Return home</Link></div>}
function AppShell(){
  const location=useLocation();
  const isAdmin=location.pathname==='/admin'||location.pathname.startsWith('/admin/')||location.pathname==='/super-admin'||location.pathname.startsWith('/super-admin/');
  const {needRefresh:[needRefresh],updateServiceWorker}=useRegisterSW();

  if(isAdmin){
    return <Suspense fallback={<div className="loading container">Loading admin…</div>}>
      <Routes>
        <Route path="/admin/*" element={<Admin/>}/>
        <Route path="/super-admin/*" element={<SuperAdmin/>}/>
      </Routes>
    </Suspense>;
  }

  return <>
    <SiteHeader/>
    <main id="main">
      <Suspense fallback={<div className="loading container">Loading page…</div>}>
        <Routes>
          <Route path="/" element={<><Helmet><title>Our College | Cuttack, Odisha</title><meta name="description" content="Discover academics, admissions, campus life and announcements at Our College."/></Helmet><Home/></>}/>
          <Route path="/notices" element={<Notices/>}/>
          <Route path="/notices/:id" element={<GenericPage/>}/>
          <Route path="/gallery" element={<Gallery/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/search" element={<SearchPage/>}/>
          <Route path="/hostel" element={<HostelOverview/>}/>
          <Route path="/hostel/fees" element={<HostelFees/>}/>
          <Route path="/hostel/notices" element={<HostelNotices/>}/>
          <Route path="/hostel/:slug" element={<HostelDetail/>}/>
          <Route path="/about/*" element={<GenericPage/>}/>
          <Route path="/administration/*" element={<GenericPage/>}/>
          <Route path="/academics/*" element={<GenericPage/>}/>
          <Route path="/admission/*" element={<GenericPage/>}/>
          <Route path="/examination/*" element={<GenericPage/>}/>
          <Route path="/extension-activities/*" element={<GenericPage/>}/>
          <Route path="/more/*" element={<GenericPage/>}/>
          {['naac','iqac','research','library','alumni','cells-centers','privacy','terms','sitemap'].map(p=><Route key={p} path={`/${p}/*`} element={<GenericPage/>}/>)}
          <Route path="/:section/*" element={<GenericPage/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </Suspense>
    </main>
    <SiteFooter/>
    <UpdatePrompt show={needRefresh} onUpdate={()=>updateServiceWorker(true)}/>
    <InstallPrompt suppressed={needRefresh}/>
  </>;
}
export default function App(){return <HelmetProvider><BrowserRouter><AppShell/></BrowserRouter></HelmetProvider>}
