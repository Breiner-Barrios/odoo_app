export interface Lead {
    id: number;
    name: string;
    contact_name: string | false;
    email_from: string | false;
    priority: string;
    stage_id: [number, string]; // Odoo devuelve [id, "nombre"] para Many2one
    expected_revenue?: number;
    probability?: number;
    phone?: string | null
}