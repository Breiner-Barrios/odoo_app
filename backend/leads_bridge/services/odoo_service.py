import xmlrpc.client
from django.conf import settings
from environ import Env
from pathlib import Path
import os

# Esto obtiene la ruta de la carpeta raíz (donde está el .env)
BASE_DIR = Path(__file__).resolve().parent.parent.parent

env = Env()
# Leemos el .env usando la ruta absoluta
env_file = os.path.join(BASE_DIR, '.env')

if os.path.exists(env_file):
    Env.read_env(env_file)
else:
    # Esto te ayudará a debuggear en la consola si el archivo no se encuentra
    print(f"Archivo .env no encontrado en: {env_file}")

class OdooService:
    def __init__(self):
        # Odoo Credentials
        self.url = env('ODOO_URL')
        self.db = env('ODOO_DB')
        self.username = env('ODOO_USER')
        self.password = env('ODOO_PASSWORD')
        self.commom = xmlrpc.client.ServerProxy(f'{self.url}/xmlrpc/2/common')
        self.models = xmlrpc.client.ServerProxy(f'{self.url}/xmlrpc/2/object')
        self.uid = self._authenticate()

    def _authenticate(self):
        """Autenticación privada para obtener el UID."""
        return self.commom.authenticate(self.db, self.username, self.password, {})

    def get_leads(self):
        """Obtiene leads básicos del modelo crm.lead."""
        fields = ['id', 'name', 'contact_name', 'email_from', 'stage_id', 'priority']
        # search_read combina la búsqueda y la lectura de campos
        leads = self.models.execute_kw(
            self.db, self.uid, self.password,
            'crm.lead', 'search_read',
            [[]],  # Filtro vacío para traer todos por ahora
            {'fields': fields}
        )
        return leads

    def update_lead_stage(self, lead_id, new_stage_id):
        """Actualiza el campo stage_id de un lead."""
        return self.models.execute_kw(
            self.db, self.uid, self.password,
            'crm.lead', 'write',
            [[int(lead_id)], {'stage_id': int(new_stage_id)}]
        )

    def get_stages(self):
        """Obtiene todas las etapas disponibles en el CRM de Odoo."""
        fields = ['id', 'name']
        stages = self.models.execute_kw(
            self.db, self.uid, self.password,
            'crm.stage', 'search_read',
            [[]], 
            {'fields': fields}
        )
        return stages