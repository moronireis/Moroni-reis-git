interface ContactVars {
  nome_fantasia?: string | null;
  razao_social?: string;
  cidade?: string | null;
  estado?: string | null;
  contato?: string | null;
  segmento?: string | null;
}

export function resolveVariables(template: string, contact: ContactVars): string {
  const name = contact.nome_fantasia || contact.razao_social || '';
  const firstName = name.split(' ')[0] || '';
  const hour = new Date().getHours();
  const periodo = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return template
    .replace(/\{\{nome\}\}/gi, name)
    .replace(/\{\{nome_fantasia\}\}/gi, name)
    .replace(/\{\{primeiro_nome\}\}/gi, firstName)
    .replace(/\{\{cidade\}\}/gi, contact.cidade || '')
    .replace(/\{\{estado\}\}/gi, contact.estado || 'RS')
    .replace(/\{\{contato\}\}/gi, contact.contato || '')
    .replace(/\{\{segmento\}\}/gi, contact.segmento || '')
    .replace(/\{\{periodo_dia\}\}/gi, periodo);
}
