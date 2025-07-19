import{r as m,g,R as y}from"./vendor-23e4ea66-1752966303432.js";const A=e=>{let t;const r=new Set,o=(n,l)=>{const i=typeof n=="function"?n(t):n;if(!Object.is(i,t)){const a=t;t=l??(typeof i!="object"||i===null)?i:Object.assign({},t,i),r.forEach(c=>c(t,a))}},s=()=>t,S={setState:o,getState:s,getInitialState:()=>I,subscribe:n=>(r.add(n),()=>r.delete(n)),destroy:()=>{r.clear()}},I=t=e(o,s,S);return S},V=e=>e?A(e):A;var v={exports:{}},h={},T={exports:{}},D={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var f=m;function B(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var F=typeof Object.is=="function"?Object.is:B,O=f.useState,P=f.useEffect,x=f.useLayoutEffect,w=f.useDebugValue;function C(e,t){var r=t(),o=O({inst:{value:r,getSnapshot:t}}),s=o[0].inst,u=o[1];return x(function(){s.value=r,s.getSnapshot=t,b(s)&&u({inst:s})},[e,r,t]),P(function(){return b(s)&&u({inst:s}),e(function(){b(s)&&u({inst:s})})},[e]),w(r),r}function b(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!F(e,r)}catch{return!0}}function G(e,t){return t()}var U=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?G:C;D.useSyncExternalStore=f.useSyncExternalStore!==void 0?f.useSyncExternalStore:U;T.exports=D;var M=T.exports;/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var _=m,N=M;function j(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var $=typeof Object.is=="function"?Object.is:j,W=N.useSyncExternalStore,z=_.useRef,K=_.useEffect,L=_.useMemo,H=_.useDebugValue;h.useSyncExternalStoreWithSelector=function(e,t,r,o,s){var u=z(null);if(u.current===null){var E={hasValue:!1,value:null};u.current=E}else E=u.current;u=L(function(){function S(a){if(!I){if(I=!0,n=a,a=o(a),s!==void 0&&E.hasValue){var c=E.value;if(s(c,a))return l=c}return l=a}if(c=l,$(n,a))return c;var p=o(a);return s!==void 0&&s(c,p)?(n=a,c):(n=a,l=p)}var I=!1,n,l,i=r===void 0?null:r;return[function(){return S(t())},i===null?void 0:function(){return S(i())}]},[t,r,o,s]);var d=W(e,u[0],u[1]);return K(function(){E.hasValue=!0,E.value=d},[d]),H(d),d};v.exports=h;var J=v.exports;const Y=g(J),{useDebugValue:Z}=y,{useSyncExternalStoreWithSelector:q}=Y;const k=e=>e;function Q(e,t=k,r){const o=q(e.subscribe,e.getState,e.getServerState||e.getInitialState,t,r);return Z(o),o}const R=e=>{const t=typeof e=="function"?V(e):e,r=(o,s)=>Q(t,o,s);return Object.assign(r,t),r},ee=e=>e?R(e):R;export{ee as c};
