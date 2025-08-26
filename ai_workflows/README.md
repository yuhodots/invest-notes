# AI Content Generator for Investment Blog

GitHub Issues를 통해 AI가 자동으로 투자 블로그 컨텐츠를 생성하고 번역하는 시스템입니다.

## 🚀 작동 방식

1. **이슈 생성**: `content-request` 라벨을 가진 이슈를 생성
2. **AI 컨텐츠 생성**: OpenAI GPT-5를 사용해 한국어 블로그 글 생성
3. **자동 번역**: 생성된 한국어 글을 영어로 번역
4. **파일 생성**: `contents/kor/`와 `contents/eng/`에 마크다운 파일 생성
5. **PR 생성**: 자동으로 Pull Request 생성 및 검토 요청

## 📋 사전 설정

### 1. GitHub Secrets 설정

Repository Settings > Secrets and variables > Actions에서 다음 시크릿을 설정:

```
OPENAI_API_KEY: OpenAI API 키
```

### 2. 라벨 생성

Repository에서 다음 라벨들을 생성하세요:

- `content-request` (필수): 이슈 트리거용
- `auto-processed`: 처리 완료 표시용
- `completed`: 작업 완료 표시용
- `auto-generated`: 자동 생성 컨텐츠 표시용
- `content`: 컨텐츠 관련 표시용

### 3. 의존성 설치 (로컬 테스트용)

```bash
cd ai_workflows
uv sync --locked
```

## 🎯 사용 방법

### 1. GitHub Issues를 통한 자동 생성

1. 새 이슈 생성
2. 제목에 원하는 블로그 주제 입력 (예: "금리 인하 시 주식 주가에 대한 영향?")
3. 본문에 추가 정보나 요구사항 입력 (선택사항)
4. `content-request` 라벨 추가
5. 이슈 생성 → GitHub Actions가 자동으로 실행됨

### 2. 로컬 테스트

#### 한국어 컨텐츠 생성 테스트

```bash
cd ai_workflows
uv run python writer.py \
  --title "금리 인하 시 주식 주가에 대한 영향" \
  --body "상세한 분석이 필요합니다" \
  --output "../contents/kor/2024-01-01-interest-rate-effect.md"
```

#### 번역 테스트

```bash
uv run python translator.py \
  --input "../contents/kor/2024-01-01-interest-rate-effect.md" \
  --output "../contents/eng/2024-01-01-interest-rate-effect.md"
```

## ⚙️ 설정 옵션

### writer.py 옵션

- `--title`: 블로그 포스트 제목 (필수)
- `--body`: 추가 내용이나 요구사항 (선택)
- `--output`: 출력 파일 경로 (필수)
- `--language`: 언어 설정 (기본값: korean)
- `--tags`: 블로그 태그 목록 (선택)

### translator.py 옵션

- `--input`: 번역할 한국어 마크다운 파일 (필수)
- `--output`: 영어 번역 파일 경로 (필수)
