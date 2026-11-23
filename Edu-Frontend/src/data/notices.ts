import type {Notice,Department} from '../types';
export const notices:Notice[]=[
{id:'n1',title:'Online Examination Form Fill-up — Semester Examination',date:'2026-11-21',category:'examination',isNew:true},
{id:'n2',title:'Admission open for undergraduate programmes 2026–27',date:'2026-11-18',category:'admission',isNew:true},
{id:'n3',title:'Academic Calendar for the session 2026–27 released',date:'2026-11-15',category:'general',isNew:true},
{id:'n4',title:'Walk-in interview for guest faculty positions',date:'2026-11-12',category:'recruitment'},
{id:'n5',title:'Inter-college cultural festival — registration notice',date:'2026-11-08',category:'event'},
{id:'n6',title:'Tender notice for campus laboratory equipment',date:'2026-10-29',category:'tender'},
{id:'n7',title:'UG second semester results published',date:'2026-10-24',category:'result'},
{id:'n8',title:'Scholarship application and renewal schedule',date:'2026-10-18',category:'general'},
{id:'n9',title:'Revised examination timetable for final year students',date:'2026-10-12',category:'examination'},
{id:'n10',title:'PhD admission: entrance test and interview schedule',date:'2026-10-04',category:'admission'},
{id:'n11',title:'NSS volunteer orientation programme',date:'2026-09-26',category:'event'},
{id:'n12',title:'Recruitment application — non-teaching positions',date:'2026-09-15',category:'recruitment'}
];
export const departments:Department[]=[
{id:'physics',name:'Physics',faculty:'Faculty of Science',programmes:['B.Sc.','M.Sc.','Ph.D.']},{id:'chemistry',name:'Chemistry',faculty:'Faculty of Science',programmes:['B.Sc.','M.Sc.','Ph.D.']},{id:'mathematics',name:'Mathematics',faculty:'Faculty of Science',programmes:['B.Sc.','M.Sc.','Ph.D.']},{id:'english',name:'English',faculty:'Faculty of Arts',programmes:['B.A.','M.A.','Ph.D.']},{id:'history',name:'History',faculty:'Faculty of Arts',programmes:['B.A.','M.A.']},{id:'commerce',name:'Commerce',faculty:'Faculty of Commerce',programmes:['B.Com.','M.Com.']}
];
