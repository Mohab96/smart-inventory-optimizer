import requests

url = 'http://127.0.0.1:5000/predict_discount'
files = {
    'purchase': open('Purchase.csv', 'rb'),
    'sales': open('Sales.csv', 'rb')
}

response = requests.post(url, files=files)

try:
    print("Status Code:", response.status_code)
    print("Response:", response.json())
except Exception as e:
    print("❌ Failed to decode JSON. Reason:", e)
    print("Response Text:", response.text)
