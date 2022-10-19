---
title: Vue test utils cheatsheet
author: Aaron Chen
datetime: 2020-04-29T03:42:51Z
slug: vue-test-utils-cheatsheet
featured: false
draft: false
tags:
  - VueJS 
  - vue-test-utils
description:
  "各種情境底下的 vue-test-utils cheatsheet"
---

## unit test 要測什麼 ？

前陣子組上的新人會問, 到底一個 component 要測些什麼 ? 

寫測試要從使用 component 的角度作為立場, 畢竟 unit test 寫完整份測試文件其實可以拿來作為一個規格

等下一個使用者要用這個 component 時, 把測試檔打開應該可以一目了然用法, 以及要丟什麼 input 會有什麼 output 等等。


那對於 component 而言
* input 應該會有
  * props
  * user action (like click a button)
  * events (from event bus or child emitted)
  * data in Vuex
* 而 output
  * emitted events
  * external function call

## 測試要放哪裡 ?

就我的習慣而言, 我會把測試放在 source code 旁邊, 這樣其他開發者在開發的時候會比較容易看到他們.

![](/media/unit_test_file_closed_source.png)

## describe 的結構

```js
describe('/api/apis', () => {
  describe('error response',() => {
    describe('with 500', () => {
      test('throws error', () => {
        // test

      })
    })
  })
})
```

```js
describe('/api/apis', () => {
  test('throws error when server responds with 500', () => {
    // test
  })
})
```

兩種 describe 的寫法都是在測同個東西, 我比較常用第一種 nested 寫法

有些狀況會比較好看他後續會分成幾條路下去。

## vue-test-utils

### mount vs. shallowMount

兩者的差別會在 mount 會 render 整顆 component tree, 而 shallow mount 只會 render 一層

可以用 Jest snapshot 來看差異

```js
test('renders item', () => {
  const wrapper = mount(Item)
  expect(wrapper.text()).toContain('item')
})
```

```js
import { shallowMount } from '@vue/test-utils'
import Item from '../Item.vue'

describe('Item.vue', () => {
  test('renders item', () => {
    const wrapper = shallowMount(Item)
    expect(wrapper.text()).toContain('item')
  })
})
```

### debug test

我常用 `console.log`, 這邊也可以用 `debugger` 

```js
import { shallowMount } from '@vue/test-utils'
import Item from '../Item.vue'
describe('Item.vue', () => {
  test('renders "item"', () => {
    const wrapper = shallowMount(Item)
    debugger
    expect(wrapper.text()).toContain('item')
  })
})
```

但這邊 node 要確認一下版本。（待補）

```js
"test:unit:debug": "node --inspect-brk ./node_modules/jest/bin/jest.js --no-
     cache --runInBand"
```

### text helper

test text content

```js
import { shallowMount } from '@vue/test-utils'
import Item from '../Item.vue'

describe('Item.vue', () => {
  test('renders item.url', () => {
    const item = {
      url: 10
    }
    const wrapper = shallowMount(Item, {
      propsData: { item }
    })
    expect(wrapper.text()).toContain(item.url)
  })
})
```

### test DOM attribute

```js
test('renders a link to the item.url with item.title as text', () => {
  const item = {
    url: 'http://some-url.com',
    title: 'some-title'
  }
  const wrapper = shallowMount(Item, {
    propsData: { item }
  })
  const a = wrapper.find('a')
  expect(a.attributes().href === item.url).toBe(true)
})
```

### find, findAll

```js
test('renders a link to the item.url with item.title as text',
  () => {  const item = {
    title: 'some title'
  }
  const wrapper = shallowMount(Item, {
    propsData: { item }
  })
  expect(wrapper.find('a').text()).toBe(item.title)
})
```

```js
import Item from '../src/Item.vue'

const wrapper = mount(ItemList)
wrapper.findAll(Item).length
```

### test props

```js
const wrapper = shallowMount(TestComponent)
expect(wrapper.find(ChildComponent).props()
 .propA).toBe('example prop')
```

### test class

```js
import { shallowMount } from '@vue/test-utils'
import ProgressBar from '../ProgressBar.vue'

describe('ProgressBar.vue', () => {
  test('is hidden on initial render', () => {
    const wrapper = shallowMount(ProgressBar)
    expect(wrapper.classes()).toContain('hidden')
  })
})
```

