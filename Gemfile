source 'https://rubygems.org'

gem 'jekyll', '~> 4.2'

gem 'minima'

# If you have any plugins, put them here!
group :jekyll_plugins do
  # for the feed template, remove when released
  gem 'jekyll-feed', git: 'https://github.com/tugrulates/jekyll-feed', branch: 'dev'
  gem 'jekyll-relative-links'
  gem 'jekyll-responsive-image', git: 'https://github.com/tugrulates/jekyll-responsive-image', branch: 'master'
  gem 'jekyll-seo-tag'
  gem 'jekyll-titles-from-headings'
end

install_if -> { RUBY_PLATFORM =~ %r!mingw|mswin|java! } do
  gem 'tzinfo', '~> 1.2'
  gem 'tzinfo-data'
end

gem 'wdm', '~> 0.1.0', :install_if => Gem.win_platform?
gem 'kramdown-parser-gfm'
gem 'rmagick', '~> 4.0'

