import {useCallback,useState} from 'react';
const STEP=.0625,MIN=.875,MAX=1.25;
export function useFontScale(){const [scale,setScale]=useState(1);const apply=(v:number)=>{const n=Math.min(MAX,Math.max(MIN,v));document.documentElement.style.setProperty('--fs-base',`${n}rem`);setScale(n)};return{scale,increase:useCallback(()=>apply(scale+STEP),[scale]),decrease:useCallback(()=>apply(scale-STEP),[scale]),reset:useCallback(()=>apply(1),[])}}
