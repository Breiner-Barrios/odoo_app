export interface Stage {
  id: number;
  name: string;
  sequence?: number;
}

export interface Lead {
  id: number;
  name: string;

  stage_id: number;
  stage_name?: string;

  partner_id?: number | null;
  partner_name?: string | null;
}
