source 'https://rubygems.org'

gem 'jekyll', '~> 4.2'

gem 'minima'

# If you have any plugins, put them here!
group :jekyll_plugins do
  gem 'jekyll-feed'
  gem 'jekyll-relative-links'
  gem 'jekyll-titles-from-headings'
end

install_if -> { RUBY_PLATFORM =~ %r!mingw|mswin|java! } do
  gem 'tzinfo', '~> 1.2'
  gem 'tzinfo-data'
end

gem 'wdm', '~> 0.1.0', :install_if => Gem.win_platform?
gem 'kramdown-parser-gfm'

