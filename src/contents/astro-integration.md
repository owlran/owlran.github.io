---
title: Astro integration
author: Aaron Chen
datetime: 2022-10-19T03:42:51Z
slug: astro-integration
featured: false
draft: false
tags:
  - astro
description:
  "我裝了哪些 Astro integration"
---

## Prefetch

[@astrojs/prefetch 🚀 Astro Documentation](https://docs.astro.build/en/guides/integrations-guide/prefetch/)

### install

```
npm install @astrojs/prefetch
```

```js
import prefetch from "@astrojs/prefetch";

export default {
  // ...
  integrations: [prefetch()],
};
```

Just add rel="prefetch" to any <a /> links on your page and you’re ready to go !

## sitemap

[@astrojs/sitemap 🚀 Astro Documentation](https://docs.astro.build/en/guides/integrations-guide/sitemap/)

### install

```
npm install @astrojs/sitemap
```

```js
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // ...
  integrations: [sitemap()],
});
```

記得要在 config 加入 site

以我的 config 為例

```
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: "dracula",
      wrap: true,
    },
  },
  site: "https://owlran.github.io",
  base: "/",
  integrations: [
    mdx({}),
    tailwind({
      config: { applyBaseStyles: false },
    }),
    image(),
    sitemap(),
    prefetch(),
  ],
});
```

我的 sitemap 會是在 https://owlran.github.io/blog/sitemap-index.xml

### React

```
npm install --save-dev @astrojs/react react react-dom
```

```js
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import sitemap from "@astrojs/sitemap";
import prefetch from '@astrojs/prefetch';
+ import react from '@astrojs/react';

export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: "dracula",
      wrap: true,
    },
  },
  site: "https://owlran.github.io",
  base: "/",
  integrations: [
    +react(),
    mdx({}),
    tailwind({
      config: { applyBaseStyles: false },
    }),
    image(),
    sitemap(),
    prefetch(),
  ],
});

```

新增了一個 React component

```ts
import { useState } from "react";

export default function MyReactComponent() {
  const [counter, setCounter] = useState(0);
  return (
    <div style={{ border: "1px solid red" }}>
      <p>I'm react component</p>
      {counter}
    </div>
  );
}
```

在 footer import 使用

```ts
---
import MyReactComponent from "./MyReactComponent";
const year = new Date().getFullYear();
---

<footer>
  <MyReactComponent />
  <div>
    Copyright &copy; {year}
    </div>
</footer>
```

如果是 interative component 則要考慮讓 astro 載入 JS, 否則預設都會是以 HTML 的形式存在

可參考 [client directive](https://docs.astro.build/en/reference/directives-reference/#client-directives)

```
---
// Example: hydrating framework components in the browser.
import InteractiveButton from '../components/InteractiveButton.jsx';
import InteractiveCounter from '../components/InteractiveCounter.jsx';
---
<!-- This component's JS will begin importing when the page loads -->
<InteractiveButton client:load />

<!-- This component's JS will not be sent to the client until
the user scrolls down and the component is visible on the page -->
<InteractiveCounter client:visible />
```

神奇的是, 我們也可以在 react component 內 import astro component 來使用

```astro
---
import MyReactComponent from "../components/MyReactComponent.jsx";
import MyAstroComponent from "../components/MyAstroComponent.astro";
---

<MyReactComponent>
  <MyAstroComponent slot="name" />
</MyReactComponent>
```
