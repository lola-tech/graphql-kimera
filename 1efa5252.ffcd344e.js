(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{141:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return i})),a.d(t,"metadata",(function(){return o})),a.d(t,"rightToc",(function(){return b})),a.d(t,"default",(function(){return s}));var n=a(2),r=a(9),c=(a(0),a(155)),i={id:"api-get-executable-schema",title:"getExecutableSchema",sidebar_label:"getExecutableSchema"},o={id:"api-get-executable-schema",title:"getExecutableSchema",description:"Returns an executable schema with data that's mocked according to the mock providers that are supplied.",source:"@site/docs/api-get-executable-schema.md",permalink:"/graphql-kimera/docs/api-get-executable-schema",editUrl:"https://github.com/lola-tech/graphql-kimera/edit/master/packages/graphql-kimera-docs/docs/api-get-executable-schema.md",sidebar_label:"getExecutableSchema",sidebar:"docs",previous:{title:"Glossary",permalink:"/graphql-kimera/docs/glossary"},next:{title:"mockResolver",permalink:"/graphql-kimera/docs/api-mock-resolver"}},b=[{value:"API",id:"api",children:[{value:"getExecutableSchema(options)",id:"getexecutableschemaoptions",children:[]}]}],l={rightToc:b};function s(e){var t=e.components,a=Object(r.a)(e,["components"]);return Object(c.b)("wrapper",Object(n.a)({},l,a,{components:t,mdxType:"MDXLayout"}),Object(c.b)("p",null,"Returns an executable schema with data that's mocked according to the ",Object(c.b)("a",Object(n.a)({parentName:"p"},{href:"/graphql-kimera/docs/glossary#mock-providers"}),"mock providers")," that are supplied."),Object(c.b)("pre",null,Object(c.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),'const { getExecutableSchema } = require("@lola-tech/graphql-kimera");\n\nconst executableSchema = getExecutableSchema({\n  typeDefs,\n  mockProvidersFn: () => ({}), // optional\n  mutationResolversFn: () => ({}), // optional\n  mockProviders: {}, // optional\n});\n')),Object(c.b)("h2",{id:"api"},"API"),Object(c.b)("h3",{id:"getexecutableschemaoptions"},"getExecutableSchema(options)"),Object(c.b)("p",null,Object(c.b)("inlineCode",{parentName:"p"},"makeExecutableSchema")," takes a single argument: an object of options. Only the ",Object(c.b)("inlineCode",{parentName:"p"},"typeDefs")," option is required."),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"options"),Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Code"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("a",Object(n.a)({parentName:"td"},{href:"/graphql-kimera/docs/api-get-executable-schema#typedefs"}),Object(c.b)("inlineCode",{parentName:"a"},"typeDefs"),"*")),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("inlineCode",{parentName:"td"},"type Query { ..."))),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("a",Object(n.a)({parentName:"td"},{href:"/graphql-kimera/docs/api-get-executable-schema#mockprovidersfn"}),Object(c.b)("inlineCode",{parentName:"a"},"mockProvidersFn"))),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("inlineCode",{parentName:"td"},"(context) => ({ scenario: ..., builders: ... })"))),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("a",Object(n.a)({parentName:"td"},{href:"/graphql-kimera/docs/api-get-executable-schema#mutationresolversfnstore-buildmocks-context"}),Object(c.b)("inlineCode",{parentName:"a"},"mutationResolversFn"))),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("inlineCode",{parentName:"td"},"(store, buildMocks, context) =>"),Object(c.b)("br",null),"\xa0","\xa0","\xa0","\xa0","\xa0","\xa0",Object(c.b)("inlineCode",{parentName:"td"},"({ [mutationName]: (info, args, ...) => { ... } })"))),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("a",Object(n.a)({parentName:"td"},{href:"/graphql-kimera/docs/api-get-executable-schema#mockproviders"}),Object(c.b)("inlineCode",{parentName:"a"},"mockProviders"))),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("inlineCode",{parentName:"td"},"{ scenario: ..., builders: ... }"))))),Object(c.b)("p",null,"We're now going to go over each option in detail."),Object(c.b)("h4",{id:"typedefs"},Object(c.b)("inlineCode",{parentName:"h4"},"typeDefs"),"*"),Object(c.b)("p",null,Object(c.b)("em",{parentName:"p"},"Required"),". A ",Object(c.b)("a",Object(n.a)({parentName:"p"},{href:"/graphql-kimera/docs/glossary#schema-definition-language"}),"GraphQL schema language string")," that contains the schema definition. Putting it another way, it's what usally resides in your ",Object(c.b)("inlineCode",{parentName:"p"},"schema.graphql")," file."),Object(c.b)("hr",null),Object(c.b)("h4",{id:"mockprovidersfn"},Object(c.b)("inlineCode",{parentName:"h4"},"mockProvidersFn")),Object(c.b)("p",null,Object(c.b)("em",{parentName:"p"},Object(c.b)("inlineCode",{parentName:"em"},"(context) => ({ scenario: ..., builders: ... })"))),Object(c.b)("p",null,Object(c.b)("em",{parentName:"p"},"Optional"),". A function that receives the ",Object(c.b)("a",Object(n.a)({parentName:"p"},{href:"/graphql-kimera/docs/glossary#context"}),"resolver context")," as an argument and needs to return an object containing ",Object(c.b)("a",Object(n.a)({parentName:"p"},{href:"/graphql-kimera/docs/glossary#mock-providers"}),"mock providers")," that Kimera will be using to generate mocks."),Object(c.b)("pre",null,Object(c.b)("code",Object(n.a)({parentName:"pre"},{className:"language-javascript"}),"function mockProvidersFn(context) {\n  const mockProviders = {\n    // 'scenario' has the same structure as the `Query` type\n    scenario: {\n      ...\n    },\n    // `builders` maps GraphQL types to functions which build mocks\n    // for their fields.\n    builders: {\n      Rocket: () => ({ rocketExampleField: ... }),\n      User: () => { ... },\n      ...\n    },\n  };\n\n  return mockProviders;\n}\n")),Object(c.b)("ul",null,Object(c.b)("li",{parentName:"ul"},Object(c.b)("inlineCode",{parentName:"li"},"scenario")," is an object containing the mocks for the ",Object(c.b)("inlineCode",{parentName:"li"},"Query")," type. You can read an in depth explanation of what the scenario is in the ",Object(c.b)("a",Object(n.a)({parentName:"li"},{href:"/graphql-kimera/docs/mocking-queries-scenario#what-is-a-scenario"}),'"What is a scenario?" section of the "Mocking queries" page of the docs'),"."),Object(c.b)("li",{parentName:"ul"},Object(c.b)("inlineCode",{parentName:"li"},"builders")," is an object that maps GraphQL types to functions. You can read more about what how they work in the ",Object(c.b)("a",Object(n.a)({parentName:"li"},{href:"/graphql-kimera/docs/mocking-types-builders#mocking-types-using-builders"}),'"Mocking types"')," section of the docs.")),Object(c.b)("div",{className:"admonition admonition-note alert alert--secondary"},Object(c.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-heading"}),Object(c.b)("h5",{parentName:"div"},Object(c.b)("span",Object(n.a)({parentName:"h5"},{className:"admonition-icon"}),Object(c.b)("svg",Object(n.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"}),Object(c.b)("path",Object(n.a)({parentName:"svg"},{fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"})))),"note")),Object(c.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-content"}),Object(c.b)("p",{parentName:"div"},'"Mock providers" is just another way of saying "the scenario and all of the builders that were defined".'))),Object(c.b)("hr",null),Object(c.b)("h4",{id:"mutationresolversfnstore-buildmocks-context"},Object(c.b)("inlineCode",{parentName:"h4"},"mutationResolversFn(store, buildMocks, context)")),Object(c.b)("p",null,Object(c.b)("em",{parentName:"p"},"Optional"),". A function that returns an object that maps Mutation names to ",Object(c.b)("a",Object(n.a)({parentName:"p"},{href:"https://www.apollographql.com/docs/tutorial/resolvers.html#mutation"}),"resolvers"),"."),Object(c.b)("ul",null,Object(c.b)("li",{parentName:"ul"},Object(c.b)("inlineCode",{parentName:"li"},"store")," is an an object which holds all of the mocks for our schema. It defined two methods:",Object(c.b)("ul",{parentName:"li"},Object(c.b)("li",{parentName:"ul"},Object(c.b)("inlineCode",{parentName:"li"},"store.get(path = '')"),": The ",Object(c.b)("inlineCode",{parentName:"li"},"get")," method will accept an optional ",Object(c.b)("inlineCode",{parentName:"li"},"path")," string, and return the mocked value stored at that specific path."),Object(c.b)("li",{parentName:"ul"},Object(c.b)("inlineCode",{parentName:"li"},"store.update(path, updateValue)"),": The ",Object(c.b)("inlineCode",{parentName:"li"},"update")," method will update the value at the supplied path with the new value. If the updated value is an object, the new value will be deeply merged over the existing value."))),Object(c.b)("li",{parentName:"ul"},Object(c.b)("inlineCode",{parentName:"li"},"buildMocks('TypeName', scenario)")," is a function that mocks a specific type using existing mock providers, and optionally, a custom scenario that we can provide at execution.")),Object(c.b)("p",null,"You can see ",Object(c.b)("a",Object(n.a)({parentName:"p"},{href:"/graphql-kimera/docs/mocking-mutations#mutationresolversfn-api"}),"examples of ",Object(c.b)("inlineCode",{parentName:"a"},"store")," and ",Object(c.b)("inlineCode",{parentName:"a"},"buildMocks"),' in action on the "Mocking Mutations" page'),"."),Object(c.b)("hr",null),Object(c.b)("h4",{id:"mockproviders"},Object(c.b)("inlineCode",{parentName:"h4"},"mockProviders")),Object(c.b)("p",null,Object(c.b)("em",{parentName:"p"},"Optional"),". An object that needs to have the same structure as the result of ",Object(c.b)("inlineCode",{parentName:"p"},"mockProvidersFn"),". These mock providers will overwrite the ones returned by ",Object(c.b)("inlineCode",{parentName:"p"},"mockProvidersFn")," by performing a deep object merge."),Object(c.b)("div",{className:"admonition admonition-note alert alert--secondary"},Object(c.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-heading"}),Object(c.b)("h5",{parentName:"div"},Object(c.b)("span",Object(n.a)({parentName:"h5"},{className:"admonition-icon"}),Object(c.b)("svg",Object(n.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"}),Object(c.b)("path",Object(n.a)({parentName:"svg"},{fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"})))),"note")),Object(c.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-content"}),Object(c.b)("p",{parentName:"div"},"The purpose of this argument is to provide a mechanism to overwrite the default mock providers from outside of our server if need be, e.g. from a React app."))),Object(c.b)("div",{className:"admonition admonition-tip alert alert--success"},Object(c.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-heading"}),Object(c.b)("h5",{parentName:"div"},Object(c.b)("span",Object(n.a)({parentName:"h5"},{className:"admonition-icon"}),Object(c.b)("svg",Object(n.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"}),Object(c.b)("path",Object(n.a)({parentName:"svg"},{fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"})))),"tip")),Object(c.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-content"}),Object(c.b)("p",{parentName:"div"},Object(c.b)("strong",{parentName:"p"},"It's useful to think of these as custom mock provider defintions"),", and the ones defined in ",Object(c.b)("inlineCode",{parentName:"p"},"mockProvidersFn")," as default defintions."))),Object(c.b)("pre",null,Object(c.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"const defaultScenario = {\n  me: {\n    userName: 'c10b10',\n    fullName: 'John Doe'\n    subscribed: true,\n    watchList: [{}, { name: 'Barry Lyndon' }],\n    address: {\n      city: 'Bucharest',\n      country: 'Romania'\n    }\n  },\n};\n\nconst customScenario = {\n  me: {\n    fullName: 'Alex Ciobica',\n    watchList: [],\n    address: {\n      city: 'Cluj-Napoca'\n    }\n  },\n};\n\ngetExecutableSchema(\n  typeDefs,\n  () => ({ scenario: defaultScenario }),\n  { scenario: customScenario },\n  getMutationResolvers\n);\n")),Object(c.b)("p",null,"The code above will result in having the ",Object(c.b)("inlineCode",{parentName:"p"},"me")," query have the following shape:"),Object(c.b)("pre",null,Object(c.b)("code",Object(n.a)({parentName:"pre"},{className:"language-javascript"}),'const defaultScenario = {\n  me: {\n    userName: "c10b10", // Default\n    fullName: "Alex Ciobica", // Custom\n    subscribed: true, // Default\n    watchList: [], // Custom\n    address: {\n      city: "Cluj-Napoca", // Custom\n      country: "Romania", // Default\n    },\n  },\n};\n')),Object(c.b)("div",{className:"admonition admonition-note alert alert--secondary"},Object(c.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-heading"}),Object(c.b)("h5",{parentName:"div"},Object(c.b)("span",Object(n.a)({parentName:"h5"},{className:"admonition-icon"}),Object(c.b)("svg",Object(n.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"}),Object(c.b)("path",Object(n.a)({parentName:"svg"},{fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"})))),"note")),Object(c.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-content"}),Object(c.b)("p",{parentName:"div"},"When merging scenarios the array fields are overwritten, while objects are deeply merged"),Object(c.b)("p",{parentName:"div"},"Builders that collide are replaced with the custom definitition."))))}s.isMDXComponent=!0},155:function(e,t,a){"use strict";a.d(t,"a",(function(){return p})),a.d(t,"b",(function(){return u}));var n=a(0),r=a.n(n);function c(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){c(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function b(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},c=Object.keys(e);for(n=0;n<c.length;n++)a=c[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)a=c[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=r.a.createContext({}),s=function(e){var t=r.a.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},p=function(e){var t=s(e.components);return r.a.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},d=r.a.forwardRef((function(e,t){var a=e.components,n=e.mdxType,c=e.originalType,i=e.parentName,l=b(e,["components","mdxType","originalType","parentName"]),p=s(a),d=n,u=p["".concat(i,".").concat(d)]||p[d]||m[d]||c;return a?r.a.createElement(u,o(o({ref:t},l),{},{components:a})):r.a.createElement(u,o({ref:t},l))}));function u(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var c=a.length,i=new Array(c);i[0]=d;var o={};for(var b in t)hasOwnProperty.call(t,b)&&(o[b]=t[b]);o.originalType=e,o.mdxType="string"==typeof e?e:n,i[1]=o;for(var l=2;l<c;l++)i[l]=a[l];return r.a.createElement.apply(null,i)}return r.a.createElement.apply(null,a)}d.displayName="MDXCreateElement"}}]);