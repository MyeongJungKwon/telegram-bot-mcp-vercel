import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

// MCP Server Information
const MCP_SERVER_INFO = {
  name: 'Telegram-Bot-API-Server',
  version: '1.0.0',
  description: 'Telegram Bot과 연동된 MCP 서버'
};

// Mock MCP capabilities
const capabilities = {
  tools: {},
  prompts: {},
  resources: {}
};

// API specification resource
const apiSpecResource = {
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
};

// Tool definitions
const tools = [
  {
    name: 'generate-endpoint',
    description: 'API 엔드포인트 생성',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'API 경로 (예: /api/users)'
        },
        method: {
          type: 'string',
          enum: ['GET', 'POST', 'PUT', 'DELETE'],
          description: 'HTTP 메서드'
        },
        description: {
          type: 'string',
          description: '엔드포인트 설명'
        },
        parameters: {
          type: 'array',
          items: { type: 'string' },
          description: '요청 파라미터'
        }
      },
      required: ['path', 'method', 'description']
    }
  },
  {
    name: 'analyze-api',
    description: 'API 분석',
    inputSchema: {
      type: 'object',
      properties: {
        endpoint: {
          type: 'string',
          description: '분석할 API 엔드포인트'
        },
        data: {
          description: '분석할 데이터'
        }
      },
      required: ['endpoint']
    }
  },
  {
    name: 'analyze-telegram-message',
    description: '텔레그램 메시지 분석',
    inputSchema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: '분석할 텔레그램 메시지'
        },
        userId: {
          type: 'number',
          description: '사용자 ID'
        },
        chatId: {
          type: 'number',
          description: '채팅방 ID'
        }
      },
      required: ['message']
    }
  }
];

// Tool execution handlers
const executeGenerateEndpoint = (params: any) => {
  const { path, method, description, parameters = [] } = params;
  
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

  return `생성된 API 엔드포인트:\n\n` +
         `경로: ${path}\n` +
         `메서드: ${method}\n` +
         `설명: ${description}\n` +
         `파라미터: ${parameters.join(', ') || '없음'}\n\n` +
         `예시:\n${JSON.stringify(endpoint.example, null, 2)}`;
};

const executeAnalyzeApi = (params: any) => {
  const { endpoint, data } = params;
  
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

  return `API 분석 결과:\n\n` +
         `엔드포인트: ${endpoint}\n` +
         `데이터 타입: ${analysis.analysis.dataType}\n` +
         `구조: ${analysis.analysis.structure}\n` +
         `복잡도: ${analysis.analysis.complexity}\n` +
         `크기: ${analysis.analysis.size} bytes\n\n` +
         `권장사항:\n${analysis.recommendations.map(r => `- ${r}`).join('\n')}`;
};

const executeAnalyzeTelegramMessage = (params: any) => {
  const { message, userId, chatId } = params;
  
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

  return `텔레그램 메시지 분석:\n\n` +
         `메시지: "${message}"\n` +
         `길이: ${analysis.analysis.length}자\n` +
         `단어 수: ${analysis.analysis.wordCount}개\n` +
         `명령어 여부: ${analysis.analysis.hasCommand ? '예' : '아니오'}\n` +
         `${analysis.analysis.command ? `명령어: ${analysis.analysis.command}\n` : ''}` +
         `감정: ${analysis.analysis.sentiment}\n` +
         `언어: ${analysis.analysis.language}\n` +
         `분석 시간: ${analysis.timestamp}`;
};


export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      // MCP 서버 정보 반환
      res.status(200).json({
        name: MCP_SERVER_INFO.name,
        version: MCP_SERVER_INFO.version,
        description: MCP_SERVER_INFO.description,
        status: 'active',
        capabilities,
        tools: tools.map(tool => ({
          name: tool.name,
          description: tool.description
        })),
        resources: [
          {
            uri: 'api-spec://telegram-bot',
            name: 'API 명세서',
            description: 'Telegram Bot API 명세서'
          }
        ],
        timestamp: new Date().toISOString()
      });
    } else if (req.method === 'POST') {
      // MCP 요청 처리
      const { method, params } = req.body;
      
      if (method === 'initialize') {
        res.status(200).json({
          jsonrpc: '2.0',
          id: req.body.id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities,
            serverInfo: MCP_SERVER_INFO,
            instructions: 'Telegram Bot과 연동된 MCP 서버입니다. /tools/list를 호출하여 사용 가능한 도구를 확인하세요.'
          }
        });
      } else if (method === 'tools/list') {
        res.status(200).json({
          jsonrpc: '2.0',
          id: req.body.id,
          result: {
            tools
          }
        });
      } else if (method === 'tools/call') {
        const { name, arguments: args } = params;
        let result: string;

        switch (name) {
          case 'generate-endpoint':
            result = executeGenerateEndpoint(args);
            break;
          case 'analyze-api':
            result = executeAnalyzeApi(args);
            break;
          case 'analyze-telegram-message':
            result = executeAnalyzeTelegramMessage(args);
            break;
          default:
            return res.status(400).json({
              jsonrpc: '2.0',
              id: req.body.id,
              error: {
                code: -32601,
                message: `Unknown tool: ${name}`
              }
            });
        }

        res.status(200).json({
          jsonrpc: '2.0',
          id: req.body.id,
          result: {
            content: [{
              type: 'text',
              text: result
            }]
          }
        });
      } else if (method === 'resources/list') {
        res.status(200).json({
          jsonrpc: '2.0',
          id: req.body.id,
          result: {
            resources: [
              {
                uri: 'api-spec://telegram-bot',
                name: 'API 명세서',
                description: 'Telegram Bot API 명세서',
                mimeType: 'application/json'
              }
            ]
          }
        });
      } else if (method === 'resources/read') {
        const { uri } = params;
        if (uri === 'api-spec://telegram-bot') {
          res.status(200).json({
            jsonrpc: '2.0',
            id: req.body.id,
            result: {
              contents: [{
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(apiSpecResource, null, 2)
              }]
            }
          });
        } else {
          res.status(404).json({
            jsonrpc: '2.0',
            id: req.body.id,
            error: {
              code: -32602,
              message: `Resource not found: ${uri}`
            }
          });
        }
      } else {
        res.status(400).json({
          jsonrpc: '2.0',
          id: req.body.id,
          error: {
            code: -32601,
            message: `Unknown method: ${method}`
          }
        });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('MCP Server error:', error);
    res.status(500).json({
      jsonrpc: '2.0',
      id: req.body?.id,
      error: {
        code: -32603,
        message: 'Internal error'
      }
    });
  }
}