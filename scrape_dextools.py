from selenium import webdriver
from selenium.webdriver.common.by import By
import time, sys, asyncio

url = sys.argv[1]
# url = "https://www.dextools.io/app/en/ether/pair-explorer/0x19a59f62150586dd5de380f96f34651f1d2044e9"
def scrape_dextools():
    options = webdriver.ChromeOptions()
    # options.add_argument('--headless') # Run the browser in headless mode
    # options.add_argument("--remote-debugging-port=9014")
    # options.add_argument("--user-data-dir=C:\Selenium\Chrome_Profile")
    # options.add_argument("--user-data-dir=C:\\Users\\Administrator\\AppData\\local\\Google\\Chrome\\User Data")
    # options.add_argument('--profile-directory=Default')
    browser = webdriver.Chrome(options=options)

    browser.get(url)
    time.sleep(5)
    
    app = browser.find_element(By.TAG_NAME, "app-audit-providers")
    buy = app.find_element(By.XPATH, "div/div[4]")
    buy = buy.find_element(By.TAG_NAME, "app-audit-value")
    buy = buy.find_element(By.XPATH, "div/span")

    text = buy.get_attribute('innerHTML')
    print(text)
    
    sell = app.find_element(By.XPATH, "div/div[5]")
    sell = sell.find_element(By.TAG_NAME, "app-audit-value")
    sell = sell.find_element(By.XPATH, "div/span")

    text = sell.get_attribute('innerHTML')
    print(text)

scrape_dextools()