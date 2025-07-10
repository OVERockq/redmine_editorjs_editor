# Redmine Editor.js Editor

**버전:** 0.1  
**제작자:** ikkcu (makeit.ikkcu.com)

Redmine의 기본 텍스트 에디터를 현대적인 블록 스타일 편집기인 [Editor.js](https://editorjs.io/)로 대체하는 플러그인입니다.

## 주요 기능

- **현대적인 UI**: 블록 기반의 직관적인 편집 환경을 제공합니다.
- **광범위한 적용**: 이슈, 위키, 게시판, 댓글 등 Redmine의 주요 텍스트 입력 영역에 적용할 수 있습니다.
- **유연한 설정**: 관리자 페이지의 플러그인 설정에서 원하는 영역에만 에디터를 선택적으로 활성화할 수 있습니다.
- **안전한 데이터 저장**: 콘텐츠는 JSON 형식으로 안전하게 데이터베이스에 저장됩니다.
- **코드 구문 강조**: 코드 블록에 대한 구문 강조(Syntax Highlighting)를 지원합니다.

## 설치 방법

1.  **플러그인 다운로드**
    이 저장소를 `redmine/plugins` 디렉토리 아래에 `redmine_editorjs_editor` 라는 이름으로 복제(clone)하거나 다운로드합니다.
    ```bash
    git clone https://your-repository-url.com redmine/plugins/redmine_editorjs_editor
    ```

2.  **자바스크립트 의존성 설치 및 빌드**
    플러그인 디렉토리로 이동하여 `npm` 패키지를 설치하고 자바스크립트 파일을 빌드합니다.
    ```bash
    cd redmine/plugins/redmine_editorjs_editor
    npm install
    npm run build
    ```

3.  **Redmine 재시작**
    변경사항을 적용하기 위해 Redmine 서버를 재시작합니다. Docker를 사용하는 경우, 컨테이너를 재시작해주세요.
    ```bash
    # 예시: Docker Compose 사용 시
    docker-compose restart
    ```

## 설정 방법

1.  Redmine에 관리자 계정으로 로그인합니다.
2.  **관리 > 플러그인** 메뉴로 이동합니다.
3.  목록에서 **Redmine Editor.js Editor plugin**을 찾아 **'설정'** 링크를 클릭합니다.
4.  에디터를 적용하고자 하는 영역(이슈, 위키, 게시판, 댓글)의 체크박스를 선택하고 저장합니다.

## 라이선스

이 플러그인은 [MIT 라이선스](LICENSE)에 따라 배포됩니다. 