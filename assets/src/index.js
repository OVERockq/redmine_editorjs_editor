import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import CodeTool from '@editorjs/code';
import Table from '@editorjs/table';
import InlineCode from '@editorjs/inline-code';
import LinkTool from '@editorjs/link';
import ImageTool from '@editorjs/image';
import Checklist from '@editorjs/checklist';
import Marker from '@editorjs/marker';

console.log('Editor.js bundle (gem-based) loaded successfully.');

const EditorJSTools = {
  header: { class: Header, inlineToolbar: true },
  list: { class: List, inlineToolbar: true },
  code: CodeTool,
  table: { class: Table, inlineToolbar: true },
  inlineCode: InlineCode,
  linkTool: LinkTool,
  image: ImageTool,
  checklist: { class: Checklist, inlineToolbar: true },
  marker: Marker,
};

function initializeGenericEditor(textArea, containerId) {
  if (document.getElementById(containerId)) return;

  textArea.style.display = 'none';
  const editorContainer = document.createElement('div');
  editorContainer.id = containerId;
  editorContainer.classList.add('editorjs-wrapper');
  textArea.parentNode.insertBefore(editorContainer, textArea);

  let initialData = {};
  const text = textArea.value;

  try {
    if (text && text.trim().startsWith('{')) {
      initialData = JSON.parse(text);
    }
  } catch (e) {
    console.error('Failed to parse initial JSON data:', e);
    initialData = { blocks: [{ type: 'paragraph', data: { text: text || '' } }] };
  }
  
  const editor = new EditorJS({
    holder: editorContainer,
    data: initialData,
    tools: EditorJSTools,
    inlineToolbar: ['link', 'marker', 'bold', 'italic'],
    i18n: {
      direction: 'ltr'
    },
    onChange: async () => {
      try {
        const outputData = await editor.save();
        textArea.value = JSON.stringify(outputData);
      } catch (error) {
        console.error('Editor.js saving to JSON failed: ', error);
      }
    }
  });
}

function attemptToInitialize(textareaId, containerId, retries = 5) {
  const textArea = document.getElementById(textareaId);

  if (textArea) {
    console.log(`Found textarea #${textareaId}, initializing editor.`);
    initializeGenericEditor(textArea, containerId);
  } else if (retries > 0) {
    console.log(`Textarea #${textareaId} not found, retrying... (${retries} retries left)`);
    setTimeout(() => attemptToInitialize(textareaId, containerId, retries - 1), 200);
  } else {
    console.log(`Could not find textarea #${textareaId} after multiple retries.`);
  }
}

function initializeAllEditors() {
  console.log('Attempting to initialize all Editor.js instances...');
  attemptToInitialize('issue_description', 'editorjs-container');
  attemptToInitialize('content_text', 'wiki-editorjs-container');
  attemptToInitialize('issue_notes', 'reply-editorjs-container');
  attemptToInitialize('message_content', 'forum-editorjs-container');
}

document.addEventListener('DOMContentLoaded', initializeAllEditors);
document.addEventListener('turbo:load', initializeAllEditors); 