source 'https://rubygems.org'

require 'json'
require 'open-uri'
versions = JSON.parse(open('https://pages.github.com/versions.json').read)

gem 'github-pages', versions['github-pages'], group: :jekyll_plugins

gem 'minima', '~> 2.5.1'

# If you have any plugins, put them here!
group :jekyll_plugins do
  gem 'jekyll-feed', versions['jekyll-feed']
  gem 'jekyll-remote-theme', versions['jekyll-remote-theme']
end

install_if -> { RUBY_PLATFORM =~ %r!mingw|mswin|java! } do
  gem 'tzinfo', '~> 1.2'
  gem 'tzinfo-data'
end

gem 'wdm', '~> 0.1.0', :install_if => Gem.win_platform?
gem 'kramdown-parser-gfm', versions['kramdown-parser-gfm']

