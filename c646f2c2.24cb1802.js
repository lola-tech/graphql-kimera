(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{133:function(t,n,e){"use strict";e.r(n);var r=e(179),o=e(0),i=e.n(o),c=e(180),a=e(165),u=e(162),f=e(160);function s(){var t=Object(r.a)(["\n  font-size: 1.5rem;\n"]);return s=function(){return t},t}function l(){var t=Object(r.a)(["\n  img {\n    height: 150px;\n  }\n\n  > span {\n    position: absolute;\n    left: -9999px;\n  }\n"]);return l=function(){return t},t}function p(){var t=Object(r.a)(["\n  padding: 4rem 0;\n  text-align: center;\n  position: relative;\n  overflow: hidden;\n\n  background-color: #eeeef6;\n\n  @media screen and (max-width: 966px) {\n    padding: 2rem;\n  }\n"]);return p=function(){return t},t}function b(){var t=Object(r.a)(["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n\n  > .button {\n    color: white;\n    border: 0;\n    background-color: var(--ifm-heading-color);\n    &:hover {\n      background-color: var(--ifm-color-primary);\n    }\n  }\n"]);return b=function(){return t},t}var v=c.a.div(b()),y=c.a.div(p()),h=c.a.h1(l()),g=c.a.p(s());n.default=function(){var t=Object(f.a)().siteConfig,n=void 0===t?{}:t;return i.a.createElement(y,null,i.a.createElement("div",{className:"container"},i.a.createElement(h,{className:"hero__title"},i.a.createElement("img",{src:Object(u.a)("img/kimera-logo.svg"),alt:"Kimera logo"}),i.a.createElement("span",null,n.title)),i.a.createElement(g,null,n.tagline),i.a.createElement(v,null,i.a.createElement(a.a,{className:"button button--lg",to:Object(u.a)("/docs/getting-started")},"Get Started"))))}},160:function(t,n,e){"use strict";var r=e(0),o=e(60);n.a=function(){return Object(r.useContext)(o.a)}},162:function(t,n,e){"use strict";e.d(n,"a",(function(){return i}));e(77);var r=e(160),o=e(164);function i(t,n){var e=void 0===n?{}:n,i=e.forcePrependBaseUrl,c=void 0!==i&&i,a=e.absolute,u=void 0!==a&&a,f=Object(r.a)().siteConfig,s=(f=void 0===f?{}:f).baseUrl,l=void 0===s?"/":s,p=f.url;if(!t)return t;if(c)return l+t;if(!Object(o.a)(t))return t;var b=l+t.replace(/^\//,"");return u?p+b:b}},164:function(t,n,e){"use strict";function r(t){return!1===/^(https?:|\/\/|mailto:|tel:)/.test(t)}e.d(n,"a",(function(){return r}))},165:function(t,n,e){"use strict";e(54),e(173),e(187);var r=e(0),o=e.n(r),i=e(41),c=e(164),a=e(18),u=function(t,n){var e={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&n.indexOf(r)<0&&(e[r]=t[r]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(t);o<r.length;o++)n.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(t,r[o])&&(e[r[o]]=t[r[o]])}return e};n.a=function(t){var n,e=t.isNavLink,f=u(t,["isNavLink"]),s=f.to,l=f.href,p=s||l,b=Object(c.a)(p),v=Object(r.useRef)(!1),y=e?i.c:i.b,h=a.a.canUseIntersectionObserver;return Object(r.useEffect)((function(){return!h&&b&&window.docusaurus.prefetch(p),function(){h&&n&&n.disconnect()}}),[p,h,b]),p&&b&&!p.startsWith("#")?o.a.createElement(y,Object.assign({},f,{onMouseEnter:function(){v.current||(window.docusaurus.preload(p),v.current=!0)},innerRef:function(t){var e,r;h&&t&&b&&(e=t,r=function(){window.docusaurus.prefetch(p)},(n=new window.IntersectionObserver((function(t){t.forEach((function(t){e===t.target&&(t.isIntersecting||t.intersectionRatio>0)&&(n.unobserve(e),n.disconnect(),r())}))}))).observe(e))},to:p})):o.a.createElement("a",Object.assign({href:p},!b&&{target:"_blank",rel:"noopener noreferrer"},f))}},166:function(t,n,e){var r=e(79),o=e(30);t.exports=function(t,n,e){if(r(n))throw TypeError("String#"+e+" doesn't accept regex!");return String(o(t))}},167:function(t,n,e){var r=e(3)("match");t.exports=function(t){var n=/./;try{"/./"[t](n)}catch(e){try{return n[r]=!1,!"/./"[t](n)}catch(o){}}return!0}},168:function(t,n,e){var r=e(83),o=e(56).concat("length","prototype");n.f=Object.getOwnPropertyNames||function(t){return r(t,o)}},169:function(t,n,e){var r=e(53),o=e(55),i=e(27),c=e(78),a=e(26),u=e(82),f=Object.getOwnPropertyDescriptor;n.f=e(10)?f:function(t,n){if(t=i(t),n=c(n,!0),u)try{return f(t,n)}catch(e){}if(a(t,n))return o(!r.f.call(t,n),t[n])}},173:function(t,n,e){"use strict";var r=e(12),o=e(28),i=e(166),c="".startsWith;r(r.P+r.F*e(167)("startsWith"),"String",{startsWith:function(t){var n=i(this,t,"startsWith"),e=o(Math.min(arguments.length>1?arguments[1]:void 0,n.length)),r=String(t);return c?c.call(n,r,e):n.slice(e,e+r.length)===r}})},175:function(t,n,e){n.f=e(3)},183:function(t,n,e){var r=e(21);t.exports=Array.isArray||function(t){return"Array"==r(t)}},187:function(t,n,e){"use strict";var r=e(6),o=e(26),i=e(10),c=e(12),a=e(15),u=e(188).KEY,f=e(14),s=e(42),l=e(43),p=e(39),b=e(3),v=e(175),y=e(189),h=e(190),g=e(183),m=e(8),d=e(13),O=e(31),w=e(27),j=e(78),S=e(55),E=e(87),x=e(191),P=e(169),N=e(80),k=e(25),F=e(20),W=P.f,I=k.f,_=x.f,J=r.Symbol,C=r.JSON,A=C&&C.stringify,D=b("_hidden"),K=b("toPrimitive"),M={}.propertyIsEnumerable,T=s("symbol-registry"),R=s("symbols"),U=s("op-symbols"),z=Object.prototype,G="function"==typeof J&&!!N.f,L=r.QObject,Y=!L||!L.prototype||!L.prototype.findChild,B=i&&f((function(){return 7!=E(I({},"a",{get:function(){return I(this,"a",{value:7}).a}})).a}))?function(t,n,e){var r=W(z,n);r&&delete z[n],I(t,n,e),r&&t!==z&&I(z,n,r)}:I,Q=function(t){var n=R[t]=E(J.prototype);return n._k=t,n},q=G&&"symbol"==typeof J.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof J},H=function(t,n,e){return t===z&&H(U,n,e),m(t),n=j(n,!0),m(e),o(R,n)?(e.enumerable?(o(t,D)&&t[D][n]&&(t[D][n]=!1),e=E(e,{enumerable:S(0,!1)})):(o(t,D)||I(t,D,S(1,{})),t[D][n]=!0),B(t,n,e)):I(t,n,e)},V=function(t,n){m(t);for(var e,r=h(n=w(n)),o=0,i=r.length;i>o;)H(t,e=r[o++],n[e]);return t},X=function(t){var n=M.call(this,t=j(t,!0));return!(this===z&&o(R,t)&&!o(U,t))&&(!(n||!o(this,t)||!o(R,t)||o(this,D)&&this[D][t])||n)},Z=function(t,n){if(t=w(t),n=j(n,!0),t!==z||!o(R,n)||o(U,n)){var e=W(t,n);return!e||!o(R,n)||o(t,D)&&t[D][n]||(e.enumerable=!0),e}},$=function(t){for(var n,e=_(w(t)),r=[],i=0;e.length>i;)o(R,n=e[i++])||n==D||n==u||r.push(n);return r},tt=function(t){for(var n,e=t===z,r=_(e?U:w(t)),i=[],c=0;r.length>c;)!o(R,n=r[c++])||e&&!o(z,n)||i.push(R[n]);return i};G||(a((J=function(){if(this instanceof J)throw TypeError("Symbol is not a constructor!");var t=p(arguments.length>0?arguments[0]:void 0),n=function(e){this===z&&n.call(U,e),o(this,D)&&o(this[D],t)&&(this[D][t]=!1),B(this,t,S(1,e))};return i&&Y&&B(z,t,{configurable:!0,set:n}),Q(t)}).prototype,"toString",(function(){return this._k})),P.f=Z,k.f=H,e(168).f=x.f=$,e(53).f=X,N.f=tt,i&&!e(40)&&a(z,"propertyIsEnumerable",X,!0),v.f=function(t){return Q(b(t))}),c(c.G+c.W+c.F*!G,{Symbol:J});for(var nt="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),et=0;nt.length>et;)b(nt[et++]);for(var rt=F(b.store),ot=0;rt.length>ot;)y(rt[ot++]);c(c.S+c.F*!G,"Symbol",{for:function(t){return o(T,t+="")?T[t]:T[t]=J(t)},keyFor:function(t){if(!q(t))throw TypeError(t+" is not a symbol!");for(var n in T)if(T[n]===t)return n},useSetter:function(){Y=!0},useSimple:function(){Y=!1}}),c(c.S+c.F*!G,"Object",{create:function(t,n){return void 0===n?E(t):V(E(t),n)},defineProperty:H,defineProperties:V,getOwnPropertyDescriptor:Z,getOwnPropertyNames:$,getOwnPropertySymbols:tt});var it=f((function(){N.f(1)}));c(c.S+c.F*it,"Object",{getOwnPropertySymbols:function(t){return N.f(O(t))}}),C&&c(c.S+c.F*(!G||f((function(){var t=J();return"[null]"!=A([t])||"{}"!=A({a:t})||"{}"!=A(Object(t))}))),"JSON",{stringify:function(t){for(var n,e,r=[t],o=1;arguments.length>o;)r.push(arguments[o++]);if(e=n=r[1],(d(n)||void 0!==t)&&!q(t))return g(n)||(n=function(t,n){if("function"==typeof e&&(n=e.call(this,t,n)),!q(n))return n}),r[1]=n,A.apply(C,r)}}),J.prototype[K]||e(11)(J.prototype,K,J.prototype.valueOf),l(J,"Symbol"),l(Math,"Math",!0),l(r.JSON,"JSON",!0)},188:function(t,n,e){var r=e(39)("meta"),o=e(13),i=e(26),c=e(25).f,a=0,u=Object.isExtensible||function(){return!0},f=!e(14)((function(){return u(Object.preventExtensions({}))})),s=function(t){c(t,r,{value:{i:"O"+ ++a,w:{}}})},l=t.exports={KEY:r,NEED:!1,fastKey:function(t,n){if(!o(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!i(t,r)){if(!u(t))return"F";if(!n)return"E";s(t)}return t[r].i},getWeak:function(t,n){if(!i(t,r)){if(!u(t))return!0;if(!n)return!1;s(t)}return t[r].w},onFreeze:function(t){return f&&l.NEED&&u(t)&&!i(t,r)&&s(t),t}}},189:function(t,n,e){var r=e(6),o=e(16),i=e(40),c=e(175),a=e(25).f;t.exports=function(t){var n=o.Symbol||(o.Symbol=i?{}:r.Symbol||{});"_"==t.charAt(0)||t in n||a(n,t,{value:c.f(t)})}},190:function(t,n,e){var r=e(20),o=e(80),i=e(53);t.exports=function(t){var n=r(t),e=o.f;if(e)for(var c,a=e(t),u=i.f,f=0;a.length>f;)u.call(t,c=a[f++])&&n.push(c);return n}},191:function(t,n,e){var r=e(27),o=e(168).f,i={}.toString,c="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[];t.exports.f=function(t){return c&&"[object Window]"==i.call(t)?function(t){try{return o(t)}catch(n){return c.slice()}}(t):o(r(t))}}}]);