module RedmineEditorjs
  module ApplicationHelperPatch
    def textilizable(obj, attr = nil, options = {})
      # 다양한 호출 방식에 대응
      text = if attr.nil? && obj.is_a?(String)
               obj
             elsif obj.respond_to?(attr)
               obj.send(attr)
             else
               ''
             end

      return '' if text.blank?

      # Editor.js JSON 형식인지 확인
      if text.strip.start_with?('{') && text.include?('"blocks"')
        begin
          # 유효한 JSON인지 파싱하여 확인
          parsed = JSON.parse(text)
          if parsed.is_a?(Hash) && parsed.key?('blocks')
            formatter = RedmineEditorjs::Formatter.new(text)
            return formatter.to_html.html_safe
          end
        rescue JSON::ParserError
          # 유효한 JSON이 아니면 기본 포맷터로 처리
        end
      end

      # Editor.js 형식이 아니면 원래의 textilizable 메소드 호출
      super
    end
  end
end

# Rails 환경에 패치 적용
Rails.configuration.to_prepare do
  # 한 번만 적용되도록 보장
  unless ApplicationHelper.included_modules.include?(RedmineEditorjs::ApplicationHelperPatch)
    ApplicationHelper.send(:prepend, RedmineEditorjs::ApplicationHelperPatch)
  end
end 