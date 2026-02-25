import urllib.request
import urllib.error

url = "http://localhost:8080/api/products"
try:
    with urllib.request.urlopen(url) as response:
        print(f"Status: {response.status}")
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(f"Status: {e.code}")
    print(f"Reason: {e.reason}")
    print("Headers:")
    print(e.headers)
    print("Body:")
    print(e.read().decode())
except Exception as e:
    print(f"Error: {e}")
