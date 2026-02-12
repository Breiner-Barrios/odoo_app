import xmlrpc.client
import os
from environ import Env

# Read env file
env = Env()
Env.read_env()

url = env('ODOO_URL')
db = env('ODOO_DB')
username = env('ODOO_USER')
password = env('ODOO_PASSWORD')

try:
    # Connect to Odoo (authenticate)
    common = xmlrpc.client.ServerProxy(f'{url}/xmlrpc/2/common')
    uid = common.authenticate(db, username, password, {})

    if uid:
        print(f"Login exitoso UID obtenido: {uid}")

        # Connect to Odoo (models)
        models = xmlrpc.client.ServerProxy(f'{url}/xmlrpc/2/object')

        version = common.version()
        print(f"Version de Odoo: {version.get('server_version')}")

    else:
        print("Credenciales Incorrectas")

except Exception as e:
    print(f"Error: {e}")

