/*! For license information please see fd152f45.165eb147.js.LICENSE.txt */
(self.webpackChunkdbux_docs=self.webpackChunkdbux_docs||[]).push([[665],{3905:function(t,e,n){"use strict";n.d(e,{Zo:function(){return p},kt:function(){return c}});var a=n(7294);function r(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function l(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function i(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?l(Object(n),!0).forEach((function(e){r(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function o(t,e){if(null==t)return{};var n,a,r=function(t,e){if(null==t)return{};var n,a,r={},l=Object.keys(t);for(a=0;a<l.length;a++)n=l[a],e.indexOf(n)>=0||(r[n]=t[n]);return r}(t,e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(t);for(a=0;a<l.length;a++)n=l[a],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(r[n]=t[n])}return r}var u=a.createContext({}),d=function(t){var e=a.useContext(u),n=e;return t&&(n="function"==typeof t?t(e):i(i({},e),t)),n},p=function(t){var e=d(t.components);return a.createElement(u.Provider,{value:e},t.children)},m={inlineCode:"code",wrapper:function(t){var e=t.children;return a.createElement(a.Fragment,{},e)}},s=a.forwardRef((function(t,e){var n=t.components,r=t.mdxType,l=t.originalType,u=t.parentName,p=o(t,["components","mdxType","originalType","parentName"]),s=d(n),c=r,g=s["".concat(u,".").concat(c)]||s[c]||m[c]||l;return n?a.createElement(g,i(i({ref:e},p),{},{components:n})):a.createElement(g,i({ref:e},p))}));function c(t,e){var n=arguments,r=e&&e.mdxType;if("string"==typeof t||r){var l=n.length,i=new Array(l);i[0]=s;var o={};for(var u in e)hasOwnProperty.call(e,u)&&(o[u]=e[u]);o.originalType=t,o.mdxType="string"==typeof t?t:r,i[1]=o;for(var d=2;d<l;d++)i[d]=n[d];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}s.displayName="MDXCreateElement"},5002:function(t,e,n){"use strict";n.d(e,{Z:function(){return d}});var a=n(7462),r=n(3366),l=n(7294),i=n(3616),o=["toc","className","linkClassName","linkActiveClassName","minHeadingLevel","maxHeadingLevel"];function u(t){var e=t.toc,n=t.className,a=t.linkClassName,r=t.isChild;return e.length?l.createElement("ul",{className:r?void 0:n},e.map((function(t){return l.createElement("li",{key:t.id},l.createElement("a",{href:"#"+t.id,className:null!=a?a:void 0,dangerouslySetInnerHTML:{__html:t.value}}),l.createElement(u,{isChild:!0,toc:t.children,className:n,linkClassName:a}))}))):null}function d(t){var e=t.toc,n=t.className,d=void 0===n?"table-of-contents table-of-contents__left-border":n,p=t.linkClassName,m=void 0===p?"table-of-contents__link":p,s=t.linkActiveClassName,c=void 0===s?void 0:s,g=t.minHeadingLevel,k=t.maxHeadingLevel,N=(0,r.Z)(t,o),b=(0,i.LU)(),h=null!=g?g:b.tableOfContents.minHeadingLevel,x=null!=k?k:b.tableOfContents.maxHeadingLevel,v=(0,i.DA)({toc:e,minHeadingLevel:h,maxHeadingLevel:x}),f=(0,l.useMemo)((function(){if(m&&c)return{linkClassName:m,linkActiveClassName:c,minHeadingLevel:h,maxHeadingLevel:x}}),[m,c,h,x]);return(0,i.Si)(f),l.createElement(u,(0,a.Z)({toc:v,className:d,linkClassName:m},N))}},5679:function(t,e,n){"use strict";n.d(e,{Z:function(){return l}});var a=n(7294),r=n(633);function l(t){var e=Object.assign({},t);return"darkLight"in e||(e.darkLight=!0),a.createElement(r.Z,e)}},633:function(t,e,n){"use strict";n.d(e,{Z:function(){return g}});var a=n(7462),r=n(3366),l=n(7294),i=n(4184),o=n.n(i),u=n(7037),d=n.n(u),p=n(5350),m=n(8767);var s=["src","title","zoomable","darkLight","screen","concept","className","maxWidth","mb","style"];function c(t){return t.startsWith("/")||t.includes("://")}function g(t){var e=t.src,n=t.title,i=t.zoomable,u=t.darkLight,g=t.screen,k=t.concept,N=t.className,b=t.maxWidth,h=t.mb,x=t.style,v=(0,r.Z)(t,s);k&&(e.startsWith("concept")||c(e)||(e="concepts/"+e)),g&&(e.startsWith("screen")||c(e)||(e="screens/"+e));var f=k||g||i;f&&void 0===i&&(i=!0);var y=function(t){var e=t.src,n=t.darkLight,a=(0,p.Z)().isDarkTheme;return(0,m.Z)()+(n?a?"dark/":"light/":"")+e}({src:e,darkLight:u}),D=n=n||e;N=o()(N,{"border-screen":f,"img-crisp":f,zoomable:i});var w=l.createElement("img",(0,a.Z)({className:N,style:x,src:y,alt:D,title:n},v));if(b){b=d()(b)?b:b+"px",h=void 0===h?"mb-2":h;var C=o()(h),S={display:"inline-block",maxWidth:b,lineHeight:0};w=l.createElement("div",{className:C,style:S},w)}return w}},8640:function(t,e,n){"use strict";n.d(e,{Z:function(){return u}});var a=n(7294),r="tableOfContentsInline_0DDH",l=n(5002);var i=function(t){var e=t.toc,n=t.minHeadingLevel,i=t.maxHeadingLevel;return a.createElement("div",{className:r},a.createElement(l.Z,{toc:e,minHeadingLevel:n,maxHeadingLevel:i,className:"table-of-contents",linkClassName:null}))},o={display:"none"};function u(t){var e=t.toc;return a.createElement("div",{style:o},a.createElement(i,{toc:e}))}},8767:function(t,e,n){"use strict";n.d(e,{Z:function(){return r}});var a=n(2263);function r(){return(0,a.Z)().siteConfig.baseUrl}},8130:function(t,e,n){"use strict";n.r(e),n.d(e,{contentTitle:function(){return b},default:function(){return f},frontMatter:function(){return N},metadata:function(){return h},toc:function(){return x}});var a=n(7462),r=n(3366),l=(n(7294),n(3905)),i=n(633),o=n(5679),u=n(8640),d=["components"],p={toc:[]};function m(t){var e=t.components,n=(0,r.Z)(t,d);return(0,l.kt)("wrapper",(0,a.Z)({},p,n,{components:e,mdxType:"MDXLayout"}),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Command"),(0,l.kt)("th",{parentName:"tr",align:null},"Title"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.backendLogin"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Backend Login"),(0,l.kt)("td",{parentName:"tr",align:null},"(Feature still in development. Won't work.)")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.debugFile"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Debug Current File"),(0,l.kt)("td",{parentName:"tr",align:null},"Run selected file with Dbux, but with Node's ",(0,l.kt)("inlineCode",{parentName:"td"},"--inspect-brk")," enabled. Make sure to enable VSCode's auto attach beforehand.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.deleteUserEvents"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux Dev: Delete all user events"),(0,l.kt)("td",{parentName:"tr",align:null},"(Feature still in development. Won't work.)")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.diagnostics"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Diagnostics"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.doActivate"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Start Dbux"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.exportApplicationData"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Export Application Data"),(0,l.kt)("td",{parentName:"tr",align:null},"Export raw recorded Dbux data of a previously executed application to a ",(0,l.kt)("inlineCode",{parentName:"td"},"json")," file.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.hideDecorations"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Hide Code Decorations"),(0,l.kt)("td",{parentName:"tr",align:null},"Do not annotate executed code with Dbux code decorations (",(0,l.kt)("span",{className:"color-red"},"\u2726\u21b1"),(0,l.kt)("span",{className:"color-orange"},"\ud83d\udd25\u0192")," etc).")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.hideGraphView"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Hide Call Graph"),(0,l.kt)("td",{parentName:"tr",align:null},"Close the Call Graph panel.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.hidePathwaysView"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Hide Pathways View"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.importApplicationData"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Import Application Data"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.loadPracticeLogFile"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux Dev:Load Practice Log"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.openPracticeLogFolder"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Open Practice Log Folder"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.reloadExerciseList"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Reload Exercise List"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.resetPracticeLog"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux Dev: Reset Practice Log"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.resetPracticeProgress"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux Dev: Reset Practice Progress"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.runFile"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Run Current File"),(0,l.kt)("td",{parentName:"tr",align:null},"Run selected file with Dbux")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.searchContexts"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Search in contexts"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.searchTraces"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Search in traces"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.searchValues"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Search in values"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.selectTrace"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Select Trace by id"),(0,l.kt)("td",{parentName:"tr",align:null},"Mostly used for debugging Dbux, or when (for some other reason) you would know some trace by its id.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.showDecorations"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Show Code Decorations"),(0,l.kt)("td",{parentName:"tr",align:null},"Show code decorations again after hiding them.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.showGraphView"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Show Call Graph"),(0,l.kt)("td",{parentName:"tr",align:null},"Open the Call Graph panel.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.showHelp"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Help"),(0,l.kt)("td",{parentName:"tr",align:null},"Show the Dbux help dialog.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.showOutputChannel"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Show output channel"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.showPathwaysView"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Show Pathways View"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.startRuntimeServer"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Start Dbux Runtime Server"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.stopRuntimeServer"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Stop Dbux Runtime Server"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.systemCheck"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Check System Dependencies"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux (especially Dbux practice) needs some system tools in order to work properly. You can check these dependencies with this command.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.toggleErrorLog"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Toggle Error Notifications"),(0,l.kt)("td",{parentName:"tr",align:null},"Suppress/unsuppress all Dbux error notifications.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.toggleNavButton"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Toggle Editor Buttons"),(0,l.kt)("td",{parentName:"tr",align:null},"Hide/show Dbux buttons in the editor tab bar. Use this if you don't want to see any extra buttons at the top right of your editor tab bar.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.togglePracticeView"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Toggle Practice View"),(0,l.kt)("td",{parentName:"tr",align:null},"Feature still in development. You can use this to use Dbux on a pre-configured bug in express.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbuxGlobalAnalysisView.node.nextSearchMode"),(0,l.kt)("td",{parentName:"tr",align:null},"Next search mode"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbuxProject.uploadLog"),(0,l.kt)("td",{parentName:"tr",align:null},"Upload log files"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbuxProjectView.showDiff"),(0,l.kt)("td",{parentName:"tr",align:null},"Show difference"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbuxSessionView.flushCache"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux Project: Flush cache"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbuxSessionView.run"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux Project: Run without dbux"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbuxSessionView.run#dbux"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux Project: Run with dbux"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbuxSessionView.run#debug"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux Project: Run without dbux in debug mode"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbuxSessionView.run#debug#dbux"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux Project: Run with dbux in debug mode"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbuxTraceDetailsView.navigation.NextChildContext"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Go to next function call in context"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbuxTraceDetailsView.navigation.NextInContext"),(0,l.kt)("td",{parentName:"tr",align:null},'Dbux: Go to next "non-trivial" trace in context'),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbuxTraceDetailsView.navigation.NextParentContext"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Go to end of context"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbuxTraceDetailsView.navigation.NextStaticTrace"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Go to next execution of the same trace"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbuxTraceDetailsView.navigation.NextTrace"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Go to next trace (unconditionally)"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbuxTraceDetailsView.navigation.PreviousChildContext"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Go to previous function call in context"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbuxTraceDetailsView.navigation.PreviousInContext"),(0,l.kt)("td",{parentName:"tr",align:null},'Dbux: Go to previous "non-trivial" trace in context'),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbuxTraceDetailsView.navigation.PreviousParentContext"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Go to start of context"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbuxTraceDetailsView.navigation.PreviousStaticTrace"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Go to previous execution of the same trace"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbuxTraceDetailsView.navigation.PreviousTrace"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Go to previous trace (unconditionally)"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbuxTraceDetailsView.selectTraceAtCursor"),(0,l.kt)("td",{parentName:"tr",align:null},"Dbux: Select Trace At Cursor"),(0,l.kt)("td",{parentName:"tr",align:null},"Selects the trace at the keyboard cursor (if there is any executed trace).")))))}m.isMDXComponent=!0;var s=["components"],c={toc:[]};function g(t){var e=t.components,n=(0,r.Z)(t,s);return(0,l.kt)("wrapper",(0,a.Z)({},c,n,{components:e,mdxType:"MDXLayout"}),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Entry"),(0,l.kt)("th",{parentName:"tr",align:null},"Type"),(0,l.kt)("th",{parentName:"tr",align:null},"Default"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.autoStart"),(0,l.kt)("td",{parentName:"tr",align:null},"boolean"),(0,l.kt)("td",{parentName:"tr",align:null},"false"),(0,l.kt)("td",{parentName:"tr",align:null},'Whether to auto-start Dbux when opening vscode. Else, you have to click the "Start Dbux" button manually every time. (During this early stage, we still hide Dbux default behavior behind a button, to make sure you don\'t see annoying messages pop up when Dbux has to update dependencies etc. We will improve upon that as Dbux evolves.)')),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.paths.git"),(0,l.kt)("td",{parentName:"tr",align:null},"string"),(0,l.kt)("td",{parentName:"tr",align:null},"git"),(0,l.kt)("td",{parentName:"tr",align:null},"When executing git terminal commands, use ",(0,l.kt)("inlineCode",{parentName:"td"},"git")," from this path. Only used for auto-installing and managing practice projects.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.paths.node"),(0,l.kt)("td",{parentName:"tr",align:null},"string"),(0,l.kt)("td",{parentName:"tr",align:null},"node"),(0,l.kt)("td",{parentName:"tr",align:null},"When executing terminal commands, use ",(0,l.kt)("inlineCode",{parentName:"td"},"node")," from this path. (Hint: If you change this, you probably also want to change ",(0,l.kt)("inlineCode",{parentName:"td"},"paths.npm"),".)")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.paths.npm"),(0,l.kt)("td",{parentName:"tr",align:null},"string"),(0,l.kt)("td",{parentName:"tr",align:null},"npm"),(0,l.kt)("td",{parentName:"tr",align:null},"When installing packages initially or practice projects, use ",(0,l.kt)("inlineCode",{parentName:"td"},"npm")," from this path. (Hint: If you change this, you probably also want to change ",(0,l.kt)("inlineCode",{parentName:"td"},"paths.node"),".)")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.paths.yarn"),(0,l.kt)("td",{parentName:"tr",align:null},"string"),(0,l.kt)("td",{parentName:"tr",align:null},"yarn"),(0,l.kt)("td",{parentName:"tr",align:null},"When playing with practice projects that require ",(0,l.kt)("inlineCode",{parentName:"td"},"yarn"),", use this path. (Hint: If you change this, you probably also want to change ",(0,l.kt)("inlineCode",{parentName:"td"},"paths.npm"),".)")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.paths.bash"),(0,l.kt)("td",{parentName:"tr",align:null},"string"),(0,l.kt)("td",{parentName:"tr",align:null},"bash"),(0,l.kt)("td",{parentName:"tr",align:null},"When executing terminal commands, use ",(0,l.kt)("inlineCode",{parentName:"td"},"bash")," from this path.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.run.dbuxArgs"),(0,l.kt)("td",{parentName:"tr",align:null},"string"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("span",{className:"no-wrap"},"--esnext")),(0,l.kt)("td",{parentName:"tr",align:null},"Custom ",(0,l.kt)("inlineCode",{parentName:"td"},"dbux run")," command options. You can find a list of all available dbux command options in ",(0,l.kt)("a",{parentName:"td",href:"https://github.com/Domiii/dbux/blob/master/dbux-cli/src/commandCommons.js"},"https://github.com/Domiii/dbux/blob/master/dbux-cli/src/commandCommons.js"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.run.nodeArgs"),(0,l.kt)("td",{parentName:"tr",align:null},"string"),(0,l.kt)("td",{parentName:"tr",align:null},"--enable-source-maps"),(0,l.kt)("td",{parentName:"tr",align:null},"Custom node options passed to node when running the program.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.run.programArgs"),(0,l.kt)("td",{parentName:"tr",align:null},"string"),(0,l.kt)("td",{parentName:"tr",align:null}),(0,l.kt)("td",{parentName:"tr",align:null},"Custom program arguments, available to the program via ",(0,l.kt)("inlineCode",{parentName:"td"},"process.argv"),".")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.run.env"),(0,l.kt)("td",{parentName:"tr",align:null},"object"),(0,l.kt)("td",{parentName:"tr",align:null},"{}"),(0,l.kt)("td",{parentName:"tr",align:null},"Custom program environment variables available via ",(0,l.kt)("inlineCode",{parentName:"td"},"process.env")," (probably not working yet).")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.debug.dbuxArgs"),(0,l.kt)("td",{parentName:"tr",align:null},"string"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("span",{className:"no-wrap"},"--esnext")),(0,l.kt)("td",{parentName:"tr",align:null},"Custom ",(0,l.kt)("inlineCode",{parentName:"td"},"dbux run")," command options. You can find a list of all available dbux command options in ",(0,l.kt)("a",{parentName:"td",href:"https://github.com/Domiii/dbux/blob/master/dbux-cli/src/commandCommons.js"},"https://github.com/Domiii/dbux/blob/master/dbux-cli/src/commandCommons.js"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.debug.nodeArgs"),(0,l.kt)("td",{parentName:"tr",align:null},"string"),(0,l.kt)("td",{parentName:"tr",align:null}),(0,l.kt)("td",{parentName:"tr",align:null},"Custom node options passed to node when running the program.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.debug.programArgs"),(0,l.kt)("td",{parentName:"tr",align:null},"string"),(0,l.kt)("td",{parentName:"tr",align:null}),(0,l.kt)("td",{parentName:"tr",align:null},"Custom program arguments, available to the program via ",(0,l.kt)("inlineCode",{parentName:"td"},"process.argv"),".")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.debug.env"),(0,l.kt)("td",{parentName:"tr",align:null},"object"),(0,l.kt)("td",{parentName:"tr",align:null},"{}"),(0,l.kt)("td",{parentName:"tr",align:null},"Custom program environment variables available via ",(0,l.kt)("inlineCode",{parentName:"td"},"process.env")," (probably not working yet).")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"dbux.packageWhitelist"),(0,l.kt)("td",{parentName:"tr",align:null},"string"),(0,l.kt)("td",{parentName:"tr",align:null}),(0,l.kt)("td",{parentName:"tr",align:null},"Specify which package will be traced by Dbux, seperated by space, regex supported.")))))}g.isMDXComponent=!0;var k=["components"],N={title:"Dbux VSCode Extension"},b="Dbux VSCode Extension",h={unversionedId:"tools-and-configuration/dbux-code",id:"tools-and-configuration/dbux-code",title:"Dbux VSCode Extension",description:"The Dbux VSCode Extension is available on the VSCode Marketplace. It is currently the only GUI implementation for Dbux.",source:"@site/content/tools-and-configuration/01-dbux-code.mdx",sourceDirName:"tools-and-configuration",slug:"/tools-and-configuration/dbux-code",permalink:"/dbux/tools-and-configuration/dbux-code",editUrl:"https://github.com/Domiii/dbux/blob/master/docs/content/tools-and-configuration/01-dbux-code.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Dbux VSCode Extension"},sidebar:"tutorialSidebar",previous:{title:"Tools and Configuration Overview",permalink:"/dbux/tools-and-configuration"},next:{title:"Dbux CLI",permalink:"/dbux/tools-and-configuration/dbux-cli"}},x=[{value:"Runtime Server",id:"runtime-server",children:[],level:2},{value:"Commands",id:"commands",children:[],level:2},{value:"Config",id:"config",children:[],level:2}],v={toc:x};function f(t){var e=t.components,n=(0,r.Z)(t,k);return(0,l.kt)("wrapper",(0,a.Z)({},v,n,{components:e,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"dbux-vscode-extension"},"Dbux VSCode Extension"),(0,l.kt)(u.Z,{toc:x,mdxType:"TOC"}),(0,l.kt)("p",null,"The Dbux VSCode Extension is available on the ",(0,l.kt)("a",{parentName:"p",href:"https://marketplace.visualstudio.com/items?itemName=Domi.dbux-code"},"VSCode Marketplace"),". It is currently the only GUI implementation for Dbux."),(0,l.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,l.kt)("div",{parentName:"div",className:"admonition-heading"},(0,l.kt)("h5",{parentName:"div"},(0,l.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,l.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,l.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,l.kt)("div",{parentName:"div",className:"admonition-content"},(0,l.kt)("p",{parentName:"div"},"This page goes into some lower level details while ",(0,l.kt)("a",{parentName:"p",href:"../runtime-analysis/"},"the Runtime Analysis manual")," explains the GUI and all analysis features in detail."))),(0,l.kt)("h2",{id:"runtime-server"},"Runtime Server"),(0,l.kt)("p",null,"Currently, the VSCode Extension is the only implementation of the ",(0,l.kt)(o.Z,{src:"antenna_green.svg",mdxType:"DarkLightImg"}),(0,l.kt)(o.Z,{src:"antenna_red.svg",mdxType:"DarkLightImg"})," Dbux Runtime Server. If enabled, it receives data from ",(0,l.kt)("a",{parentName:"p",href:"/dbux/runtime-analysis/enable-dbux"},"Dbux-enabled applications")," running on ",(0,l.kt)("inlineCode",{parentName:"p"},"localhost"),(0,l.kt)("sup",{parentName:"p",id:"fnref-1"},(0,l.kt)("a",{parentName:"sup",href:"#fn-1",className:"footnote-ref"},"1")),". Once a first batch of data is received, the application will show up in the ",(0,l.kt)("a",{parentName:"p",href:"../runtime-analysis/applications"},"Application View"),"."),(0,l.kt)("p",null,"The Runtime Server is turned off by default. It turns on automatically the first time you use ",(0,l.kt)("a",{parentName:"p",href:"/dbux/runtime-analysis/the-run-button"},"the Run Button")," or run a ",(0,l.kt)("a",{parentName:"p",href:"/dbux/dbux-practice/"},"Dbux Practice exercise"),"."),(0,l.kt)("p",null,'You can manually turn it on or off via "the Runtime Server button" at the top of ',(0,l.kt)("a",{parentName:"p",href:"/dbux/runtime-analysis/applications"},"the Applications view"),(0,l.kt)("sup",{parentName:"p",id:"fnref-2"},(0,l.kt)("a",{parentName:"sup",href:"#fn-2",className:"footnote-ref"},"2")),":"),(0,l.kt)(i.Z,{screen:!0,src:"runtime-server-button.png",mdxType:"Img"}),(0,l.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,l.kt)("div",{parentName:"div",className:"admonition-heading"},(0,l.kt)("h5",{parentName:"div"},(0,l.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,l.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,l.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,l.kt)("div",{parentName:"div",className:"admonition-content"},(0,l.kt)("p",{parentName:"div"},"Since the Runtime Server port is currently hard-coded",(0,l.kt)("sup",{parentName:"p",id:"fnref-1"},(0,l.kt)("a",{parentName:"sup",href:"#fn-1",className:"footnote-ref"},"1")),', only one instance can be running per computer/VM/container. Trying to start another instance will fail with a corresponding "port in use" error message.'))),(0,l.kt)("h2",{id:"commands"},"Commands"),(0,l.kt)("p",null,"Dbux offers a multitude of commands. If you have trouble, using the commands, please consult ",(0,l.kt)("a",{parentName:"p",href:"/dbux/faq#how-to-use-commands"},"the corresponding entry in our FAQ"),"."),(0,l.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,l.kt)("div",{parentName:"div",className:"admonition-heading"},(0,l.kt)("h5",{parentName:"div"},(0,l.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,l.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,l.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,l.kt)("div",{parentName:"div",className:"admonition-content"},(0,l.kt)("p",{parentName:"div"},"(Almost?) all buttons in the Dbux VSCode Extension have corresponding commands."),(0,l.kt)("p",{parentName:"div"},"Also: You can bind commands to keys: ",(0,l.kt)("a",{parentName:"p",href:"https://code.visualstudio.com/docs/getstarted/keybindings"},"VSCode official documentation on key-binds"),"."))),(0,l.kt)(m,{mdxType:"Commands"}),(0,l.kt)("h2",{id:"config"},"Config"),(0,l.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,l.kt)("div",{parentName:"div",className:"admonition-heading"},(0,l.kt)("h5",{parentName:"div"},(0,l.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,l.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,l.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,l.kt)("div",{parentName:"div",className:"admonition-content"},(0,l.kt)("p",{parentName:"div"},"You can change configuration via the ",(0,l.kt)("inlineCode",{parentName:"p"},"Preferences: Open User/Workspace Settings")," ",(0,l.kt)("a",{parentName:"p",href:"/dbux/faq#how-to-use-commands"},"commands"),"."))),(0,l.kt)(g,{mdxType:"Config"}),(0,l.kt)("div",{className:"footnotes"},(0,l.kt)("hr",{parentName:"div"}),(0,l.kt)("ol",{parentName:"div"},(0,l.kt)("li",{parentName:"ol",id:"fn-1"},"Dbux can currently only receive data on ",(0,l.kt)("inlineCode",{parentName:"li"},"localhost")," via a hard-coded port. This is a ",(0,l.kt)("a",{parentName:"li",href:"../advanced/future-work"},"known limitation")," we intend to address in the near future.",(0,l.kt)("a",{parentName:"li",href:"#fnref-1",className:"footnote-backref"},"\u21a9")),(0,l.kt)("li",{parentName:"ol",id:"fn-2"},"You might need to hover over the ",(0,l.kt)("inlineCode",{parentName:"li"},"Applications")," view for buttons to show up. This is a ",(0,l.kt)("a",{parentName:"li",href:"https://github.com/microsoft/vscode/issues/78829"},"limitation of the VSCode Extension API"),".",(0,l.kt)("a",{parentName:"li",href:"#fnref-2",className:"footnote-backref"},"\u21a9")))))}f.isMDXComponent=!0},4184:function(t,e){var n;!function(){"use strict";var a={}.hasOwnProperty;function r(){for(var t=[],e=0;e<arguments.length;e++){var n=arguments[e];if(n){var l=typeof n;if("string"===l||"number"===l)t.push(n);else if(Array.isArray(n)){if(n.length){var i=r.apply(null,n);i&&t.push(i)}}else if("object"===l)if(n.toString===Object.prototype.toString)for(var o in n)a.call(n,o)&&n[o]&&t.push(o);else t.push(n.toString())}}return t.join(" ")}t.exports?(r.default=r,t.exports=r):void 0===(n=function(){return r}.apply(e,[]))||(t.exports=n)}()},2705:function(t,e,n){var a=n(5639).Symbol;t.exports=a},4239:function(t,e,n){var a=n(2705),r=n(9607),l=n(2333),i=a?a.toStringTag:void 0;t.exports=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":i&&i in Object(t)?r(t):l(t)}},1957:function(t,e,n){var a="object"==typeof n.g&&n.g&&n.g.Object===Object&&n.g;t.exports=a},9607:function(t,e,n){var a=n(2705),r=Object.prototype,l=r.hasOwnProperty,i=r.toString,o=a?a.toStringTag:void 0;t.exports=function(t){var e=l.call(t,o),n=t[o];try{t[o]=void 0;var a=!0}catch(u){}var r=i.call(t);return a&&(e?t[o]=n:delete t[o]),r}},2333:function(t){var e=Object.prototype.toString;t.exports=function(t){return e.call(t)}},5639:function(t,e,n){var a=n(1957),r="object"==typeof self&&self&&self.Object===Object&&self,l=a||r||Function("return this")();t.exports=l},1469:function(t){var e=Array.isArray;t.exports=e},7005:function(t){t.exports=function(t){return null!=t&&"object"==typeof t}},7037:function(t,e,n){var a=n(4239),r=n(1469),l=n(7005);t.exports=function(t){return"string"==typeof t||!r(t)&&l(t)&&"[object String]"==a(t)}}}]);