# GitHub 저장소와 연결하기

# 1. GitHub에서 새 저장소 생성 후 다음 명령어 실행:

# 원격 저장소 추가 (GitHub에서 생성한 저장소 URL로 변경)
git remote add origin https://github.com/YOUR_USERNAME/telegram-bot-mcp-vercel.git

# 기본 브랜치를 main으로 변경
git branch -M main

# GitHub에 푸시
git push -u origin main

# 또는 PowerShell에서:
# powershell -Command "Set-Location 'C:\AI\git_prj\telegram-bot-mcp-vercel'; git remote add origin https://github.com/YOUR_USERNAME/telegram-bot-mcp-vercel.git"
# powershell -Command "Set-Location 'C:\AI\git_prj\telegram-bot-mcp-vercel'; git branch -M main"
# powershell -Command "Set-Location 'C:\AI\git_prj\telegram-bot-mcp-vercel'; git push -u origin main"