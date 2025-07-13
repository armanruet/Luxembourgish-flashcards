import{r as v,g as y,R as D}from"./vendor-23e4ea66-1752367518515.js";const p=e=>{let t;const r=new Set,s=(n,l)=>{const i=typeof n=="function"?n(t):n;if(!Object.is(i,t)){const a=t;t=l??(typeof i!="object"||i===null)?i:Object.assign({},t,i),r.forEach(E=>E(t,a))}},u=()=>t,d={setState:s,getState:u,getInitialState:()=>I,subscribe:n=>(r.add(n),()=>r.delete(n)),destroy:()=>{r.clear()}},I=t=e(s,u,d);return d},V=e=>e?p(e):p;var h={exports:{}},R={},m={exports:{}},g={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var f=v;function B(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var F=typeof Object.is=="function"?Object.is:B,O=f.useState,P=f.useEffect,x=f.useLayoutEffect,U=f.useDebugValue;function z(e,t){var r=t(),s=O({inst:{value:r,getSnapshot:t}}),u=s[0].inst,o=s[1];return x(function(){u.value=r,u.getSnapshot=t,b(u)&&o({inst:u})},[e,r,t]),P(function(){return b(u)&&o({inst:u}),e(function(){b(u)&&o({inst:u})})},[e]),U(r),r}function b(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!F(e,r)}catch{return!0}}function j(e,t){return t()}var L=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?j:z;g.useSyncExternalStore=f.useSyncExternalStore!==void 0?f.useSyncExternalStore:L;m.exports=g;var w=m.exports;/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var _=v,C=w;function G(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var W=typeof Object.is=="function"?Object.is:G,H=C.useSyncExternalStore,K=_.useRef,M=_.useEffect,Y=_.useMemo,J=_.useDebugValue;R.useSyncExternalStoreWithSelector=function(e,t,r,s,u){var o=K(null);if(o.current===null){var c={hasValue:!1,value:null};o.current=c}else c=o.current;o=Y(function(){function d(a){if(!I){if(I=!0,n=a,a=s(a),u!==void 0&&c.hasValue){var E=c.value;if(u(E,a))return l=E}return l=a}if(E=l,W(n,a))return E;var T=s(a);return u!==void 0&&u(E,T)?(n=a,E):(n=a,l=T)}var I=!1,n,l,i=r===void 0?null:r;return[function(){return d(t())},i===null?void 0:function(){return d(i())}]},[t,r,s,u]);var S=H(e,o[0],o[1]);return M(function(){c.hasValue=!0,c.value=S},[S]),J(S),S};h.exports=R;var N=h.exports;const $=y(N),{useDebugValue:Q}=D,{useSyncExternalStoreWithSelector:q}=$;const k=e=>e;function X(e,t=k,r){const s=q(e.subscribe,e.getState,e.getServerState||e.getInitialState,t,r);return Q(s),s}const A=e=>{const t=typeof e=="function"?V(e):e,r=(s,u)=>X(t,s,u);return Object.assign(r,t),r},ee=e=>e?A(e):A;export{ee as c};
