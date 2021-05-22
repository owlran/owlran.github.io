---
title: 用 Github action 自動 deploy hexo
date: "2020-04-26T22:40:32.169Z"
template: "post"
draft: false
slug: "using-github-action-to-deploy-hexo-blog"
category: "hexo"
tags:
  - "Hexo"
  - "Github action"
description: "透過 Github action 來自動化 Hexo deploy 流程"
socialImage: "/media/42-line-bible.jpg"
---

Hexo 打完文章之後都樣手動下 `hexo g` 產生靜態頁面, 再透過 `hexo d` 來 deploy 到 github page上.

這次希望可以透過 Github action 來簡化這些手動流程, 希望寫完文章就可以自動 deploy 上去.


Github action 每個月可以免費用 2000 分鐘, 對這使用情境而言是綽綽有餘了.

![github_action_price](/media/github_action_price.png)

## hexo 架構

目前我 repo 是由 `master` 來放靜態頁面, 直接透過 github page 來存取 blog

而 `backup` branch 拿來放 hexo 的 source

可以直接從我的 repo 看, [我的repo](https://github.com/owlran/owlran.github.io)

所以我的 Github action 這邊等到 `backup` branch 有東西 push 才會去呼叫後面一連串的動作

## 權限

先透過 `ssh-keygen` 生成 public key, private key 後面兩個步驟會用到

```
ssh-keygen -f deploy-key
```

### Settings > Deploy keys
> settings → Deploy keys → add deploy key

新增一個叫 `DEPLOY_KEY_PUB` 的 deploy key 內容從 `deploy-key.pub` 裡面複製貼上.

### Settings > Secrets
> settings → Secrets → add a new secret

新增一個叫 `DEPLOY_KEY` 的 secret 內容從 `deploy-key` 裡面複製貼上.

## _config.yml 要由 ssh 的方式來做 hexo deploy 
```
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: git
  repository: git@github.com:owlran/owlran.github.io.git
  branch: master
```

## Github action

hexo 的 theme 是用 submodule 的方式來管理, 所以 `Update themes` 那步要記得做

```
name: CI
on:
  push:
    branches:
      - backup 
jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1
      - name: Use Node.js ${{ matrix.node_version }}
        uses: actions/setup-node@v1
        with:
          node_version: ${{ matrix.node_version }}
      - name: Configuration environment
        env:
          DEPLOY_KEY: ${{secrets.DEPLOY_KEY}}
        run: |
          mkdir -p ~/.ssh/
          echo "$DEPLOY_KEY" | tr -d '\r' > ~/.ssh/id_rsa
          echo "$DEPLOY_KEY"
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan github.com >> ~/.ssh/known_hosts
          git config --global user.name "owlran"
          git config --global user.email "owlran1088@gmail.com"
      - name: Update themes
        run: |
          git submodule init
          git submodule update
      - name: Install dependencies
        run: |
          npm i -g hexo-cli
          npm i
      - name: Generate hexo
        run: |
          hexo generate
      - name: Deploy hexo
        run: |
          hexo deploy
```

## Reference
* [Hexo + github actions 自動化部署](https://op30132.github.io/2020/02/05/github-action/)