### test style

```js
test('initializes with 0% width', () => {
  const wrapper = shallowMount(ProgressBar)
  expect(wrapper.element.style.width).toBe('0%')
})
```

### test method
```js
test('is hidden when hide is called', () => {
  const wrapper = shallowMount(Popup)
  wrapper.vm.hide()
  expect(wrapper.element.style.display).toBe('none')
})
```

### test timer

```js
jest.useFakeTimers()
setTimeout(() => console.log('100ms are up'), 100)
jest.runTimersToTime(100) // logs 100ms are up
```

```js
beforeEach(() => {
  jest.useFakeTimers()
})
```

```js
test('increases width by 1% every 100ms after start call', () => {
    const wrapper = shallowMount(ProgressBar)
    wrapper.vm.start()
    jest.runTimersToTime(100)
    expect(wrapper.element.style.width).toBe('1%')
    jest.runTimersToTime(900)
    expect(wrapper.element.style.width).toBe('10%')
    jest.runTimersToTime(4000)
    expect(wrapper.element.style.width).toBe('50%')
})
```

## mock code
1. 可以 stop side effect like HTTP calls
2. 可以控制 function 的行為, 以及他要回什麼

### mock vue instance property

```js
shallowMount(ItemList, {
  mocks: {
    $bar: {
      start: () => {}
    }
  }
})
```

### mocking module dependency

可以在同層的目錄, 開個 `__mocks__` 的資料夾, 裡面放個同名的檔

ex: 要 mock api.js 的話, 會在 `src/api/__mocks__/api.js` 去 export mock function.

```js
// src/api/api.js
fetchListData = axios.get(APU_URL);
```

我們可以在 `src/api/__mocks__/api.js` 裡面 mock fetchListData

```js
// src/api/__mocks__/api.js
export const fetchListData = jest.fn(() => Promise.resolve([]))
```

### test async code

* use async / await
```js
test('fetches data', async () => {
  expect.assertions(1)
  const data = await fetchListData()
  expect(data).toBe('some data')
})
```

* 如果待測試的 component 有 call 到 async code, 那我們會辦法去 awawit 他呼叫 async function. 這時候必須要等到 promsie 結束，但我們可以利用 flush-promise 來讓 promise fullfill。

```jsx
test('awaits promises', async () => {
  expect.assertions(1)
  let hasResolved = false
  Promise.resolve().then(() => {
    hasResolved = true
  })
  await flushPromises()

  expect(hasResolved).toBe(true)
})
```

* 若想了解 flush promise 的運作原理, 需要先懂什麼是 microtask queue 和 task queue的差異
  * 可以參考 [https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules).

```
npm install --save-dev flush-promises
```

## Testing events
### test native DOM event
- trigger mouse enter event
    - trigger method 可以模擬 DOM 的 event, ex: input, keydown, mouseup

    ```jsx
    const wrapper = shallowMount(TestComponent)
    wrapper.find('div').trigger('mouseenter')
    ```

    ```jsx
    // modal.vue
    <template>
      <div>
        <button
          @click="onClose"
        />
        <slot />
      </div>
    </template>

    <script>
    export default {
      props: ['onClose']
    }
    </script>
    ```

    ```jsx
    // modal.vue.spec.js
    test('calls onClose when button is clicked', () => {
      const onClose = jest.fn()
      const wrapper = shallowMount(Modal,
        propsData: {
          onClose
        }
      })
      wrapper.find('button').trigger('click')
      expect(onClose).toHaveBeenCalled()
    })
    ```

### Testing custom Vue events

可以用 `emitted` 來測試component 是不是有正確 emit event 出來

```jsx
test('emits on-close when button is clicked', () => {
  const wrapper = shallowMount(Modal)
  wrapper.find('button').trigger('click')
  expect(wrapper.emitted('close-modal')).toHaveLength(1)
})
```

```jsx
// Form.vue
<template>
    <form @submit="onSubmit">
       <button />
    </form>
</template>

<script>

export default {
  methods: {
    onSubmit () {
      this.$emit('form-submitted')
    }
  }
}
</script>
```

