import{r as v,g,R as y}from"./vendor-dd3a49dd-1755041958250.js";const A=e=>{let t;const r=new Set,u=(n,l)=>{const i=typeof n=="function"?n(t):n;if(!Object.is(i,t)){const a=t;t=l??(typeof i!="object"||i===null)?i:Object.assign({},t,i),r.forEach(c=>c(t,a))}},o=()=>t,d={setState:u,getState:o,getInitialState:()=>I,subscribe:n=>(r.add(n),()=>r.delete(n)),destroy:()=>{r.clear()}},I=t=e(u,o,d);return d},V=e=>e?A(e):A;var m={exports:{}},T={},D={exports:{}},h={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var f=v;function B(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var F=typeof Object.is=="function"?Object.is:B,O=f.useState,P=f.useEffect,w=f.useLayoutEffect,x=f.useDebugValue;function C(e,t){var r=t(),u=O({inst:{value:r,getSnapshot:t}}),o=u[0].inst,s=u[1];return w(function(){o.value=r,o.getSnapshot=t,b(o)&&s({inst:o})},[e,r,t]),P(function(){return b(o)&&s({inst:o}),e(function(){b(o)&&s({inst:o})})},[e]),x(r),r}function b(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!F(e,r)}catch{return!0}}function G(e,t){return t()}var U=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?G:C;h.useSyncExternalStore=f.useSyncExternalStore!==void 0?f.useSyncExternalStore:U;D.exports=h;var M=D.exports;/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var _=v,N=M;function j(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var $=typeof Object.is=="function"?Object.is:j,W=N.useSyncExternalStore,z=_.useRef,K=_.useEffect,H=_.useMemo,L=_.useDebugValue;T.useSyncExternalStoreWithSelector=function(e,t,r,u,o){var s=z(null);if(s.current===null){var E={hasValue:!1,value:null};s.current=E}else E=s.current;s=H(function(){function d(a){if(!I){if(I=!0,n=a,a=u(a),o!==void 0&&E.hasValue){var c=E.value;if(o(c,a))return l=c}return l=a}if(c=l,$(n,a))return c;var p=u(a);return o!==void 0&&o(c,p)?(n=a,c):(n=a,l=p)}var I=!1,n,l,i=r===void 0?null:r;return[function(){return d(t())},i===null?void 0:function(){return d(i())}]},[t,r,u,o]);var S=W(e,s[0],s[1]);return K(function(){E.hasValue=!0,E.value=S},[S]),L(S),S};m.exports=T;var J=m.exports;const Y=g(J),{useDebugValue:Z}=y,{useSyncExternalStoreWithSelector:q}=Y;const k=e=>e;function Q(e,t=k,r){const u=q(e.subscribe,e.getState,e.getServerState||e.getInitialState,t,r);return Z(u),u}const R=e=>{const t=typeof e=="function"?V(e):e,r=(u,o)=>Q(t,u,o);return Object.assign(r,t),r},ee=e=>e?R(e):R;export{ee as c};
