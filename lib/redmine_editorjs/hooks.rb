module RedmineEditorjs
  class Hooks < Redmine::Hook::ViewListener
    def view_layouts_base_html_head(context)
      return '' unless context[:controller]

      settings = Setting.plugin_redmine_editorjs_editor || {}
      controller = context[:controller]
      
      load_assets = false
      if controller.is_a?(IssuesController)
        # 이슈 설명 또는 댓글 중 하나라도 활성화된 경우
        load_assets = settings['replace_issues'] == 'true' || settings['replace_comments'] == 'true'
      elsif controller.is_a?(WikiController)
        load_assets = settings['replace_wiki'] == 'true'
      elsif controller.is_a?(MessagesController)
        load_assets = settings['replace_forums'] == 'true'
      end

      if load_assets
        tags = [
          stylesheet_link_tag('editorjs.css', plugin: 'redmine_editorjs_editor'),
          javascript_include_tag('editorjs-bundle.js', plugin: 'redmine_editorjs_editor')
        ]
        return tags.join("\n").html_safe
      end
      
      ''
    end
  end
end 