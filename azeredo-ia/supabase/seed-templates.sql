insert into az_templates (name, body, category) values
  ('Promoção Geral', 'Olá, {{primeiro_nome}}! Temos novidades imperdíveis para {{cidade}}. Entre em contato conosco para conferir as promoções de hoje!', 'promocao'),
  ('Reativação', 'Oi, {{primeiro_nome}}! Há um tempo não nos falamos. Estamos com ótimas condições para a {{cidade}} esta semana. Podemos conversar?', 'reativacao'),
  ('Troca de Tabela', 'Olá, {{primeiro_nome}}! Informamos que nossa tabela de preços foi atualizada. Entre em contato para receber a nova tabela e garantir os melhores preços.', 'tabela'),
  ('Lançamento de Produto', 'Oi, {{primeiro_nome}}! Chegou novidade! Temos produtos novos que combinam com o perfil da {{nome_fantasia}}. Quer saber mais?', 'lancamento'),
  ('Follow-up', 'Olá, {{primeiro_nome}}! Passando para ver se conseguiu analisar nossa proposta. Estou à disposição para qualquer dúvida!', 'follow_up')
on conflict do nothing;
