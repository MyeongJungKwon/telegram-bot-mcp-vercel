# Vercel 배포 가이드

## 🚀 빠른 배포

### 1. GitHub 저장소 연결

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. "New Project" 클릭
3. GitHub에서 `telegram-bot-mcp-vercel` 저장소 Import
4. 프로젝트 설정:
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 2. 환경변수 설정

Vercel 프로젝트 설정에서 다음 환경변수를 추가하세요:

```
BOT_TOKEN=your_telegram_bot_token_here
WEBHOOK_URL=https://your-vercel-app.vercel.app/webhook
NODE_ENV=production
```

### 3. Telegram Bot 토큰 획득

1. Telegram에서 [@BotFather](https://t.me/BotFather)와 채팅
2. `/newbot` 명령어 입력
3. 봇 이름과 사용자명 설정
4. 받은 토큰을 `BOT_TOKEN`에 설정

### 4. 웹훅 설정

배포 완료 후 다음 URL로 웹훅을 설정하세요:

```bash
# Windows PowerShell
Invoke-RestMethod -Uri "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" -Method Post -ContentType "application/json" -Body '{"url": "https://your-vercel-app.vercel.app/webhook"}'

# 또는 cURL (Git Bash/WSL)
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-vercel-app.vercel.app/webhook"}'
```

### 5. 테스트

1. 배포된 봇과 Telegram에서 채팅
2. `/start` 명령어로 테스트
3. MCP 서버 확인: `https://your-vercel-app.vercel.app/mcp`

## 🔧 고급 설정

### 사용자 정의 도메인

Vercel에서 사용자 정의 도메인을 설정한 경우:

1. `WEBHOOK_URL`을 사용자 정의 도메인으로 변경
2. 웹훅을 다시 설정

### Redis 연동 (선택사항)

영구 저장소가 필요한 경우:

1. [Upstash Redis](https://upstash.com/) 계정 생성
2. Redis 데이터베이스 생성
3. `REDIS_URL` 환경변수 추가

### 모니터링

- Vercel Functions 탭에서 로그 확인
- 오류 발생시 실시간 로그 모니터링

## 🚨 문제해결

### 봇이 응답하지 않는 경우

1. **웹훅 상태 확인:**
   ```bash
   curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
   ```

2. **Vercel 함수 로그 확인:**
   - Vercel Dashboard → Functions → View Function Logs

3. **환경변수 확인:**
   - `BOT_TOKEN`이 올바르게 설정되었는지 확인
   - `WEBHOOK_URL`이 정확한지 확인

### MCP 서버 오류

1. **API 테스트:**
   ```bash
   curl https://your-vercel-app.vercel.app/mcp
   ```

2. **TypeScript 컴파일 오류:**
   - 로컬에서 `npm run build` 실행하여 확인

### 배포 실패

1. **Node.js 버전:** 18.0.0 이상 확인
2. **의존성 문제:** `package.json`의 버전 호환성 확인
3. **빌드 명령어:** Vercel 설정에서 빌드 명령어 확인

## 📊 성능 최적화

- **Cold Start 최소화:** 주기적인 Health Check 요청
- **메모리 사용량 모니터링:** Vercel Analytics 활용
- **응답 시간 최적화:** 불필요한 의존성 제거

더 자세한 문제해결이 필요하면 GitHub Issues를 생성해주세요!