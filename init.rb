# lib 디렉토리를 load path에 추가
require 'pathname'
plugin_root = Pathname.new(__FILE__).dirname
lib_dir = plugin_root.join('lib')
$LOAD_PATH.unshift(lib_dir.to_s) unless $LOAD_PATH.include?(lib_dir.to_s)

require 'redmine_editorjs'

Redmine::Plugin.register :redmine_editorjs_editor do
  name 'Redmine Editor.js Editor plugin'
  author 'Your Name'
  description 'This is a plugin for Redmine that replaces the default editor with Editor.js'
  version '0.1.0'
  url 'https://github.com/your-username/redmine_editorjs_editor'
  author_url 'https://github.com/alphametrics'

  settings default: {
    'replace_issues' => 'true',
    'replace_wiki' => 'true',
    'replace_forums' => 'true',
    'replace_comments' => 'true'
  }, partial: 'settings/editorjs_settings'

  # Wiki 포맷터로 자체 Formatter 등록
  wiki_format_provider 'Editor.js', RedmineEditorjs::Formatter
  
  # 초기화 코드 추가
  require_dependency 'redmine_editorjs'
  require_dependency 'redmine_editorjs/hooks'
  require_dependency 'redmine_editorjs/application_helper_patch'
end 