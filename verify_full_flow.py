import urllib.request
import json
import time

BASE_URL = "http://localhost:8080/api"

def run_test():
    print("🚀 Starting SmartStock System Check...\n")
    errors = []

    # 1. Test Backend Connectivity & Product Listing
    print("1. Checking Connectivity & Products...")
    try:
        with urllib.request.urlopen(f"{BASE_URL}/products") as res:
            if res.status == 200:
                products = json.loads(res.read().decode())
                print(f"✅ Backend Online. Found {len(products)} products.")
                if not products:
                    errors.append("Product list is empty!")
                    return errors
                target_product = products[0]
                print(f"   Target for test: {target_product['name']} (ID: {target_product['id']}, Stock: {target_product['stockQuantity']})")
            else:
                errors.append(f"Product API returned status {res.status}")
                return errors
    except Exception as e:
        errors.append(f"Backend unreachable: {e}")
        return errors

    # 2. Test Login (Mock)
    print("\n2. Testing Login...")
    try:
        data = json.dumps({"mobileNumber": "9999999999"}).encode()
        req = urllib.request.Request(f"{BASE_URL}/auth/login", data=data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as res:
             if res.status == 200:
                 user_data = json.loads(res.read().decode())
                 user_id = user_data['userId']
                 print(f"✅ Login Successful. User ID: {user_id}")
             else:
                 errors.append(f"Login failed with status {res.status}")
                 return errors
    except Exception as e:
        errors.append(f"Login failed: {e}")
        return errors

    # 3. Test Locking (Add to Cart)
    print("\n3. Testing Atomic Locking (Add to Cart)...")
    try:
        lock_data = json.dumps({
            "userId": user_id,
            "productId": target_product['id'],
            "quantity": 1
        }).encode()
        req = urllib.request.Request(f"{BASE_URL}/inventory/lock", data=lock_data, headers={'Content-Type': 'application/json'})
        
        with urllib.request.urlopen(req) as res:
            if res.status == 200:
                lock_res = json.loads(res.read().decode())
                print(f"✅ Stock Locked Successfully. Lock ID: {lock_res['id']}")
            else:
                 errors.append(f"Locking failed with status {res.status}")
    except Exception as e:
        errors.append(f"Locking failed: {e}")

    # 4. Verify Stock Update
    print("\n4. Verifying Real-time Stock Update...")
    try:
        with urllib.request.urlopen(f"{BASE_URL}/products") as res:
            updated_products = json.loads(res.read().decode())
            orig_stock = target_product['stockQuantity']
            new_stock = next(p['stockQuantity'] for p in updated_products if p['id'] == target_product['id'])
            
            if new_stock == orig_stock - 1:
                print(f"✅ Stock updated correctly: {orig_stock} -> {new_stock}")
            else:
                errors.append(f"Stock mismatch! Expected {orig_stock - 1}, got {new_stock}")
    except Exception as e:
        errors.append(f"Verification failed: {e}")

    print("\n" + "="*30)
    if not errors:
        print("🎉 ALL SYSTEMS GO! The code is working perfectly.")
    else:
        print("❌ ERRORS FOUND:")
        for err in errors:
            print(f" - {err}")
    print("="*30)

if __name__ == "__main__":
    run_test()
