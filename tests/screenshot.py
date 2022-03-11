"""Run screenshots of the site on different browsers."""

import sys
from argparse import ArgumentParser

from selenium import webdriver
from selenium.webdriver.remote.webdriver import WebDriver


def main() -> None:
    """Initialize webdriver and take screenshots."""
    parser = ArgumentParser(description='Take screenshots.')
    parser.add_argument('--url', default='https://tugrul.blog')
    parser.add_argument('--browser', required=True)
    parser.add_argument('--out', required=True)
    namespace = parser.parse_args(sys.argv[1:])

    if namespace.browser == 'firefox':
        browser = firefox()
    if namespace.browser == 'safari':
        browser = safari()

    browser.get(namespace.url)
    browser.save_screenshot(namespace.out)
    browser.quit()


def firefox() -> WebDriver:
    """Return Firefox driver assuming running on Linux."""
    from selenium.webdriver.firefox.options import Options
    from selenium.webdriver.firefox.service import Service
    options = Options()
    options.add_argument('--headless')
    service = Service()
    return webdriver.Firefox(service=service, options=options)


def safari() -> WebDriver:
    """Return Firefox driver assuming running on Linux."""
    return webdriver.Safari()


if __name__ == '__main__':
    main()
