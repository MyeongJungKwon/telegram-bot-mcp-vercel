# Telegram Bot + MCP Server on Vercel

Vercel에 배포 가능한 TypeScript 기반 Telegram Bot과 MCP (Model Context Protocol) Server 통합 프로젝트입니다.

## 🚀 특징

- **TypeScript 100%**: 완전한 타입 안정성
- **Vercel 최적화**: 서버리스 환경에 특화
- **MCP 통합**: Model Context Protocol 서버 내장
- **Telegraf 프레임워크**: 강력한 Telegram Bot 기능
- **즉시 배포**: 환경변수 설정만으로 배포 완료

## 📋 사전 요구사항

- Node.js 18.0.0 이상
- Telegram Bot Token
- Vercel 계정

## 🛠️ 설치 및 설정

### 1. 프로젝트 클론

```bash
git clone <your-repo-url>
cd telegram-bot-mcp-vercel
```

### 2. 의존성 설치

```bash
npm install
# 또는
yarn install
```

### 3. 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 편집하여 다음 값들을 설정하세요:

```env
BOT_TOKEN=your_telegram_bot_token_here
WEBHOOK_URL=https://your-vercel-app.vercel.app/webhook
```

### 4. 로컬 개발

```bash
npm run dev
```

## 🚀 Vercel 배포

### 1. Vercel CLI 사용

```bash
# Vercel CLI 설치 (처음만)
npm i -g vercel

# 배포
vercel
```

### 2. GitHub 연동 배포

1. GitHub에 프로젝트 푸시
2. [Vercel Dashboard](https://vercel.com/dashboard)에서 Import
3. 환경변수 설정:
   - `BOT_TOKEN`: Telegram Bot Token
   - `WEBHOOK_URL`: 배포된 URL + /webhook

### 3. 웹훅 설정

배포 완료 후 Telegram에 웹훅을 등록해야 합니다:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-vercel-app.vercel.app/webhook"}'
```

## 🤖 Bot 명령어

- `/start` - 봇 시작 및 환영 메시지
- `/help` - 도움말 보기
- `/mcp` - MCP 서버 상태 확인
- `/ping` - 서버 응답 테스트
- `/echo [메시지]` - 메시지 따라하기

## 🔧 MCP 서버 기능

### 엔드포인트

- `GET /mcp` - MCP 서버 상태 및 정보
- `POST /mcp` - MCP 요청 처리

### 제공 도구

1. **generate-endpoint**: API 엔드포인트 생성
2. **analyze-api**: API 분석
3. **analyze-telegram-message**: 텔레그램 메시지 분석

### 제공 리소스

- **api-spec**: Telegram Bot API 명세서

## 📁 프로젝트 구조

```
telegram-bot-mcp-vercel/
├── api/
│   ├── webhook.ts      # Telegram Bot 웹훅 핸들러
│   └── mcp.ts          # MCP 서버 구현
├── package.json        # 프로젝트 설정
├── tsconfig.json       # TypeScript 설정
├── vercel.json         # Vercel 배포 설정
├── .env.example        # 환경변수 예시
└── README.md           # 프로젝트 문서
```

## 🔍 API 테스트

### Telegram Bot 테스트

봇과 대화하여 기능을 테스트할 수 있습니다.

### MCP 서버 테스트

```bash
# 서버 상태 확인
curl https://your-vercel-app.vercel.app/mcp

# 도구 목록 조회
curl -X POST https://your-vercel-app.vercel.app/mcp \
     -H "Content-Type: application/json" \
     -d '{"method": "tools/list"}'
```

## 🛡️ 보안 고려사항

- BOT_TOKEN은 절대 코드에 하드코딩하지 마세요
- Vercel 환경변수를 통해서만 민감한 정보를 관리하세요
- 프로덕션에서는 웹훅 URL 검증을 추가하세요

## 📚 참고 자료

- [Telegraf Documentation](https://telegraf.js.org/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Vercel Documentation](https://vercel.com/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## ❓ 문제 해결

### 일반적인 문제들

**1. Bot이 응답하지 않는 경우**
- BOT_TOKEN이 올바르게 설정되었는지 확인
- 웹훅이 올바르게 등록되었는지 확인
- Vercel 함수 로그 확인

**2. MCP 서버 오류**
- MCP SDK 버전 호환성 확인
- TypeScript 컴파일 오류 확인

**3. 배포 실패**
- Node.js 버전 확인 (18.0.0 이상)
- 환경변수 설정 확인

더 자세한 도움이 필요하면 Issues를 생성해주세요!