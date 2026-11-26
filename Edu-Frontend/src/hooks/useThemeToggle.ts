import {useCallback,useState} from 'react';
function initial(){const saved=localStorage.getItem('theme');if(saved==='dark'||saved==='light'){document.documentElement.setAttribute('data-theme',saved);return saved==='dark'}return window.matchMedia('(prefers-color-scheme: dark)').matches}
export function useThemeToggle(){const [isDark,setIsDark]=useState(initial);const toggle=useCallback(()=>{setIsDark(prev=>{const next=!prev;const value=next?'dark':'light';localStorage.setItem('theme',value);document.documentElement.setAttribute('data-theme',value);return next})},[]);return{isDark,toggle}}
