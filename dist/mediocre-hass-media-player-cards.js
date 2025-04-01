(function(fe){typeof define=="function"&&define.amd?define(fe):fe()})(function(){"use strict";var fe,E,cr,pe,lr,ur,dr,fr,pt,mt,ht,pr,Pe={},mr=[],_i=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,$e=Array.isArray;function te(e,t){for(var r in t)e[r]=t[r];return e}function _t(e){e&&e.parentNode&&e.parentNode.removeChild(e)}function G(e,t,r){var n,i,o,a={};for(o in t)o=="key"?n=t[o]:o=="ref"?i=t[o]:a[o]=t[o];if(arguments.length>2&&(a.children=arguments.length>3?fe.call(arguments,2):r),typeof e=="function"&&e.defaultProps!=null)for(o in e.defaultProps)a[o]===void 0&&(a[o]=e.defaultProps[o]);return Ee(e,a,n,i,null)}function Ee(e,t,r,n,i){var o={type:e,props:t,key:r,ref:n,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:i??++cr,__i:-1,__u:0};return i==null&&E.vnode!=null&&E.vnode(o),o}function hr(){return{current:null}}function B(e){return e.children}function ee(e,t){this.props=e,this.context=t}function ge(e,t){if(t==null)return e.__?ge(e.__,e.__i+1):null;for(var r;t<e.__k.length;t++)if((r=e.__k[t])!=null&&r.__e!=null)return r.__e;return typeof e.type=="function"?ge(e):null}function _r(e){var t,r;if((e=e.__)!=null&&e.__c!=null){for(e.__e=e.__c.base=null,t=0;t<e.__k.length;t++)if((r=e.__k[t])!=null&&r.__e!=null){e.__e=e.__c.base=r.__e;break}return _r(e)}}function gt(e){(!e.__d&&(e.__d=!0)&&pe.push(e)&&!Be.__r++||lr!==E.debounceRendering)&&((lr=E.debounceRendering)||ur)(Be)}function Be(){for(var e,t,r,n,i,o,a,s=1;pe.length;)pe.length>s&&pe.sort(dr),e=pe.shift(),s=pe.length,e.__d&&(r=void 0,i=(n=(t=e).__v).__e,o=[],a=[],t.__P&&((r=te({},n)).__v=n.__v+1,E.vnode&&E.vnode(r),vt(t.__P,r,n,t.__n,t.__P.namespaceURI,32&n.__u?[i]:null,o,i??ge(n),!!(32&n.__u),a),r.__v=n.__v,r.__.__k[r.__i]=r,xr(o,r,a),r.__e!=i&&_r(r)));Be.__r=0}function gr(e,t,r,n,i,o,a,s,d,u,f){var c,_,p,h,m,v,y=n&&n.__k||mr,x=t.length;for(d=gi(r,t,y,d,x),c=0;c<x;c++)(p=r.__k[c])!=null&&(_=p.__i===-1?Pe:y[p.__i]||Pe,p.__i=c,v=vt(e,p,_,i,o,a,s,d,u,f),h=p.__e,p.ref&&_.ref!=p.ref&&(_.ref&&yt(_.ref,null,p),f.push(p.ref,p.__c||h,p)),m==null&&h!=null&&(m=h),4&p.__u||_.__k===p.__k?d=vr(p,d,e):typeof p.type=="function"&&v!==void 0?d=v:h&&(d=h.nextSibling),p.__u&=-7);return r.__e=m,d}function gi(e,t,r,n,i){var o,a,s,d,u,f=r.length,c=f,_=0;for(e.__k=new Array(i),o=0;o<i;o++)(a=t[o])!=null&&typeof a!="boolean"&&typeof a!="function"?(d=o+_,(a=e.__k[o]=typeof a=="string"||typeof a=="number"||typeof a=="bigint"||a.constructor==String?Ee(null,a,null,null,null):$e(a)?Ee(B,{children:a},null,null,null):a.constructor===void 0&&a.__b>0?Ee(a.type,a.props,a.key,a.ref?a.ref:null,a.__v):a).__=e,a.__b=e.__b+1,s=null,(u=a.__i=vi(a,r,d,c))!==-1&&(c--,(s=r[u])&&(s.__u|=2)),s==null||s.__v===null?(u==-1&&(i>f?_--:i<f&&_++),typeof a.type!="function"&&(a.__u|=4)):u!=d&&(u==d-1?_--:u==d+1?_++:(u>d?_--:_++,a.__u|=4))):e.__k[o]=null;if(c)for(o=0;o<f;o++)(s=r[o])!=null&&(2&s.__u)==0&&(s.__e==n&&(n=ge(s)),Cr(s,s));return n}function vr(e,t,r){var n,i;if(typeof e.type=="function"){for(n=e.__k,i=0;n&&i<n.length;i++)n[i]&&(n[i].__=e,t=vr(n[i],t,r));return t}e.__e!=t&&(t&&e.type&&!r.contains(t)&&(t=ge(e)),r.insertBefore(e.__e,t||null),t=e.__e);do t=t&&t.nextSibling;while(t!=null&&t.nodeType==8);return t}function ae(e,t){return t=t||[],e==null||typeof e=="boolean"||($e(e)?e.some(function(r){ae(r,t)}):t.push(e)),t}function vi(e,t,r,n){var i,o,a=e.key,s=e.type,d=t[r];if(d===null&&e.key==null||d&&a==d.key&&s===d.type&&(2&d.__u)==0)return r;if(n>(d!=null&&(2&d.__u)==0?1:0))for(i=r-1,o=r+1;i>=0||o<t.length;){if(i>=0){if((d=t[i])&&(2&d.__u)==0&&a==d.key&&s===d.type)return i;i--}if(o<t.length){if((d=t[o])&&(2&d.__u)==0&&a==d.key&&s===d.type)return o;o++}}return-1}function yr(e,t,r){t[0]=="-"?e.setProperty(t,r??""):e[t]=r==null?"":typeof r!="number"||_i.test(t)?r:r+"px"}function Ue(e,t,r,n,i){var o;e:if(t=="style")if(typeof r=="string")e.style.cssText=r;else{if(typeof n=="string"&&(e.style.cssText=n=""),n)for(t in n)r&&t in r||yr(e.style,t,"");if(r)for(t in r)n&&r[t]===n[t]||yr(e.style,t,r[t])}else if(t[0]=="o"&&t[1]=="n")o=t!=(t=t.replace(fr,"$1")),t=t.toLowerCase()in e||t=="onFocusOut"||t=="onFocusIn"?t.toLowerCase().slice(2):t.slice(2),e.l||(e.l={}),e.l[t+o]=r,r?n?r.t=n.t:(r.t=pt,e.addEventListener(t,o?ht:mt,o)):e.removeEventListener(t,o?ht:mt,o);else{if(i=="http://www.w3.org/2000/svg")t=t.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(t!="width"&&t!="height"&&t!="href"&&t!="list"&&t!="form"&&t!="tabIndex"&&t!="download"&&t!="rowSpan"&&t!="colSpan"&&t!="role"&&t!="popover"&&t in e)try{e[t]=r??"";break e}catch{}typeof r=="function"||(r==null||r===!1&&t[4]!="-"?e.removeAttribute(t):e.setAttribute(t,t=="popover"&&r==1?"":r))}}function br(e){return function(t){if(this.l){var r=this.l[t.type+e];if(t.u==null)t.u=pt++;else if(t.u<r.t)return;return r(E.event?E.event(t):t)}}}function vt(e,t,r,n,i,o,a,s,d,u){var f,c,_,p,h,m,v,y,x,S,$,g,w,C,N,F,O,j=t.type;if(t.constructor!==void 0)return null;128&r.__u&&(d=!!(32&r.__u),o=[s=t.__e=r.__e]),(f=E.__b)&&f(t);e:if(typeof j=="function")try{if(y=t.props,x="prototype"in j&&j.prototype.render,S=(f=j.contextType)&&n[f.__c],$=f?S?S.props.value:f.__:n,r.__c?v=(c=t.__c=r.__c).__=c.__E:(x?t.__c=c=new j(y,$):(t.__c=c=new ee(y,$),c.constructor=j,c.render=bi),S&&S.sub(c),c.props=y,c.state||(c.state={}),c.context=$,c.__n=n,_=c.__d=!0,c.__h=[],c._sb=[]),x&&c.__s==null&&(c.__s=c.state),x&&j.getDerivedStateFromProps!=null&&(c.__s==c.state&&(c.__s=te({},c.__s)),te(c.__s,j.getDerivedStateFromProps(y,c.__s))),p=c.props,h=c.state,c.__v=t,_)x&&j.getDerivedStateFromProps==null&&c.componentWillMount!=null&&c.componentWillMount(),x&&c.componentDidMount!=null&&c.__h.push(c.componentDidMount);else{if(x&&j.getDerivedStateFromProps==null&&y!==p&&c.componentWillReceiveProps!=null&&c.componentWillReceiveProps(y,$),!c.__e&&(c.shouldComponentUpdate!=null&&c.shouldComponentUpdate(y,c.__s,$)===!1||t.__v==r.__v)){for(t.__v!=r.__v&&(c.props=y,c.state=c.__s,c.__d=!1),t.__e=r.__e,t.__k=r.__k,t.__k.some(function(oe){oe&&(oe.__=t)}),g=0;g<c._sb.length;g++)c.__h.push(c._sb[g]);c._sb=[],c.__h.length&&a.push(c);break e}c.componentWillUpdate!=null&&c.componentWillUpdate(y,c.__s,$),x&&c.componentDidUpdate!=null&&c.__h.push(function(){c.componentDidUpdate(p,h,m)})}if(c.context=$,c.props=y,c.__P=e,c.__e=!1,w=E.__r,C=0,x){for(c.state=c.__s,c.__d=!1,w&&w(t),f=c.render(c.props,c.state,c.context),N=0;N<c._sb.length;N++)c.__h.push(c._sb[N]);c._sb=[]}else do c.__d=!1,w&&w(t),f=c.render(c.props,c.state,c.context),c.state=c.__s;while(c.__d&&++C<25);c.state=c.__s,c.getChildContext!=null&&(n=te(te({},n),c.getChildContext())),x&&!_&&c.getSnapshotBeforeUpdate!=null&&(m=c.getSnapshotBeforeUpdate(p,h)),F=f,f!=null&&f.type===B&&f.key==null&&(F=wr(f.props.children)),s=gr(e,$e(F)?F:[F],t,r,n,i,o,a,s,d,u),c.base=t.__e,t.__u&=-161,c.__h.length&&a.push(c),v&&(c.__E=c.__=null)}catch(oe){if(t.__v=null,d||o!=null)if(oe.then){for(t.__u|=d?160:128;s&&s.nodeType==8&&s.nextSibling;)s=s.nextSibling;o[o.indexOf(s)]=null,t.__e=s}else for(O=o.length;O--;)_t(o[O]);else t.__e=r.__e,t.__k=r.__k;E.__e(oe,t,r)}else o==null&&t.__v==r.__v?(t.__k=r.__k,t.__e=r.__e):s=t.__e=yi(r.__e,t,r,n,i,o,a,d,u);return(f=E.diffed)&&f(t),128&t.__u?void 0:s}function xr(e,t,r){for(var n=0;n<r.length;n++)yt(r[n],r[++n],r[++n]);E.__c&&E.__c(t,e),e.some(function(i){try{e=i.__h,i.__h=[],e.some(function(o){o.call(i)})}catch(o){E.__e(o,i.__v)}})}function wr(e){return typeof e!="object"||e==null?e:$e(e)?e.map(wr):te({},e)}function yi(e,t,r,n,i,o,a,s,d){var u,f,c,_,p,h,m,v=r.props,y=t.props,x=t.type;if(x=="svg"?i="http://www.w3.org/2000/svg":x=="math"?i="http://www.w3.org/1998/Math/MathML":i||(i="http://www.w3.org/1999/xhtml"),o!=null){for(u=0;u<o.length;u++)if((p=o[u])&&"setAttribute"in p==!!x&&(x?p.localName==x:p.nodeType==3)){e=p,o[u]=null;break}}if(e==null){if(x==null)return document.createTextNode(y);e=document.createElementNS(i,x,y.is&&y),s&&(E.__m&&E.__m(t,o),s=!1),o=null}if(x===null)v===y||s&&e.data===y||(e.data=y);else{if(o=o&&fe.call(e.childNodes),v=r.props||Pe,!s&&o!=null)for(v={},u=0;u<e.attributes.length;u++)v[(p=e.attributes[u]).name]=p.value;for(u in v)if(p=v[u],u!="children"){if(u=="dangerouslySetInnerHTML")c=p;else if(!(u in y)){if(u=="value"&&"defaultValue"in y||u=="checked"&&"defaultChecked"in y)continue;Ue(e,u,null,p,i)}}for(u in y)p=y[u],u=="children"?_=p:u=="dangerouslySetInnerHTML"?f=p:u=="value"?h=p:u=="checked"?m=p:s&&typeof p!="function"||v[u]===p||Ue(e,u,p,v[u],i);if(f)s||c&&(f.__html===c.__html||f.__html===e.innerHTML)||(e.innerHTML=f.__html),t.__k=[];else if(c&&(e.innerHTML=""),gr(t.type==="template"?e.content:e,$e(_)?_:[_],t,r,n,x=="foreignObject"?"http://www.w3.org/1999/xhtml":i,o,a,o?o[0]:r.__k&&ge(r,0),s,d),o!=null)for(u=o.length;u--;)_t(o[u]);s||(u="value",x=="progress"&&h==null?e.removeAttribute("value"):h!==void 0&&(h!==e[u]||x=="progress"&&!h||x=="option"&&h!==v[u])&&Ue(e,u,h,v[u],i),u="checked",m!==void 0&&m!==e[u]&&Ue(e,u,m,v[u],i))}return e}function yt(e,t,r){try{if(typeof e=="function"){var n=typeof e.__u=="function";n&&e.__u(),n&&t==null||(e.__u=e(t))}else e.current=t}catch(i){E.__e(i,r)}}function Cr(e,t,r){var n,i;if(E.unmount&&E.unmount(e),(n=e.ref)&&(n.current&&n.current!==e.__e||yt(n,null,t)),(n=e.__c)!=null){if(n.componentWillUnmount)try{n.componentWillUnmount()}catch(o){E.__e(o,t)}n.base=n.__P=null}if(n=e.__k)for(i=0;i<n.length;i++)n[i]&&Cr(n[i],t,r||typeof e.type!="function");r||_t(e.__e),e.__c=e.__=e.__e=void 0}function bi(e,t,r){return this.constructor(e,r)}function me(e,t,r){var n,i,o,a;t==document&&(t=document.documentElement),E.__&&E.__(e,t),i=(n=typeof r=="function")?null:r&&r.__k||t.__k,o=[],a=[],vt(t,e=(!n&&r||t).__k=G(B,null,[e]),i||Pe,Pe,t.namespaceURI,!n&&r?[r]:i?null:t.firstChild?fe.call(t.childNodes):null,o,!n&&r?r:i?i.__e:t.firstChild,n,a),xr(o,e,a)}function Sr(e,t){me(e,t,Sr)}function xi(e,t,r){var n,i,o,a,s=te({},e.props);for(o in e.type&&e.type.defaultProps&&(a=e.type.defaultProps),t)o=="key"?n=t[o]:o=="ref"?i=t[o]:s[o]=t[o]===void 0&&a!==void 0?a[o]:t[o];return arguments.length>2&&(s.children=arguments.length>3?fe.call(arguments,2):r),Ee(e.type,s,n||e.key,i||e.ref,null)}function Te(e){function t(r){var n,i;return this.getChildContext||(n=new Set,(i={})[t.__c]=this,this.getChildContext=function(){return i},this.componentWillUnmount=function(){n=null},this.shouldComponentUpdate=function(o){this.props.value!==o.value&&n.forEach(function(a){a.__e=!0,gt(a)})},this.sub=function(o){n.add(o);var a=o.componentWillUnmount;o.componentWillUnmount=function(){n&&n.delete(o),a&&a.call(o)}}),r.children}return t.__c="__cC"+pr++,t.__=e,t.Provider=t.__l=(t.Consumer=function(r,n){return r.children(n)}).contextType=t,t}fe=mr.slice,E={__e:function(e,t,r,n){for(var i,o,a;t=t.__;)if((i=t.__c)&&!i.__)try{if((o=i.constructor)&&o.getDerivedStateFromError!=null&&(i.setState(o.getDerivedStateFromError(e)),a=i.__d),i.componentDidCatch!=null&&(i.componentDidCatch(e,n||{}),a=i.__d),a)return i.__E=i}catch(s){e=s}throw e}},cr=0,ee.prototype.setState=function(e,t){var r;r=this.__s!=null&&this.__s!==this.state?this.__s:this.__s=te({},this.state),typeof e=="function"&&(e=e(te({},r),this.props)),e&&te(r,e),e!=null&&this.__v&&(t&&this._sb.push(t),gt(this))},ee.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),gt(this))},ee.prototype.render=B,pe=[],ur=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,dr=function(e,t){return e.__v.__b-t.__v.__b},Be.__r=0,fr=/(PointerCapture)$|Capture$/i,pt=0,mt=br(!1),ht=br(!0),pr=0;var wi=0;function l(e,t,r,n,i,o){t||(t={});var a,s,d=t;if("ref"in d)for(s in d={},t)s=="ref"?a=t[s]:d[s]=t[s];var u={type:e,props:d,key:r,ref:a,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--wi,__i:-1,__u:0,__source:i,__self:o};if(typeof e=="function"&&(a=e.defaultProps))for(s in a)d[s]===void 0&&(d[s]=a[s]);return E.vnode&&E.vnode(u),u}function bt(){return bt=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)({}).hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},bt.apply(null,arguments)}var se,I,xt,kr,ve=0,Pr=[],D=E,$r=D.__b,Er=D.__r,Tr=D.diffed,Mr=D.__c,Ar=D.unmount,Rr=D.__;function he(e,t){D.__h&&D.__h(I,e,ve||t),ve=0;var r=I.__H||(I.__H={__:[],__h:[]});return e>=r.__.length&&r.__.push({}),r.__[e]}function U(e){return ve=1,He(Nr,e)}function He(e,t,r){var n=he(se++,2);if(n.t=e,!n.__c&&(n.__=[r?r(t):Nr(void 0,t),function(s){var d=n.__N?n.__N[0]:n.__[0],u=n.t(d,s);d!==u&&(n.__N=[u,n.__[1]],n.__c.setState({}))}],n.__c=I,!I.__f)){var i=function(s,d,u){if(!n.__c.__H)return!0;var f=n.__c.__H.__.filter(function(_){return!!_.__c});if(f.every(function(_){return!_.__N}))return!o||o.call(this,s,d,u);var c=n.__c.props!==s;return f.forEach(function(_){if(_.__N){var p=_.__[0];_.__=_.__N,_.__N=void 0,p!==_.__[0]&&(c=!0)}}),o&&o.call(this,s,d,u)||c};I.__f=!0;var o=I.shouldComponentUpdate,a=I.componentWillUpdate;I.componentWillUpdate=function(s,d,u){if(this.__e){var f=o;o=void 0,i(s,d,u),o=f}a&&a.call(this,s,d,u)},I.shouldComponentUpdate=i}return n.__N||n.__}function ce(e,t){var r=he(se++,3);!D.__s&&Pt(r.__H,t)&&(r.__=e,r.u=t,I.__H.__h.push(r))}function ye(e,t){var r=he(se++,4);!D.__s&&Pt(r.__H,t)&&(r.__=e,r.u=t,I.__h.push(r))}function le(e){return ve=5,W(function(){return{current:e}},[])}function wt(e,t,r){ve=6,ye(function(){if(typeof e=="function"){var n=e(t());return function(){e(null),n&&typeof n=="function"&&n()}}if(e)return e.current=t(),function(){return e.current=null}},r==null?r:r.concat(e))}function W(e,t){var r=he(se++,7);return Pt(r.__H,t)&&(r.__=e(),r.__H=t,r.__h=e),r.__}function k(e,t){return ve=8,W(function(){return e},t)}function A(e){var t=I.context[e.__c],r=he(se++,9);return r.c=e,t?(r.__==null&&(r.__=!0,t.sub(I)),t.props.value):e.__}function Ct(e,t){D.useDebugValue&&D.useDebugValue(t?t(e):e)}function Ci(e){var t=he(se++,10),r=U();return t.__=e,I.componentDidCatch||(I.componentDidCatch=function(n,i){t.__&&t.__(n,i),r[1](n)}),[r[0],function(){r[1](void 0)}]}function St(){var e=he(se++,11);if(!e.__){for(var t=I.__v;t!==null&&!t.__m&&t.__!==null;)t=t.__;var r=t.__m||(t.__m=[0,0]);e.__="P"+r[0]+"-"+r[1]++}return e.__}function Si(){for(var e;e=Pr.shift();)if(e.__P&&e.__H)try{e.__H.__h.forEach(je),e.__H.__h.forEach(kt),e.__H.__h=[]}catch(t){e.__H.__h=[],D.__e(t,e.__v)}}D.__b=function(e){I=null,$r&&$r(e)},D.__=function(e,t){e&&t.__k&&t.__k.__m&&(e.__m=t.__k.__m),Rr&&Rr(e,t)},D.__r=function(e){Er&&Er(e),se=0;var t=(I=e.__c).__H;t&&(xt===I?(t.__h=[],I.__h=[],t.__.forEach(function(r){r.__N&&(r.__=r.__N),r.u=r.__N=void 0})):(t.__h.forEach(je),t.__h.forEach(kt),t.__h=[],se=0)),xt=I},D.diffed=function(e){Tr&&Tr(e);var t=e.__c;t&&t.__H&&(t.__H.__h.length&&(Pr.push(t)!==1&&kr===D.requestAnimationFrame||((kr=D.requestAnimationFrame)||ki)(Si)),t.__H.__.forEach(function(r){r.u&&(r.__H=r.u),r.u=void 0})),xt=I=null},D.__c=function(e,t){t.some(function(r){try{r.__h.forEach(je),r.__h=r.__h.filter(function(n){return!n.__||kt(n)})}catch(n){t.some(function(i){i.__h&&(i.__h=[])}),t=[],D.__e(n,r.__v)}}),Mr&&Mr(e,t)},D.unmount=function(e){Ar&&Ar(e);var t,r=e.__c;r&&r.__H&&(r.__H.__.forEach(function(n){try{je(n)}catch(i){t=i}}),r.__H=void 0,t&&D.__e(t,r.__v))};var Lr=typeof requestAnimationFrame=="function";function ki(e){var t,r=function(){clearTimeout(n),Lr&&cancelAnimationFrame(t),setTimeout(e)},n=setTimeout(r,100);Lr&&(t=requestAnimationFrame(r))}function je(e){var t=I,r=e.__c;typeof r=="function"&&(e.__c=void 0,r()),I=t}function kt(e){var t=I;e.__c=e.__(),I=t}function Pt(e,t){return!e||e.length!==t.length||t.some(function(r,n){return r!==e[n]})}function Nr(e,t){return typeof t=="function"?t(e):t}function Ir(e,t){for(var r in t)e[r]=t[r];return e}function $t(e,t){for(var r in e)if(r!=="__source"&&!(r in t))return!0;for(var n in t)if(n!=="__source"&&e[n]!==t[n])return!0;return!1}function Et(e,t){var r=t(),n=U({t:{__:r,u:t}}),i=n[0].t,o=n[1];return ye(function(){i.__=r,i.u=t,Tt(i)&&o({t:i})},[e,r,t]),ce(function(){return Tt(i)&&o({t:i}),e(function(){Tt(i)&&o({t:i})})},[e]),r}function Tt(e){var t,r,n=e.u,i=e.__;try{var o=n();return!((t=i)===(r=o)&&(t!==0||1/t==1/r)||t!=t&&r!=r)}catch{return!0}}function Mt(e){e()}function At(e){return e}function Rt(){return[!1,Mt]}var Lt=ye;function Ge(e,t){this.props=e,this.context=t}function Or(e,t){function r(i){var o=this.props.ref,a=o==i.ref;return!a&&o&&(o.call?o(null):o.current=null),t?!t(this.props,i)||!a:$t(this.props,i)}function n(i){return this.shouldComponentUpdate=r,G(e,i)}return n.displayName="Memo("+(e.displayName||e.name)+")",n.prototype.isReactComponent=!0,n.__f=!0,n}(Ge.prototype=new ee).isPureReactComponent=!0,Ge.prototype.shouldComponentUpdate=function(e,t){return $t(this.props,e)||$t(this.state,t)};var zr=E.__b;E.__b=function(e){e.type&&e.type.__f&&e.ref&&(e.props.ref=e.ref,e.ref=null),zr&&zr(e)};var Pi=typeof Symbol<"u"&&Symbol.for&&Symbol.for("react.forward_ref")||3911;function Nt(e){function t(r){var n=Ir({},r);return delete n.ref,e(n,r.ref||null)}return t.$$typeof=Pi,t.render=t,t.prototype.isReactComponent=t.__f=!0,t.displayName="ForwardRef("+(e.displayName||e.name)+")",t}var Dr=function(e,t){return e==null?null:ae(ae(e).map(t))},Vr={map:Dr,forEach:Dr,count:function(e){return e?ae(e).length:0},only:function(e){var t=ae(e);if(t.length!==1)throw"Children.only";return t[0]},toArray:ae},$i=E.__e;E.__e=function(e,t,r,n){if(e.then){for(var i,o=t;o=o.__;)if((i=o.__c)&&i.__c)return t.__e==null&&(t.__e=r.__e,t.__k=r.__k),i.__c(e,t)}$i(e,t,r,n)};var Fr=E.unmount;function Br(e,t,r){return e&&(e.__c&&e.__c.__H&&(e.__c.__H.__.forEach(function(n){typeof n.__c=="function"&&n.__c()}),e.__c.__H=null),(e=Ir({},e)).__c!=null&&(e.__c.__P===r&&(e.__c.__P=t),e.__c=null),e.__k=e.__k&&e.__k.map(function(n){return Br(n,t,r)})),e}function Ur(e,t,r){return e&&r&&(e.__v=null,e.__k=e.__k&&e.__k.map(function(n){return Ur(n,t,r)}),e.__c&&e.__c.__P===t&&(e.__e&&r.appendChild(e.__e),e.__c.__e=!0,e.__c.__P=r)),e}function Me(){this.__u=0,this.o=null,this.__b=null}function Hr(e){var t=e.__.__c;return t&&t.__a&&t.__a(e)}function jr(e){var t,r,n;function i(o){if(t||(t=e()).then(function(a){r=a.default||a},function(a){n=a}),n)throw n;if(!r)throw t;return G(r,o)}return i.displayName="Lazy",i.__f=!0,i}function be(){this.i=null,this.l=null}E.unmount=function(e){var t=e.__c;t&&t.__R&&t.__R(),t&&32&e.__u&&(e.type=null),Fr&&Fr(e)},(Me.prototype=new ee).__c=function(e,t){var r=t.__c,n=this;n.o==null&&(n.o=[]),n.o.push(r);var i=Hr(n.__v),o=!1,a=function(){o||(o=!0,r.__R=null,i?i(s):s())};r.__R=a;var s=function(){if(!--n.__u){if(n.state.__a){var d=n.state.__a;n.__v.__k[0]=Ur(d,d.__c.__P,d.__c.__O)}var u;for(n.setState({__a:n.__b=null});u=n.o.pop();)u.forceUpdate()}};n.__u++||32&t.__u||n.setState({__a:n.__b=n.__v.__k[0]}),e.then(a,a)},Me.prototype.componentWillUnmount=function(){this.o=[]},Me.prototype.render=function(e,t){if(this.__b){if(this.__v.__k){var r=document.createElement("div"),n=this.__v.__k[0].__c;this.__v.__k[0]=Br(this.__b,r,n.__O=n.__P)}this.__b=null}var i=t.__a&&G(B,null,e.fallback);return i&&(i.__u&=-33),[G(B,null,t.__a?null:e.children),i]};var Gr=function(e,t,r){if(++r[1]===r[0]&&e.l.delete(t),e.props.revealOrder&&(e.props.revealOrder[0]!=="t"||!e.l.size))for(r=e.i;r;){for(;r.length>3;)r.pop()();if(r[1]<r[0])break;e.i=r=r[2]}};function Ei(e){return this.getChildContext=function(){return e.context},e.children}function Ti(e){var t=this,r=e.h;t.componentWillUnmount=function(){me(null,t.v),t.v=null,t.h=null},t.h&&t.h!==r&&t.componentWillUnmount(),t.v||(t.h=r,t.v={nodeType:1,parentNode:r,childNodes:[],contains:function(){return!0},appendChild:function(n){this.childNodes.push(n),t.h.appendChild(n)},insertBefore:function(n,i){this.childNodes.push(n),t.h.insertBefore(n,i)},removeChild:function(n){this.childNodes.splice(this.childNodes.indexOf(n)>>>1,1),t.h.removeChild(n)}}),me(G(Ei,{context:t.context},e.__v),t.v)}function Wr(e,t){var r=G(Ti,{__v:e,h:t});return r.containerInfo=t,r}(be.prototype=new ee).__a=function(e){var t=this,r=Hr(t.__v),n=t.l.get(e);return n[0]++,function(i){var o=function(){t.props.revealOrder?(n.push(i),Gr(t,e,n)):i()};r?r(o):o()}},be.prototype.render=function(e){this.i=null,this.l=new Map;var t=ae(e.children);e.revealOrder&&e.revealOrder[0]==="b"&&t.reverse();for(var r=t.length;r--;)this.l.set(t[r],this.i=[1,0,this.i]);return e.children},be.prototype.componentDidUpdate=be.prototype.componentDidMount=function(){var e=this;this.l.forEach(function(t,r){Gr(e,r,t)})};var Yr=typeof Symbol<"u"&&Symbol.for&&Symbol.for("react.element")||60103,Mi=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,Ai=/^on(Ani|Tra|Tou|BeforeInp|Compo)/,Ri=/[A-Z0-9]/g,Li=typeof document<"u",Ni=function(e){return(typeof Symbol<"u"&&typeof Symbol()=="symbol"?/fil|che|rad/:/fil|che|ra/).test(e)};function qr(e,t,r){return t.__k==null&&(t.textContent=""),me(e,t),typeof r=="function"&&r(),e?e.__c:null}function Xr(e,t,r){return Sr(e,t),typeof r=="function"&&r(),e?e.__c:null}ee.prototype.isReactComponent={},["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(e){Object.defineProperty(ee.prototype,e,{configurable:!0,get:function(){return this["UNSAFE_"+e]},set:function(t){Object.defineProperty(this,e,{configurable:!0,writable:!0,value:t})}})});var Kr=E.event;function Ii(){}function Oi(){return this.cancelBubble}function zi(){return this.defaultPrevented}E.event=function(e){return Kr&&(e=Kr(e)),e.persist=Ii,e.isPropagationStopped=Oi,e.isDefaultPrevented=zi,e.nativeEvent=e};var It,Di={enumerable:!1,configurable:!0,get:function(){return this.class}},Zr=E.vnode;E.vnode=function(e){typeof e.type=="string"&&function(t){var r=t.props,n=t.type,i={},o=n.indexOf("-")===-1;for(var a in r){var s=r[a];if(!(a==="value"&&"defaultValue"in r&&s==null||Li&&a==="children"&&n==="noscript"||a==="class"||a==="className")){var d=a.toLowerCase();a==="defaultValue"&&"value"in r&&r.value==null?a="value":a==="download"&&s===!0?s="":d==="translate"&&s==="no"?s=!1:d[0]==="o"&&d[1]==="n"?d==="ondoubleclick"?a="ondblclick":d!=="onchange"||n!=="input"&&n!=="textarea"||Ni(r.type)?d==="onfocus"?a="onfocusin":d==="onblur"?a="onfocusout":Ai.test(a)&&(a=d):d=a="oninput":o&&Mi.test(a)?a=a.replace(Ri,"-$&").toLowerCase():s===null&&(s=void 0),d==="oninput"&&i[a=d]&&(a="oninputCapture"),i[a]=s}}n=="select"&&i.multiple&&Array.isArray(i.value)&&(i.value=ae(r.children).forEach(function(u){u.props.selected=i.value.indexOf(u.props.value)!=-1})),n=="select"&&i.defaultValue!=null&&(i.value=ae(r.children).forEach(function(u){u.props.selected=i.multiple?i.defaultValue.indexOf(u.props.value)!=-1:i.defaultValue==u.props.value})),r.class&&!r.className?(i.class=r.class,Object.defineProperty(i,"className",Di)):(r.className&&!r.class||r.class&&r.className)&&(i.class=i.className=r.className),t.props=i}(e),e.$$typeof=Yr,Zr&&Zr(e)};var Jr=E.__r;E.__r=function(e){Jr&&Jr(e),It=e.__c};var Qr=E.diffed;E.diffed=function(e){Qr&&Qr(e);var t=e.props,r=e.__e;r!=null&&e.type==="textarea"&&"value"in t&&t.value!==r.value&&(r.value=t.value==null?"":t.value),It=null};var en={ReactCurrentDispatcher:{current:{readContext:function(e){return It.__n[e.__c].props.value},useCallback:k,useContext:A,useDebugValue:Ct,useDeferredValue:At,useEffect:ce,useId:St,useImperativeHandle:wt,useInsertionEffect:Lt,useLayoutEffect:ye,useMemo:W,useReducer:He,useRef:le,useState:U,useSyncExternalStore:Et,useTransition:Rt}}},Vi="18.3.1";function tn(e){return G.bind(null,e)}function Ae(e){return!!e&&e.$$typeof===Yr}function rn(e){return Ae(e)&&e.type===B}function nn(e){return!!e&&!!e.displayName&&(typeof e.displayName=="string"||e.displayName instanceof String)&&e.displayName.startsWith("Memo(")}function on(e){return Ae(e)?xi.apply(null,arguments):e}function an(e){return!!e.__k&&(me(null,e),!0)}function sn(e){return e&&(e.base||e.nodeType===1&&e)||null}var cn=function(e,t){return e(t)},ln=function(e,t){return e(t)},un=B,dn=Ae,Fi={useState:U,useId:St,useReducer:He,useEffect:ce,useLayoutEffect:ye,useInsertionEffect:Lt,useTransition:Rt,useDeferredValue:At,useSyncExternalStore:Et,startTransition:Mt,useRef:le,useImperativeHandle:wt,useMemo:W,useCallback:k,useContext:A,useDebugValue:Ct,version:"18.3.1",Children:Vr,render:qr,hydrate:Xr,unmountComponentAtNode:an,createPortal:Wr,createElement:G,createContext:Te,createFactory:tn,cloneElement:on,createRef:hr,Fragment:B,isValidElement:Ae,isElement:dn,isFragment:rn,isMemo:nn,findDOMNode:sn,Component:ee,PureComponent:Ge,memo:Or,forwardRef:Nt,flushSync:ln,unstable_batchedUpdates:cn,StrictMode:un,Suspense:Me,SuspenseList:be,lazy:jr,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:en};const fn=Object.freeze(Object.defineProperty({__proto__:null,Children:Vr,Component:ee,Fragment:B,PureComponent:Ge,StrictMode:un,Suspense:Me,SuspenseList:be,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:en,cloneElement:on,createContext:Te,createElement:G,createFactory:tn,createPortal:Wr,createRef:hr,default:Fi,findDOMNode:sn,flushSync:ln,forwardRef:Nt,hydrate:Xr,isElement:dn,isFragment:rn,isMemo:nn,isValidElement:Ae,lazy:jr,memo:Or,render:qr,startTransition:Mt,unmountComponentAtNode:an,unstable_batchedUpdates:cn,useCallback:k,useContext:A,useDebugValue:Ct,useDeferredValue:At,useEffect:ce,useErrorBoundary:Ci,useId:St,useImperativeHandle:wt,useInsertionEffect:Lt,useLayoutEffect:ye,useMemo:W,useReducer:He,useRef:le,useState:U,useSyncExternalStore:Et,useTransition:Rt,version:Vi},Symbol.toStringTag,{value:"Module"}));function Bi(e){if(e.sheet)return e.sheet;for(var t=0;t<document.styleSheets.length;t++)if(document.styleSheets[t].ownerNode===e)return document.styleSheets[t]}function Ui(e){var t=document.createElement("style");return t.setAttribute("data-emotion",e.key),e.nonce!==void 0&&t.setAttribute("nonce",e.nonce),t.appendChild(document.createTextNode("")),t.setAttribute("data-s",""),t}var Hi=function(){function e(r){var n=this;this._insertTag=function(i){var o;n.tags.length===0?n.insertionPoint?o=n.insertionPoint.nextSibling:n.prepend?o=n.container.firstChild:o=n.before:o=n.tags[n.tags.length-1].nextSibling,n.container.insertBefore(i,o),n.tags.push(i)},this.isSpeedy=r.speedy===void 0?!0:r.speedy,this.tags=[],this.ctr=0,this.nonce=r.nonce,this.key=r.key,this.container=r.container,this.prepend=r.prepend,this.insertionPoint=r.insertionPoint,this.before=null}var t=e.prototype;return t.hydrate=function(n){n.forEach(this._insertTag)},t.insert=function(n){this.ctr%(this.isSpeedy?65e3:1)===0&&this._insertTag(Ui(this));var i=this.tags[this.tags.length-1];if(this.isSpeedy){var o=Bi(i);try{o.insertRule(n,o.cssRules.length)}catch{}}else i.appendChild(document.createTextNode(n));this.ctr++},t.flush=function(){this.tags.forEach(function(n){var i;return(i=n.parentNode)==null?void 0:i.removeChild(n)}),this.tags=[],this.ctr=0},e}(),q="-ms-",We="-moz-",T="-webkit-",pn="comm",Ot="rule",zt="decl",ji="@import",mn="@keyframes",Gi="@layer",Wi=Math.abs,Ye=String.fromCharCode,Yi=Object.assign;function qi(e,t){return Y(e,0)^45?(((t<<2^Y(e,0))<<2^Y(e,1))<<2^Y(e,2))<<2^Y(e,3):0}function hn(e){return e.trim()}function Xi(e,t){return(e=t.exec(e))?e[0]:e}function M(e,t,r){return e.replace(t,r)}function Dt(e,t){return e.indexOf(t)}function Y(e,t){return e.charCodeAt(t)|0}function Re(e,t,r){return e.slice(t,r)}function re(e){return e.length}function Vt(e){return e.length}function qe(e,t){return t.push(e),e}function Ki(e,t){return e.map(t).join("")}var Xe=1,xe=1,_n=0,X=0,H=0,we="";function Ke(e,t,r,n,i,o,a){return{value:e,root:t,parent:r,type:n,props:i,children:o,line:Xe,column:xe,length:a,return:""}}function Le(e,t){return Yi(Ke("",null,null,"",null,null,0),e,{length:-e.length},t)}function Zi(){return H}function Ji(){return H=X>0?Y(we,--X):0,xe--,H===10&&(xe=1,Xe--),H}function J(){return H=X<_n?Y(we,X++):0,xe++,H===10&&(xe=1,Xe++),H}function ne(){return Y(we,X)}function Ze(){return X}function Ne(e,t){return Re(we,e,t)}function Ie(e){switch(e){case 0:case 9:case 10:case 13:case 32:return 5;case 33:case 43:case 44:case 47:case 62:case 64:case 126:case 59:case 123:case 125:return 4;case 58:return 3;case 34:case 39:case 40:case 91:return 2;case 41:case 93:return 1}return 0}function gn(e){return Xe=xe=1,_n=re(we=e),X=0,[]}function vn(e){return we="",e}function Je(e){return hn(Ne(X-1,Ft(e===91?e+2:e===40?e+1:e)))}function Qi(e){for(;(H=ne())&&H<33;)J();return Ie(e)>2||Ie(H)>3?"":" "}function eo(e,t){for(;--t&&J()&&!(H<48||H>102||H>57&&H<65||H>70&&H<97););return Ne(e,Ze()+(t<6&&ne()==32&&J()==32))}function Ft(e){for(;J();)switch(H){case e:return X;case 34:case 39:e!==34&&e!==39&&Ft(H);break;case 40:e===41&&Ft(e);break;case 92:J();break}return X}function to(e,t){for(;J()&&e+H!==57;)if(e+H===84&&ne()===47)break;return"/*"+Ne(t,X-1)+"*"+Ye(e===47?e:J())}function ro(e){for(;!Ie(ne());)J();return Ne(e,X)}function no(e){return vn(Qe("",null,null,null,[""],e=gn(e),0,[0],e))}function Qe(e,t,r,n,i,o,a,s,d){for(var u=0,f=0,c=a,_=0,p=0,h=0,m=1,v=1,y=1,x=0,S="",$=i,g=o,w=n,C=S;v;)switch(h=x,x=J()){case 40:if(h!=108&&Y(C,c-1)==58){Dt(C+=M(Je(x),"&","&\f"),"&\f")!=-1&&(y=-1);break}case 34:case 39:case 91:C+=Je(x);break;case 9:case 10:case 13:case 32:C+=Qi(h);break;case 92:C+=eo(Ze()-1,7);continue;case 47:switch(ne()){case 42:case 47:qe(io(to(J(),Ze()),t,r),d);break;default:C+="/"}break;case 123*m:s[u++]=re(C)*y;case 125*m:case 59:case 0:switch(x){case 0:case 125:v=0;case 59+f:y==-1&&(C=M(C,/\f/g,"")),p>0&&re(C)-c&&qe(p>32?bn(C+";",n,r,c-1):bn(M(C," ","")+";",n,r,c-2),d);break;case 59:C+=";";default:if(qe(w=yn(C,t,r,u,f,i,s,S,$=[],g=[],c),o),x===123)if(f===0)Qe(C,t,w,w,$,o,c,s,g);else switch(_===99&&Y(C,3)===110?100:_){case 100:case 108:case 109:case 115:Qe(e,w,w,n&&qe(yn(e,w,w,0,0,i,s,S,i,$=[],c),g),i,g,c,s,n?$:g);break;default:Qe(C,w,w,w,[""],g,0,s,g)}}u=f=p=0,m=y=1,S=C="",c=a;break;case 58:c=1+re(C),p=h;default:if(m<1){if(x==123)--m;else if(x==125&&m++==0&&Ji()==125)continue}switch(C+=Ye(x),x*m){case 38:y=f>0?1:(C+="\f",-1);break;case 44:s[u++]=(re(C)-1)*y,y=1;break;case 64:ne()===45&&(C+=Je(J())),_=ne(),f=c=re(S=C+=ro(Ze())),x++;break;case 45:h===45&&re(C)==2&&(m=0)}}return o}function yn(e,t,r,n,i,o,a,s,d,u,f){for(var c=i-1,_=i===0?o:[""],p=Vt(_),h=0,m=0,v=0;h<n;++h)for(var y=0,x=Re(e,c+1,c=Wi(m=a[h])),S=e;y<p;++y)(S=hn(m>0?_[y]+" "+x:M(x,/&\f/g,_[y])))&&(d[v++]=S);return Ke(e,t,r,i===0?Ot:s,d,u,f)}function io(e,t,r){return Ke(e,t,r,pn,Ye(Zi()),Re(e,2,-2),0)}function bn(e,t,r,n){return Ke(e,t,r,zt,Re(e,0,n),Re(e,n+1,-1),n)}function Ce(e,t){for(var r="",n=Vt(e),i=0;i<n;i++)r+=t(e[i],i,e,t)||"";return r}function oo(e,t,r,n){switch(e.type){case Gi:if(e.children.length)break;case ji:case zt:return e.return=e.return||e.value;case pn:return"";case mn:return e.return=e.value+"{"+Ce(e.children,n)+"}";case Ot:e.value=e.props.join(",")}return re(r=Ce(e.children,n))?e.return=e.value+"{"+r+"}":""}function ao(e){var t=Vt(e);return function(r,n,i,o){for(var a="",s=0;s<t;s++)a+=e[s](r,n,i,o)||"";return a}}function so(e){return function(t){t.root||(t=t.return)&&e(t)}}function xn(e){var t=Object.create(null);return function(r){return t[r]===void 0&&(t[r]=e(r)),t[r]}}var co=function(t,r,n){for(var i=0,o=0;i=o,o=ne(),i===38&&o===12&&(r[n]=1),!Ie(o);)J();return Ne(t,X)},lo=function(t,r){var n=-1,i=44;do switch(Ie(i)){case 0:i===38&&ne()===12&&(r[n]=1),t[n]+=co(X-1,r,n);break;case 2:t[n]+=Je(i);break;case 4:if(i===44){t[++n]=ne()===58?"&\f":"",r[n]=t[n].length;break}default:t[n]+=Ye(i)}while(i=J());return t},uo=function(t,r){return vn(lo(gn(t),r))},wn=new WeakMap,fo=function(t){if(!(t.type!=="rule"||!t.parent||t.length<1)){for(var r=t.value,n=t.parent,i=t.column===n.column&&t.line===n.line;n.type!=="rule";)if(n=n.parent,!n)return;if(!(t.props.length===1&&r.charCodeAt(0)!==58&&!wn.get(n))&&!i){wn.set(t,!0);for(var o=[],a=uo(r,o),s=n.props,d=0,u=0;d<a.length;d++)for(var f=0;f<s.length;f++,u++)t.props[u]=o[d]?a[d].replace(/&\f/g,s[f]):s[f]+" "+a[d]}}},po=function(t){if(t.type==="decl"){var r=t.value;r.charCodeAt(0)===108&&r.charCodeAt(2)===98&&(t.return="",t.value="")}};function Cn(e,t){switch(qi(e,t)){case 5103:return T+"print-"+e+e;case 5737:case 4201:case 3177:case 3433:case 1641:case 4457:case 2921:case 5572:case 6356:case 5844:case 3191:case 6645:case 3005:case 6391:case 5879:case 5623:case 6135:case 4599:case 4855:case 4215:case 6389:case 5109:case 5365:case 5621:case 3829:return T+e+e;case 5349:case 4246:case 4810:case 6968:case 2756:return T+e+We+e+q+e+e;case 6828:case 4268:return T+e+q+e+e;case 6165:return T+e+q+"flex-"+e+e;case 5187:return T+e+M(e,/(\w+).+(:[^]+)/,T+"box-$1$2"+q+"flex-$1$2")+e;case 5443:return T+e+q+"flex-item-"+M(e,/flex-|-self/,"")+e;case 4675:return T+e+q+"flex-line-pack"+M(e,/align-content|flex-|-self/,"")+e;case 5548:return T+e+q+M(e,"shrink","negative")+e;case 5292:return T+e+q+M(e,"basis","preferred-size")+e;case 6060:return T+"box-"+M(e,"-grow","")+T+e+q+M(e,"grow","positive")+e;case 4554:return T+M(e,/([^-])(transform)/g,"$1"+T+"$2")+e;case 6187:return M(M(M(e,/(zoom-|grab)/,T+"$1"),/(image-set)/,T+"$1"),e,"")+e;case 5495:case 3959:return M(e,/(image-set\([^]*)/,T+"$1$`$1");case 4968:return M(M(e,/(.+:)(flex-)?(.*)/,T+"box-pack:$3"+q+"flex-pack:$3"),/s.+-b[^;]+/,"justify")+T+e+e;case 4095:case 3583:case 4068:case 2532:return M(e,/(.+)-inline(.+)/,T+"$1$2")+e;case 8116:case 7059:case 5753:case 5535:case 5445:case 5701:case 4933:case 4677:case 5533:case 5789:case 5021:case 4765:if(re(e)-1-t>6)switch(Y(e,t+1)){case 109:if(Y(e,t+4)!==45)break;case 102:return M(e,/(.+:)(.+)-([^]+)/,"$1"+T+"$2-$3$1"+We+(Y(e,t+3)==108?"$3":"$2-$3"))+e;case 115:return~Dt(e,"stretch")?Cn(M(e,"stretch","fill-available"),t)+e:e}break;case 4949:if(Y(e,t+1)!==115)break;case 6444:switch(Y(e,re(e)-3-(~Dt(e,"!important")&&10))){case 107:return M(e,":",":"+T)+e;case 101:return M(e,/(.+:)([^;!]+)(;|!.+)?/,"$1"+T+(Y(e,14)===45?"inline-":"")+"box$3$1"+T+"$2$3$1"+q+"$2box$3")+e}break;case 5936:switch(Y(e,t+11)){case 114:return T+e+q+M(e,/[svh]\w+-[tblr]{2}/,"tb")+e;case 108:return T+e+q+M(e,/[svh]\w+-[tblr]{2}/,"tb-rl")+e;case 45:return T+e+q+M(e,/[svh]\w+-[tblr]{2}/,"lr")+e}return T+e+q+e+e}return e}var mo=function(t,r,n,i){if(t.length>-1&&!t.return)switch(t.type){case zt:t.return=Cn(t.value,t.length);break;case mn:return Ce([Le(t,{value:M(t.value,"@","@"+T)})],i);case Ot:if(t.length)return Ki(t.props,function(o){switch(Xi(o,/(::plac\w+|:read-\w+)/)){case":read-only":case":read-write":return Ce([Le(t,{props:[M(o,/:(read-\w+)/,":"+We+"$1")]})],i);case"::placeholder":return Ce([Le(t,{props:[M(o,/:(plac\w+)/,":"+T+"input-$1")]}),Le(t,{props:[M(o,/:(plac\w+)/,":"+We+"$1")]}),Le(t,{props:[M(o,/:(plac\w+)/,q+"input-$1")]})],i)}return""})}},ho=[mo],Sn=function(t){var r=t.key;if(r==="css"){var n=document.querySelectorAll("style[data-emotion]:not([data-s])");Array.prototype.forEach.call(n,function(m){var v=m.getAttribute("data-emotion");v.indexOf(" ")!==-1&&(document.head.appendChild(m),m.setAttribute("data-s",""))})}var i=t.stylisPlugins||ho,o={},a,s=[];a=t.container||document.head,Array.prototype.forEach.call(document.querySelectorAll('style[data-emotion^="'+r+' "]'),function(m){for(var v=m.getAttribute("data-emotion").split(" "),y=1;y<v.length;y++)o[v[y]]=!0;s.push(m)});var d,u=[fo,po];{var f,c=[oo,so(function(m){f.insert(m)})],_=ao(u.concat(i,c)),p=function(v){return Ce(no(v),_)};d=function(v,y,x,S){f=x,p(v?v+"{"+y.styles+"}":y.styles),S&&(h.inserted[y.name]=!0)}}var h={key:r,sheet:new Hi({key:r,container:a,nonce:t.nonce,speedy:t.speedy,prepend:t.prepend,insertionPoint:t.insertionPoint}),nonce:t.nonce,inserted:o,registered:{},insert:d};return h.sheet.hydrate(s),h},et={exports:{}},R={};/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var kn;function _o(){if(kn)return R;kn=1;var e=typeof Symbol=="function"&&Symbol.for,t=e?Symbol.for("react.element"):60103,r=e?Symbol.for("react.portal"):60106,n=e?Symbol.for("react.fragment"):60107,i=e?Symbol.for("react.strict_mode"):60108,o=e?Symbol.for("react.profiler"):60114,a=e?Symbol.for("react.provider"):60109,s=e?Symbol.for("react.context"):60110,d=e?Symbol.for("react.async_mode"):60111,u=e?Symbol.for("react.concurrent_mode"):60111,f=e?Symbol.for("react.forward_ref"):60112,c=e?Symbol.for("react.suspense"):60113,_=e?Symbol.for("react.suspense_list"):60120,p=e?Symbol.for("react.memo"):60115,h=e?Symbol.for("react.lazy"):60116,m=e?Symbol.for("react.block"):60121,v=e?Symbol.for("react.fundamental"):60117,y=e?Symbol.for("react.responder"):60118,x=e?Symbol.for("react.scope"):60119;function S(g){if(typeof g=="object"&&g!==null){var w=g.$$typeof;switch(w){case t:switch(g=g.type,g){case d:case u:case n:case o:case i:case c:return g;default:switch(g=g&&g.$$typeof,g){case s:case f:case h:case p:case a:return g;default:return w}}case r:return w}}}function $(g){return S(g)===u}return R.AsyncMode=d,R.ConcurrentMode=u,R.ContextConsumer=s,R.ContextProvider=a,R.Element=t,R.ForwardRef=f,R.Fragment=n,R.Lazy=h,R.Memo=p,R.Portal=r,R.Profiler=o,R.StrictMode=i,R.Suspense=c,R.isAsyncMode=function(g){return $(g)||S(g)===d},R.isConcurrentMode=$,R.isContextConsumer=function(g){return S(g)===s},R.isContextProvider=function(g){return S(g)===a},R.isElement=function(g){return typeof g=="object"&&g!==null&&g.$$typeof===t},R.isForwardRef=function(g){return S(g)===f},R.isFragment=function(g){return S(g)===n},R.isLazy=function(g){return S(g)===h},R.isMemo=function(g){return S(g)===p},R.isPortal=function(g){return S(g)===r},R.isProfiler=function(g){return S(g)===o},R.isStrictMode=function(g){return S(g)===i},R.isSuspense=function(g){return S(g)===c},R.isValidElementType=function(g){return typeof g=="string"||typeof g=="function"||g===n||g===u||g===o||g===i||g===c||g===_||typeof g=="object"&&g!==null&&(g.$$typeof===h||g.$$typeof===p||g.$$typeof===a||g.$$typeof===s||g.$$typeof===f||g.$$typeof===v||g.$$typeof===y||g.$$typeof===x||g.$$typeof===m)},R.typeOf=S,R}var L={},Pn;function go(){if(Pn)return L;Pn=1;var e={};/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */return e.NODE_ENV!=="production"&&function(){var t=typeof Symbol=="function"&&Symbol.for,r=t?Symbol.for("react.element"):60103,n=t?Symbol.for("react.portal"):60106,i=t?Symbol.for("react.fragment"):60107,o=t?Symbol.for("react.strict_mode"):60108,a=t?Symbol.for("react.profiler"):60114,s=t?Symbol.for("react.provider"):60109,d=t?Symbol.for("react.context"):60110,u=t?Symbol.for("react.async_mode"):60111,f=t?Symbol.for("react.concurrent_mode"):60111,c=t?Symbol.for("react.forward_ref"):60112,_=t?Symbol.for("react.suspense"):60113,p=t?Symbol.for("react.suspense_list"):60120,h=t?Symbol.for("react.memo"):60115,m=t?Symbol.for("react.lazy"):60116,v=t?Symbol.for("react.block"):60121,y=t?Symbol.for("react.fundamental"):60117,x=t?Symbol.for("react.responder"):60118,S=t?Symbol.for("react.scope"):60119;function $(P){return typeof P=="string"||typeof P=="function"||P===i||P===f||P===a||P===o||P===_||P===p||typeof P=="object"&&P!==null&&(P.$$typeof===m||P.$$typeof===h||P.$$typeof===s||P.$$typeof===d||P.$$typeof===c||P.$$typeof===y||P.$$typeof===x||P.$$typeof===S||P.$$typeof===v)}function g(P){if(typeof P=="object"&&P!==null){var ar=P.$$typeof;switch(ar){case r:var ft=P.type;switch(ft){case u:case f:case i:case a:case o:case _:return ft;default:var hi=ft&&ft.$$typeof;switch(hi){case d:case c:case m:case h:case s:return hi;default:return ar}}case n:return ar}}}var w=u,C=f,N=d,F=s,O=r,j=c,oe=i,lt=m,ut=h,dt=n,yc=a,bc=o,xc=_,pi=!1;function wc(P){return pi||(pi=!0,console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")),mi(P)||g(P)===u}function mi(P){return g(P)===f}function Cc(P){return g(P)===d}function Sc(P){return g(P)===s}function kc(P){return typeof P=="object"&&P!==null&&P.$$typeof===r}function Pc(P){return g(P)===c}function $c(P){return g(P)===i}function Ec(P){return g(P)===m}function Tc(P){return g(P)===h}function Mc(P){return g(P)===n}function Ac(P){return g(P)===a}function Rc(P){return g(P)===o}function Lc(P){return g(P)===_}L.AsyncMode=w,L.ConcurrentMode=C,L.ContextConsumer=N,L.ContextProvider=F,L.Element=O,L.ForwardRef=j,L.Fragment=oe,L.Lazy=lt,L.Memo=ut,L.Portal=dt,L.Profiler=yc,L.StrictMode=bc,L.Suspense=xc,L.isAsyncMode=wc,L.isConcurrentMode=mi,L.isContextConsumer=Cc,L.isContextProvider=Sc,L.isElement=kc,L.isForwardRef=Pc,L.isFragment=$c,L.isLazy=Ec,L.isMemo=Tc,L.isPortal=Mc,L.isProfiler=Ac,L.isStrictMode=Rc,L.isSuspense=Lc,L.isValidElementType=$,L.typeOf=g}(),L}var $n;function vo(){if($n)return et.exports;$n=1;var e={};return e.NODE_ENV==="production"?et.exports=_o():et.exports=go(),et.exports}var Bt,En;function yo(){if(En)return Bt;En=1;var e=vo(),t={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},r={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},n={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},i={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},o={};o[e.ForwardRef]=n,o[e.Memo]=i;function a(h){return e.isMemo(h)?i:o[h.$$typeof]||t}var s=Object.defineProperty,d=Object.getOwnPropertyNames,u=Object.getOwnPropertySymbols,f=Object.getOwnPropertyDescriptor,c=Object.getPrototypeOf,_=Object.prototype;function p(h,m,v){if(typeof m!="string"){if(_){var y=c(m);y&&y!==_&&p(h,y,v)}var x=d(m);u&&(x=x.concat(u(m)));for(var S=a(h),$=a(m),g=0;g<x.length;++g){var w=x[g];if(!r[w]&&!(v&&v[w])&&!($&&$[w])&&!(S&&S[w])){var C=f(m,w);try{s(h,w,C)}catch{}}}}return h}return Bt=p,Bt}yo();var bo=!0;function Tn(e,t,r){var n="";return r.split(" ").forEach(function(i){e[i]!==void 0?t.push(e[i]+";"):i&&(n+=i+" ")}),n}var Ut=function(t,r,n){var i=t.key+"-"+r.name;(n===!1||bo===!1)&&t.registered[i]===void 0&&(t.registered[i]=r.styles)},Mn=function(t,r,n){Ut(t,r,n);var i=t.key+"-"+r.name;if(t.inserted[r.name]===void 0){var o=r;do t.insert(r===o?"."+i:"",o,t.sheet,!0),o=o.next;while(o!==void 0)}};function xo(e){for(var t=0,r,n=0,i=e.length;i>=4;++n,i-=4)r=e.charCodeAt(n)&255|(e.charCodeAt(++n)&255)<<8|(e.charCodeAt(++n)&255)<<16|(e.charCodeAt(++n)&255)<<24,r=(r&65535)*1540483477+((r>>>16)*59797<<16),r^=r>>>24,t=(r&65535)*1540483477+((r>>>16)*59797<<16)^(t&65535)*1540483477+((t>>>16)*59797<<16);switch(i){case 3:t^=(e.charCodeAt(n+2)&255)<<16;case 2:t^=(e.charCodeAt(n+1)&255)<<8;case 1:t^=e.charCodeAt(n)&255,t=(t&65535)*1540483477+((t>>>16)*59797<<16)}return t^=t>>>13,t=(t&65535)*1540483477+((t>>>16)*59797<<16),((t^t>>>15)>>>0).toString(36)}var wo={animationIterationCount:1,aspectRatio:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,boxFlex:1,boxFlexGroup:1,boxOrdinalGroup:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexPositive:1,flexShrink:1,flexNegative:1,flexOrder:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,msGridRow:1,msGridRowSpan:1,msGridColumn:1,msGridColumnSpan:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,scale:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1},Co=/[A-Z]|^ms/g,So=/_EMO_([^_]+?)_([^]*?)_EMO_/g,An=function(t){return t.charCodeAt(1)===45},Rn=function(t){return t!=null&&typeof t!="boolean"},Ht=xn(function(e){return An(e)?e:e.replace(Co,"-$&").toLowerCase()}),Ln=function(t,r){switch(t){case"animation":case"animationName":if(typeof r=="string")return r.replace(So,function(n,i,o){return ie={name:i,styles:o,next:ie},i})}return wo[t]!==1&&!An(t)&&typeof r=="number"&&r!==0?r+"px":r};function Oe(e,t,r){if(r==null)return"";var n=r;if(n.__emotion_styles!==void 0)return n;switch(typeof r){case"boolean":return"";case"object":{var i=r;if(i.anim===1)return ie={name:i.name,styles:i.styles,next:ie},i.name;var o=r;if(o.styles!==void 0){var a=o.next;if(a!==void 0)for(;a!==void 0;)ie={name:a.name,styles:a.styles,next:ie},a=a.next;var s=o.styles+";";return s}return ko(e,t,r)}case"function":{if(e!==void 0){var d=ie,u=r(e);return ie=d,Oe(e,t,u)}break}}var f=r;if(t==null)return f;var c=t[f];return c!==void 0?c:f}function ko(e,t,r){var n="";if(Array.isArray(r))for(var i=0;i<r.length;i++)n+=Oe(e,t,r[i])+";";else for(var o in r){var a=r[o];if(typeof a!="object"){var s=a;t!=null&&t[s]!==void 0?n+=o+"{"+t[s]+"}":Rn(s)&&(n+=Ht(o)+":"+Ln(o,s)+";")}else if(Array.isArray(a)&&typeof a[0]=="string"&&(t==null||t[a[0]]===void 0))for(var d=0;d<a.length;d++)Rn(a[d])&&(n+=Ht(o)+":"+Ln(o,a[d])+";");else{var u=Oe(e,t,a);switch(o){case"animation":case"animationName":{n+=Ht(o)+":"+u+";";break}default:n+=o+"{"+u+"}"}}}return n}var Nn=/label:\s*([^\s;{]+)\s*(;|$)/g,ie;function jt(e,t,r){if(e.length===1&&typeof e[0]=="object"&&e[0]!==null&&e[0].styles!==void 0)return e[0];var n=!0,i="";ie=void 0;var o=e[0];if(o==null||o.raw===void 0)n=!1,i+=Oe(r,t,o);else{var a=o;i+=a[0]}for(var s=1;s<e.length;s++)if(i+=Oe(r,t,e[s]),n){var d=o;i+=d[s]}Nn.lastIndex=0;for(var u="",f;(f=Nn.exec(i))!==null;)u+="-"+f[1];var c=xo(i)+u;return{name:c,styles:i,next:ie}}var Po=function(t){return t()},$o=fn.useInsertionEffect?fn.useInsertionEffect:!1,In=$o||Po,On=Te(typeof HTMLElement<"u"?Sn({key:"css"}):null),Eo=On.Provider,zn=function(t){return Nt(function(r,n){var i=A(On);return t(r,i,n)})},Dn=Te({}),Gt={}.hasOwnProperty,Wt="__EMOTION_TYPE_PLEASE_DO_NOT_USE__",To=function(t,r){var n={};for(var i in r)Gt.call(r,i)&&(n[i]=r[i]);return n[Wt]=t,n},Mo=function(t){var r=t.cache,n=t.serialized,i=t.isStringTag;return Ut(r,n,i),In(function(){return Mn(r,n,i)}),null},Ao=zn(function(e,t,r){var n=e.css;typeof n=="string"&&t.registered[n]!==void 0&&(n=t.registered[n]);var i=e[Wt],o=[n],a="";typeof e.className=="string"?a=Tn(t.registered,o,e.className):e.className!=null&&(a=e.className+" ");var s=jt(o,void 0,A(Dn));a+=t.key+"-"+s.name;var d={};for(var u in e)Gt.call(e,u)&&u!=="css"&&u!==Wt&&(d[u]=e[u]);return d.className=a,r&&(d.ref=r),G(B,null,G(Mo,{cache:t,serialized:s,isStringTag:typeof i=="string"}),G(i,d))}),Ro=Ao,Vn=function(t,r){var n=arguments;if(r==null||!Gt.call(r,"css"))return G.apply(void 0,n);var i=n.length,o=new Array(i);o[0]=Ro,o[1]=To(t,r);for(var a=2;a<i;a++)o[a]=n[a];return G.apply(null,o)};(function(e){var t;t||(t=e.JSX||(e.JSX={}))})(Vn||(Vn={}));function Lo(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return jt(t)}function Fn(){var e=Lo.apply(void 0,arguments),t="animation-"+e.name;return{name:t,styles:"@keyframes "+t+"{"+e.styles+"}",anim:1,toString:function(){return"_EMO_"+this.name+"_"+this.styles+"_EMO_"}}}var No=/^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|disableRemotePlayback|download|draggable|encType|enterKeyHint|fetchpriority|fetchPriority|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/,Io=xn(function(e){return No.test(e)||e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)<91}),Oo=Io,zo=function(t){return t!=="theme"},Bn=function(t){return typeof t=="string"&&t.charCodeAt(0)>96?Oo:zo},Un=function(t,r,n){var i;if(r){var o=r.shouldForwardProp;i=t.__emotion_forwardProp&&o?function(a){return t.__emotion_forwardProp(a)&&o(a)}:o}return typeof i!="function"&&n&&(i=t.__emotion_forwardProp),i},Do=function(t){var r=t.cache,n=t.serialized,i=t.isStringTag;return Ut(r,n,i),In(function(){return Mn(r,n,i)}),null},Vo=function e(t,r){var n=t.__emotion_real===t,i=n&&t.__emotion_base||t,o,a;r!==void 0&&(o=r.label,a=r.target);var s=Un(t,r,n),d=s||Bn(i),u=!d("as");return function(){var f=arguments,c=n&&t.__emotion_styles!==void 0?t.__emotion_styles.slice(0):[];if(o!==void 0&&c.push("label:"+o+";"),f[0]==null||f[0].raw===void 0)c.push.apply(c,f);else{var _=f[0];c.push(_[0]);for(var p=f.length,h=1;h<p;h++)c.push(f[h],_[h])}var m=zn(function(v,y,x){var S=u&&v.as||i,$="",g=[],w=v;if(v.theme==null){w={};for(var C in v)w[C]=v[C];w.theme=A(Dn)}typeof v.className=="string"?$=Tn(y.registered,g,v.className):v.className!=null&&($=v.className+" ");var N=jt(c.concat(g),y.registered,w);$+=y.key+"-"+N.name,a!==void 0&&($+=" "+a);var F=u&&s===void 0?Bn(S):d,O={};for(var j in v)u&&j==="as"||F(j)&&(O[j]=v[j]);return O.className=$,x&&(O.ref=x),G(B,null,G(Do,{cache:y,serialized:N,isStringTag:typeof S=="string"}),G(S,O))});return m.displayName=o!==void 0?o:"Styled("+(typeof i=="string"?i:i.displayName||i.name||"Component")+")",m.defaultProps=t.defaultProps,m.__emotion_real=m,m.__emotion_base=i,m.__emotion_styles=c,m.__emotion_forwardProp=s,Object.defineProperty(m,"toString",{value:function(){return"."+a}}),m.withComponent=function(v,y){var x=e(v,bt({},r,y,{shouldForwardProp:Un(m,y,!0)}));return x.apply(void 0,c)},m}},Fo=["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","big","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","marquee","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr","circle","clipPath","defs","ellipse","foreignObject","g","image","line","linearGradient","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","text","tspan"],b=Vo.bind(null);Fo.forEach(function(e){b[e]=b(e)});const Bo=b.button`
  position: relative;
  background: none;
  border: none;
  display: flex;
  flex: 0;
  flex-direction: row;
  height: 32px;
  font-size: 13px;
  font-weight: 500;
  line-height: 32px;
  padding: 0 12px;
  border-radius: 16px;
  color: var(--card-background-color);
  background-color: var(--primary-text-color);
  margin-right: 5px;
  align-items: center;
  gap: 4px;
  text-wrap: nowrap;
  cursor: pointer;
  opacity: ${e=>e.$loading?.3:.8};
`,tt=({loading:e,...t})=>l(Bo,{$loading:e,...t}),Uo=()=>[{name:"tap_action",label:"Tap Action",selector:{ui_action:{}}},{name:"hold_action",label:"Hold Action",selector:{ui_action:{}}},{name:"double_tap_action",label:"Double Tap Action",selector:{ui_action:{}}}],Ho=({hass:e,value:t,onChange:r,disabled:n=!1})=>{const i=le(null),o=W(()=>t?{...t}:{action:"none"},[t]),a=k(s=>{const u=s.detail.value;r(u)},[r]);return ce(()=>{const s=i.current;return s&&s.addEventListener("value-changed",a),()=>{s&&s.removeEventListener("value-changed",a)}},[i.current,a]),l("ha-form",{ref:i,hass:e,data:o,schema:Uo(),computeLabel:s=>s.label||s.name,disabled:n})},Se=e=>{const{hass:t,value:r,onChange:n,label:i,domains:o,required:a=!1,disabled:s=!1,allowCustomEntity:d=!1}=e,u=le(null),f=k(c=>{const p=c.detail.value;n(p)},[n]);return ce(()=>{const c=u.current;return c&&c.addEventListener("value-changed",f),()=>{c&&c.removeEventListener("value-changed",f)}},[u.current,f]),l("ha-entity-picker",{ref:u,hass:t,value:r,label:i||"Entity",includeDomains:o,disabled:s,required:a,"allow-custom-entity":d})},jo=b.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`,Hn=({hass:e,value:t,onChange:r,label:n,domains:i,disabled:o=!1,allowCustomEntity:a=!1})=>{const s=(t==null?void 0:t.filter(Boolean))||[],d=k((u,f)=>{const c=[...s];!u&&f<s.length?c.splice(f,1):f<s.length?c[f]=u||"":u&&c.push(u),r(c.filter(Boolean))},[s,r]);return l(jo,{className:"entities-picker",children:[n&&l("label",{children:n}),s.map((u,f)=>l(Se,{hass:e,value:u,onChange:c=>d(c,f),domains:i,disabled:o,required:!1,allowCustomEntity:a},`entity-${f}`)),l(Se,{hass:e,value:"",onChange:u=>d(u,s.length),domains:i,disabled:o,required:!1,allowCustomEntity:a},"entity-new")]})},rt=({hass:e,value:t={},onChange:r})=>l(Ho,{hass:e,value:t,onChange:r}),Go=({options:e,onSelected:t,selected:r})=>l("select",{value:r,onChange:n=>t(n.target.value),children:e.map(n=>l("option",{value:n.value,children:n.name},n.value))}),K=b.div`
  margin-bottom: 16px;
`,nt=b.label`
  display: block;
  margin-bottom: 16px;
  font-weight: 500;
`,jn=b.div`
  display: flex;
  flex-direction: column;
`,Yt=b.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: var(--primary-color, #03a9f4);
  color: white;
  font-weight: 500;

  &:hover {
    background-color: var(--primary-color-dark, #007ac1);
  }
  align-self: flex-start;
`,Gn=b(Yt)`
  background-color: var(--error-color, #ff5252);

  &:hover {
    background-color: var(--error-color-dark, #c50b0b);
  }
`,it=b.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`,Wo=b.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`,Yo=b.label`
  margin-left: 8px;
  font-weight: normal;
`,qo=b.input`
  cursor: pointer;
`,ot=({hass:e,value:t,onChange:r,label:n,required:i=!1,disabled:o=!1,isIconInput:a=!1})=>{const s=k(d=>{r(d.detail.value)},[r]);return a?l("ha-icon-picker",{label:n||"Icon",hass:e,value:t,disabled:o,required:i,"onvalue-changed":s}):l("ha-textfield",{label:n||"Text",value:t,disabled:o,required:i,onchange:d=>r(d.target.value)})},Xo=b.div`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${e=>qt(e.$size)}px;
  aspect-ratio: 1;

  > ha-icon {
    --mdc-icon-size: ${e=>qt(e.$size)}px;
    width: ${e=>qt(e.$size)}px;
    display: flex;
  }
`,Z=({icon:e,size:t="medium",className:r})=>l(Xo,{$size:t,className:r,children:l("ha-icon",{icon:e})}),qt=e=>{switch(e){case"xx-small":return 12;case"x-small":return 18;case"small":return 24;case"medium":return 32;case"large":return 48;case"x-large":return 80}},Ko=b.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
  padding: ${e=>e.$size==="xx-small"?0:4}px;
  min-width: ${e=>Xt(e.$size)}px;
  aspect-ratio: 1;
  color: ${e=>e.disabled?"var(--disabled-text-color, #999)":"var(--primary-text-color, #333)"};

  &:hover {
    background-color: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
  }

  &:active {
    background-color: var(--divider-color, rgba(0, 0, 0, 0.1));
  }
  > ha-icon {
    --mdc-icon-size: ${e=>Xt(e.$size)}px;
    width: ${e=>Xt(e.$size)}px;
    display: flex;
    pointer-events: none;
  }
`,V=({icon:e,size:t="medium",disabled:r=!1,className:n,renderLongPressIndicator:i,...o})=>l(Ko,{disabled:r,$disabled:r,$size:t,className:n,...o,children:[l("ha-icon",{icon:e}),i&&i()]}),Xt=e=>{switch(e){case"xx-small":return 12;case"x-small":return 18;case"small":return 24;case"medium":return 32;case"large":return 48;case"x-large":return 80;case"xx-large":return 120}},z=Te({rootElement:null,hass:null,config:null}),Wn=({rootElement:e,hass:t,config:r,children:n})=>l(z.Provider,{value:{rootElement:e,hass:t,config:r},children:n}),Yn=({rootElement:e,children:t})=>{const[r]=U(()=>Sn({key:"mmpc",container:e,speedy:!1}));return l(Eo,{value:r,children:t})},Zo=({children:e})=>{const[t,r]=U(!1);return ce(()=>{customElements.get("hui-glance-card").getConfigElement().then(()=>{r(!0)})},[]),t?e:null};class qn extends HTMLElement{constructor(){super(...arguments),this._config=null,this.Card=null,this.extraProps={},this._hass=null}set hass(t){this._hass=t}setConfig(t){this._config=t,me(l(Yn,{rootElement:this,children:l(Zo,{children:l(this.Card,{config:this._config,hass:this._hass,rootElement:this,...this.extraProps})})}),this)}}class Kt extends HTMLElement{constructor(){super(...arguments),this.Card=null,this.config=null}set hass(t){if(!this.Card)throw new Error("Preact Card is not defined");me(l(Yn,{rootElement:this,children:l(Wn,{rootElement:this,hass:t,config:this.config,children:l(this.Card,{})})}),this)}getCardSize(){return 1}}const Zt=({hass:e,action:t,target:r,data:n})=>{const i=t.split(".")[0],o=t.split(".")[1],a={...n,...r};return e.callService(i,o,a)},Jo=b.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  overflow-x: auto !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`,Qo=b.div`
  display: flex;
  flex: 1 0 auto;
  flex-direction: row;
  height: 32px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
  line-height: 32px;
  padding: 0 12px;
  border-radius: 16px;
  background-color: var(--card-background-color);
  color: var(--primary-text-color);
  margin-bottom: 5px;
  margin-right: 5px;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  text-wrap: nowrap;
  cursor: pointer;
  opacity: ${e=>e.$loading?.5:e.$inactive?.8:1};
`,ea=()=>{const{hass:e,config:t}=A(z),[r,n]=U([]),i=W(()=>{const s=e.states[t.entity_id];return t.entities.filter(u=>u!==s.entity_id).map(u=>{const f=e.states[u];return{entity_id:f.entity_id,friendly_name:f.attributes.friendly_name,isGrouped:s.attributes.group_members.includes(f.entity_id),isGrouping:r.includes(f.entity_id)}}).sort((u,f)=>u.friendly_name<f.friendly_name?-1:u.friendly_name>f.friendly_name?1:0).sort((u,f)=>u.isGrouped&&!f.isGrouped?-1:!u.isGrouped&&f.isGrouped?1:0)},[e,t,r]),o=k(async s=>{if(!s.isGrouping){n([...r,s.entity_id]);try{await e.callService("media_player","turn_on",{entity_id:s.entity_id}),await e.callService("media_player","join",{entity_id:t.entity_id,group_members:[s.entity_id]})}catch(d){console.error(d)}n(r.filter(d=>d!==s.entity_id))}},[e,t]),a=k(async s=>{if(!s.isGrouping){n([...r,s.entity_id]);try{await e.callService("media_player","unjoin",{entity_id:s.entity_id}),await e.callService("media_player","turn_off",{entity_id:s.entity_id})}catch(d){console.error(d)}n(r.filter(d=>d!==s.entity_id))}},[e,t]);return l(B,{children:l(Jo,{className:"chips",children:i.map(s=>l(Qo,{$inactive:!s.isGrouped,$loading:s.isGrouping,onClick:()=>{s.isGrouped?a(s):o(s)},children:[s.friendly_name,s.isGrouped&&l(Z,{size:"x-small",icon:"mdi:close"}),!s.isGrouped&&l(Z,{size:"x-small",icon:"mdi:plus"})]},s.entity_id))})})};class ta{constructor(t,r){this.pixels=t,this.opts=r;const{sigBits:n}=r,i=($,g,w)=>($<<2*n)+(g<<n)+w;this.getColorIndex=i;const o=8-n,a=1<<3*n,s=new Uint32Array(a);let d,u,f,c,_,p,h,m,v,y;d=f=_=0,u=c=p=Number.MAX_VALUE;const x=t.length/4;let S=0;for(;S<x;){const $=S*4;if(S++,h=t[$+0],m=t[$+1],v=t[$+2],y=t[$+3],y===0)continue;h=h>>o,m=m>>o,v=v>>o;const g=i(h,m,v);s[g]===void 0&&(s[g]=0),s[g]+=1,h>d&&(d=h),h<u&&(u=h),m>f&&(f=m),m<c&&(c=m),v>_&&(_=v),v<p&&(p=v)}this._colorCount=s.reduce(($,g)=>g>0?$+1:$,0),this.hist=s,this.rmax=d,this.rmin=u,this.gmax=f,this.gmin=c,this.bmax=_,this.bmin=p}get colorCount(){return this._colorCount}}class ra{scaleDown(t){const r=this.getWidth(),n=this.getHeight();let i=1;if(t.maxDimension>0){const o=Math.max(r,n);o>t.maxDimension&&(i=t.maxDimension/o)}else i=1/t.quality;i<1&&this.resize(r*i,n*i,i)}}function na(e,t){var r;if(t.length>0){const n=e.data,i=n.length/4;let o,a,s,d,u;for(let f=0;f<i;f++){o=f*4,a=n[o+0],s=n[o+1],d=n[o+2],u=n[o+3];for(let c=0;c<t.length;c++)if(!((r=t[c])!=null&&r.call(t,a,s,d,u))){n[o+3]=0;break}}}return e}function ia(e){const t=new URL(e,location.href);return t.protocol===location.protocol&&t.host===location.host&&t.port===location.port}function oa(e,t){const r=new URL(e),n=new URL(t);return r.protocol===n.protocol&&r.hostname===n.hostname&&r.port===n.port}class aa extends ra{_getCanvas(){if(!this._canvas)throw new Error("Canvas is not initialized");return this._canvas}_getContext(){if(!this._context)throw new Error("Context is not initialized");return this._context}_getWidth(){if(!this._width)throw new Error("Width is not initialized");return this._width}_getHeight(){if(!this._height)throw new Error("Height is not initialized");return this._height}_initCanvas(){const t=this.image;if(!t)throw new Error("Image is not initialized");const r=this._canvas=document.createElement("canvas"),n=r.getContext("2d");if(!n)throw new ReferenceError("Failed to create canvas context");this._context=n,r.className="@vibrant/canvas",r.style.display="none",this._width=r.width=t.width,this._height=r.height=t.height,n.drawImage(t,0,0),document.body.appendChild(r)}load(t){let r,n;if(typeof t=="string")r=document.createElement("img"),n=t,!ia(n)&&!oa(window.location.href,n)&&(r.crossOrigin="anonymous"),r.src=n;else if(t instanceof HTMLImageElement)r=t,n=t.src;else return Promise.reject(new Error("Cannot load buffer as an image in browser"));return this.image=r,new Promise((i,o)=>{const a=()=>{this._initCanvas(),i(this)};r.complete?a():(r.onload=a,r.onerror=s=>o(new Error(`Fail to load image: ${n}`)))})}clear(){this._getContext().clearRect(0,0,this._getWidth(),this._getHeight())}update(t){this._getContext().putImageData(t,0,0)}getWidth(){return this._getWidth()}getHeight(){return this._getHeight()}resize(t,r,n){if(!this.image)throw new Error("Image is not initialized");this._width=this._getCanvas().width=t,this._height=this._getCanvas().height=r,this._getContext().scale(n,n),this._getContext().drawImage(this.image,0,0)}getPixelCount(){return this._getWidth()*this._getHeight()}getImageData(){return this._getContext().getImageData(0,0,this._getWidth(),this._getHeight())}remove(){this._canvas&&this._canvas.parentNode&&this._canvas.parentNode.removeChild(this._canvas)}}function ze(e,...t){return t.forEach(r=>{if(r){for(const n in r)if(r.hasOwnProperty(n)){const i=r[n];Array.isArray(i)?e[n]=i.slice(0):typeof i=="object"?(e[n]||(e[n]={}),ze(e[n],i)):e[n]=i}}}),e}function sa(e,t){const{colorCount:r,quantizer:n,generators:i,filters:o}=e,a={colorCount:r},s=typeof n=="string"?{name:n,options:{}}:n;return s.options=ze({},a,s.options),ze({},{quantizer:s,generators:i,filters:o},t)}class ca{constructor(t,r={}){this._src=t,this._opts=ze({},de.DefaultOpts,r)}maxColorCount(t){return this._opts.colorCount=t,this}maxDimension(t){return this._opts.maxDimension=t,this}addFilter(t){return this._opts.filters?this._opts.filters.push(t):this._opts.filters=[t],this}removeFilter(t){if(this._opts.filters){const r=this._opts.filters.indexOf(t);r>0&&this._opts.filters.splice(r)}return this}clearFilters(){return this._opts.filters=[],this}quality(t){return this._opts.quality=t,this}useImageClass(t){return this._opts.ImageClass=t,this}useGenerator(t,r){return this._opts.generators||(this._opts.generators=[]),this._opts.generators.push(r?{name:t,options:r}:t),this}useQuantizer(t,r){return this._opts.quantizer=r?{name:t,options:r}:t,this}build(){return new de(this._src,this._opts)}getPalette(){return this.build().getPalette()}}class Jt{constructor(t){this.pipeline=t,this._map={}}names(){return Object.keys(this._map)}has(t){return!!this._map[t]}get(t){return this._map[t]}register(t,r){return this._map[t]=r,this.pipeline}}class la{constructor(){this.filter=new Jt(this),this.quantizer=new Jt(this),this.generator=new Jt(this)}_buildProcessTasks({filters:t,quantizer:r,generators:n}){return n.length===1&&n[0]==="*"&&(n=this.generator.names()),{filters:t.map(o=>i(this.filter,o)),quantizer:i(this.quantizer,r),generators:n.map(o=>i(this.generator,o))};function i(o,a){let s,d;return typeof a=="string"?s=a:(s=a.name,d=a.options),{name:s,fn:o.get(s),options:d}}}async process(t,r){const{filters:n,quantizer:i,generators:o}=this._buildProcessTasks(r),a=await this._filterColors(n,t),s=await this._generateColors(i,a),d=await this._generatePalettes(o,s);return{colors:s,palettes:d}}_filterColors(t,r){return Promise.resolve(na(r,t.map(({fn:n})=>n)))}_generateColors(t,r){return Promise.resolve(t.fn(r.data,t.options))}async _generatePalettes(t,r){const n=await Promise.all(t.map(({fn:i,options:o})=>Promise.resolve(i(r,o))));return Promise.resolve(n.reduce((i,o,a)=>(i[t[a].name]=o,i),{}))}}function ua(e,t,r){return"#"+((1<<24)+(e<<16)+(t<<8)+r).toString(16).slice(1,7)}function da(e,t,r){e/=255,t/=255,r/=255;const n=Math.max(e,t,r),i=Math.min(e,t,r);let o=0,a=0;const s=(n+i)/2;if(n!==i){const d=n-i;switch(a=s>.5?d/(2-n-i):d/(n+i),n){case e:o=(t-r)/d+(t<r?6:0);break;case t:o=(r-e)/d+2;break;case r:o=(e-t)/d+4;break}o/=6}return[o,a,s]}function ue(e,t,r){let n,i,o;function a(s,d,u){return u<0&&(u+=1),u>1&&(u-=1),u<1/6?s+(d-s)*6*u:u<1/2?d:u<2/3?s+(d-s)*(2/3-u)*6:s}if(t===0)n=i=o=r;else{const s=r<.5?r*(1+t):r+t-r*t,d=2*r-s;n=a(d,s,e+1/3),i=a(d,s,e),o=a(d,s,e-1/3)}return[n*255,i*255,o*255]}class Q{static applyFilters(t,r){return r.length>0?t.filter(({r:n,g:i,b:o})=>{var a;for(let s=0;s<r.length;s++)if(!((a=r[s])!=null&&a.call(r,n,i,o,255)))return!1;return!0}):t}static clone(t){return new Q(t._rgb,t._population)}get r(){return this._rgb[0]}get g(){return this._rgb[1]}get b(){return this._rgb[2]}get rgb(){return this._rgb}get hsl(){if(!this._hsl){const[t,r,n]=this._rgb;this._hsl=da(t,r,n)}return this._hsl}get hex(){if(!this._hex){const[t,r,n]=this._rgb;this._hex=ua(t,r,n)}return this._hex}get population(){return this._population}toJSON(){return{rgb:this.rgb,population:this.population}}getYiq(){if(!this._yiq){const t=this._rgb;this._yiq=(t[0]*299+t[1]*587+t[2]*114)/1e3}return this._yiq}get titleTextColor(){return this._titleTextColor||(this._titleTextColor=this.getYiq()<200?"#fff":"#000"),this._titleTextColor}get bodyTextColor(){return this._bodyTextColor||(this._bodyTextColor=this.getYiq()<150?"#fff":"#000"),this._bodyTextColor}constructor(t,r){this._rgb=t,this._population=r}}const Xn=class sr{constructor(t,r){this._src=t,this.opts=ze({},sr.DefaultOpts,r)}static use(t){this._pipeline=t}static from(t){return new ca(t)}get result(){return this._result}_process(t,r){t.scaleDown(this.opts);const n=sa(this.opts,r);return sr._pipeline.process(t.getImageData(),n)}async getPalette(){const t=new this.opts.ImageClass;try{const r=await t.load(this._src),n=await this._process(r,{generators:["default"]});this._result=n;const i=n.palettes.default;if(!i)throw new Error("Something went wrong and a palette was not found, please file a bug against our GitHub repo: https://github.com/vibrant-Colors/node-vibrant/");return t.remove(),i}catch(r){return t.remove(),Promise.reject(r)}}async getPalettes(){const t=new this.opts.ImageClass;try{const r=await t.load(this._src),n=await this._process(r,{generators:["*"]});this._result=n;const i=n.palettes;return t.remove(),i}catch(r){return t.remove(),Promise.reject(r)}}};Xn.DefaultOpts={colorCount:64,quality:5,filters:[]};let de=Xn;de.DefaultOpts.quantizer="mmcq",de.DefaultOpts.generators=["default"],de.DefaultOpts.filters=["default"],de.DefaultOpts.ImageClass=aa;const Qt=5,er=8-Qt;class at{constructor(t,r,n,i,o,a,s){this.histogram=s,this._volume=-1,this._avg=null,this._count=-1,this.dimension={r1:t,r2:r,g1:n,g2:i,b1:o,b2:a}}static build(t){const r=new ta(t,{sigBits:Qt}),{rmin:n,rmax:i,gmin:o,gmax:a,bmin:s,bmax:d}=r;return new at(n,i,o,a,s,d,r)}invalidate(){this._volume=this._count=-1,this._avg=null}volume(){if(this._volume<0){const{r1:t,r2:r,g1:n,g2:i,b1:o,b2:a}=this.dimension;this._volume=(r-t+1)*(i-n+1)*(a-o+1)}return this._volume}count(){if(this._count<0){const{hist:t,getColorIndex:r}=this.histogram,{r1:n,r2:i,g1:o,g2:a,b1:s,b2:d}=this.dimension;let u=0;for(let f=n;f<=i;f++)for(let c=o;c<=a;c++)for(let _=s;_<=d;_++){const p=r(f,c,_);t[p]&&(u+=t[p])}this._count=u}return this._count}clone(){const{histogram:t}=this,{r1:r,r2:n,g1:i,g2:o,b1:a,b2:s}=this.dimension;return new at(r,n,i,o,a,s,t)}avg(){if(!this._avg){const{hist:t,getColorIndex:r}=this.histogram,{r1:n,r2:i,g1:o,g2:a,b1:s,b2:d}=this.dimension;let u=0;const f=1<<8-Qt;let c,_,p;c=_=p=0;for(let h=n;h<=i;h++)for(let m=o;m<=a;m++)for(let v=s;v<=d;v++){const y=r(h,m,v),x=t[y];x&&(u+=x,c+=x*(h+.5)*f,_+=x*(m+.5)*f,p+=x*(v+.5)*f)}u?this._avg=[~~(c/u),~~(_/u),~~(p/u)]:this._avg=[~~(f*(n+i+1)/2),~~(f*(o+a+1)/2),~~(f*(s+d+1)/2)]}return this._avg}contains(t){let[r,n,i]=t;const{r1:o,r2:a,g1:s,g2:d,b1:u,b2:f}=this.dimension;return r>>=er,n>>=er,i>>=er,r>=o&&r<=a&&n>=s&&n<=d&&i>=u&&i<=f}split(){const{hist:t,getColorIndex:r}=this.histogram,{r1:n,r2:i,g1:o,g2:a,b1:s,b2:d}=this.dimension,u=this.count();if(!u)return[];if(u===1)return[this.clone()];const f=i-n+1,c=a-o+1,_=d-s+1,p=Math.max(f,c,_);let h=null,m,v;m=v=0;let y=null;if(p===f){y="r",h=new Uint32Array(i+1);for(let w=n;w<=i;w++){m=0;for(let C=o;C<=a;C++)for(let N=s;N<=d;N++){const F=r(w,C,N);t[F]&&(m+=t[F])}v+=m,h[w]=v}}else if(p===c){y="g",h=new Uint32Array(a+1);for(let w=o;w<=a;w++){m=0;for(let C=n;C<=i;C++)for(let N=s;N<=d;N++){const F=r(C,w,N);t[F]&&(m+=t[F])}v+=m,h[w]=v}}else{y="b",h=new Uint32Array(d+1);for(let w=s;w<=d;w++){m=0;for(let C=n;C<=i;C++)for(let N=o;N<=a;N++){const F=r(C,N,w);t[F]&&(m+=t[F])}v+=m,h[w]=v}}let x=-1;const S=new Uint32Array(h.length);for(let w=0;w<h.length;w++){const C=h[w];C&&(x<0&&C>v/2&&(x=w),S[w]=v-C)}const $=this;function g(w){const C=w+"1",N=w+"2",F=$.dimension[C];let O=$.dimension[N];const j=$.clone(),oe=$.clone(),lt=x-F,ut=O-x;for(lt<=ut?(O=Math.min(O-1,~~(x+ut/2)),O=Math.max(0,O)):(O=Math.max(F,~~(x-1-lt/2)),O=Math.min($.dimension[N],O));!h[O];)O++;let dt=S[O];for(;!dt&&h[O-1];)dt=S[--O];return j.dimension[N]=O,oe.dimension[C]=O+1,[j,oe]}return g(y)}}class Kn{_sort(){this._sorted||(this.contents.sort(this._comparator),this._sorted=!0)}constructor(t){this._comparator=t,this.contents=[],this._sorted=!1}push(t){this.contents.push(t),this._sorted=!1}peek(t){return this._sort(),t=typeof t=="number"?t:this.contents.length-1,this.contents[t]}pop(){return this._sort(),this.contents.pop()}size(){return this.contents.length}map(t){return this._sort(),this.contents.map(t)}}const fa=.75;function Zn(e,t){let r=e.size();for(;e.size()<t;){const n=e.pop();if(n&&n.count()>0){const[i,o]=n.split();if(!i||(e.push(i),o&&o.count()>0&&e.push(o),e.size()===r))break;r=e.size()}else break}}const pa=(e,t)=>{if(e.length===0||t.colorCount<2||t.colorCount>256)throw new Error("Wrong MMCQ parameters");const r=at.build(e);r.histogram.colorCount;const n=new Kn((o,a)=>o.count()-a.count());n.push(r),Zn(n,fa*t.colorCount);const i=new Kn((o,a)=>o.count()*o.volume()-a.count()*a.volume());return i.contents=n.contents,Zn(i,t.colorCount-i.size()),ma(i)};function ma(e){const t=[];for(;e.size();){const r=e.pop(),n=r.avg();t.push(new Q(n,r.count()))}return t}const ha={targetDarkLuma:.26,maxDarkLuma:.45,minLightLuma:.55,targetLightLuma:.74,minNormalLuma:.3,targetNormalLuma:.5,maxNormalLuma:.7,targetMutesSaturation:.3,maxMutesSaturation:.4,targetVibrantSaturation:1,minVibrantSaturation:.35,weightSaturation:3,weightLuma:6.5,weightPopulation:.5};function _a(e){let t=0;return e.forEach(r=>{t=Math.max(t,r.population)}),t}function ga(e,t){return e.Vibrant===t||e.DarkVibrant===t||e.LightVibrant===t||e.Muted===t||e.DarkMuted===t||e.LightMuted===t}function va(e,t,r,n,i,o,a){function s(...u){let f=0,c=0;for(let _=0;_<u.length;_+=2){const p=u[_],h=u[_+1];!p||!h||(f+=p*h,c+=h)}return f/c}function d(u,f){return 1-Math.abs(u-f)}return s(d(e,t),a.weightSaturation,d(r,n),a.weightLuma,i/o,a.weightPopulation)}function ke(e,t,r,n,i,o,a,s,d,u){let f=null,c=0;return t.forEach(_=>{const[,p,h]=_.hsl;if(p>=s&&p<=d&&h>=i&&h<=o&&!ga(e,_)){const m=va(p,a,h,n,_.population,r,u);(f===null||m>c)&&(f=_,c=m)}}),f}function ya(e,t,r){const n={Vibrant:null,DarkVibrant:null,LightVibrant:null,Muted:null,DarkMuted:null,LightMuted:null};return n.Vibrant=ke(n,e,t,r.targetNormalLuma,r.minNormalLuma,r.maxNormalLuma,r.targetVibrantSaturation,r.minVibrantSaturation,1,r),n.LightVibrant=ke(n,e,t,r.targetLightLuma,r.minLightLuma,1,r.targetVibrantSaturation,r.minVibrantSaturation,1,r),n.DarkVibrant=ke(n,e,t,r.targetDarkLuma,0,r.maxDarkLuma,r.targetVibrantSaturation,r.minVibrantSaturation,1,r),n.Muted=ke(n,e,t,r.targetNormalLuma,r.minNormalLuma,r.maxNormalLuma,r.targetMutesSaturation,0,r.maxMutesSaturation,r),n.LightMuted=ke(n,e,t,r.targetLightLuma,r.minLightLuma,1,r.targetMutesSaturation,0,r.maxMutesSaturation,r),n.DarkMuted=ke(n,e,t,r.targetDarkLuma,0,r.maxDarkLuma,r.targetMutesSaturation,0,r.maxMutesSaturation,r),n}function ba(e,t,r){if(!e.Vibrant&&!e.DarkVibrant&&!e.LightVibrant){if(!e.DarkVibrant&&e.DarkMuted){let[n,i,o]=e.DarkMuted.hsl;o=r.targetDarkLuma,e.DarkVibrant=new Q(ue(n,i,o),0)}if(!e.LightVibrant&&e.LightMuted){let[n,i,o]=e.LightMuted.hsl;o=r.targetDarkLuma,e.DarkVibrant=new Q(ue(n,i,o),0)}}if(!e.Vibrant&&e.DarkVibrant){let[n,i,o]=e.DarkVibrant.hsl;o=r.targetNormalLuma,e.Vibrant=new Q(ue(n,i,o),0)}else if(!e.Vibrant&&e.LightVibrant){let[n,i,o]=e.LightVibrant.hsl;o=r.targetNormalLuma,e.Vibrant=new Q(ue(n,i,o),0)}if(!e.DarkVibrant&&e.Vibrant){let[n,i,o]=e.Vibrant.hsl;o=r.targetDarkLuma,e.DarkVibrant=new Q(ue(n,i,o),0)}if(!e.LightVibrant&&e.Vibrant){let[n,i,o]=e.Vibrant.hsl;o=r.targetLightLuma,e.LightVibrant=new Q(ue(n,i,o),0)}if(!e.Muted&&e.Vibrant){let[n,i,o]=e.Vibrant.hsl;o=r.targetMutesSaturation,e.Muted=new Q(ue(n,i,o),0)}if(!e.DarkMuted&&e.DarkVibrant){let[n,i,o]=e.DarkVibrant.hsl;o=r.targetMutesSaturation,e.DarkMuted=new Q(ue(n,i,o),0)}if(!e.LightMuted&&e.LightVibrant){let[n,i,o]=e.LightVibrant.hsl;o=r.targetMutesSaturation,e.LightMuted=new Q(ue(n,i,o),0)}}const xa=(e,t)=>{t=Object.assign({},ha,t);const r=_a(e),n=ya(e,r,t);return ba(n,r,t),n},wa=new la().filter.register("default",(e,t,r,n)=>n>=125&&!(e>250&&t>250&&r>250)).quantizer.register("mmcq",pa).generator.register("default",xa);de.use(wa);const Ca=b.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
`,Sa=b.div`
  position: relative;
  aspect-ratio: 1;
  max-height: 95%;
  overflow: hidden;
  border-radius: 8px;
  align-self: center;
  margin-top: 8px;
  margin-bottom: 8px;
  box-shadow: 0px 0px 8px var(--clear-background-color);
`,ka=b.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  background-color: var(--card-background-color);
`,Pa=b.div`
  position: absolute;
  bottom: 6px;
  right: 6px;
  color: var(--primary-text-color);
  ${e=>e.contrastColor?`color: ${e.contrastColor};`:""}
  opacity: 0.8;
`,$a=()=>{const{hass:e,config:t}=A(z),{entity_id:r}=t,n=e.states[r],{media_title:i,media_artist:o,entity_picture:a,source:s}=n.attributes,d=n.state,[u,f]=U(null);ce(()=>{f(null)},[a]);const c=()=>{if(a){const _=window.matchMedia("(prefers-color-scheme: dark)");de.from(a).getPalette().then(p=>{p.DarkVibrant&&p.LightVibrant?f(_?p.DarkVibrant.bodyTextColor:p.LightVibrant.bodyTextColor):p.DarkMuted&&p.LightMuted?f(_?p.DarkMutedt.bodyTextColor:p.DarkMuted.bodyTextColor):f(void 0)}).catch(p=>{console.error("Error getting color with Vibrant:",p)})}};return l(Ca,{children:l(Sa,{children:l(B,{children:[l(ka,{src:a??"data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='400'%20height='400'%20viewBox='0%200%20400%20400'%3E%3Crect%20width='400'%20height='400'%20fill='transparent'/%3E%3C/svg%3E",alt:`${i} by ${o}`,onLoad:c}),l(Pa,{contrastColor:u,children:l(Z,{size:"x-small",icon:Ea({source:s,state:d})})})]})})})},Ea=({source:e,state:t})=>{if(t==="off")return"mdi:power-off";switch(e==null?void 0:e.toLowerCase()){case"spotify":return"mdi:spotify";case"airplay":return"mdi:airplay";case"bluetooth":return"mdi:bluetooth";case"net radio":return"mdi:radio";case"server":return"mdi:server";case"usb":return"mdi:usb";case"aux":return"mdi:audio-input-rca";case"hdmi":return"mdi:hdmi-port";case"tv":return"mdi:television";case"tuner":return"mdi:radio-tower";case"optical":return"mdi:audio-input-stereo-minijack";default:return"mdi:music"}},Ta=b.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  > h2,
  > h3 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
  }
`,Ma=b.h2`
  margin: 0px;
`,Aa=b.h3`
  margin: 0px;
  font-weight: normal;
`,Ra=()=>{var o,a,s;const{hass:e,config:t}=A(z),r=(o=e.states[t.entity_id].attributes)==null?void 0:o.media_title,n=(a=e.states[t.entity_id].attributes)==null?void 0:a.media_artist,i=(s=e.states[t.entity_id].attributes)==null?void 0:s.media_album_name;return!r&&!n&&!i?null:l(Ta,{children:[!!r&&l(Ma,{children:r}),(!!i||!!n)&&l(Aa,{children:`${i??""} - ${n??""}`})]})},La=b.div`
  display: flex;
  flex-direction: row;
  height: 4px;
  width: 100%;
  background-color: var(--secondary-background-color);
  border-radius: 2px;
  overflow: hidden;
`,Na=b.div`
  height: 100%;
  background-color: var(--primary-text-color);
  width: 0%;
  transition: width 1s linear;
`,Ia=({min:e,max:t,value:r})=>{const n=(r-e)/(t-e)*100;return l(La,{children:l(Na,{style:{width:`${n}%`}})})},Oa=b.div`
  width: 100%;
`,za=b.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 4px;
`,Da=()=>{const{hass:e,config:t}=A(z),r=W(()=>{var v,y,x;const s=e.states[t.entity_id],d=((v=s.attributes)==null?void 0:v.media_position)??null,u=((y=s.attributes)==null?void 0:y.media_position_updated_at)??null,f=((x=s.attributes)==null?void 0:x.media_duration)??null;if(d===null||d<0||f===null||u===null)return null;const c=new Date,_=new Date(u),h=(c.getTime()-_.getTime())/1e3+d,m=S=>{const $=Math.floor(S/60).toString().padStart(2,"0"),g=Math.round(S-Number($)*60).toString().padStart(2,"0");return`${$}:${g}`};return{currentPosition:h,mediaDuration:f,prettyNow:m(h),prettyEnd:m(f)}},[e,t]);if(!r)return null;const{currentPosition:n,prettyEnd:i,prettyNow:o,mediaDuration:a}=r;return l(Oa,{children:[l(Ia,{value:n,min:0,max:a}),l(za,{children:[l("span",{children:o}),l("span",{children:i})]})]})};var Jn,Qn;(function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"})(Jn||(Jn={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(Qn||(Qn={}));function Va(e){return e.substr(0,e.indexOf("."))}var Fa=["closed","locked","off"],De=function(e,t,r,n){n=n||{},r=r??{};var i=new Event(t,{bubbles:n.bubbles===void 0||n.bubbles,cancelable:!!n.cancelable,composed:n.composed===void 0||n.composed});return i.detail=r,e.dispatchEvent(i),i},st=function(e){De(window,"haptic",e)},Ba=function(e,t,r){r===void 0&&(r=!1),r?history.replaceState(null,"",t):history.pushState(null,"",t),De(window,"location-changed",{replace:r})},Ua=function(e,t,r){r===void 0&&(r=!0);var n,i=Va(t),o=i==="group"?"homeassistant":i;switch(i){case"lock":n=r?"unlock":"lock";break;case"cover":n=r?"open_cover":"close_cover";break;default:n=r?"turn_on":"turn_off"}return e.callService(o,n,{entity_id:t})},Ha=function(e,t){var r=Fa.includes(e.states[t].state);return Ua(e,t,r)},ja=function(e,t,r,n){if(n||(n={action:"more-info"}),!n.confirmation||n.confirmation.exemptions&&n.confirmation.exemptions.some(function(o){return o.user===t.user.id})||(st("warning"),confirm(n.confirmation.text||"Are you sure you want to "+n.action+"?")))switch(n.action){case"more-info":(r.entity||r.camera_image)&&De(e,"hass-more-info",{entityId:r.entity?r.entity:r.camera_image});break;case"navigate":n.navigation_path&&Ba(0,n.navigation_path);break;case"url":n.url_path&&window.open(n.url_path);break;case"toggle":r.entity&&(Ha(t,r.entity),st("success"));break;case"call-service":if(!n.service)return void st("failure");var i=n.service.split(".",2);t.callService(i[0],i[1],n.service_data,n.target),st("success");break;case"fire-dom-event":De(e,"ll-custom",n)}},tr=function(e,t,r,n){var i;n==="double_tap"&&r.double_tap_action?i=r.double_tap_action:n==="hold"&&r.hold_action?i=r.hold_action:n==="tap"&&r.tap_action&&(i=r.tap_action),ja(e,t,r,i)};const rr=(e,t)=>t[e].action==="more-info"&&t[e].entity?{...t,entity:t[e].entity}:t;function Ve({actionConfig:e,rootElement:t,hass:r,overrideCallback:n}){const i=W(()=>({onTap:e!=null&&e.tap_action?()=>{const a=e.tap_action;if(a.action==="perform-action"){Zt({hass:r,action:a.perform_action,target:a.target,data:a.data});return}tr(t,r,rr("tap_action",e),"tap")}:void 0,onLongPress:e!=null&&e.hold_action?()=>{const a=e.hold_action;if(a.action==="perform-action"){Zt({hass:r,action:a.perform_action,target:a.target,data:a.data});return}tr(t,r,rr("hold_action",e),"hold")}:void 0,onDoubleTap:e!=null&&e.double_tap_action?()=>{const a=e.double_tap_action;if(a.action==="perform-action"){Zt({hass:r,action:a.perform_action,target:a.target,data:a.data});return}tr(t,r,rr("double_tap_action",e),"double_tap")}:void 0,...n??{}}),[e,n]),o=Ya(i);return W(()=>o,[o])}const Ga="ontouchstart"in window,Wa=b.div`
  position: fixed;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--primary-color, rgba(7, 114, 244));
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 9;
  animation: pulse 1s infinite;
  transform: translate(-50%, -50%);

  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(0.95);
      opacity: 0.6;
    }
    50% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.8;
    }
    100% {
      transform: translate(-50%, -50%) scale(0.95);
      opacity: 0.6;
    }
  }
`;function Ya({onTap:e,onLongPress:t,onDoubleTap:r}){const n=le(null),i=le(0),o=le(null),a=le(null),[s,d]=U(!1),[u,f]=U({x:0,y:0}),c=k(()=>{o.current&&clearTimeout(o.current),a.current&&clearTimeout(a.current),d(!1),n.current=null,i.current=0},[]),_=()=>s?l(Wa,{style:{left:`${u.x}px`,top:`${u.y}px`}}):null,p=k(()=>{const w=Date.now();return!!(n.current&&w-n.current>=500)},[]),h=k((w,C)=>{f({x:w,y:C})},[]),m=k((w,C)=>{n.current=Date.now(),h(w,C),a.current=setTimeout(()=>{d(!0)},500)},[h]),v=k((w,C)=>{s&&h(w,C)},[s,h]),y=k(()=>{o.current&&clearTimeout(o.current),a.current&&(clearTimeout(a.current),d(!1)),i.current+=1,o.current=setTimeout(()=>{i.current>1?r==null||r():p()?t==null||t():e==null||e(),n.current=null,i.current=0},250)},[p,r,t,e]),x=k(w=>{m(w.clientX,w.clientY)},[m]),S=k(w=>{v(w.clientX,w.clientY)},[v]),$=k(w=>{if(w.touches.length>0){const C=w.touches[0];m(C.clientX,C.clientY)}},[m]),g=k(w=>{if(w.touches.length>0){const C=w.touches[0];v(C.clientX,C.clientY)}},[v]);return W(()=>({...Ga?{onTouchStart:$,onTouchMove:g,onTouchEnd:y,onTouchCancel:c}:{onMouseDown:x,onMouseMove:S,onMouseUp:y,onMouseOut:c},renderLongPressIndicator:_}),[x,S,y,c,$,g,_])}function nr(e){const{attributes:{shuffle:t,repeat:r,source:n,supported_features:i}}=e,o=(i|16)===i,a=(i|32)===i,s=t!==void 0&&!["optical","aux"].includes(n==null?void 0:n.toLowerCase()),d=r!==void 0&&!["optical","aux"].includes(n==null?void 0:n.toLowerCase()),u=(i&4096)===4096||(i&16384)===16384;return W(()=>({supportPreviousTrack:o,supportNextTrack:a,supportsShuffle:s,supportsRepeat:d,supportsTogglePlayPause:u}),[o,a,s,d,u])}const qa=b.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 100%;
`,Xa=()=>{const{hass:e,config:t}=A(z),r=e.states[t.entity_id],{attributes:{shuffle:n,repeat:i}}=r,o=r.state==="playing",{supportPreviousTrack:a,supportNextTrack:s,supportsShuffle:d,supportsRepeat:u,supportsTogglePlayPause:f}=nr(r),c=k(()=>{e.callService("media_player","media_play_pause",{entity_id:t.entity_id})},[]),_=k(()=>{e.callService("media_player","media_next_track",{entity_id:t.entity_id})},[]),p=k(()=>{e.callService("media_player","media_previous_track",{entity_id:t.entity_id})},[]),h=k(()=>{e.callService("media_player","shuffle_set",{entity_id:t.entity_id,shuffle:!n})},[n]),m=k(()=>{const v=i==="off"?"one":i==="one"?"all":"off";e.callService("media_player","repeat_set",{entity_id:t.entity_id,repeat:v})},[i]);return l(qa,{children:[d&&l(V,{size:"small",onClick:h,icon:n?"mdi:shuffle-variant":"mdi:shuffle-disabled"}),a&&l(V,{size:"large",onClick:p,icon:"mdi:skip-previous"}),f&&l(V,{size:"x-large",onClick:c,icon:o?"mdi:pause-circle":"mdi:play-circle"}),s&&l(V,{size:"large",onClick:_,icon:"mdi:skip-next"}),u&&l(V,{size:"small",onClick:m,icon:i==="one"?"mdi:repeat-once":i==="all"?"mdi:repeat":"mdi:repeat-off"})]})},Ka=b.div`
  display: contents;

  > ha-slider {
    width: 100%;
    --_handle-height: ${e=>ei(e.thumbSize)} !important;
    --_handle-width: ${e=>ei(e.thumbSize)} !important;
  }
`,ct=({min:e,max:t,step:r,value:n,thumbSize:i,onChange:o})=>l(Ka,{thumbSize:i,children:l("ha-slider",{min:e,max:t,step:r,value:n,onInput:a=>o(parseFloat(a.target.value))})}),ei=e=>{switch(e){case"xsmall":return"8px";case"small":return"12px";case"medium":return"14px";case"large":return"16px"}},Za=b.div`
  display: flex;
  align-items: center;
  flex: 1;
  max-height: 36px;
  margin-top: auto;
`,ti=b(V)`
  opacity: ${e=>e.muted?.8:1}; // reduce opacity if muted
`,Ja=()=>{var u,f;const{hass:e,config:t}=A(z),{entity_id:r}=t,n=e.states[r],i=((u=n.attributes)==null?void 0:u.volume_level)??0,o=((f=n.attributes)==null?void 0:f.is_volume_muted)??!1,a=k(c=>{e.callService("media_player","volume_set",{entity_id:r,volume_level:c})},[]),s=k(()=>{e.callService("media_player","volume_mute",{entity_id:r,is_volume_muted:!o})},[o]),d=W(()=>ri(i,o),[i,o]);return l(Za,{children:[l(ti,{size:"small",onClick:s,icon:d}),l(ct,{min:0,max:1,step:.01,value:i,thumbSize:"large",onChange:a})]})},ri=(e,t)=>e===0||t?"mdi:volume-off":e<.5?"mdi:volume-medium":"mdi:volume-high",Qa=({onClick:e})=>{var d,u;const{hass:t,config:r}=A(z),{entity_id:n}=r,i=t.states[n],o=((d=i.attributes)==null?void 0:d.volume_level)??0,a=((u=i.attributes)==null?void 0:u.is_volume_muted)??!1,s=ri(o,a);return l(ti,{size:"small",onClick:e,icon:s})},es=b.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`,ts=b.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 16px;
  margin-right: 16px;
`,rs=b.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,ns=b.div`
  font-size: 13px;
  flex: 1;
  ${e=>e.isMaster?"font-weight: 500;":""}
  color: var(--primary-text-color);
`,is=b.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8px;
`,os=b.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 2px;
  overflow-x: auto !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`,as=b(tt)`
  opacity: ${e=>e.$loading?.3:.8};
  &:first-child {
    margin-left: 16px;
  }
  &:last-child {
    margin-right: 16px;
  }
`,ss=()=>{var c,_;const{hass:e,config:t}=A(z),{entity_id:r,speaker_group:n}=t,[i,o]=U([]),a=(n==null?void 0:n.entity_id)||r,s=e.states[a],d=W(()=>{var p;return(p=n==null?void 0:n.entities)!=null&&p.length?n.entities.filter(h=>e.states[h]).map(h=>{var m,v,y,x;return{entity_id:h,name:e.states[h].attributes.friendly_name,volume:e.states[h].attributes.volume_level||0,muted:e.states[h].attributes.is_volume_muted||!1,isGrouped:((v=(m=s==null?void 0:s.attributes)==null?void 0:m.group_members)==null?void 0:v.includes(h))||!1,isMainSpeaker:((x=(y=s==null?void 0:s.attributes)==null?void 0:y.group_members)==null?void 0:x[0])===h||!1}}).sort((h,m)=>h.entity_id===a?-1:m.entity_id===a?1:h.name.localeCompare(m.name)):[]},[e.states,n]),u=k(async(p,h)=>{if(!i.includes(p)){o(m=>[...m,p]);try{const m=e.states[p];h?await e.callService("media_player","unjoin",{entity_id:p}):(m.state==="off"&&await e.callService("media_player","turn_on",{entity_id:p}),await e.callService("media_player","join",{entity_id:a,group_members:[p]}))}catch(m){console.error(m)}o(m=>m.filter(v=>v!==p))}},[a,i]),f=k((p,h)=>{e.callService("media_player","volume_set",{entity_id:p,volume_level:h})},[]);return l(es,{children:[((_=(c=s==null?void 0:s.attributes)==null?void 0:c.group_members)==null?void 0:_.length)>1&&l(B,{children:l(ts,{children:d.filter(p=>p.isGrouped).map(p=>l(rs,{children:[l(V,{size:"x-small",onClick:()=>u(p.entity_id,p.isGrouped),icon:"mdi:link-variant-off"}),l(ns,{isMaster:p.isMainSpeaker,children:[p.name," ",p.isMainSpeaker&&"(Master)"]}),p.isGrouped&&l(is,{children:[l(Z,{size:"x-small",icon:"mdi:volume-high"}),l(ct,{min:0,max:1,step:.01,value:p.volume,thumbSize:"small",onChange:h=>f(p.entity_id,h)})]})]},p.entity_id))})}),l(os,{children:d.filter(p=>!p.isGrouped).map(p=>l(as,{$loading:i.includes(p.entity_id),onClick:()=>u(p.entity_id,p.isGrouped),children:[p.name,p.isGrouped&&l(Z,{size:"x-small",icon:"mdi:close"}),!p.isGrouped&&l(Z,{size:"x-small",icon:"mdi:plus"})]},p.entity_id))})]})},cs=b.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 2px;
  overflow-x: auto !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`,ls=b(tt)`
  &:first-child {
    margin-left: 16px;
  }
  &:last-child {
    margin-right: 16px;
  }
`,us=()=>{const{config:e}=A(z),{custom_buttons:t}=e;return l(cs,{children:t.map((r,n)=>l(ds,{button:r},n))})},ds=({button:e})=>{const{hass:t,rootElement:r,config:n}=A(z),{icon:i,name:o,...a}=e,s=Ve({hass:t,rootElement:r,actionConfig:{...a,entity:n.entity_id}});return l(ls,{...s,children:[!!i&&l(Z,{icon:i,size:"x-small"}),!!o&&l("span",{children:o}),s.renderLongPressIndicator()]})},fs=b.div`
  background-color: var(--card-background-color);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  padding: 12px;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  box-shadow: 0 0px 80px var(--clear-background-color);
`,ps=Fn`
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`,ms=b.div`
  position: absolute;
  bottom: calc(100% + 12px);
  left: 0;
  width: 100%;
  background-color: var(--card-background-color);
  border-radius: 12px;
  box-sizing: border-box;
  animation: ${ps} 0.3s ease forwards;
  box-shadow: 0 0px 80px var(--clear-background-color);
`,hs=b.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  > h4 {
    margin: 0;
  }
  padding: 8px 16px;
  border-bottom: 0.5px solid var(--divider-color, rgba(0, 0, 0, 0.12));
`,_s=b.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: ${e=>e.padding??"16px"};
`,gs=()=>{const{hass:e,config:t}=A(z),{entity_id:r,custom_buttons:n,speaker_group:i}=t,[o,a]=U(),s=k(u=>{a(o===u?void 0:u)},[o]),d=k(()=>{e.callService("media_player","toggle",{entity_id:r})},[r]);return l(fs,{children:[l(ir,{title:"Volume",isOpen:o==="volume",onClose:()=>a(void 0),children:l(Ja,{})}),l(ir,{title:"Speaker Grouping",isOpen:o==="speaker-grouping",onClose:()=>a(void 0),padding:"16px 0px 16px 0px",children:l(ss,{})}),!!i&&l(V,{size:"small",icon:"mdi:speaker-multiple",onClick:()=>s("speaker-grouping")}),n==null?void 0:n.slice(0,2).map((u,f)=>l(vs,{button:u},f)),(n==null?void 0:n.length)>3&&l(B,{children:[l(V,{size:"small",icon:"mdi:dots-horizontal",onClick:()=>s("custom-buttons")}),l(ir,{title:"Shortcuts",isOpen:o==="custom-buttons",onClose:()=>a(void 0),padding:"16px 0px 16px 0px",children:l(us,{})})]}),l(V,{size:"small",icon:"mdi:power",onClick:d}),l(Qa,{onClick:()=>s("volume")})]})},ir=({children:e,title:t,isOpen:r,padding:n,onClose:i})=>r?l(ms,{children:[l(hs,{children:[l("h4",{children:t}),l(V,{type:"button",size:"small",icon:"mdi:close",onClick:i})]}),l(_s,{padding:n,children:e})]}):null,vs=({button:e})=>{const{hass:t,rootElement:r,config:n}=A(z),{icon:i,name:o,...a}=e,s=Ve({hass:t,rootElement:r,actionConfig:{...a,entity:n.entity_id}});return l(V,{icon:e.icon??"mdi:dots-vertical",size:"small",...s})},ys=b.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ${e=>{switch(e==null?void 0:e.mode){case"panel":return`
          width: 100%;
          height: 100%;
          // Below gradient transitions from panel header color to transparent
          background: linear-gradient(
            var(--app-header-background-color),
            rgba(255, 255, 255, 0)
          );
          max-height: calc(100vh - var(--header-height, 16px));
        `;default:return""}}}

  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
`,bs=b.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: space-around;
  align-items: center;
  padding-top: 16px;
  padding-bottom: 16px;
  ${e=>{switch(e==null?void 0:e.mode){case"panel":return`
          width: 90%;
          max-width: 400px;
        `;case"popup":return`
          max-width: 100%;
          padding: 16px;
          padding-bottom: max(calc(env(safe-area-inset-bottom) + 8px), 16px);
        `;case"card":return`
          width: 100%;
          padding: 16px;
        `;default:return""}}}
  height: 100%;
`,xs=b.div`
  display: flex;
  flex-direction: column;
  max-height: 300px;
  min-height: 280px;
  width: 100%;
  height: 100%;
  justify-content: space-between;
`,ni=({className:e})=>{const{config:t}=A(z),{mode:r}=t,n=()=>l(ys,{className:e,mode:r,children:l(bs,{mode:r,children:[l($a,{}),l(xs,{children:[l(Ra,{}),l(Da,{}),l(Xa,{}),l(gs,{})]})]})});return r==="card"?l("ha-card",{children:n()}):n()},ws=b.div`
  border: 1px solid var(--divider-color, #e0e0e0);
  border-radius: 8px;
  position: relative;
  margin-bottom: 16px;
  background-color: var(--card-background-color, #fff);
`,Cs=b.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: ${e=>e.$expanded?"1px solid var(--divider-color, #e0e0e0)":"none"};
`,Ss=b.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
`,ks=b.div`
  padding: 16px;
  display: ${e=>e.$expanded?"block":"none"};
`,_e=({title:e,children:t,initiallyExpanded:r=!1})=>{const[n,i]=U(r);return l(ws,{children:[l(Cs,{$expanded:n,children:[l(Ss,{children:e}),l(V,{onClick:()=>i(!n),icon:n?"mdi:chevron-up":"mdi:chevron-down",type:"button",size:"small"})]}),l(ks,{$expanded:n,children:t})]})},Ps=({config:e,rootElement:t,hass:r})=>{(!e||!r||!t)&&console.error("No config or hass");const n=k(f=>{const c=new Event("config-changed",{bubbles:!0,composed:!0});c.detail={config:f},t.dispatchEvent(c)},[t]),i=k((f,c)=>{if(!e)return;const _=f.split("."),p={...e};let h=p;for(let m=0;m<_.length-1;m++)h[_[m]]||(h[_[m]]={}),h=h[_[m]];h[_[_.length-1]]=c,n(p)},[e,n]),o=k(()=>{const f=[...e.custom_buttons||[],{icon:"mdi:paper-roll",name:"New Button",tap_action:{action:"toggle-menu"}}];n({...e,custom_buttons:f})},[e,n]),a=k(f=>{const c=[...e.custom_buttons||[]];c.splice(f,1),n({...e,custom_buttons:c})},[e,n]),s=k((f,c,_)=>{const p=[...e.custom_buttons||[]];p[f]={...p[f],[c]:_},n({...e,custom_buttons:p})},[e,n]),d=k((f,c)=>{const _=[...e.custom_buttons||[]];_[f]={..._[f],...c},n({...e,custom_buttons:_})},[e,n]);if(!e||!r)return null;const u={...e,speaker_group:e.speaker_group||{entity_id:"",entities:[]},custom_buttons:e.custom_buttons||[]};return l("form",{children:[l(K,{children:l(Se,{hass:r,value:u.entity_id,onChange:f=>i("entity_id",f),label:"Media Player Entity",domains:["media_player"],required:!0})}),l(_e,{title:"Display Mode",children:l(Go,{options:[{name:"Panel",value:"panel"},{name:"Card",value:"card"},{name:"In Card",value:"in-card"}],onSelected:f=>i("mode",f),selected:e.mode||"panel"})}),l(K,{children:l(_e,{title:"Interactions",children:l(rt,{hass:r,value:u.action||{},onChange:f=>i("action",f)})})}),l(K,{children:l(_e,{title:"Speaker Group Configuration (optional)",children:[l(K,{children:l(Se,{hass:r,value:u.speaker_group.entity_id,onChange:f=>i("speaker_group.entity_id",f),label:"Main Speaker Entity ID (Optional)",domains:["media_player"]})}),l(nt,{children:"Select Speakers (including main speaker)"}),l(K,{children:l(Hn,{hass:r,value:u.speaker_group.entities,onChange:f=>i("speaker_group.entities",f),label:"Speaker Group Entities (including main speaker)",domains:["media_player"]})})]})}),l(K,{children:l(jn,{children:[u.custom_buttons.map((f,c)=>{const{name:_,icon:p,...h}=f;return l(_e,{title:`Button ${c} - ${f.name}`,children:[l(K,{children:[l(it,{children:l(ot,{value:_||"",onChange:m=>s(c,"name",m),hass:r,label:"Name"})}),l(it,{children:l(ot,{value:p||"",onChange:m=>s(c,"icon",m),hass:r,isIconInput:!0,label:"Icon"})}),l(nt,{children:"Interactions"}),l(rt,{hass:r,value:h,onChange:m=>d(c,m)})]}),l(Gn,{type:"button",onClick:()=>a(c),children:"Remove Button"})]},c)}),l(Yt,{type:"button",onClick:o,children:"Add Custom Button"})]})})]})},$s=b.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0px;
  margin: 0px;
  max-height: ${e=>e.maxHeight};
  aspect-ratio: 1;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  ${e=>e.shadowColor?`box-shadow: 0px 0px 80px ${e.shadowColor}, 170px 50px 120px ${e.shadowColor}40, 300px -50px 150px ${e.shadowColor}40;`:""}
`,Es=b.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`,Ts=b.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: var(--card-background-color);
  background-color: var(--primary-text-color);
  opacity: 0.5;
`,Ms=b.div`
  position: absolute;
  bottom: 6px;
  right: 6px;
  color: var(--primary-text-color);
  opacity: 0.8;
`,As=({maxHeight:e,renderLongPressIndicator:t,...r})=>{const{hass:n,config:i}=A(z),{entity_id:o}=i,a=n.states[o],{media_title:s,media_artist:d,entity_picture:u,source:f}=a.attributes,c=a.state,[_,p]=U(null);ce(()=>{p(null)},[u]);const h=()=>{u&&de.from(u).getPalette().then(m=>{m.Muted?p(m.Muted.hex):m.Vibrant?p(m.Vibrant.hex):p("#888")}).catch(m=>{console.error("Error getting color with Vibrant:",m)})};return l($s,{maxHeight:e,...r,shadowColor:_,children:[u?l(B,{children:[l(Es,{src:u,alt:`${s} by ${d}`,onLoad:h}),l(Ms,{children:l(Z,{size:"xx-small",icon:ii({source:f,state:c})})})]}):l(Ts,{children:l(Z,{size:"x-large",icon:ii({source:f,state:c})})}),!!t&&t()]})},ii=({source:e,state:t})=>{if(t==="off")return"mdi:power-off";switch(e==null?void 0:e.toLowerCase()){case"spotify":return"mdi:spotify";case"airplay":return"mdi:airplay";case"bluetooth":return"mdi:bluetooth";case"net radio":return"mdi:radio";case"server":return"mdi:server";case"usb":return"mdi:usb";case"aux":return"mdi:audio-input-rca";case"hdmi":return"mdi:hdmi-port";case"tv":return"mdi:television";case"tuner":return"mdi:radio-tower";case"optical":return"mdi:audio-input-stereo-minijack";default:return"mdi:music"}},Rs=b.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  overflow-x: auto !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
  padding-top: 16px;
  padding-bottom: 16px;
  border-top: 0.5px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  gap: 2px;
`,Ls=b(tt)`
  &:first-child {
    margin-left: 16px;
  }
  &:last-child {
    margin-right: 16px;
  }
`,Ns=()=>{const{config:e}=A(z),{custom_buttons:t}=e;return l(Rs,{children:t.map((r,n)=>l(oi,{button:r},n))})},oi=({button:e,type:t="chip"})=>{const{hass:r,rootElement:n,config:i}=A(z),{icon:o,name:a,...s}=e,d=Ve({hass:r,rootElement:n,actionConfig:{...s,entity:i.entity_id}});return t==="icon-button"?l(V,{icon:e.icon??"mdi:dots-vertical",size:"x-small",...d}):l(Ls,{...d,children:[!!o&&l(Z,{icon:o,size:"x-small"}),!!a&&l("span",{children:a}),d.renderLongPressIndicator()]})},Is=b.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`,ai=b.span`
  font-size: 11px;
  color: var(--secondary-text-color, #888);
  opacity: 0.8;
  font-style: italic;
`,Os=()=>{var c,_;const{hass:e,config:t,rootElement:r}=A(z),{entity_id:n,speaker_group:i}=t,{friendly_name:o,icon:a,device_class:s}=e.states[n].attributes,d=(_=(c=e.states[(i==null?void 0:i.entity_id)??n])==null?void 0:c.attributes)==null?void 0:_.group_members,u=si({icon:a,deviceClass:s}),f=k(()=>{De(r,"hass-more-info",{entityId:n})},[]);return l(Is,{children:[l(V,{icon:u,onClick:f,size:"xx-small"}),l(ai,{children:o}),d&&d.length>1&&l(ai,{children:["+",d.length-1]})]})},si=({icon:e,deviceClass:t})=>{if(e)return e;switch(t){case"speaker":return"mdi:speaker";case"receiver":return"mdi:audio-video";default:return"mdi:speaker"}},zs=Fn`
  from {
    transform: translateY(15%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`,Ds=b.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 8; // Above header and below dialogs
  transition: opacity 0.3s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  @media screen and (min-height: 832px) {
    align-items: center;
  }
`,Vs=b.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`,Fs=b.div`
  animation: ${zs} 0.55s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  max-height: 98vh;
  height: fit-content;
  width: 424px;
  max-width: 98vw;
  margin-botton: 16px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.8);
  background-color: var(--ha-card-background, #fff);
  overflow: hidden;
  border-top-left-radius: var(--ha-dialog-border-radius, 28px);
  border-top-right-radius: var(--ha-dialog-border-radius, 28px);
  @media screen and (min-height: 832px) {
    border-radius: var(--ha-dialog-border-radius, 28px);
  }
`,Bs=b.div`
  display: grid;
  height: 100%;
`,ci=58,Us=b.div`
  display: flex;
  height: ${ci}px;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 16px;
  border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  background-color: var(--ha-card-background, #fff);
  gap: 8px;
`,Hs=b.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: var(--primary-text-color, #212121);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: auto;
`,js=b(ni)`
  max-height: calc(98vh - ${ci}px);
  max-width: 98vw;
  width: 100%;
  height: 100%;
  overflow: hidden;
`,Gs=({visible:e,setVisible:t})=>{var h,m;const{hass:r,config:n,rootElement:i}=A(z),{entity_id:o,speaker_group:a}=n,{friendly_name:s,icon:d,device_class:u}=r.states[o].attributes,f=(m=(h=r.states[(a==null?void 0:a.entity_id)??o])==null?void 0:h.attributes)==null?void 0:m.group_members,c=si({icon:d,deviceClass:u}),_=W(()=>{const{tap_opens_popup:v,...y}=n;return{...y,mode:"popup"}},[n]),p=Ve({rootElement:i,hass:r,actionConfig:{tap_action:{action:"more-info"},entity:o}});return e?l(Ds,{children:[l(Vs,{onClick:()=>t(!1)}),l(Fs,{children:[l(Us,{children:[l(Z,{size:"small",icon:c}),l(Hs,{children:[s,(f==null?void 0:f.length)>1&&l("span",{children:[" +",f.length-1]})]}),l(V,{size:"small",...p,icon:"mdi:dots-vertical"}),l(V,{icon:"mdi:close",size:"small",onClick:()=>t(!1)})]}),l(Bs,{children:l(Wn,{rootElement:i,hass:r,config:_,children:l(js,{})})})]})]}):null},Ws=b.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--primary-text-color, #333);
`,Ys=b.p`
  margin: 0px;
  font-size: 14px;
  color: var(--secondary-text-color, #666);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,qs=()=>{const{hass:e,config:t}=A(z),{entity_id:r}=t,{media_title:n,media_artist:i,media_album_name:o,source:a,friendly_name:s}=e.states[r].attributes,d=n??a??s,u=`${o!==n?`${o} - `:""}${i}`;return l(B,{children:[!!d&&l(Ws,{children:d}),(!!o||!!i)&&l(Ys,{children:u})]})},Xs=b.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: auto;
  height: 36px; // fixed to prevent jumping
  margin-left: -4px; // compensate for icon button padding
`,Fe=b(V)`
  opacity: ${e=>e.muted?.8:1}; // reduce opacity if muted
`,Ks=()=>{const{hass:e,config:t}=A(z),{entity_id:r}=t,n=e.states[r],{attributes:{shuffle:i,repeat:o}}=n,a=n.state==="playing",{supportPreviousTrack:s,supportNextTrack:d,supportsShuffle:u,supportsRepeat:f,supportsTogglePlayPause:c}=nr(n),_=k(()=>{e.callService("media_player","media_play_pause",{entity_id:t.entity_id})},[]),p=k(()=>{e.callService("media_player","media_next_track",{entity_id:t.entity_id})},[]),h=k(()=>{e.callService("media_player","media_previous_track",{entity_id:t.entity_id})},[]),m=k(()=>{e.callService("media_player","shuffle_set",{entity_id:t.entity_id,shuffle:!i})},[i]),v=k(()=>{const y=o==="off"?"one":o==="one"?"all":"off";e.callService("media_player","repeat_set",{entity_id:t.entity_id,repeat:y})},[o]);return l(Xs,{children:[!!u&&l(Fe,{size:"x-small",onClick:m,muted:!i,icon:i?"mdi:shuffle-variant":"mdi:shuffle-disabled"}),!!s&&l(Fe,{size:"small",onClick:h,icon:"mdi:skip-previous"}),c&&l(Fe,{size:"medium",onClick:_,icon:a?"mdi:pause-circle":"mdi:play-circle"}),!!d&&l(Fe,{size:"small",onClick:p,icon:"mdi:skip-next"}),!!f&&l(Fe,{size:"x-small",onClick:v,muted:o==="off",icon:o==="one"?"mdi:repeat-once":o==="all"?"mdi:repeat":"mdi:repeat-off"})]})},Zs=b.div`
  display: flex;
  flex-direction: column;
  padding-top: 8px;
  padding-bottom: 16px;
  border-top: 0.5px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  gap: 12px;
`,li=b.div`
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-text-color);
  margin-top: 8px;
  margin-right: 16px;
  margin-left: 16px;
`,Js=b.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 16px;
  margin-right: 16px;
`,Qs=b.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,ec=b.div`
  font-size: 13px;
  flex: 1;
  ${e=>e.isMaster?"font-weight: 500;":""}
  color: var(--primary-text-color);
`,tc=b.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8px;
`,rc=b.div`
  display: flex;
  flex-direction: row;
  gap: 2px;
  justify-content: flex-start;
  overflow-x: auto !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`,nc=b(tt)`
  opacity: ${e=>e.$loading?.3:.8};
  &:first-child {
    margin-left: 16px;
  }
  &:last-child {
    margin-right: 16px;
  }
`,ic=()=>{var c,_;const{hass:e,config:t}=A(z),{entity_id:r,speaker_group:n}=t,[i,o]=U([]),a=(n==null?void 0:n.entity_id)||r,s=e.states[a],d=W(()=>{var p;return(p=n==null?void 0:n.entities)!=null&&p.length?n.entities.filter(h=>e.states[h]).map(h=>{var m,v,y,x;return{entity_id:h,name:e.states[h].attributes.friendly_name,volume:e.states[h].attributes.volume_level||0,muted:e.states[h].attributes.is_volume_muted||!1,isGrouped:((v=(m=s==null?void 0:s.attributes)==null?void 0:m.group_members)==null?void 0:v.includes(h))||!1,isMainSpeaker:((x=(y=s==null?void 0:s.attributes)==null?void 0:y.group_members)==null?void 0:x[0])===h||!1}}).sort((h,m)=>h.entity_id===a?-1:m.entity_id===a?1:h.name.localeCompare(m.name)):[]},[e.states,n]),u=k(async(p,h)=>{if(!i.includes(p)){o(m=>[...m,p]);try{const m=e.states[p];h?await e.callService("media_player","unjoin",{entity_id:p}):(m.state==="off"&&await e.callService("media_player","turn_on",{entity_id:p}),await e.callService("media_player","join",{entity_id:a,group_members:[p]}))}catch(m){console.error(m)}o(m=>m.filter(v=>v!==p))}},[a,i]),f=k((p,h)=>{e.callService("media_player","volume_set",{entity_id:p,volume_level:h})},[]);return l(Zs,{children:[((_=(c=s==null?void 0:s.attributes)==null?void 0:c.group_members)==null?void 0:_.length)>1&&l(B,{children:[l(li,{children:"Grouped Speakers"}),l(Js,{children:d.filter(p=>p.isGrouped).map(p=>l(Qs,{children:[l(V,{size:"x-small",onClick:()=>u(p.entity_id,p.isGrouped),icon:"mdi:link-variant-off"}),l(ec,{isMaster:p.isMainSpeaker,children:[p.name," ",p.isMainSpeaker&&"(Master)"]}),p.isGrouped&&l(tc,{children:[l(Z,{size:"x-small",icon:"mdi:volume-high"}),l(ct,{min:0,max:1,step:.01,value:p.volume,thumbSize:"small",onChange:h=>f(p.entity_id,h)})]})]},p.entity_id))})]}),l(li,{children:"Add speakers to group"}),l(rc,{children:d.filter(p=>!p.isGrouped).map(p=>l(nc,{$loading:i.includes(p.entity_id),onClick:()=>u(p.entity_id,p.isGrouped),children:[p.name,p.isGrouped&&l(Z,{size:"x-small",icon:"mdi:close"}),!p.isGrouped&&l(Z,{size:"x-small",icon:"mdi:plus"})]},p.entity_id))})]})};b.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 4px;
`;const oc=b.div`
  display: flex;
  align-items: center;
  flex: 1;
  transition: all 0.3s ease;
  max-height: 36px;
  margin-top: auto;
`,or=b(V)`
  opacity: ${e=>e.muted?.8:1}; // reduce opacity if muted
`,ac=()=>{var u,f;const{hass:e,config:t}=A(z),{entity_id:r}=t,n=e.states[r],i=((u=n.attributes)==null?void 0:u.volume_level)??0,o=((f=n.attributes)==null?void 0:f.is_volume_muted)??!1,a=k(c=>{e.callService("media_player","volume_set",{entity_id:r,volume_level:c})},[]),s=k(()=>{e.callService("media_player","volume_mute",{entity_id:r,is_volume_muted:!o})},[o]),d=W(()=>ui(i,o),[i,o]);return l(oc,{children:[l(or,{size:"small",onClick:s,icon:d}),l(ct,{min:0,max:1,step:.01,value:i,thumbSize:"small",onChange:a})]})},ui=(e,t)=>e===0||t?"mdi:volume-off":e<.5?"mdi:volume-medium":"mdi:volume-high",sc=({sliderVisible:e,setSliderVisible:t})=>{var u,f;const{hass:r,config:n}=A(z),{entity_id:i}=n,o=r.states[i],a=((u=o.attributes)==null?void 0:u.volume_level)??0,s=((f=o.attributes)==null?void 0:f.is_volume_muted)??!1,d=ui(a,s);return l(B,{children:e?l(or,{size:"small",onClick:()=>t(!1),icon:"mdi:chevron-left"}):l(or,{size:"small",onClick:()=>t(!0),icon:d})})},di=b.div`
  border-radius: var(--ha-card-border-radius, 12px);
  overflow: hidden;
`,cc=b.div`
  display: flex;
  gap: 14px;
  padding: 12px;
  opacity: ${e=>e.isOn?1:.7};
  transition: opacity 0.3s ease;
  position: relative;
`,lc=b.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 12px;
  overflow: hidden;
`,uc=b.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,dc=b.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  justify-content: space-between;
`,fi=b.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: flex-start;
`,fc=()=>{const{rootElement:e,hass:t,config:r}=A(z),{entity_id:n,custom_buttons:i,action:o,tap_opens_popup:a}=r,s=i&&i.length>0,[d,u]=U(!1),[f,c]=U(!1),[_,p]=U(!1),h=t.states[n];if(!h)return l("ha-card",{children:l(di,{children:l("div",{children:["Entity ",n," not found"]})})});const m=nr(h),v=!m.supportsTogglePlayPause&&!m.supportNextTrack&&!m.supportPreviousTrack&&!m.supportsShuffle&&!m.supportsRepeat,{state:y}=h,x=!["off","unavailable"].includes(y),S=r.speaker_group&&r.speaker_group.entities&&r.speaker_group.entities.length>0,$=()=>{u(!d)},[g,w]=U(!1),N=Ve({hass:t,rootElement:e,actionConfig:{...o??{tap_action:{action:"more-info"}},entity:r.entity_id},overrideCallback:a?{onTap:()=>{w(!0)}}:{}}),F=k(()=>{t.callService("media_player","toggle",{entity_id:n})},[n]);return l(B,{children:[l("ha-card",{children:l(di,{children:[l(cc,{isOn:x,children:[l(As,{maxHeight:"100px",...N}),l(lc,{children:[l(uc,{children:[l(qs,{}),l(Os,{}),_||v?l(ac,{}):l(Ks,{})]}),l(dc,{children:[l(fi,{children:[s&&l(B,{children:i.length===1?l(oi,{button:i[0],type:"icon-button"}):l(V,{size:"x-small",onClick:()=>c(!f),icon:"mdi:dots-vertical"})}),S&&l(V,{size:"x-small",onClick:$,icon:"mdi:speaker-multiple"})]}),l(fi,{children:[!!x&&!v&&l(sc,{sliderVisible:_,setSliderVisible:p}),(!x||v)&&l(V,{size:"small",onClick:F,icon:"mdi:power"})]})]})]})]}),d&&S&&l(ic,{}),f&&l(Ns,{})]})}),l(Gs,{visible:g,setVisible:w})]})},pc=({config:e,rootElement:t,hass:r})=>{(!e||!r||!t)&&console.error("No config or hass");const n=k(f=>{const c=new Event("config-changed",{bubbles:!0,composed:!0});c.detail={config:f},t.dispatchEvent(c)},[t]),i=k((f,c)=>{if(!e)return;const _=f.split("."),p={...e};let h=p;for(let m=0;m<_.length-1;m++)h[_[m]]||(h[_[m]]={}),h=h[_[m]];h[_[_.length-1]]=c,n(p)},[e,n]),o=k(()=>{const f=[...e.custom_buttons||[],{icon:"mdi:paper-roll",name:"New Button",tap_action:{action:"toggle-menu"}}];n({...e,custom_buttons:f})},[e,n]),a=k(f=>{const c=[...e.custom_buttons||[]];c.splice(f,1),n({...e,custom_buttons:c})},[e,n]),s=k((f,c,_)=>{const p=[...e.custom_buttons||[]];p[f]={...p[f],[c]:_},n({...e,custom_buttons:p})},[e,n]),d=k((f,c)=>{const _=[...e.custom_buttons||[]];_[f]={..._[f],...c},n({...e,custom_buttons:_})},[e,n]);if(!e||!r)return null;const u={...e,speaker_group:e.speaker_group||{entity_id:"",entities:[]},custom_buttons:e.custom_buttons||[]};return l("form",{children:[l(K,{children:l(Se,{hass:r,value:u.entity_id,onChange:f=>i("entity_id",f),label:"Media Player Entity",domains:["media_player"],required:!0})}),l(K,{children:l(_e,{title:"Interactions",children:[l(Wo,{children:[l(qo,{type:"checkbox",id:"tap_opens_popup",checked:u.tap_opens_popup||!1,onChange:f=>i("tap_opens_popup",f.target.checked)}),l(Yo,{htmlFor:"tap_opens_popup",children:"Tap opens popup (this will override any setting under tap in action)"})]}),l(rt,{hass:r,value:u.action||{},onChange:f=>i("action",f)})]})}),l(K,{children:l(_e,{title:"Speaker Group Configuration (optional)",children:[l(K,{children:l(Se,{hass:r,value:u.speaker_group.entity_id,onChange:f=>i("speaker_group.entity_id",f),label:"Main Speaker Entity ID (Optional)",domains:["media_player"]})}),l(nt,{children:"Select Speakers (including main speaker)"}),l(K,{children:l(Hn,{hass:r,value:u.speaker_group.entities,onChange:f=>i("speaker_group.entities",f),label:"Speaker Group Entities (including main speaker)",domains:["media_player"]})})]})}),l(K,{children:l(jn,{children:[u.custom_buttons.map((f,c)=>{const{name:_,icon:p,...h}=f;return l(_e,{title:`Button ${c} - ${f.name}`,children:[l(K,{children:[l(it,{children:l(ot,{value:_||"",onChange:m=>s(c,"name",m),hass:r,label:"Name"})}),l(it,{children:l(ot,{value:p||"",onChange:m=>s(c,"icon",m),hass:r,isIconInput:!0,label:"Icon"})}),l(nt,{children:"Interactions"}),l(rt,{hass:r,value:h,onChange:m=>d(c,m)})]}),l(Gn,{type:"button",onClick:()=>a(c),children:"Remove Button"})]},c)}),l(Yt,{type:"button",onClick:o,children:"Add Custom Button"})]})})]})};class mc extends Kt{constructor(){super(...arguments),this.Card=ea}setConfig(t){if(!t.entity_id)throw new Error("You need to define an entity_id");if(!t.entities)throw new Error("You need to define entities");this.config=t}getCardSize(){return 1}getLayoutOptions(){return{grid_rows:1,grid_columns:6,grid_min_rows:1,grid_max_rows:1}}}customElements.define("mediocre-chip-media-player-group-card",mc);class hc extends Kt{constructor(){super(...arguments),this.Card=ni}setConfig(t){if(!t.entity_id)throw new Error("You need to define an entity_id");this.config=t}static getConfigElement(){return document.createElement("mediocre-massive-media-player-card-editor")}static getStubConfig(t){return{entity_id:Object.keys(t.states).filter(i=>i.substr(0,i.indexOf("."))==="media_player")[0]??"",mode:"card"}}}customElements.define("mediocre-massive-media-player-card",hc),window.customCards=window.customCards||[],window.customCards.push({type:"mediocre-massive-media-player-card",name:"Mediocre Massive Media Player Card",preview:!0,description:"A media player card with player grouping support.",documentationURL:"https://github.com/antontanderup/mediocre-hass-media-player-cards"});class _c extends qn{constructor(){super(...arguments),this.Card=pc}}class gc extends qn{constructor(){super(...arguments),this.Card=Ps,this.extraProps={isMassive:!0,className:void 0}}}customElements.define("mediocre-massive-media-player-card-editor",gc),customElements.define("mediocre-media-player-card-editor",_c);class vc extends Kt{constructor(){super(...arguments),this.Card=fc}setConfig(t){if(!t.entity_id)throw new Error("You need to define an entity_id");this.config=t}static getConfigElement(){return document.createElement("mediocre-media-player-card-editor")}static getStubConfig(t){return{entity_id:Object.keys(t.states).filter(i=>i.substr(0,i.indexOf("."))==="media_player")[0]??""}}getCardSize(){return 2}getGridOptions(){return{columns:12,min_columns:8}}}customElements.define("mediocre-media-player-card",vc),window.customCards=window.customCards||[],window.customCards.push({type:"mediocre-media-player-card",name:"Mediocre Media Player Card",preview:!0,description:"A media player card with player grouping support.",documentationURL:"https://github.com/antontanderup/mediocre-hass-media-player-cards"})});
