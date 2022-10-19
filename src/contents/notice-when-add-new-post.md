---
title: 寫給自己看，新增一篇文章時要注意的是
author: Aaron Chen
datetime: 2022-10-20T00:22:19Z
slug: notice-when-add-new-post
featured: false
draft: false
tags:
  - blog
ogImage: ""
description: 一些 frontmatter 的設定
---

## Table of contents


## Frontmatter
[Markdown & MDX 🚀 Astro Documentation](https://docs.astro.build/en/guides/markdown-content/)

Here is the list of frontmatter property for each post.

| Property          | Description                                                                               | Remark                    |
| ----------------- | ----------------------------------------------------------------------------------------- | ------------------------- |
| **_title_**       | Title of the post. (h1)                                                                   | required<sup>\*</sup>     |
| **_description_** | Description of the post. Used in post excerpt and site description of the post.           | default = SITE.desc       |
| **_author_**      | Author of the post.                                                                       | default = SITE.author     |
| **_datetime_**    | Published datetime in ISO 8601 format.                                                    |                           |
| **_slug_**        | Slug for the post. Usually the all lowercase title seperated in `-` instead of whtiespace | default = slugified title |
| **_featured_**    | Whether or not display this post in featured section of home page                         | default = false           |
| **_draft_**       | Mark this post 'unpublished'.                                                             | default = false           |
| **_tags_**        | Related keywords for this post. Written in array yaml format.                             |                           |
| **_ogImage_**     | OG image of the post. Useful for social media sharing and SEO.                            | default = SITE.ogImage    |
|                   |                                                                                           |                           |

給一個 post.md 的 frontmatter example

```yaml
# src/contents/sample-post.md
---
title: The title of the post
author: your name
datetime: 2022-09-21T05:17:19Z
slug: the-title-of-the-post
featured: true
draft: false
tags:
  - some
  - example
  - tags
ogImage: ""
description: This is the example description of the example post.
---
```
## 在文章內新增 TOC

直接在 frontmatter 底下新增一個 `## Table of contents`

```md
---
# some frontmatter
---

Here are some recommendations, tips & ticks for creating new posts in AstroPaper blog theme.

## Table of contents

<!-- the rest of the post -->
```

## Headings
title 會是 h1, 所以內文在寫的時候用 h2 ~ h6 以利 SEO

## image compression
準備好圖片時可以用 tinyPng 來壓圖，raycast 有 plugin 可以直接 call.

## OG Image
如果沒有在 frontmatter 提供 OG image, 那就會用 default-og.png 來使用。OG image 建議的 size 是 1200 x 640 px

