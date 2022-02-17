module Jekyll
    module WidthFilter

      include Jekyll::Filters::URLFilters

      def width(image, width)
        raise "`image` must be a string - got: #{image.class}" unless image.is_a? String
        raise "`image` may not be empty" unless image.length > 0
        raise "`width` must be an int - got: #{width.class}" unless width.is_a? Integer
        raise "`width` must be positive" unless width > 0

        image = relative_url(image)
        name = File.basename(image, ".*").concat("-", width.to_s, File.extname(image))
        File.join(File.dirname(image), name)
      end
    end
  end

Liquid::Template.register_filter(Jekyll::WidthFilter)
