"use strict";(self.webpackChunkdbux_docs=self.webpackChunkdbux_docs||[]).push([[204],{3905:function(e,t,n){n.d(t,{Zo:function(){return m},kt:function(){return p}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=a.createContext({}),s=function(e){var t=a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},m=function(e){var t=s(e.components);return a.createElement(c.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,c=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),u=s(n),p=r,f=u["".concat(c,".").concat(p)]||u[p]||d[p]||i;return n?a.createElement(f,o(o({ref:t},m),{},{components:n})):a.createElement(f,o({ref:t},m))}));function p(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=u;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var s=2;s<i;s++)o[s]=n[s];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},5002:function(e,t,n){n.d(t,{Z:function(){return s}});var a=n(7462),r=n(3366),i=n(7294),o=n(3616),l=["toc","className","linkClassName","linkActiveClassName","minHeadingLevel","maxHeadingLevel"];function c(e){var t=e.toc,n=e.className,a=e.linkClassName,r=e.isChild;return t.length?i.createElement("ul",{className:r?void 0:n},t.map((function(e){return i.createElement("li",{key:e.id},i.createElement("a",{href:"#"+e.id,className:null!=a?a:void 0,dangerouslySetInnerHTML:{__html:e.value}}),i.createElement(c,{isChild:!0,toc:e.children,className:n,linkClassName:a}))}))):null}function s(e){var t=e.toc,n=e.className,s=void 0===n?"table-of-contents table-of-contents__left-border":n,m=e.linkClassName,d=void 0===m?"table-of-contents__link":m,u=e.linkActiveClassName,p=void 0===u?void 0:u,f=e.minHeadingLevel,v=e.maxHeadingLevel,k=(0,r.Z)(e,l),g=(0,o.LU)(),y=null!=f?f:g.tableOfContents.minHeadingLevel,h=null!=v?v:g.tableOfContents.maxHeadingLevel,N=(0,o.DA)({toc:t,minHeadingLevel:y,maxHeadingLevel:h}),b=(0,i.useMemo)((function(){if(d&&p)return{linkClassName:d,linkActiveClassName:p,minHeadingLevel:y,maxHeadingLevel:h}}),[d,p,y,h]);return(0,o.Si)(b),i.createElement(c,(0,a.Z)({toc:N,className:s,linkClassName:d},k))}},8640:function(e,t,n){n.d(t,{Z:function(){return c}});var a=n(7294),r="tableOfContentsInline_0DDH",i=n(5002);var o=function(e){var t=e.toc,n=e.minHeadingLevel,o=e.maxHeadingLevel;return a.createElement("div",{className:r},a.createElement(i.Z,{toc:t,minHeadingLevel:n,maxHeadingLevel:o,className:"table-of-contents",linkClassName:null}))},l={display:"none"};function c(e){var t=e.toc;return a.createElement("div",{style:l},a.createElement(o,{toc:t}))}},7950:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return c},contentTitle:function(){return s},metadata:function(){return m},toc:function(){return d},default:function(){return p}});var a=n(7462),r=n(3366),i=(n(7294),n(3905)),o=n(8640),l=["components"],c={},s="Terminology",m={unversionedId:"advanced/terminology",id:"advanced/terminology",title:"Terminology",description:"This page lists some of Dbux's own terminology. More relevant background information can be found in the Background and Related Work chapter.",source:"@site/content/advanced/04-terminology.mdx",sourceDirName:"advanced",slug:"/advanced/terminology",permalink:"/dbux/advanced/terminology",editUrl:"https://github.com/Domiii/dbux/blob/master/docs/content/advanced/04-terminology.mdx",tags:[],version:"current",sidebarPosition:4,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Contributing",permalink:"/dbux/advanced/contributing"},next:{title:"Dbux Data Analysis",permalink:"/dbux/advanced/data-analysis"}},d=[{value:"Trace",id:"trace",children:[],level:2},{value:"Context",id:"context",children:[],level:2}],u={toc:d};function p(e){var t=e.components,n=(0,r.Z)(e,l);return(0,i.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"terminology"},"Terminology"),(0,i.kt)(o.Z,{toc:d,mdxType:"TOC"}),(0,i.kt)("p",null,"This page lists some of Dbux's own terminology. More relevant background information can be found in the ",(0,i.kt)("a",{parentName:"p",href:"../background"},"Background and Related Work")," chapter."),(0,i.kt)("span",{id:"staticTrace"}),(0,i.kt)("h2",{id:"trace"},"Trace"),(0,i.kt)("p",null,"We use (i) the name ",(0,i.kt)("inlineCode",{parentName:"p"},"staticTrace")," to represent a piece of code (e.g. ",(0,i.kt)("inlineCode",{parentName:"p"},"f(x)"),"), and (ii) the name ",(0,i.kt)("inlineCode",{parentName:"p"},"trace")," to represent a recorded execution of that code; meaning that one ",(0,i.kt)("inlineCode",{parentName:"p"},"staticTrace")," (piece of code) has 0 or more ",(0,i.kt)("inlineCode",{parentName:"p"},"traces")," (executions)."),(0,i.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"In runtime analysis research, the term ",(0,i.kt)("inlineCode",{parentName:"p"},"trace")," usually refers to the entire runtime log and ",(0,i.kt)("inlineCode",{parentName:"p"},"event"),' refers to an individual "trace log entry". But since the term ',(0,i.kt)("inlineCode",{parentName:"p"},"event")," is commonly used by JavaScript developers to refer to something else instead, we decided to, use ",(0,i.kt)("inlineCode",{parentName:"p"},"trace"),' to refer to "trace log entry" instead. This choice, despite being more confusing to researchers, likely alleviates confusion for most JavaScript developers.'))),(0,i.kt)("span",{id:"staticContext"}),(0,i.kt)("h2",{id:"context"},"Context"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"A ",(0,i.kt)("inlineCode",{parentName:"li"},"static context")," can be a ",(0,i.kt)("inlineCode",{parentName:"li"},"function")," declaration or a ",(0,i.kt)("inlineCode",{parentName:"li"},"Program")," (",(0,i.kt)("inlineCode",{parentName:"li"},"Program"),' is Babel\'s word for "JavaScript file").'),(0,i.kt)("li",{parentName:"ul"},"A ",(0,i.kt)("inlineCode",{parentName:"li"},"context")," (sometimes also called ",(0,i.kt)("inlineCode",{parentName:"li"},"executionContext"),") is any execution of such function or Program."),(0,i.kt)("li",{parentName:"ul"},"In many ways, a ",(0,i.kt)("inlineCode",{parentName:"li"},"context"),' can also be considered a "stack frame", but it is not quite the same.'),(0,i.kt)("li",{parentName:"ul"},"On file contexts:",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"While functions can be executed many times, JavaScript files usually only execute once, that is the first time they are ",(0,i.kt)("inlineCode",{parentName:"li"},"require"),"'d or ",(0,i.kt)("inlineCode",{parentName:"li"},"import"),"'ed."),(0,i.kt)("li",{parentName:"ul"},"After that first time, their ",(0,i.kt)("inlineCode",{parentName:"li"},"exports")," are cached, and returned to any following caller of ",(0,i.kt)("inlineCode",{parentName:"li"},"require")," or ",(0,i.kt)("inlineCode",{parentName:"li"},"import"),"."),(0,i.kt)("li",{parentName:"ul"},"That is why you will only see a single trace in the file scope, even if you require them many times."))),(0,i.kt)("li",{parentName:"ul"},"TODO: explain virtual and async contexts")))}p.isMDXComponent=!0}}]);