# 获取网站图标 API

### 接口描述
获取指定网站的图标（`favicon`）。

---

## 请求方式
- **方法**: `GET`
- **URL**: `https://api.jiangcheng.site/api/favicon`

---

## 请求参数

| 参数名  | 类型   | 是否必填 | 描述                           |
| ------- | ------ | -------- | ------------------------------ |
| `url`   | String | 必填     | 目标网站的 URL 或域名 |

### 示例
#### 完整请求

[https://api.jiangcheng.site/api/favicon?url=github.com](https://api.jiangcheng.site/api/favicon?url=github.com)


### Tip
需要科学上网访问的网站，部署的服务器也需要配置代理或者海外服务器