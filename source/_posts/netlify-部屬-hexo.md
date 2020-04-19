---
title: Netlify 部屬 Hexo
date: 2020-04-19T22:49:08.000Z
tags:
  - hexo
  - netlify
categories:
  - ""
comments: true
---
## Netlify 設定

透過 netlify CMS 作為後台可以直接編輯 hexo 建立的 blog.
這邊記錄一下設定的過程.

<!-- more -->

直接到 Netlify 設定 New site from git.

build command 給 `hexo g`

public folder 給 `/public`

### Enable Identity

1. Settings > Identity > Enable Identity
    * 底下有個 Registration, 改成 Invite only
2. Services > Git Gateway > Enable Git Gateway

### Hexo 設定
* netlify build post process
    * 需要在 header 內加入一行 script tag
    * 建立 source/admin/index.html, source/admin/config.yml


#### script tag
```
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
```

#### admin/index.html
```
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
  <meta http-equiv=”X-UA-Compatible” content=”IE=edge,chrome=1″/>
  <meta name="apple-mobile-web-app-status-bar-style" content="white" />
  <title>CMS</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/netlify-cms@2.10.4/dist/cms.css" />
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/netlify-cms@2.10.4/dist/netlify-cms.js"></script>
</body>
</html>
```

#### admin/config.yml
```
backend:
  name: git-gateway
  branch: master # Branch to update (optional; defaults to master)

# This line should *not* be indented
publish_mode: editorial_workflow

# This line should *not* be indented
media_folder: "source/images/uploads" # Media files will be stored in the repo under images/uploads
public_folder: "/images/uploads" # The src attribute for uploaded media will begin with /images/uploads

collections:
  - name: "posts" # Used in routes, e.g., /admin/collections/blog
    label: "Post" # Used in the UI
    folder: "source/_posts" # The path to the folder where the documents are stored
    create: true # Allow users to create new documents in this collection
    slug: "{{slug}}" # Filename template, e.g., YYYY-MM-DD-title.md
    fields: # The fields for each document, usually in front matter
      - {label: "Layout", name: "layout", widget: "hidden", default: "blog"}
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Publish Date", name: "date", widget: "datetime"}
      - {label: "Updated Date", name: "updated", widget: "datetime"}
      - {label: "Featured Image", name: "thumbnail", widget: "string"}
      - {label: "abbrlink", name: "abbrlink", widget: "string"}
      - {label: "Tags", name: "tags", widget: "list"}
      - {label: "Categories", name: "categories", widget: "list"}
      - {label: "TOC", name: "toc", widget: "boolean", default: true}
      - {label: "Body", name: "body", widget: "markdown"}
```

#### config.yml 底下要 skip render
```
skip_render:
  - admin/*
```


### CMS user
* 有個地方可以 invite user, 那邊填入自己信箱.
* 收到信可以設定帳密
* 直接訪問 site/admin 的url, 就可以登入後台了
* 後台可以直接編輯文章.