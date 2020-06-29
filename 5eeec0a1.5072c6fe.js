(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{148:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return i})),n.d(t,"rightToc",(function(){return l})),n.d(t,"default",(function(){return m}));var r=n(2),a=n(9),o=(n(0),n(161)),c={id:"query-resolvers",title:"Query Resolvers",sidebar_label:"Query Resolvers"},i={id:"query-resolvers",isDocsHomePage:!1,title:"Query Resolvers",description:"Custom query resolvers are useful for fields with arguments.",source:"@site/docs/query-resolvers.md",permalink:"/graphql-kimera/docs/query-resolvers",editUrl:"https://github.com/lola-tech/graphql-kimera/edit/master/packages/graphql-kimera-docs/docs/query-resolvers.md",sidebar_label:"Query Resolvers",sidebar:"docs",previous:{title:"Mocking types with builders",permalink:"/graphql-kimera/docs/mocking-types-builders"},next:{title:"Mocking Mutations",permalink:"/graphql-kimera/docs/mocking-mutations"}},l=[{value:"<code>mockResolver</code> API",id:"mockresolver-api",children:[]},{value:"<code>mockResolver</code> examples",id:"mockresolver-examples",children:[]}],s={rightToc:l};function m(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},s,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("blockquote",null,Object(o.b)("p",{parentName:"blockquote"},Object(o.b)("em",{parentName:"p"},"Custom query resolvers are useful for fields with arguments."))),Object(o.b)("div",{className:"admonition admonition-note alert alert--secondary"},Object(o.b)("div",Object(r.a)({parentName:"div"},{className:"admonition-heading"}),Object(o.b)("h5",{parentName:"div"},Object(o.b)("span",Object(r.a)({parentName:"h5"},{className:"admonition-icon"}),Object(o.b)("svg",Object(r.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"}),Object(o.b)("path",Object(r.a)({parentName:"svg"},{fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"})))),"note")),Object(o.b)("div",Object(r.a)({parentName:"div"},{className:"admonition-content"}),Object(o.b)("p",{parentName:"div"},"This page assumes familiarity with the concept of ",Object(o.b)("em",{parentName:"p"},"scenario"),". If you want to learn about scenarios, read the ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"/graphql-kimera/docs/mocking-queries-scenario"}),'"Mocking queries"')," section of the docs."))),Object(o.b)("p",null,"Suppose we have a schema with a ",Object(o.b)("inlineCode",{parentName:"p"},"rocket")," query that can be filtered by passing the a rocket ",Object(o.b)("inlineCode",{parentName:"p"},"model")," argument."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-graphql"}),"type Query {\n  rockets(model: String): [Rocket]\n}\n\ntype Rocket {\n  id: ID!\n  name: String\n  model: String\n  fuel: Fuel\n}\n")),Object(o.b)("p",null,"To implement the filtering, Kimera allows us to define resolvers in our scenarios."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-js",metastring:"{15-27}","{15-27}":!0}),"const {\n  getExecutableSchema,\n  mockResolver,\n} = require('@lola-tech/graphql-kimera');\n\nconst schema = `\n  type Query {\n  ...\n`;\n\nconst executableSchema = getExecutableSchema({\n  typeDefs: schema,\n  mockProvidersFn: (context) => ({\n    scenario: {\n      rockets: mockResolver(\n        // First `mockResolver` arg: the resolver factory\n        (store) => (_, { model }) => {\n          // `mocks` is the store containing the mocks for the `rockets` field.\n          const mockedRockets = store.get();\n\n          return model\n            ? mockedRockets.filter((rocket) => rocket.model === model)\n            : mockedRockets;\n        },\n        // Second `mockResolver` arg (optional):  the scenario\n        [{ model: 'Shuttle' }, {}, { model: 'Shuttle' }]\n      ),\n    },\n  }),\n});\n")),Object(o.b)("p",null,"To define a resolver, we use the ",Object(o.b)("inlineCode",{parentName:"p"},"mockResolver")," function imported from the ",Object(o.b)("inlineCode",{parentName:"p"},"@lola-tech/graphql-kimera")," package."),Object(o.b)("h2",{id:"mockresolver-api"},Object(o.b)("inlineCode",{parentName:"h2"},"mockResolver")," API"),Object(o.b)("p",null,Object(o.b)("inlineCode",{parentName:"p"},"mockResolver")," accepts two arguments:"),Object(o.b)("ol",null,Object(o.b)("li",{parentName:"ol"},"The resolver factory function")),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("em",{parentName:"li"},"Function"),": ",Object(o.b)("inlineCode",{parentName:"li"},"(store) => (info, args, ...) => {...}")),Object(o.b)("li",{parentName:"ul"},"The argument to factory function is the field ",Object(o.b)("inlineCode",{parentName:"li"},"store"),": an object that contains the mocked data for the field we are defining the resolver for. The store defines a ",Object(o.b)("inlineCode",{parentName:"li"},"get")," method that returns the mocked data."),Object(o.b)("li",{parentName:"ul"},"The ",Object(o.b)("inlineCode",{parentName:"li"},"store")," ",Object(o.b)("inlineCode",{parentName:"li"},"get")," method accepts an optional ",Object(o.b)("inlineCode",{parentName:"li"},"string")," argument, that represents the path"),Object(o.b)("li",{parentName:"ul"},"You need to always use the ",Object(o.b)("inlineCode",{parentName:"li"},"get")," ",Object(o.b)("inlineCode",{parentName:"li"},"store")," method to retrieve data"),Object(o.b)("li",{parentName:"ul"},"The resolver factory function needs to return a ",Object(o.b)("a",Object(r.a)({parentName:"li"},{href:"/graphql-kimera/docs/glossary#resolver"}),"valid graphql resolver"))),Object(o.b)("ol",{start:2},Object(o.b)("li",{parentName:"ol"},"(Optional) The field scenario")),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"If omitted, the field will be mocked as it would if no scenario was defined for this field."),Object(o.b)("li",{parentName:"ul"},"The mocked data will be set in the field store, which is supplied to the resolver factory function as its argument.")),Object(o.b)("h2",{id:"mockresolver-examples"},Object(o.b)("inlineCode",{parentName:"h2"},"mockResolver")," examples"),Object(o.b)("p",null,"Let's use the following schema:"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-graphql"}),"type Query {\n  launches(site: String!): [Launch]\n}\n\ntype Launch {\n  id: ID!\n  site: String\n  rockets: [Rocket]\n  isBooked: Boolean!\n}\n\ntype Rocket {\n  id: ID!\n  name: String\n  model: String\n  fuel: Fuel\n}\n\nenum Fuel {\n  PLASMA\n  ION\n  DILITHIUM\n}\n")),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-js",metastring:"{5-17}","{5-17}":!0}),"const executableSchema = getExecutableSchema({\n  typeDefs: schema,\n  mockProvidersFn: (context) => ({\n    scenario: {\n      launches: mockResolver(\n        (store) => (_, { site }) => {\n          // Get all launches mocked\n          const launches = store.get();\n\n          // Get rockets from the first launch\n          const firstLaunchRockets = store.get('launches.0.rockets');\n\n          // ...\n        },\n        [{ site: 'Vandenberg Base Space' }, {}, {}, {}, {}]\n      ),\n    },\n    builders: {\n      Launch: () => ({\n        site: 'Kennedy Space Center',\n      }),\n    },\n  }),\n});\n")),Object(o.b)("p",null,Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"/graphql-kimera/docs/mocking-mutations"}),"Next"),", we'll talk about how we can mock Mutations."))}m.isMDXComponent=!0},161:function(e,t,n){"use strict";n.d(t,"a",(function(){return b})),n.d(t,"b",(function(){return d}));var r=n(0),a=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=a.a.createContext({}),m=function(e){var t=a.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},b=function(e){var t=m(e.components);return a.a.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},u=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,c=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),b=m(n),u=r,d=b["".concat(c,".").concat(u)]||b[u]||p[u]||o;return n?a.a.createElement(d,i(i({ref:t},s),{},{components:n})):a.a.createElement(d,i({ref:t},s))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,c=new Array(o);c[0]=u;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:r,c[1]=i;for(var s=2;s<o;s++)c[s]=n[s];return a.a.createElement.apply(null,c)}return a.a.createElement.apply(null,n)}u.displayName="MDXCreateElement"}}]);