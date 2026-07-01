// 云函数：baidu-ai-recognize — 调用百度AI通用物体识别
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 百度AI配置 — 优先从环境变量读取，否则使用占位符
const BAIDU_API_KEY = process.env.BAIDU_API_KEY || "__BAIDU_API_KEY__";
const BAIDU_SECRET_KEY = process.env.BAIDU_SECRET_KEY || "__BAIDU_SECRET_KEY__";

// 是否使用 Mock 模式（演示用）
const USE_MOCK = !BAIDU_API_KEY || BAIDU_API_KEY.startsWith("__");

// ====== Mock 识别数据（演示用） ======
const MOCK_RESULTS = [
  { category: "冰箱", brand: "海尔", confidence: 0.92 },
  { category: "洗衣机", brand: "小天鹅", confidence: 0.89 },
  { category: "电视", brand: "海信", confidence: 0.85 },
  { category: "空调", brand: "格力", confidence: 0.91 },
  { category: "电脑", brand: "联想", confidence: 0.78 },
  { category: "手机", brand: "华为", confidence: 0.83 },
  { category: "冰箱", brand: "美的", confidence: 0.87 },
  { category: "洗衣机", brand: "海尔", confidence: 0.94 },
  { category: "空调", brand: "美的", confidence: 0.88 },
  { category: "电视", brand: "TCL", confidence: 0.86 },
  { category: "微波炉", brand: "格兰仕", confidence: 0.90 },
  { category: "热水器", brand: "史密斯", confidence: 0.84 },
];

function getMockResult(imageUrl) {
  // 用 imageUrl 生成确定性索引，同一张图每次结果一致
  let hash = 0;
  const str = imageUrl || String(Date.now());
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % MOCK_RESULTS.length;
  const mock = MOCK_RESULTS[idx];
  return {
    code: 0,
    result: {
      result: [
        { keyword: mock.category, score: mock.confidence },
        { keyword: mock.brand, score: Math.round(mock.confidence * 0.9 * 100) / 100 },
      ],
    },
    _mock: true,   // 标记为 mock 数据
  };
}
// ====== Mock 识别数据 End ======

let accessToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;

  const https = require("https");
  const tokenRes = await new Promise((resolve, reject) => {
    https.get(
      `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${BAIDU_API_KEY}&client_secret=${BAIDU_SECRET_KEY}`,
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error("解析百度AI token响应失败: " + data));
          }
        });
      }
    ).on("error", reject);
  });

  if (tokenRes.error) {
    throw new Error("获取百度AI Token失败: " + (tokenRes.error_description || tokenRes.error));
  }

  accessToken = tokenRes.access_token;
  tokenExpiry = Date.now() + (tokenRes.expires_in - 300) * 1000;
  return accessToken;
}

exports.main = async (event) => {
  const { imageUrl } = event;

  // Mock 模式：API Key 未配置时，返回模拟识别结果（演示用）
  if (USE_MOCK) {
    console.log("[Mock模式] 百度AI API Key 未配置，使用模拟数据");
    // 模拟 1-2 秒识别延迟，让前端 loading 效果更自然
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));
    return getMockResult(imageUrl);
  }

  try {
    const token = await getAccessToken();

    // 调用百度AI通用物体识别
    const https = require("https");
    const result = await new Promise((resolve, reject) => {
      const postData = JSON.stringify({ image: imageUrl, baike_num: 0 });
      const req = https.request(
        {
          hostname: "aip.baidubce.com",
          path: `/rest/2.0/image-classify/v2/advanced_general?access_token=${token}`,
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(new Error("解析百度AI识别响应失败"));
            }
          });
        }
      );
      req.on("error", reject);
      req.write(postData);
      req.end();
    });

    if (result.error_code) {
      return { code: 2, message: "百度AI识别失败: " + result.error_msg };
    }

    return {
      code: 0,
      result: {
        result: result.result || [{ keyword: "未知品类", score: 0 }],
      },
    };
  } catch (err) {
    return {
      code: 3,
      message: "百度AI服务异常: " + (err.message || "未知错误"),
    };
  }
};
