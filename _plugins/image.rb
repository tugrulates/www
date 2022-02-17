module Jekyll
  module ResponsiveImage
    module ImageFilters

      include Jekyll::Filters::URLFilters

      def _path(image)
        raise "`image` must be a string - got: #{image.class}" unless image.is_a? String
        raise "`image` may not be empty" unless image.length > 0

        path = image
        @context.registers[:site].collections.each do |name, meta|
          for doc in meta.files
            if doc.url == relative_url(image)
              path = doc.path
            end
          end
        end

        path
      end

      WIDTHS = [ 40, 80, 120, 160, 320, 640, 960, 1280 ].freeze

      def _best_width(width)
        raise "`width` must be an int - got: #{width.class}" unless width.is_a? Integer
        raise "`width` must be positive" unless width > 0

        WIDTHS.select {|value| value > width }.first
      end

      def width(image, width)
        image = _path(image)
        width = _best_width(width)
        if width
          name = File.basename(image, ".*").concat("-", width.to_s, File.extname(image))
        else
          name = File.basename(image)
        end
        File.join('/images', name)
      end

      def srcset(image, width)
        [1, 2, 3, 4]
          .collect {|dp| "%s %dx" % [ width(image, width * dp), dp ]}
          .join(", ")
      end

      def image(image, cls, width)
        @attributes = {
          'path' => _path(image),
          'class' => cls,
          'src' => image,
          'srcset' => srcset(image, width)
        }
        Renderer.new(@context.registers[:site], @attributes).render_responsive_image
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::ResponsiveImage::ImageFilters)
