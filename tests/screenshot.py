"""Run screenshots of the site on different browsers."""

import sys
import time
from argparse import ArgumentParser, Namespace

from selenium import webdriver
from selenium.webdriver import Remote


def main() -> None:
    """Initialize webdriver and take screenshots."""
    parser = ArgumentParser(description='Take screenshots.')
    parser.add_argument('--url', default='https://tugrul.blog')
    parser.add_argument('--browser', required=True)
    parser.add_argument('--platform', required=True)
    parser.add_argument('--theme', required=True)
    parser.add_argument('--width', type=int, required=True)
    parser.add_argument('--height', type=int, required=True)
    parser.add_argument('--dpr', type=float, required=True)
    parser.add_argument('--out', required=True)
    namespace = parser.parse_args(sys.argv[1:])

    if namespace.browser == 'chrome':
        browser = chrome(namespace)
    if namespace.browser == 'firefox':
        browser = firefox(namespace)
    if namespace.browser == 'safari':
        browser = safari(namespace)

    browser.set_window_size(namespace.width, namespace.height)
    browser.get(namespace.url)
    time.sleep(3)
    if namespace.theme == 'dark':
        browser.execute_script('javascript:switchLight()')
        time.sleep(1)
        browser.refresh()
        time.sleep(3)
    browser.save_screenshot(namespace.out)
    browser.quit()


def chrome(namespace: Namespace) -> Remote:
    """Return Chrome driver."""
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument(f'--force-device-scale-factor={namespace.dpr}')
    if namespace.platform == 'mobile':
        options.add_argument('--use-mobile-user-agent')
        options.add_experimental_option(
            'mobileEmulation', {
                'deviceMetrics': {
                    'pixelRatio': namespace.dpr
                },
                'userAgent': ('Mozilla/5.0 (Linux; Android 4.2.1; en-us; '
                              'Nexus 5 Build/JOP40D) AppleWebKit/535.19 '
                              '(KHTML, like Gecko) Chrome/18.0.1025.166 '
                              'Mobile Safari/535.19')})
    return webdriver.Chrome(chrome_options=options)


def firefox(namespace: Namespace) -> Remote:
    """Return Firefox driver."""
    options = webdriver.FirefoxOptions()
    options.add_argument('--headless')
    profile = webdriver.FirefoxProfile()
    profile.set_preference('layout.css.devPixelsPerPx', str(namespace.dpr))
    return webdriver.Firefox(options=options, firefox_profile=profile)


def safari(_: Namespace) -> Remote:
    """Return Safari driver assuming running on MacOS."""
    return webdriver.Safari()


if __name__ == '__main__':
    main()