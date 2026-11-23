export interface NavItem { label:string; href?:string; external?:boolean; children?:NavItem[] }
export type NoticeCategory='admission'|'examination'|'result'|'tender'|'recruitment'|'event'|'general';
export interface Notice { id:string; title:string; date:string; category:NoticeCategory; fileUrl?:string; isNew?:boolean }
export interface Department { id:string; name:string; faculty:string; hod?:string; programmes:string[] }
export interface HeroSlide { id:string; image:string; alt:string; link?:string }
export interface QuickLink { label:string; href:string; external?:boolean }