```jsx
// Form.vue.spec.js
import Form from '../Form.vue'
import { shallowMount } from '@vue/test-utils'

describe('Form.vue', () => {
  test('emits form-submitted when form is submitted', () => {
    const wrapper = shallowMount(Form)
    wrapper.find('button').trigger('submit')
    expect(wrapper.emitted('form-submitted')).toHaveLength(1)
  })
})
```

上面只有測試 component 有沒有 emit event 出來而已

那可以測試 emit 出來的 event 有人聽嘛 ? 可以

```jsx
<modal
  v-if="displayModal"
  @close-modal="closeModal"
>
```

```jsx
import App from '../App.vue'
import { shallowMount } from '@vue/test-utils'
import Modal from '../components/Modal.vue'

describe('App.vue', () => {
  test('hides Modal when Modal emits close-modal', () => {
    const wrapper = shallowMount(App)
    wrapper.find(Modal).vm.$emit('close-modal')
    expect(wrapper.find(Modal).exists()).toBeFalsy()
  })
})
```

這樣就可以測試, emit 出來時, component 有被正確關掉了

## Testing input elements

```js
test('sends post request with email on submit', () => {
  const axios =
    post: jest.fn()
  }
  const wrapper = shallowMount(Form, {
    mocks: { axios: { post: jest.fn() } }
  })
  const input = wrapper.find('input[type="email"]')
  input.setValue('email@gmail.com')
  wrapper.find('button').trigger('submit')
  const url = 'http://demo7437963.mockable.io/validate'
  const expectedData = expect.objectContaining({
    email: 'email@gmail.com'
  })
  expect(axios.post).toHaveBeenCalledWith(url, expectedData)
})
```

對 input 欄位的重點會是在 input 欄位的 setValue 和 trigger 的使用

### radio button 的測試

```js
test('sends post request with enterCompetition checkbox value on submit', () => {
  const axios = {
    post: jest.fn()
  }
  const wrapper = shallowMount(Form, {
    mocks: {
      axios
    }
  })
  const url = 'http://demo7437963.mockable.io/validate'

  wrapper.find('input[value="no"]').setChecked()
  wrapper.find('button').trigger('submit')

  expect(axios.post).toHaveBeenCalledWith(url, expect.objectContaining({ //
    enterCompetition: false
  }))
})
```

```js
<input
  v-model="enterCompetition"
  value="yes"
  type="radio"
  name="enterCompetition"
/>
<input
  v-model="enterCompetition"
  value="no"
  type="radio"
  name="enterCompetition"
/>
Add enterCompetition to the default object:
data: () => ({
  email: null,
  enterCompetition: 'yes'
}),
```

### 了解 jsdom 的限制

* 因為我們測試是在 node 執行, 所以會透過 jsdom 來模擬整個 DOM 的環境
  * 大部分時間 ok, 但有些時候會遇到一些尚未 implemenet 的 feature
  * 像是 Layout, Navigation
    - Layout: 關於 calculating element position 都屬於 layout 這塊
        - 像是 Element.get-BoundingClientRects 就無法如預期執行
    - Navigation: 像是 form submit 在瀏覽器的預設下, 會發出 GET 然後 reload 頁面. 這邊建議直接用 `.prevent` modifier 來避免這種預設行為就好

  ```jsx
  <form name="email-form" @submit.prevent="onSubmit">
  ```

### Writing unit tests for Vuex store mutations, actions, getters

測試 Vuex store 的一種方法是分別測試state, mutation, action, getter。 

好處是小而集中。 如果單元測試失敗，您將確切知道哪個部分出了問題。

- 測試 mutation

    ```jsx
    setName: (state, { name }) => {
      state.name = name
    }
    ```

    ```jsx
    store.commit('setName', { name: 'Edd' })
    ```

    ```jsx
    src/store/__tests__/mutations.spec.js
    import mutations from '../mutations'

    describe('mutations', () => {
      test('setItems sets state.items to items', () => {
        const items = [{id: 1}, {id: 2}]
        const state = {
          items: []
        }
        mutations.setItems(state, { items })
        expect(state.items).toBe(items)
      })
    })
    ```

