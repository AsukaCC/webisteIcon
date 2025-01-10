# 获取网站图标 API

### 接口描述
获取指定网站的图标（`favicon`）。

---

## 请求方式
- **方法**: `GET`
- **URL**: `https://api.jiangcheng.site/api/websiteIcon`

---

## 请求参数

| 参数名  | 类型   | 是否必填 | 描述                           |
| ------- | ------ | -------- | ------------------------------ |
| `url`   | String | 必填     | 目标网站的 URL 或域名（不含协议） |

### 示例
#### 完整请求
```http
GET https://api.jiangcheng.site/api/websiteIcon?url=github.com
