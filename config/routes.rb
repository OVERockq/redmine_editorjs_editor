Rails.application.routes.draw do
  # Editor.js 미리보기 및 저장
  post 'projects/:project_id/wiki/:id/preview_editorjs', to: 'wiki#preview_editorjs'
  post 'projects/:project_id/wiki/:id/save_editorjs', to: 'wiki#save_editorjs'
 
  # 첨부 파일 업로드
  post 'attachments/upload', to: 'attachments#upload'
  post 'attachments/fetch', to: 'attachments#fetch'
  post 'attachments/link', to: 'attachments#link'
end 