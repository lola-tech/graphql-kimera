(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{142:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return l})),n.d(t,"metadata",(function(){return c})),n.d(t,"rightToc",(function(){return i})),n.d(t,"default",(function(){return p}));var r=n(2),a=n(9),o=(n(0),n(155)),l={id:"setup",title:"Setup",sidebar_label:"Setup"},c={id:"setup",title:"Setup",description:"Install Kimera and a GraphQL server to get started.",source:"@site/docs/setup.md",permalink:"/graphql-kimera/docs/setup",editUrl:"https://github.com/lola-tech/graphql-kimera/edit/master/packages/graphql-kimera-docs/docs/setup.md",sidebar_label:"Setup",sidebar:"docs",previous:{title:"Getting Started",permalink:"/graphql-kimera/docs/getting-started"},next:{title:"Mocking queries",permalink:"/graphql-kimera/docs/mocking-queries-scenario"}},i=[{value:"Installing Kimera",id:"installing-kimera",children:[]},{value:"Using Kimera",id:"using-kimera",children:[]}],s={rightToc:i};function p(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},s,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("blockquote",null,Object(o.b)("p",{parentName:"blockquote"},Object(o.b)("em",{parentName:"p"},"Install Kimera and a GraphQL server to get started."))),Object(o.b)("div",{className:"admonition admonition-note alert alert--secondary"},Object(o.b)("div",Object(r.a)({parentName:"div"},{className:"admonition-heading"}),Object(o.b)("h5",{parentName:"div"},Object(o.b)("span",Object(r.a)({parentName:"h5"},{className:"admonition-icon"}),Object(o.b)("svg",Object(r.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"}),Object(o.b)("path",Object(r.a)({parentName:"svg"},{fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"})))),"note")),Object(o.b)("div",Object(r.a)({parentName:"div"},{className:"admonition-content"}),Object(o.b)("p",{parentName:"div"},"This page walks you through the steps you need to take in order to get a Kimera server working. You can see an ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://github.com/lola-tech/graphql-kimera/tree/master/examples/server"}),"example of a working Kimera server in the GitHub repository"),"."))),Object(o.b)("h3",{id:"installing-kimera"},"Installing Kimera"),Object(o.b)("p",null,"To install Kimera you can install it via npm or yarn, it's totally up to you. We're guessing that you'll most likely want Kimera to be a dev dependency."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-sh"}),"npm install --save-dev @lola-tech/graphql-kimera\n")),Object(o.b)("p",null,"or if you want to use yarn"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-sh"}),"yarn add --dev @lola-tech/graphql-kimera\n")),Object(o.b)("h3",{id:"using-kimera"},"Using Kimera"),Object(o.b)("p",null,"To use Kimera, you'll need a GraphQL server, and the schema definitions."),Object(o.b)("p",null,"We'll use Apollo Server for the server, but any GraphQL server would work. See ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://www.apollographql.com/docs/apollo-server/getting-started/#step-2-install-dependencies"}),"how to install Apollo Server in the Apollo docs"),"."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-javascript",metastring:'title="server.js" {2,26,29}',title:'"server.js"',"{2,26,29}":!0}),'const { ApolloServer, gql } = require("apollo-server");\nconst { getExecutableSchema } = require("@lola-tech/graphql-kimera");\n\nconst schema = gql`\n  type User {\n    id: ID!\n    name: String\n    gender: Gender\n  }\n\n  enum Gender {\n    FEMALE\n    MALE\n    NON_BINARY\n  }\n\n  type Query {\n    me: User\n  }\n\n  schema {\n    query: Query\n  }\n`;\n\nconst executableSchema = getExecutableSchema({ typeDefs: schema });\n\nconst apollo = new ApolloServer({\n  schema: executableSchema,\n  introspection: true,\n});\n\napollo.listen().then(({ url }) => {\n  console.log(`\ud83d\ude80 Server ready at ${url}`);\n});\n')),Object(o.b)("p",null,"Running this code with ",Object(o.b)("inlineCode",{parentName:"p"},"node")," will start a server on ",Object(o.b)("inlineCode",{parentName:"p"},"localhost:4000"),". Visiting the URL will predictably take us to the GraphQL Playground."),Object(o.b)("p",null,"Running the ",Object(o.b)("inlineCode",{parentName:"p"},"me")," query..."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-graphql"}),"query {\n  me {\n    id\n    name\n    gender\n  }\n}\n")),Object(o.b)("p",null,"...will return mocked data:"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-json"}),'{\n  "data": {\n    "me": {\n      "id": "Mocked ID Scalar",\n      "name": "Mocked String Scalar",\n      "gender": "FEMALE"\n    }\n  }\n}\n')),Object(o.b)("p",null,Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"/graphql-kimera/docs/mocking-queries-scenario"})," Next "),", let's see how we can customize those mocks."))}p.isMDXComponent=!0},155:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return d}));var r=n(0),a=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=a.a.createContext({}),p=function(e){var t=a.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},u=function(e){var t=p(e.components);return a.a.createElement(s.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},m=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),u=p(n),m=r,d=u["".concat(l,".").concat(m)]||u[m]||b[m]||o;return n?a.a.createElement(d,c(c({ref:t},s),{},{components:n})):a.a.createElement(d,c({ref:t},s))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,l=new Array(o);l[0]=m;var c={};for(var i in t)hasOwnProperty.call(t,i)&&(c[i]=t[i]);c.originalType=e,c.mdxType="string"==typeof e?e:r,l[1]=c;for(var s=2;s<o;s++)l[s]=n[s];return a.a.createElement.apply(null,l)}return a.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);