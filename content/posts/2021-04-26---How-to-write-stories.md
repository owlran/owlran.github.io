---
title: How to write stories
date: "2021-04-26T22:40:32.169Z"
template: "post"
draft: false
slug: "how-to-write-stories"
category: "Storybook"
tags:
  - "Storybook"
description: "記錄一下寫 storybook 時要注意哪些事項"
socialImage: "/media/42-line-bible.jpg"
---

# How to write stories
一個 story 會 capture 一個 ui component 的 rendered state. 
這個 function 會根據給定的 arguments 回傳對應的 component state.

<!-- more -->

Props 之於 Vue.js 的關係，會等同 Args 之於 Storybook。

## Where to put stories
component 的 story 會和 source code 放在一塊。

```js
Button.js
Button.stories.js
```

## Component Story Format
### Default export
storybook 是用 default export 來認出這是一個 story.


```JS
// Button.stories.js
import Button from './Button.vue';

export default {
	title: 'Components/Button',
	component: Button,
};
```

### Defining stories
這邊會用 _named_ exports 來定義 story 內的 state.

官方建議這邊用 `UpperCamelCase`

下面例子是去 render 一個在 `primary` state 的 `Button`. 

```js
// Button.stories.js
import Button from './Button.vue';

export default {
	component: Button,
	title: 'Components/Button',
};

export const Primary = () => ({
	components: { Button },
	template: '<Button primary label="Button" />',
});
```

若有多個 state 需要呈現，那就延續著上面接著做下去。

```js
export const Primary = () => ({
  components: { Button },
  template: '<Button background="#ff0" label="Button" />',
});

export const Secondary = () => ({
  components: { Button },
  template: '<Button background="#ff0" label="😄👍😍💯" />',
});

export const Tertiary = () => ({
  components: { Button },
  template: '<Button background="#ff0" label="📚📕📈🤓" />',
});
```

### Using args (推薦這用法)

為 story 定義一個 master template 來優化上述的 code，這個 template 允許您傳入args。
這樣可以減少為每個 story 編寫和維護的 effort 。

```js
// Button.stories.js
import Button from './Button.vue';

export default {
	component: Button,
	title: 'Components/Button',
};

//👇 We create a “template” of how args map to rendering
const Template = (args, { argTypes }) => ({
	components: { Button },
	props: Object.keys(argTypes),
	template: '<Button :background="background" :label="label" />',
});

//👇 Each story then reuses that template
export const Primary = Template.bind({});
Primary.args = { background: '#ff0', label: 'Button' };

export const Secondary = Template.bind({});
Secondary.args = { ...Primary.args, label: '😄👍😍💯' };

export const Tertiary = Template.bind({});
Tertiary.args = { ...Primary.args, label: '📚📕📈🤓' };
```

`Template.bind({})` 這是 copy 一份 template 的寫法。


## Ref
[How to write stories](https://storybook.js.org/docs/vue/writing-stories/introduction)