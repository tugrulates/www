Jekyll::Hooks.register :documents, :pre_render do |doc|
    if doc.data['state'] == "public" then
        doc.data['published'] = true
    end
  end
