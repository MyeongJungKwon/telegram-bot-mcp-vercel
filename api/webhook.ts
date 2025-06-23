import { VercelRequest, VercelResponse } from '@vercel/node';
import { Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

const bot = new Telegraf(process.env.BOT_TOKEN!);

// Bot commands
bot.start((ctx) => {
  ctx.reply(
    '🤖 안녕하세요! Telegram Bot + MCP Server입니다.\n\n' +
    '사용 가능한 명령어:\n' +
    '/help - 도움말 보기\n' +
    '/mcp - MCP 서버 상태 확인\n' +
    '/ping - 서버 응답 테스트'
  );
});

bot.help((ctx) => {
  ctx.reply(
    '📚 도움말\n\n' +
    '이 봇은 Model Context Protocol (MCP) 서버와 연동됩니다.\n\n' +
    '명령어 목록:\n' +
    '/start - 시작하기\n' +
    '/help - 이 도움말\n' +
    '/mcp - MCP 서버 정보\n' +
    '/ping - 서버 상태 확인\n' +
    '/echo [메시지] - 메시지 따라하기'
  );
});

bot.command('mcp', async (ctx) => {
  try {
    // MCP 서버 상태 확인 (실제 구현에서는 MCP 서버와 통신)
    const mcpStatus = {
      status: 'active',
      version: '1.0.0',
      tools: ['generate-endpoint', 'analyze-api'],
      resources: ['api-spec']
    };
    
    ctx.reply(
      '🔧 MCP 서버 상태\n\n' +
      `상태: ${mcpStatus.status}\n` +
      `버전: ${mcpStatus.version}\n` +
      `도구: ${mcpStatus.tools.join(', ')}\n` +
      `리소스: ${mcpStatus.resources.join(', ')}`
    );
  } catch (error) {
    ctx.reply('❌ MCP 서버 상태 확인 중 오류가 발생했습니다.');
  }
});

bot.command('ping', (ctx) => {
  const now = new Date();
  ctx.reply(`🏓 Pong! 서버 시간: ${now.toLocaleString('ko-KR')}`);
});

bot.command('echo', (ctx) => {
  const message = ctx.message.text?.replace('/echo', '').trim();
  if (message) {
    ctx.reply(`📢 ${message}`);
  } else {
    ctx.reply('사용법: /echo [메시지]');
  }
});

// 일반 메시지 처리
bot.on('text', (ctx) => {
  const text = ctx.message.text;
  
  if (!text.startsWith('/')) {
    ctx.reply(
      `받은 메시지: "${text}"\n\n` +
      '명령어를 사용하려면 /help를 입력하세요.'
    );
  }
});

// Error handler
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  if (ctx) {
    ctx.reply('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'POST') {
      // Telegram webhook 처리
      const update: Update = req.body;
      await bot.handleUpdate(update);
      res.status(200).json({ ok: true });
    } else if (req.method === 'GET') {
      // Webhook 설정 정보 반환
      res.status(200).json({
        message: 'Telegram Bot Webhook Endpoint',
        status: 'active',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}