- 測試 getter

    ```jsx
    export const getters = {
      inStockProducts: (state) => {
        return state.products.filter(p => p.stock > 0)
      }
    }
    ```

    ```jsx
    test('inStockProducts returns products in stock', () => {
      const state = {
        products: [{stock: 2}, {stock: 0}, {stock: 3}]
      }
      const result = getters.inStockProducts()
      expect(result).toHaveLength(2)
    })
    ```

    ```jsx
    // src/store/__tests__/getters.spec.js
    import getters from '../getters'

    describe('getters', () => {
      test('displayItems returns the first 20 items from state.items', () => {
        const items = Array(21).fill().map((v, i) => i)

        const state = {
          items
        }
        const result = getters.displayItems(state)
        const expectedResult = items.slice(0, 20)
        expect(result).toEqual(expectedResult)
      })
    })
    ```

    - 若有 chained getter 的例子, 則會用 fake state, fake getter 來產出後面 getter 的結果
- 測試 actions

    ```jsx
    import actions from '../actions'
    import { fetchListData } from '../../api/api'
    import flushPromises from 'flush-promises'

    jest.mock('../../api/api')

    describe('actions', () => {
      test('fetchListData calls commit with the result of fetchListData',
        async () => {
        expect.assertions(1)
        const items = [{}, {}]
        const type = 'top'
        fetchListData.mockImplementationOnce(calledWith => {
          return calledWith === type
            ? Promise.resolve(items)
            : Promise.resolve()
        })
        const context = {
          commit: jest.fn()
        }
        actions.fetchListData(context, { type })
        await flushPromises()
        expect(context.commit).toHaveBeenCalledWith('setItems', { items })
      })
    })
    ```

### Writing unit tests for Vuex connected components

- Local vue

```jsx
import { createLocalVue, shallowMount } from '@vue/test-utils'

// ..

const localVue = createLocalVue()
localVue.use(Vuex)

shallowMount(TestComponent, {
  localVue
})
```

```jsx
// mocking $store
// Q: 用這種方式 mock, mapAction 跟 mapGetter 會影響到嘛 (待捕)
const $store = {
    actions: {
        fetchListData: jest.fn()
    }
}
shallowMount(TestComponent, {
    mocks: {
        $store
    }
})
```

```jsx
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import flushPromises from 'flush-promises'
import ItemList from '../ItemList.vue'
import Item from '../../components/Item.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('ItemList.vue', () => {
  let storeOptions
  let store

  beforeEach(() => {
    storeOptions = {
      getters: {
        displayItems: jest.fn()
      },
      actions: {
        fetchListData: jest.fn(() => Promise.resolve())
      }
    }
    store = new Vuex.Store(storeOptions)
  })
})
```

```jsx
test('renders an Item with data for each item in displayItems', () => {
  const $bar = {
    start: () => {},
    finish: () => {}
  }
  const items = [{}, {}, {}]
  storeOptions.getters.displayItems.mockReturnValue(items)
  const wrapper = shallowMount(ItemList, {
    mocks: {$bar},
    localVue,
    store
  })
  const Items = wrapper.findAll(Item)
  expect(Items).toHaveLength(items.length)
  Items.wrappers.forEach((wrapper, i) => {
    expect(wrapper.vm.item).toBe(items[i])
  })
})
```

```jsx
test('dispatches fetchListData with top', async () => {
  expect.assertions(1)
  const $bar = {
    start: () => {},
    finish: () => {}
  }
  store.dispatch = jest.fn(() => Promise.resolve())
  shallowMount(ItemList, {mocks: {$bar}, localVue, store})
  expect(store.dispatch).toHaveBeenCalledWith('fetchListData', {
    type: 'top'
  })
})
```

```jsx
// mocking the action to throw error
test('calls $bar fail when fetchListData throws', async () => {
  expect.assertions(1)
  const $bar = {
    start: jest.fn(),
    fail: jest.fn()
  }
  storeOptions.actions.fetchListData.mockRejectedValue()
  shallowMount(ItemList, {mocks: {$bar}, localVue,
    store})
  await flushPromises()
  expect($bar.fail).toHaveBeenCalled()
})
```

