export interface NavItem { label:string; slug?:string; href?:string; external?:boolean; children?:NavItem[] }
export type NoticeCategory='admission'|'examination'|'result'|'tender'|'recruitment'|'event'|'general';
export interface Notice { id:string; title:string; date:string; category:NoticeCategory; fileUrl?:string; isNew?:boolean }
export interface Department { id:string; name:string; faculty:string; hod?:string; programmes:string[] }
export interface HeroSlide { id:string; image:string; alt:string; link?:string }
export interface QuickLink { label:string; href:string; external?:boolean }

export type HostelType='boys'|'girls'|'coed';
export interface Hostel {
  id:number; slug:string; name:string; hostel_type:HostelType; capacity:number; location:string;
  warden_name:string; warden_phone:string; warden_email:string; description:string; facilities:string[];
  rules_text:string; rules_file?:string|null; image?:string|null; admission_process:string; important_dates:string;
  payment_instructions:string; bank_details:string; is_published:boolean; sort_order:number;
}
export type RoomCategory='single'|'double'|'triple'|'dormitory';
export interface HostelRoomType {
  id:number; hostel:number; slug:string; category:RoomCategory; seats_per_room:number; is_ac:boolean;
  bathroom_type:'attached'|'common'; room_count:number; vacant_count:number; is_published:boolean;
}
export interface HostelMessMenuRow { id:number; hostel:number; slug:string; day:string; meal:'breakfast'|'lunch'|'snacks'|'dinner'; items:string }
export type HostelNoticeType='selection_list'|'waiting_list'|'final_list'|'spot_round'|'general';
export interface HostelNotice {
  id:number; hostel:number|null; title:string; notice_type:HostelNoticeType; academic_year:string;
  date:string; file?:string|null; description:string; is_published:boolean;
}
export type FeeType='one_time'|'recurring'|'refundable';
export type FeeFrequency='one_time'|'monthly'|'term'|'annual';
export interface HostelFeeHead {
  id:number; name:string; slug:string; fee_type:FeeType; frequency:FeeFrequency;
  is_optional:boolean; description:string; is_active:boolean;
}
export type FeeCategory='general'|'sc_st'|'obc'|'outstation'|'scholarship'|'staff_ward';
export interface HostelFee {
  id:number; slug:string; hostel:number; room_type:number|null; fee_head:number;
  academic_year:string; category:FeeCategory; amount:string; is_active:boolean;
}
