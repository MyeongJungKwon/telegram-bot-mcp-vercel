import { VercelRequest, VercelResponse } from '@vercel/node';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { z } from 'zod';

// MCP 서버 인스턴스 생성
const mcpServer = new McpServer({
  name: 'Telegram-Bot-API-Server',
  version: '1.0.0',
  description: 'Telegram Bot과 연동된 MCP 서버'
});

// 리소스 정의: API 명세서
mcpServer.resource(
  'api-spec',
  'api-spec://telegram-bot',
  async (uri) => ({
    contents: [{
      uri: uri.href,
      text: JSON.stringify({
        name: 'Telegram Bot API',
        version: '1.0.0',
        description: 'Telegram Bot과 상호작용하기 위한 API',
        endpoints: [
          {
            path: '/webhook',
            method: 'POST',
            description: 'Telegram webhook 수신'
          },
          {
            path: '/mcp',
            method: 'GET',
            description: 'MCP 서버 상태 조회'
          }
        ]
      }, null, 2)
    }]
  })
);

// 도구 1: API 엔드포인트 생성
mcpServer.tool(
  'generate-endpoint',
  {
    path: z.string().describe('API 경로 (예: /api/users)'),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).describe('HTTP 메서드'),
    description: z.string().describe('엔드포인트 설명'),
    parameters: z.array(z.string()).optional().describe('요청 파라미터')
  },
  async ({ path, method, description, parameters = [] }) => {
    const endpoint = {
      path,
      method,
      description,
      parameters,
      createdAt: new Date().toISOString(),
      example: {
        request: method === 'GET' ? 
          `GET ${path}${parameters.length > 0 ? '?' + parameters.join('&') : ''}` :
          `${method} ${path}`,
        response: {
          status: 200,
          data: method === 'POST' ? { id: 1, created: true } : 
                method === 'GET' ? { items: [] } : 
                { updated: true }
        }
      }
    };

    return {
      content: [{
        type: 'text' as const,
        text: `생성된 API 엔드포인트:\n\n` +
              `경로: ${path}\n` +
              `메서드: ${method}\n` +
              `설명: ${description}\n` +
              `파라미터: ${parameters.join(', ') || '없음'}\n\n` +
              `예시:\n${JSON.stringify(endpoint.example, null, 2)}`
      }]
    };
  }
);

// 도구 2: API 분석
mcpServer.tool(
  'analyze-api',
  {
    endpoint: z.string().describe('분석할 API 엔드포인트'),
    data: z.any().optional().describe('분석할 데이터')
  },
  async ({ endpoint, data }) => {
    const analysis = {
      endpoint,
      timestamp: new Date().toISOString(),
      analysis: {
        structure: typeof data === 'object' ? Object.keys(data || {}) : 'primitive',
        dataType: typeof data,
        size: JSON.stringify(data || {}).length,
        complexity: data && typeof data === 'object' ? 
          Object.keys(data).length > 5 ? 'high' : 'low' : 'simple'
      },
      recommendations: [
        '적절한 데이터 검증 추가',
        '에러 핸들링 구현',
        '응답 캐싱 고려',
        '레이트 리미팅 적용'
      ]
    };

    return {
      content: [{
        type: 'text' as const,
        text: `API 분석 결과:\n\n` +
              `엔드포인트: ${endpoint}\n` +
              `데이터 타입: ${analysis.analysis.dataType}\n` +
              `구조: ${analysis.analysis.structure}\n` +
              `복잡도: ${analysis.analysis.complexity}\n` +
              `크기: ${analysis.analysis.size} bytes\n\n` +
              `권장사항:\n${analysis.recommendations.map(r => `- ${r}`).join('\n')}`
      }]
    };
  }
);

// 도구 3: Telegram 메시지 분석
mcpServer.tool(
  'analyze-telegram-message',
  {
    message: z.string().describe('분석할 텔레그램 메시지'),
    userId: z.number().optional().describe('사용자 ID'),
    chatId: z.number().optional().describe('채팅방 ID')
  },
  async ({ message, userId, chatId }) => {
    const analysis = {
      message,
      userId,
      chatId,
      analysis: {
        length: message.length,
        wordCount: message.split(' ').length,
        hasCommand: message.startsWith('/'),
        command: message.startsWith('/') ? message.split(' ')[0] : null,
        sentiment: message.includes('좋') || message.includes('감사') ? 'positive' :
                  message.includes('나쁘') || message.includes('문제') ? 'negative' : 'neutral',
        language: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(message) ? 'korean' : 'english'
      },
      timestamp: new Date().toISOString()
    };

    return {
      content: [{
        type: 'text' as const,
        text: `텔레그램 메시지 분석:\n\n` +
              `메시지: "${message}"\n` +
              `길이: ${analysis.analysis.length}자\n` +
              `단어 수: ${analysis.analysis.wordCount}개\n` +
              `명령어 여부: ${analysis.analysis.hasCommand ? '예' : '아니오'}\n` +
              `${analysis.analysis.command ? `명령어: ${analysis.analysis.command}\n` : ''}` +
              `감정: ${analysis.analysis.sentiment}\n` +
              `언어: ${analysis.analysis.language}\n` +
              `분석 시간: ${analysis.timestamp}`
      }]
    };
  }
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      // MCP 서버 정보 반환
      res.status(200).json({
        name: mcpServer.name,
        version: mcpServer.version,
        description: 'Telegram Bot과 연동된 MCP 서버',
        status: 'active',
        capabilities: {
          resources: ['api-spec'],
          tools: ['generate-endpoint', 'analyze-api', 'analyze-telegram-message']
        },
        timestamp: new Date().toISOString()
      });
    } else if (req.method === 'POST') {
      // MCP 요청 처리 (실제 MCP 클라이언트와의 통신)
      const { method, params } = req.body;
      
      // 간단한 MCP 요청 처리 예시
      if (method === 'tools/list') {
        res.status(200).json({
          tools: [
            {
              name: 'generate-endpoint',
              description: 'API 엔드포인트 생성'
            },
            {
              name: 'analyze-api',
              description: 'API 분석'
            },
            {
              name: 'analyze-telegram-message',
              description: '텔레그램 메시지 분석'
            }
          ]
        });
      } else if (method === 'resources/list') {
        res.status(200).json({
          resources: [
            {
              uri: 'api-spec://telegram-bot',
              name: 'API 명세서',
              description: 'Telegram Bot API 명세서'
            }
          ]
        });
      } else {
        res.status(400).json({ error: 'Unknown method' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('MCP Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}