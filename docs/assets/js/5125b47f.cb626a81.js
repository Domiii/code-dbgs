"use strict";(self.webpackChunkdbux_docs=self.webpackChunkdbux_docs||[]).push([[131],{3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return v}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),u=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},s=function(e){var t=u(e.components);return r.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),m=u(n),v=a,f=m["".concat(l,".").concat(v)]||m[v]||d[v]||i;return n?r.createElement(f,o(o({ref:t},s),{},{components:n})):r.createElement(f,o({ref:t},s))}));function v(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=m;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:a,o[1]=c;for(var u=2;u<i;u++)o[u]=n[u];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},7783:function(e,t,n){n.d(t,{Z:function(){return o}});var r=n(7294),a="tableOfContentsInline_0DDH",i=n(5002);var o=function(e){var t=e.toc,n=e.minHeadingLevel,o=e.maxHeadingLevel;return r.createElement("div",{className:a},r.createElement(i.Z,{toc:t,minHeadingLevel:n,maxHeadingLevel:o,className:"table-of-contents",linkClassName:null}))}},5002:function(e,t,n){n.d(t,{Z:function(){return u}});var r=n(7462),a=n(3366),i=n(7294),o=n(3616),c=["toc","className","linkClassName","linkActiveClassName","minHeadingLevel","maxHeadingLevel"];function l(e){var t=e.toc,n=e.className,r=e.linkClassName,a=e.isChild;return t.length?i.createElement("ul",{className:a?void 0:n},t.map((function(e){return i.createElement("li",{key:e.id},i.createElement("a",{href:"#"+e.id,className:null!=r?r:void 0,dangerouslySetInnerHTML:{__html:e.value}}),i.createElement(l,{isChild:!0,toc:e.children,className:n,linkClassName:r}))}))):null}function u(e){var t=e.toc,n=e.className,u=void 0===n?"table-of-contents table-of-contents__left-border":n,s=e.linkClassName,d=void 0===s?"table-of-contents__link":s,m=e.linkActiveClassName,v=void 0===m?void 0:m,f=e.minHeadingLevel,p=e.maxHeadingLevel,b=(0,a.Z)(e,c),g=(0,o.LU)(),y=null!=f?f:g.tableOfContents.minHeadingLevel,x=null!=p?p:g.tableOfContents.maxHeadingLevel,O=(0,o.DA)({toc:t,minHeadingLevel:y,maxHeadingLevel:x}),w=(0,i.useMemo)((function(){if(d&&v)return{linkClassName:d,linkActiveClassName:v,minHeadingLevel:y,maxHeadingLevel:x}}),[d,v,y,x]);return(0,o.Si)(w),i.createElement(l,(0,r.Z)({toc:O,className:u,linkClassName:d},b))}},1044:function(e,t,n){n.d(t,{Z:function(){return o}});var r=n(7294),a=n(7783),i={display:"none"};function o(e){var t=e.toc;return r.createElement("div",{style:i},r.createElement(a.Z,{toc:t}))}},6429:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return u},metadata:function(){return s},toc:function(){return d},default:function(){return v}});var r=n(7462),a=n(3366),i=(n(7294),n(3905)),o=n(1044),c=["components"],l={title:"Overview",slug:"/dbux-practice/"},u="Dbux Practice: Overview",s={unversionedId:"dbux-practice/overview",id:"dbux-practice/overview",title:"Overview",description:"TODO",source:"@site/content/03-dbux-practice/01-overview.mdx",sourceDirName:"03-dbux-practice",slug:"/dbux-practice/",permalink:"/dbux/dbux-practice/",editUrl:"https://github.com/Domiii/dbux/blob/master/docs/content/03-dbux-practice/01-overview.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Overview",slug:"/dbux-practice/"},sidebar:"tutorialSidebar",previous:{title:"Data Flow",permalink:"/dbux/using-dbux/data-flow"},next:{title:"Tutorial",permalink:"/dbux/dbux-practice/tutorial"}},d=[],m={toc:d};function v(e){var t=e.components,n=(0,a.Z)(e,c);return(0,i.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"dbux-practice-overview"},"Dbux Practice: Overview"),(0,i.kt)(o.Z,{toc:d,mdxType:"TOC"}),(0,i.kt)("p",null,"TODO"))}v.isMDXComponent=!0}}]);