## Organizing tests with factory functions

當測試越寫越多時, 會發現重複的 code 越來越多, 我們可以利用 factory functions 來organize 這些測試避免這種情況。

透過 `_.merge` 來將我們傳進去的 option 合併到 default option 內

```jsx
import _ from 'lodash';

function createStore (overrides) {
  const defaultStoreConfig = {
    getters: {
        displayItems: jest.fn()
      },
      actions: {
        fetchListData: jest.fn(() => Promise.resolve())
      }
    }
    return new Vuex.Store(
      _.mergeWith(defaultStoreConfig, overrides, customizer)
    )
  }
```

用法會像這樣, 只要丟想 overwrite 掉的部份進去就好。

```jsx
test('renders an Item with data for each item in displayItems', () => {
  const $bar = {
    start: () => {},
    finish: () => {}
  }
  const items = [{}, {}, {}]
  const store = createStore({
    getters: {
      displayItems: () => items
    }
  })
  const wrapper = shallowMount(ItemList, {
    mocks: {$bar},
    localVue,
    store
  })
  const Items = wrapper.findAll(Item)

  expect(Items).toHaveLength(items.length)
  Items.wrappers.forEach((wrapper, i) => {
    expect(wrapper.vm.item).toBe(items[i])
  })
})
```

- create wrapper 也可以用相同的方式來包一個 factory function

```jsx
function createWrapper (overrides) {
  const defaultMountingOptions = {
    mocks: {
      $bar: {
        start: jest.fn(),
        finish: jest.fn(),
        fail: jest.fn()
      }
    },
    localVue,
    store: createStore()
  }
  return shallowMount(
    ItemList,
    mergeWith(
      defaultMountingOptions,
      overrides,
      customizer
    )
  )
}
```

用法一：overwrite store

```jsx
test('renders an Item with data for each item in displayItems', () => {
  const items = [{}, {}, {}]
  const store = createStore({
    getters: {
      displayItems: () => items
    }
  })

  const wrapper = createWrapper({ store })
  const Items = wrapper.findAll(Item)
  expect(Items).toHaveLength(items.length)
  Items.wrappers.forEach((wrapper, i) => {
    expect(wrapper.vm.item).toBe(items[i])
  })
})
```

用法二：overwrite props data

```jsx
test('calls onClose prop when clicked', () => {
  const propsData = {
    onClose: jest.fn()
  }
  const wrapper = createWrapper({ propsData })
  wrapper.trigger('click')
  expect(propsData.onClose).toHaveBeenCalled()
})
```

用法三：overwrite mocks

```jsx
test('calls $bar start on render', () => {
  const mocks = {
    $bar: {
      start: jest.fn()
    }
  }
  createWrapper({ mocks })
  expect(mocks.$bar.start).toHaveBeenCalled()
})
```

用法四：mocking action

```jsx
test('dispatches fetchListData with top', async () => {
  const store = createStore()
  store.dispatch = jest.fn(() => Promise.resolve())
  createWrapper({ store })
  await flushPromises()
  expect(store.dispatch).toHaveBeenCalledWith('fetchListData',
      { type: 'top' })
})
```

## Testing mixins and filters

- Using Vue mixins and filters in a project

```jsx
// mixin 這樣用
const logHelloOnCreateMixin = {
  created ()
    console.log('hello')
  }
}

new Vue({
  mixins: [logHelloOnCreateMixin ],
  template: '<div />'
}).$mount()
```

```jsx
import { mount } from '@vue/test-utils'
import { titleMixin } from '../mixins'

describe('titleMixin', () => {
  test('set document.title using component title property', () => {
    const Component = {
      render() {},
      title: 'dummy title',
      mixins: [titleMixin]
    }
    mount(Component)
    expect(document.title).toBe('Vue HN | dummy title')
  })

  test('does not set document.title if title property does not exist', () => {
    document.title = 'some title'
    const Component = {
      render() {},
      mixins: [titleMixin]
    }
    mount(Component)
    expect(document.title).toBe('some title')
  })
})
```

以上, 上面所列的應該可以涵蓋大部分的測試

若未來還有什麼需要補充, 會更正的話會直接在這篇繼續修改。
