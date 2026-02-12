import xmlrpc.client
from django.conf import settings
from environ import environ

env = Env()

class OdooService:
    def __init__(self):
        # Odoo Credentials
        self.url = env('ODOO_URL')
        self.db = env('ODOO_DB')
        self.username = env('ODOO_USERNAME')
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

