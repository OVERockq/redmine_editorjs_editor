import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Checklist from '@editorjs/checklist';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import LinkTool from '@editorjs/link';
import ImageTool from '@editorjs/image';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';

class RedmineEditorJS {
  constructor(element, options = {}) {
    this.element = element;
    this.options = options;
    this.editor = null;
    this.autoSaveTimeout = null;
    
    this.init();
  }

  init() {
    // Editor.js 설정
    const config = {
      holder: this.element,
      tools: {
        header: {
          class: Header,
          config: {
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 2
          }
        },
        list: {
          class: List,
          inlineToolbar: true
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true
        },
        quote: {
          class: Quote,
          inlineToolbar: true
        },
        code: Code,
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: '/attachments/link'
          }
        },
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: '/attachments/upload',
              byUrl: '/attachments/fetch'
            }
          }
        },
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              vimeo: true
            }
          }
        },
        table: {
          class: Table,
          inlineToolbar: true
        },
        marker: Marker,
        inlineCode: InlineCode
      },
      data: this.options.initialData || {},
      onChange: () => {
        this.onContentChange();
      },
      autofocus: true,
      placeholder: '내용을 입력하세요...'
    };

    // Editor.js 인스턴스 생성
    this.editor = new EditorJS(config);

    // 이벤트 리스너 등록
    this.bindEvents();
  }

  bindEvents() {
    // 폼 제출 시 에디터 내용 저장
    const form = this.element.closest('form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.saveContent();
        form.submit();
      });
    }

    // 자동 저장
    if (this.options.autoSave) {
      this.setupAutoSave();
    }
  }

  async onContentChange() {
    // 자동 저장 타이머 재설정
    if (this.options.autoSave) {
      clearTimeout(this.autoSaveTimeout);
      this.autoSaveTimeout = setTimeout(() => {
        this.saveContent();
      }, 3000);
    }

    // 변경 이벤트 발생
    const event = new CustomEvent('editorjs:change', {
      detail: { editor: this }
    });
    this.element.dispatchEvent(event);
  }

  async saveContent() {
    try {
      const data = await this.editor.save();
      
      // 저장 표시기 업데이트
      this.updateSaveIndicator('저장 중...');

      // AJAX로 서버에 저장
      const response = await fetch(this.options.saveUrl || window.location.href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.getCsrfToken()
        },
        body: JSON.stringify({
          content: data
        })
      });

      if (!response.ok) {
        throw new Error('저장 실패');
      }

      this.updateSaveIndicator('저장됨');
    } catch (error) {
      console.error('저장 오류:', error);
      this.updateSaveIndicator('저장 실패');
    }
  }

  updateSaveIndicator(message) {
    let indicator = document.getElementById('save-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'save-indicator';
      this.element.parentNode.insertBefore(indicator, this.element);
    }
    indicator.textContent = message;
    
    // 3초 후 메시지 숨김
    setTimeout(() => {
      indicator.textContent = '';
    }, 3000);
  }

  getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.content;
  }

  setupAutoSave() {
    // 30초마다 자동 저장
    setInterval(() => {
      this.saveContent();
    }, 30000);
  }

  async getContent() {
    return await this.editor.save();
  }

  async setContent(data) {
    await this.editor.render(data);
  }

  destroy() {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
    clearTimeout(this.autoSaveTimeout);
  }
}

// 전역 객체로 등록
window.RedmineEditorJS = RedmineEditorJS;

// DOM이 로드되면 에디터 초기화
document.addEventListener('DOMContentLoaded', () => {
  const editorElements = document.querySelectorAll('.editorjs-editor');
  editorElements.forEach(element => {
    const options = {
      autoSave: element.dataset.autosave !== 'false',
      saveUrl: element.dataset.saveUrl,
      initialData: JSON.parse(element.dataset.content || '{}')
    };
    new RedmineEditorJS(element, options);
  });
}); 