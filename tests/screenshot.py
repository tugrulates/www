"""Run screenshots of the site on different browsers."""

import logging
import sys
import time
from argparse import ArgumentParser, Namespace

from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver import Remote


def main() -> None:
    """Setup args, logging and run webdriver."""
    logging.basicConfig(format="%(message)s")
    log = logging.getLogger(__name__)

    parser = ArgumentParser(description="Take screenshots.")
    parser.add_argument("--url", default="https://tugrul.blog")
    parser.add_argument("--browser", required=True)
    parser.add_argument("--platform", required=True)
    parser.add_argument("--theme", required=True)
    parser.add_argument("--width", type=int, required=True)
    parser.add_argument("--height", type=int, required=True)
    parser.add_argument("--dpr", type=float, required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--retries", type=int, default=1)
    namespace = parser.parse_args(sys.argv[1:])

    for i in range(namespace.retries):
        try:
            screenshot(namespace)
            sys.exit(0)
        except WebDriverException as err:
            log.error("Webdriver error: %s", err.msg)
            log.warning("%d retries left", namespace.retries - i - 1)
    sys.exit(1)


def screenshot(namespace: Namespace) -> None:
    """Initialize webdriver and take screenshots."""
    if namespace.browser == "chrome":
        browser = chrome(namespace)
    if namespace.browser == "firefox":
        browser = firefox(namespace)
    if namespace.browser == "safari":
        browser = safari(namespace)
    browser.set_window_size(namespace.width, namespace.height)
    browser.get(namespace.url)
    time.sleep(3)
    if namespace.theme == "dark":
        browser.find_element_by_id("light-switch").click()
    #     browser.execute_script("javascript:switchLight()")
    #     time.sleep(1)
    #     browser.refresh()
    #     time.sleep(3)
    browser.save_screenshot(namespace.out)
    browser.quit()


def chrome(namespace: Namespace) -> Remote:
    """Return Chrome driver."""
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument(f"--force-device-scale-factor={namespace.dpr}")
    if namespace.platform == "mobile":
        options.add_argument("--use-mobile-user-agent")
        options.add_experimental_option(
            "mobileEmulation",
            {
                "deviceMetrics": {"pixelRatio": namespace.dpr},
                "userAgent": (
                    "Mozilla/5.0 (Linux; Android 4.2.1; en-us; "
                    "Nexus 5 Build/JOP40D) AppleWebKit/535.19 "
                    "(KHTML, like Gecko) Chrome/18.0.1025.166 "
                    "Mobile Safari/535.19"
                ),
            },
        )
    return webdriver.Chrome(options=options)


def firefox(namespace: Namespace) -> Remote:
    """Return Firefox driver."""
    options = webdriver.FirefoxOptions()
    options.add_argument("--headless")
    options.set_preference("layout.css.devPixelsPerPx", str(namespace.dpr))
    return webdriver.Firefox(options=options)


def safari(_: Namespace) -> Remote:
    """Return Safari driver assuming running on MacOS."""
    return webdriver.Safari()


if __name__ == "__main__":
    main()
