import { VercelRequest, VercelResponse } from '@vercel/node';

export function cors(req: VercelRequest, res: VercelResponse) {
  // 允许的来源，可以是特定域名或 '*' 表示允许所有来源
  res.setHeader('Access-Control-Allow-Origin', '*');

  // 允许的 HTTP 方法
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // 允许的头
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');

  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }

  return false;
}
