"use strict";(self.webpackChunkdbux_docs=self.webpackChunkdbux_docs||[]).push([[263],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return m}});var o=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,a=function(e,t){if(null==e)return{};var n,o,a={},i=Object.keys(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=o.createContext({}),c=function(e){var t=o.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},u=function(e){var t=c(e.components);return o.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},d=o.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),d=c(n),m=a,h=d["".concat(s,".").concat(m)]||d[m]||p[m]||i;return n?o.createElement(h,r(r({ref:t},u),{},{components:n})):o.createElement(h,r({ref:t},u))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,r=new Array(i);r[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,r[1]=l;for(var c=2;c<i;c++)r[c]=n[c];return o.createElement.apply(null,r)}return o.createElement.apply(null,n)}d.displayName="MDXCreateElement"},6031:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return s},metadata:function(){return c},toc:function(){return u},default:function(){return d}});var o=n(7462),a=n(3366),i=(n(7294),n(3905)),r=["components"],l={},s="FAQ",c={unversionedId:"faq",id:"faq",title:"FAQ",description:"TODO",source:"@site/content/05-faq.mdx",sourceDirName:".",slug:"/faq",permalink:"/dbux/faq",editUrl:"https://github.com/Domiii/dbux/blob/master/docs/content/05-faq.mdx",tags:[],version:"current",sidebarPosition:5,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Build Pipeline Integration",permalink:"/dbux/tools-and-configuration/build-pipeline-integration"}},u=[{value:"It Just Won&#39;t Work!",id:"it-just-wont-work",children:[],level:2},{value:"My Applications don&#39;t Show Up",id:"my-applications-dont-show-up",children:[],level:2},{value:"How to use commands?",id:"how-to-use-commands",children:[],level:2},{value:"Which files will be traced?",id:"which-files-will-be-traced",children:[],level:2}],p={toc:u};function d(e){var t=e.components,n=(0,a.Z)(e,r);return(0,i.kt)("wrapper",(0,o.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"faq"},"FAQ"),(0,i.kt)("p",null,"TODO"),(0,i.kt)("h2",{id:"it-just-wont-work"},"It Just Won't Work!"),(0,i.kt)("p",null,"While technically not a question, this is certainly a frustrating experience to encounter. Please don't hesitate to reach out. We recommend using ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Domiii/dbux/issues"},"our GitHub Issues Page")," to file well-written complaints, or ",(0,i.kt)("a",{parentName:"p",href:"https://discord.gg/QKgq9ZE"},"join us on Discord")," to ask questions or discuss anything you feel like."),(0,i.kt)("h2",{id:"my-applications-dont-show-up"},"My Applications don't Show Up"),(0,i.kt)("p",null,"There is a multitude of possible reasons for things to not quite work out:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"You did not instrument the application. Make sure to use one of the four methods of ",(0,i.kt)("a",{parentName:"li",href:"./using-dbux"},"Running a JavaScript Application w/ Dbux Enabled"),"."),(0,i.kt)("li",{parentName:"ol"},"Your application exited prematurely due to a crash or ",(0,i.kt)("inlineCode",{parentName:"li"},"process.exit")," being called. In that case, Dbux might not have been able to send out the data on time. Usually, this is accompanied by a console message that reads a little like ",(0,i.kt)("inlineCode",{parentName:"li"},'"Process exiting but not all data has been sent out. Analysis will be incomplete. This is probably because of a crash or because process.exit was called manually."'),".",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"Note that some environments (such as ",(0,i.kt)("inlineCode",{parentName:"li"},"Jest"),") might swallow important console messages, which would explain why you were not able to see the message."),(0,i.kt)("li",{parentName:"ul"},"In order to prevent this situation, Dbux tries (rather aggressively) to keep an instrumented application alive. If it does, it would accompany its moves with further log messages. Look for the hints."))),(0,i.kt)("li",{parentName:"ol"},"Your application has an infinite loop or otherwise starves the network queue.",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"Since Dbux relies on the network queue to send data back to the mothership, it requires the code to give up control for that to happen first. Thus, Dbux is not (currently) a good tool to help in dealing with infinite loops or starvation.")))),(0,i.kt)("h2",{id:"how-to-use-commands"},"How to use commands?"),(0,i.kt)("p",null,"Dbux offers ",(0,i.kt)("a",{parentName:"p",href:"/dbux/tools-and-configuration/dbux-code#commands"},"several commands"),". This is how commands work in VSCode:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"Press ",(0,i.kt)("inlineCode",{parentName:"li"},"F1")," or ",(0,i.kt)("inlineCode",{parentName:"li"},"CTRL/Command + Shift + P")),(0,i.kt)("li",{parentName:"ol"},"Search for a command... (type the name or some letters of the name)"),(0,i.kt)("li",{parentName:"ol"},"Select the command (",(0,i.kt)("inlineCode",{parentName:"li"},"Enter"),")"),(0,i.kt)("li",{parentName:"ol"},"See it execute."),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("a",{parentName:"li",href:"https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette"},"Official documentation for VSCode Command Palette"),".",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.google.com/search?q=Official+documentation+for+VSCode+Command+Palette&hl=en"},"(even more info...)"))))),(0,i.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"You can bind commands to keys. ",(0,i.kt)("a",{parentName:"p",href:"https://code.visualstudio.com/docs/getstarted/keybindings"},"This official documentation explains how to easily keybind any command in VSCode"),"."))),(0,i.kt)("h2",{id:"which-files-will-be-traced"},"Which files will be traced?"),(0,i.kt)("p",null,"TODO"))}d.isMDXComponent=!0}}]);