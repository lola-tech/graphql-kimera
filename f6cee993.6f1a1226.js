(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{152:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return o})),t.d(n,"metadata",(function(){return i})),t.d(n,"rightToc",(function(){return l})),t.d(n,"default",(function(){return b}));var a=t(2),r=t(9),c=(t(0),t(155)),o={id:"mocking-types-builders",title:"Mocking types with builders",sidebar_label:"Mocking types"},i={id:"mocking-types-builders",title:"Mocking types with builders",description:"Customize mocks for types by defining a builders.",source:"@site/docs/mocking-types-builders.md",permalink:"/graphql-kimera/docs/mocking-types-builders",editUrl:"https://github.com/lola-tech/graphql-kimera/edit/master/packages/graphql-kimera-docs/docs/mocking-types-builders.md",sidebar_label:"Mocking types",sidebar:"docs",previous:{title:"Mocking queries",permalink:"/graphql-kimera/docs/mocking-queries-scenario"},next:{title:"Query Resolvers",permalink:"/graphql-kimera/docs/query-resolvers"}},l=[{value:"Mocking types using builders",id:"mocking-types-using-builders",children:[]},{value:"Scenario mocks take precedence over builder mocks",id:"scenario-mocks-take-precedence-over-builder-mocks",children:[]},{value:"Builders are functions",id:"builders-are-functions",children:[]},{value:"Builders don&#39;t need to mock all fields of a type",id:"builders-dont-need-to-mock-all-fields-of-a-type",children:[]},{value:"Builder field mocks are scenarios",id:"builder-field-mocks-are-scenarios",children:[]}],s={rightToc:l};function b(e){var n=e.components,t=Object(r.a)(e,["components"]);return Object(c.b)("wrapper",Object(a.a)({},s,t,{components:n,mdxType:"MDXLayout"}),Object(c.b)("p",null,Object(c.b)("em",{parentName:"p"},"Customize mocks for types by defining a builders.")),Object(c.b)("div",{className:"admonition admonition-note alert alert--secondary"},Object(c.b)("div",Object(a.a)({parentName:"div"},{className:"admonition-heading"}),Object(c.b)("h5",{parentName:"div"},Object(c.b)("span",Object(a.a)({parentName:"h5"},{className:"admonition-icon"}),Object(c.b)("svg",Object(a.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"}),Object(c.b)("path",Object(a.a)({parentName:"svg"},{fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"})))),"note")),Object(c.b)("div",Object(a.a)({parentName:"div"},{className:"admonition-content"}),Object(c.b)("p",{parentName:"div"},"This page assumes familiarity with the concept of ",Object(c.b)("em",{parentName:"p"},"scenario"),". If you want to learn about scenarios, read the ",Object(c.b)("a",Object(a.a)({parentName:"p"},{href:"/graphql-kimera/docs/mocking-queries-scenario"}),'"Mocking queries"')," section of the docs."))),Object(c.b)("p",null,"Let's start with the following schema:"),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-graphql"}),"type Query {\n  launch: Launch\n  rockets: [Rockets]!\n}\n\ntype Launch {\n  id: ID!\n  site: String\n  rockets: Rocket\n}\n\ntype Rocket {\n  id: ID!\n  name: String\n  type: String\n  fuel: Fuel\n}\n\nenum Fuel {\n  PLASMA\n  ION\n  DILITHIUM\n}\n")),Object(c.b)("p",null,"Defining the following scenario..."),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),'const executableSchema = getExecutableSchema({\n  typeDefs,\n  mockProvidersFn: (context) => ({\n    scenario: {\n      launch: {\n        rockets: [{ name: "Saturn V" }, { fuel: "DILITHIUM" }, {}],\n      },\n      rockets: [{}],\n    },\n  }),\n});\n')),Object(c.b)("p",null,"...will yield the following mocks:"),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-json",metastring:"{7,14}","{7,14}":!0}),'{\n  "data": {\n    "launch": {\n      // ...\n      "rockets": [\n        {\n          "name": "Saturn V",\n          "type": "Mocked String Scalar",\n          "fuel": "PLASMA"\n        },\n        {\n          "name": "Mocked String Scalar",\n          "type": "Mocked String Scalar",\n          "fuel": "DILITHIUM"\n        },\n        {\n          "name": "Mocked String Scalar",\n          "type": "Mocked String Scalar",\n          "fuel": "PLASMA"\n        },\n      ],\n    },\n    "rockets": [{\n        {\n          "name": "Mocked String Scalar",\n          "type": "Mocked String Scalar",\n          "fuel": "PLASMA"\n        },\n    }]\n  }\n}\n')),Object(c.b)("p",null,"What if we wanted to have a way of defining mocks for the ",Object(c.b)("inlineCode",{parentName:"p"},"Rocket")," type once, and have Kimera use those mocks everywhere it encounters the ",Object(c.b)("inlineCode",{parentName:"p"},"Rocket")," type?"),Object(c.b)("p",null,"To do that we'll need to make use of another type of mock provider: the builder."),Object(c.b)("h2",{id:"mocking-types-using-builders"},"Mocking types using builders"),Object(c.b)("p",null,"To add a builder, we'll need to make it part of a ",Object(c.b)("inlineCode",{parentName:"p"},"builders")," object returned from our ",Object(c.b)("inlineCode",{parentName:"p"},"mockProvidersFn")," function."),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js",metastring:'title="Scenario + Builder" {3,10-16}',title:'"Scenario',"+":!0,'Builder"':!0,"{3,10-16}":!0}),'const executableSchema = getExecutableSchema({\n  typeDefs,\n  mockProvidersFn: (context) => ({\n    scenario: {\n      launch: {\n        rockets: [{ name: "Saturn V" }, { fuel: "DILITHIUM" }],\n      },\n      rockets: [{}],\n    },\n    builders: {\n      Rocket: () => ({\n        type: ["Orion", "Apollo"][_.random(0, 1)],\n        name: "Rocket name",\n      }),\n    },\n  }),\n});\n')),Object(c.b)("p",null,"Using the above mock providers will result in:"),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-json",metastring:'title="The scenario takes precedence"',title:'"The',scenario:!0,takes:!0,'precedence"':!0}),'{\n  "data": {\n    "launch": {\n      // ...\n      "rockets": [\n        {\n          "name": "Saturn V", // From scenario\n          "type": "Orion", // From builder\n          "fuel": "PLASMA" // Default. No mock providers definition.\n        },\n        {\n          "name": "Rocket name", // From builder\n          "type": "Orion", // From builder\n          "fuel": "DILITHIUM" // From scenario\n        },\n        {\n          "name": "Rocket name", // From builder\n          "type": "Apollo", // From builder\n          "fuel": "PLASMA" // Default\n        },\n      ],\n    },\n    "rockets": [{\n        {\n          "name": "Rocket Name", // From builder\n          "type": "Apollo", // From builder\n          "fuel": "PLASMA" // Default\n        },\n    }]\n  }\n}\n')),Object(c.b)("p",null,"We will now explain what builders are, and other subtleties of their use."),Object(c.b)("h2",{id:"scenario-mocks-take-precedence-over-builder-mocks"},"Scenario mocks take precedence over builder mocks"),Object(c.b)("p",null,"You may notice in the example above that where fields are mocked in both a builder and in the scenario, ",Object(c.b)("strong",{parentName:"p"},"the scenario mock will take precedence"),"."),Object(c.b)("h2",{id:"builders-are-functions"},"Builders are functions"),Object(c.b)("p",null,"A ",Object(c.b)("strong",{parentName:"p"},"builder is a function")," that's used to build mocks for a specific type."),Object(c.b)("p",null,"You can have multiple builders defined, each for a separate type."),Object(c.b)("p",null,"You define builders on the root of the ",Object(c.b)("inlineCode",{parentName:"p"},"builders")," object just as you would resolvers for types in a resolver map, or the definitions of types in your schema."),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js",metastring:'title="Multiple builders" {4,5,9,13}',title:'"Multiple','builders"':!0,"{4,5,9,13}":!0}),'const executableSchema = getExecutableSchema({\n  // ...\n  mockProvidersFn: (context) => ({\n    builders: {\n      Rocket: () => ({\n        type: ["Orion", "Apollo"][_.random(0, 1)],\n        name: "Rocket name",\n      }),\n      Launch: () => ({\n        site: "Kennedy Space Center"\n        rockets: [{}]\n      }),\n    },\n  })\n});\n')),Object(c.b)("h2",{id:"builders-dont-need-to-mock-all-fields-of-a-type"},"Builders don't need to mock all fields of a type"),Object(c.b)("p",null,Object(c.b)("a",Object(a.a)({parentName:"p"},{href:"/graphql-kimera/docs/mocking-queries-scenario#a-scenario-can-mock-fewer-fields-than-whats-in-the-schema"}),"As with the Query scenario"),", the builder can mock as many or as few fields you need it to."),Object(c.b)("p",null,"These are all valid builders for the ",Object(c.b)("inlineCode",{parentName:"p"},"Rocket")," type."),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),'() => ({\n  type: "Exploration Vessel",\n  name: "Enterprise",\n});\n')),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),'() => ({\n  type: "Exploration Vessel",\n});\n')),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),'() => ({\n  name: "Enterprise",\n});\n')),Object(c.b)("h2",{id:"builder-field-mocks-are-scenarios"},"Builder field mocks are scenarios"),Object(c.b)("div",{className:"admonition admonition-tip alert alert--success"},Object(c.b)("div",Object(a.a)({parentName:"div"},{className:"admonition-heading"}),Object(c.b)("h5",{parentName:"div"},Object(c.b)("span",Object(a.a)({parentName:"h5"},{className:"admonition-icon"}),Object(c.b)("svg",Object(a.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"}),Object(c.b)("path",Object(a.a)({parentName:"svg"},{fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"})))),"tip")),Object(c.b)("div",Object(a.a)({parentName:"div"},{className:"admonition-content"}),Object(c.b)("p",{parentName:"div"},Object(c.b)("strong",{parentName:"p"},"You can think of a builder as a function that returns a collection of mocks for each of a type's fields"),". For example, the ",Object(c.b)("inlineCode",{parentName:"p"},"Rocket")," builder can contain mocks for the ",Object(c.b)("inlineCode",{parentName:"p"},"type")," and / or ",Object(c.b)("inlineCode",{parentName:"p"},"name")," field(s)."))),Object(c.b)("p",null,"The mocks for each of fields in a builder are scenarios. Building on ",Object(c.b)("a",Object(a.a)({parentName:"p"},{href:"/graphql-kimera/docs/mocking-queries-scenario#what-is-the-query-scenario"}),"the ",Object(c.b)("inlineCode",{parentName:"a"},"Query"),' scenario definition from the "Mocking queries"')," section of the docs, a type ",Object(c.b)("inlineCode",{parentName:"p"},"scenario")," is an object that:"),Object(c.b)("ul",null,Object(c.b)("li",{parentName:"ul"},"contains mocks for that specific type;"),Object(c.b)("li",{parentName:"ul"},"has the same structure as the type's object form.")),Object(c.b)("p",null,"For example, these are all valid builders for the ",Object(c.b)("inlineCode",{parentName:"p"},"Launch")," type:"),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),'() => ({\n  site: "Kennedy Space Center"\n  rockets: [{}]\n})\n')),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),'() => ({\n  site: "Kennedy Space Center"\n  rockets: [{ name: "Enterprise" }, {}]\n})\n')),Object(c.b)("pre",null,Object(c.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"() => ({\n  rockets: [{}, {}],\n});\n")),Object(c.b)("p",null,Object(c.b)("a",Object(a.a)({parentName:"p"},{href:"/graphql-kimera/docs/query-resolvers"}),"Next"),", we'll learn how to mock query resolvers."))}b.isMDXComponent=!0},155:function(e,n,t){"use strict";t.d(n,"a",(function(){return p})),t.d(n,"b",(function(){return m}));var a=t(0),r=t.n(a);function c(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){c(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},c=Object.keys(e);for(a=0;a<c.length;a++)t=c[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(a=0;a<c.length;a++)t=c[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var s=r.a.createContext({}),b=function(e){var n=r.a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},p=function(e){var n=b(e.components);return r.a.createElement(s.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.a.createElement(r.a.Fragment,{},n)}},d=r.a.forwardRef((function(e,n){var t=e.components,a=e.mdxType,c=e.originalType,o=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),p=b(t),d=a,m=p["".concat(o,".").concat(d)]||p[d]||u[d]||c;return t?r.a.createElement(m,i(i({ref:n},s),{},{components:t})):r.a.createElement(m,i({ref:n},s))}));function m(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var c=t.length,o=new Array(c);o[0]=d;var i={};for(var l in n)hasOwnProperty.call(n,l)&&(i[l]=n[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,o[1]=i;for(var s=2;s<c;s++)o[s]=t[s];return r.a.createElement.apply(null,o)}return r.a.createElement.apply(null,t)}d.displayName="MDXCreateElement"}}]);