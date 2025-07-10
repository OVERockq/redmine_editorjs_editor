require 'rouge'
require 'htmlentities'

module RedmineEditorjs
  class Formatter
    def initialize(text)
      @text = text
      @coder = HTMLEntities.new
    end

    def to_html
      return '' if @text.blank?

      begin
        data = JSON.parse(@text)
        return CGI.escapeHTML(@text) unless data.is_a?(Hash) && data['blocks'].is_a?(Array)

        html = data['blocks'].map { |block| convert_block(block) }.join
        "<div class='editor_js'>#{html}</div>"
      rescue JSON::ParserError
        CGI.escapeHTML(@text)
      end
    end

    private

    def convert_block(block)
      return '' unless block.is_a?(Hash) && block.key?('type') && block.key?('data')

      case block['type']
      when 'paragraph'
        "<p>#{block['data']['text']}</p>"
      when 'header'
        level = block['data']['level'].to_i
        level = (1..6).cover?(level) ? level : 2
        "<h#{level}>#{block['data']['text']}</h#{level}>"
      when 'list'
        items = block['data']['items'].map { |item| "<li>#{item}</li>" }.join
        tag = block['data']['style'] == 'ordered' ? 'ol' : 'ul'
        "<#{tag}>#{items}</#{tag}>"
      when 'code'
        code = block['data']['code']
        # Use Redmine's Rouge for syntax highlighting
        formatter = Rouge::Formatters::HTML.new
        lexer = Rouge::Lexer.find('plaintext') # find_fancy is better if language is provided
        highlighted_code = formatter.format(lexer.lex(code))
        "<pre class='code'><code>#{highlighted_code}</code></pre>"
      when 'table'
        header = block['data']['withHeadings'] ? block['data']['content'].first : []
        body = block['data']['withHeadings'] ? block['data']['content'].drop(1) : block['data']['content']
        
        thead = "<thead><tr>#{header.map { |cell| "<th>#{cell}</th>" }.join}</tr></thead>" if header.any?
        tbody = "<tbody>#{body.map { |row| "<tr>#{row.map { |cell| "<td>#{cell}</td>" }.join}</tr>" }.join}</tbody>"
        
        "<table>#{thead}#{tbody}</table>"
      else
        '' # Ignore unknown block types
      end
    rescue => e
      '' # Ignore blocks that fail to render
    end
  end
end 