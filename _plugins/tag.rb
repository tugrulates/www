module SamplePlugin
    class TagPageGenerator < Jekyll::Generator
      safe true

      def generate(site)
        site.tags.each do |tag, docs|
          site.pages << TagPage.new(site, tag, docs)
        end
      end
    end

    # Subclass of `Jekyll::Page` with custom method definitions.
    class TagPage < Jekyll::Page
      def initialize(site, tag, docs)
        @site = site             # the current site instance.
        @base = site.source      # path to the source directory.
        @dir  = tag              # the directory the page will reside in.

        # All pages have the same filename, so define attributes straight away.
        @basename = '#{tag}'      # filename without the extension.
        @ext      = '.html'       # the extension.
        @name     = '#{tag}.html' # basically @basename + @ext.

        # Initialize data hash with a key pointing to all docs under current tag.
        # This allows accessing the list in a template via `page.docs`.
        @data = {
          'title' => "~/#{tag}",
          'tag'   => tag,
          'docs'  => docs,
          'feed'  => "#{site.config["feed"]["tags"]["path"]}#{tag}.atom"
        }

        # Look up front matter defaults scoped to type `tags`, if given key
        # doesn't exist in the `data` hash.
        data.default_proc = proc do |_, key|
          site.frontmatter_defaults.find(relative_path, :tags, key)
        end
      end

      # Placeholders that are used in constructing page URL.
      def url_placeholders
        {
          :tag        => @dir,
          :basename   => basename,
          :output_ext => output_ext,
        }
      end
    end
  end
