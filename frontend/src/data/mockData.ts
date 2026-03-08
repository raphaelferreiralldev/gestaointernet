import type { Client, Plan, Invoice, Ticket, NetworkEvent } from '../types';

export const plans: Plan[] = [
  { id: 'p1', name: 'Basico 50MB', download: 50, upload: 25, price: 79.90, clientCount: 142, technology: 'Fibra', active: true },
  { id: 'p2', name: 'Essencial 100MB', download: 100, upload: 50, price: 99.90, clientCount: 287, technology: 'Fibra', active: true },
  { id: 'p3', name: 'Plus 200MB', download: 200, upload: 100, price: 129.90, clientCount: 198, technology: 'Fibra', active: true },
  { id: 'p4', name: 'Ultra 500MB', download: 500, upload: 250, price: 179.90, clientCount: 95, technology: 'Fibra', active: true },
  { id: 'p5', name: 'Giga 1GB', download: 1000, upload: 500, price: 249.90, clientCount: 43, technology: 'Fibra', active: true },
  { id: 'p6', name: 'Radio 30MB', download: 30, upload: 10, price: 69.90, clientCount: 78, technology: 'Radio', active: true },
];

export const clients: Client[] = [
  { id: 'c1', name: 'Joao Carlos Silva', cpf: '123.456.789-00', email: 'joao.silva@email.com', phone: '(11) 99999-1234', address: 'Rua das Flores, 123', city: 'Sao Paulo', planId: 'p2', planName: 'Essencial 100MB', status: 'active', connectionStatus: 'online', joinDate: '2022-03-15', ip: '192.168.1.101', downloadUsage: 187.4, uploadUsage: 23.1, mac: '00:1A:2B:3C:4D:01' },
  { id: 'c2', name: 'Maria Fernanda Souza', cpf: '234.567.890-11', email: 'maria.souza@email.com', phone: '(11) 98888-5678', address: 'Av. Brasil, 456', city: 'Sao Paulo', planId: 'p3', planName: 'Plus 200MB', status: 'active', connectionStatus: 'online', joinDate: '2021-07-20', ip: '192.168.1.102', downloadUsage: 312.8, uploadUsage: 45.6, mac: '00:1A:2B:3C:4D:02' },
  { id: 'c3', name: 'Pedro Henrique Costa', cpf: '345.678.901-22', email: 'pedro.costa@email.com', phone: '(11) 97777-9012', address: 'Rua da Paz, 789', city: 'Guarulhos', planId: 'p1', planName: 'Basico 50MB', status: 'suspended', connectionStatus: 'offline', joinDate: '2023-01-10', ip: '192.168.1.103', downloadUsage: 0, uploadUsage: 0, mac: '00:1A:2B:3C:4D:03' },
  { id: 'c4', name: 'Ana Paula Rodrigues', cpf: '456.789.012-33', email: 'ana.rodrigues@email.com', phone: '(11) 96666-3456', address: 'Rua Consolacao, 1010', city: 'Sao Paulo', planId: 'p4', planName: 'Ultra 500MB', status: 'active', connectionStatus: 'online', joinDate: '2020-11-05', ip: '192.168.1.104', downloadUsage: 523.2, uploadUsage: 87.3, mac: '00:1A:2B:3C:4D:04' },
  { id: 'c5', name: 'Carlos Eduardo Lima', cpf: '567.890.123-44', email: 'carlos.lima@email.com', phone: '(11) 95555-7890', address: 'Al. Santos, 321', city: 'Sao Paulo', planId: 'p5', planName: 'Giga 1GB', status: 'active', connectionStatus: 'online', joinDate: '2021-04-18', ip: '192.168.1.105', downloadUsage: 892.7, uploadUsage: 134.5, mac: '00:1A:2B:3C:4D:05' },
  { id: 'c6', name: 'Lucia Helena Ferreira', cpf: '678.901.234-55', email: 'lucia.ferreira@email.com', phone: '(11) 94444-2345', address: 'Rua Augusta, 567', city: 'Sao Paulo', planId: 'p2', planName: 'Essencial 100MB', status: 'active', connectionStatus: 'offline', joinDate: '2022-09-30', ip: '192.168.1.106', downloadUsage: 45.2, uploadUsage: 8.9, mac: '00:1A:2B:3C:4D:06' },
  { id: 'c7', name: 'Roberto Alves Mendes', cpf: '789.012.345-66', email: 'roberto.mendes@email.com', phone: '(11) 93333-6789', address: 'Rua Oscar Freire, 890', city: 'Sao Paulo', planId: 'p3', planName: 'Plus 200MB', status: 'active', connectionStatus: 'online', joinDate: '2023-05-22', ip: '192.168.1.107', downloadUsage: 278.1, uploadUsage: 34.7, mac: '00:1A:2B:3C:4D:07' },
  { id: 'c8', name: 'Beatriz Oliveira Santos', cpf: '890.123.456-77', email: 'beatriz.santos@email.com', phone: '(11) 92222-0123', address: 'Av. Paulista, 1500', city: 'Sao Paulo', planId: 'p2', planName: 'Essencial 100MB', status: 'active', connectionStatus: 'online', joinDate: '2020-02-14', ip: '192.168.1.108', downloadUsage: 156.3, uploadUsage: 22.4, mac: '00:1A:2B:3C:4D:08' },
  { id: 'c9', name: 'Fernando Moreira Dias', cpf: '901.234.567-88', email: 'fernando.dias@email.com', phone: '(11) 91111-4567', address: 'Rua Vergueiro, 234', city: 'Sao Paulo', planId: 'p1', planName: 'Basico 50MB', status: 'cancelled', connectionStatus: 'offline', joinDate: '2021-12-01', ip: '', downloadUsage: 0, uploadUsage: 0, mac: '' },
  { id: 'c10', name: 'Camila Pereira Nunes', cpf: '012.345.678-99', email: 'camila.nunes@email.com', phone: '(11) 90000-8901', address: 'Rua Liberdade, 678', city: 'Sao Paulo', planId: 'p4', planName: 'Ultra 500MB', status: 'active', connectionStatus: 'online', joinDate: '2022-06-08', ip: '192.168.1.110', downloadUsage: 445.9, uploadUsage: 72.1, mac: '00:1A:2B:3C:4D:0A' },
  { id: 'c11', name: 'Marcos Antonio Barbosa', cpf: '111.222.333-44', email: 'marcos.barbosa@email.com', phone: '(19) 99887-6655', address: 'Rua das Araras, 55', city: 'Campinas', planId: 'p6', planName: 'Radio 30MB', status: 'active', connectionStatus: 'online', joinDate: '2023-02-17', ip: '10.0.0.11', downloadUsage: 68.4, uploadUsage: 9.2, mac: 'AA:BB:CC:DD:EE:11' },
  { id: 'c12', name: 'Juliana Carvalho Teixeira', cpf: '222.333.444-55', email: 'juliana.teixeira@email.com', phone: '(11) 98765-4321', address: 'Rua da Mooca, 1200', city: 'Sao Paulo', planId: 'p3', planName: 'Plus 200MB', status: 'active', connectionStatus: 'online', joinDate: '2021-10-03', ip: '192.168.1.112', downloadUsage: 289.5, uploadUsage: 41.3, mac: '00:1A:2B:3C:4D:0C' },
];

export const invoices: Invoice[] = [
  { id: 'inv1', clientId: 'c1', clientName: 'Joao Carlos Silva', amount: 99.90, dueDate: '2024-12-10', paidDate: '2024-12-08', status: 'paid', month: 'Dezembro/2024', description: 'Mensalidade Essencial 100MB - Dez/2024' },
  { id: 'inv2', clientId: 'c2', clientName: 'Maria Fernanda Souza', amount: 129.90, dueDate: '2024-12-15', paidDate: '2024-12-14', status: 'paid', month: 'Dezembro/2024', description: 'Mensalidade Plus 200MB - Dez/2024' },
  { id: 'inv3', clientId: 'c3', clientName: 'Pedro Henrique Costa', amount: 79.90, dueDate: '2024-11-10', status: 'overdue', month: 'Novembro/2024', description: 'Mensalidade Basico 50MB - Nov/2024' },
  { id: 'inv4', clientId: 'c4', clientName: 'Ana Paula Rodrigues', amount: 179.90, dueDate: '2024-12-20', status: 'pending', month: 'Dezembro/2024', description: 'Mensalidade Ultra 500MB - Dez/2024' },
  { id: 'inv5', clientId: 'c5', clientName: 'Carlos Eduardo Lima', amount: 249.90, dueDate: '2024-12-18', paidDate: '2024-12-17', status: 'paid', month: 'Dezembro/2024', description: 'Mensalidade Giga 1GB - Dez/2024' },
  { id: 'inv6', clientId: 'c6', clientName: 'Lucia Helena Ferreira', amount: 99.90, dueDate: '2024-12-05', paidDate: '2024-12-05', status: 'paid', month: 'Dezembro/2024', description: 'Mensalidade Essencial 100MB - Dez/2024' },
  { id: 'inv7', clientId: 'c7', clientName: 'Roberto Alves Mendes', amount: 129.90, dueDate: '2024-12-22', status: 'pending', month: 'Dezembro/2024', description: 'Mensalidade Plus 200MB - Dez/2024' },
  { id: 'inv8', clientId: 'c8', clientName: 'Beatriz Oliveira Santos', amount: 99.90, dueDate: '2024-12-10', paidDate: '2024-12-09', status: 'paid', month: 'Dezembro/2024', description: 'Mensalidade Essencial 100MB - Dez/2024' },
  { id: 'inv9', clientId: 'c10', clientName: 'Camila Pereira Nunes', amount: 179.90, dueDate: '2024-11-20', status: 'overdue', month: 'Novembro/2024', description: 'Mensalidade Ultra 500MB - Nov/2024' },
  { id: 'inv10', clientId: 'c11', clientName: 'Marcos Antonio Barbosa', amount: 69.90, dueDate: '2024-12-17', paidDate: '2024-12-16', status: 'paid', month: 'Dezembro/2024', description: 'Mensalidade Radio 30MB - Dez/2024' },
  { id: 'inv11', clientId: 'c12', clientName: 'Juliana Carvalho Teixeira', amount: 129.90, dueDate: '2024-12-03', paidDate: '2024-12-02', status: 'paid', month: 'Dezembro/2024', description: 'Mensalidade Plus 200MB - Dez/2024' },
  { id: 'inv12', clientId: 'c1', clientName: 'Joao Carlos Silva', amount: 99.90, dueDate: '2024-11-10', paidDate: '2024-11-08', status: 'paid', month: 'Novembro/2024', description: 'Mensalidade Essencial 100MB - Nov/2024' },
  { id: 'inv13', clientId: 'c2', clientName: 'Maria Fernanda Souza', amount: 129.90, dueDate: '2024-11-15', paidDate: '2024-11-13', status: 'paid', month: 'Novembro/2024', description: 'Mensalidade Plus 200MB - Nov/2024' },
  { id: 'inv14', clientId: 'c5', clientName: 'Carlos Eduardo Lima', amount: 249.90, dueDate: '2024-11-18', paidDate: '2024-11-18', status: 'paid', month: 'Novembro/2024', description: 'Mensalidade Giga 1GB - Nov/2024' },
];

export const tickets: Ticket[] = [
  { id: 't1', clientId: 'c1', clientName: 'Joao Carlos Silva', subject: 'Conexao lenta durante horario de pico', description: 'Minha internet fica muito lenta entre 18h e 22h. Faço home office e fica inviavel trabalhar.', status: 'in_progress', priority: 'high', createdAt: '2024-12-18T14:30:00', updatedAt: '2024-12-19T09:15:00', category: 'connection' },
  { id: 't2', clientId: 'c3', clientName: 'Pedro Henrique Costa', subject: 'Cobranca indevida no mes de novembro', description: 'Fui cobrado duas vezes no mes de novembro. Preciso de estorno urgente.', status: 'open', priority: 'high', createdAt: '2024-12-20T10:00:00', updatedAt: '2024-12-20T10:00:00', category: 'billing' },
  { id: 't3', clientId: 'c6', clientName: 'Lucia Helena Ferreira', subject: 'Sem conexao ha 2 dias', description: 'Minha internet parou completamente ha 2 dias. Ja reiniciei o roteador varias vezes sem sucesso.', status: 'in_progress', priority: 'critical', createdAt: '2024-12-19T08:00:00', updatedAt: '2024-12-20T11:30:00', category: 'connection' },
  { id: 't4', clientId: 'c4', clientName: 'Ana Paula Rodrigues', subject: 'Solicito troca do roteador', description: 'Meu roteador esta com problemas de aquecimento. Luzes piscando constantemente.', status: 'open', priority: 'medium', createdAt: '2024-12-20T15:45:00', updatedAt: '2024-12-20T15:45:00', category: 'equipment' },
  { id: 't5', clientId: 'c7', clientName: 'Roberto Alves Mendes', subject: 'Pergunta sobre upgrade de plano', description: 'Gostaria de informacoes sobre upgrade do plano Plus para Ultra. Quais sao as condicoes?', status: 'resolved', priority: 'low', createdAt: '2024-12-15T11:00:00', updatedAt: '2024-12-16T14:20:00', category: 'other' },
  { id: 't6', clientId: 'c8', clientName: 'Beatriz Oliveira Santos', subject: 'Instabilidade de conexao recorrente', description: 'A conexao cai varias vezes por dia, dura apenas alguns segundos mas e muito frequente.', status: 'open', priority: 'medium', createdAt: '2024-12-21T09:30:00', updatedAt: '2024-12-21T09:30:00', category: 'connection' },
  { id: 't7', clientId: 'c10', clientName: 'Camila Pereira Nunes', subject: 'Solicitacao de segunda via de fatura', description: 'Preciso da segunda via das faturas dos meses de outubro e novembro para fins fiscais.', status: 'resolved', priority: 'low', createdAt: '2024-12-10T16:00:00', updatedAt: '2024-12-11T08:45:00', category: 'billing' },
  { id: 't8', clientId: 'c12', clientName: 'Juliana Carvalho Teixeira', subject: 'Velocidade abaixo do contratado', description: 'Fiz teste de velocidade e estou recebendo apenas 120MB de download no plano de 200MB.', status: 'in_progress', priority: 'medium', createdAt: '2024-12-19T13:00:00', updatedAt: '2024-12-20T10:00:00', category: 'connection' },
];

export const networkEvents: NetworkEvent[] = [
  { id: 'ne1', type: 'outage', description: 'Queda de energia na OLT Central - Zona Norte', affectedClients: 87, startTime: '2024-12-18T22:15:00', endTime: '2024-12-19T01:30:00', region: 'Zona Norte' },
  { id: 'ne2', type: 'maintenance', description: 'Manutencao programada - Upgrade de equipamentos', affectedClients: 0, startTime: '2024-12-22T02:00:00', endTime: '2024-12-22T06:00:00', region: 'Geral' },
  { id: 'ne3', type: 'degraded', description: 'Degradacao de velocidade - Backbone sobrecarregado', affectedClients: 234, startTime: '2024-12-20T18:00:00', endTime: '2024-12-20T21:45:00', region: 'Zona Sul' },
  { id: 'ne4', type: 'resolved', description: 'Normalizacao apos reparo de cabo danificado', affectedClients: 56, startTime: '2024-12-17T14:00:00', endTime: '2024-12-17T17:20:00', region: 'Centro' },
];

export const revenueData = [
  { name: 'Jul', receita: 38500, despesas: 12000 },
  { name: 'Ago', receita: 41200, despesas: 11800 },
  { name: 'Set', receita: 43100, despesas: 13200 },
  { name: 'Out', receita: 45800, despesas: 12500 },
  { name: 'Nov', receita: 47200, despesas: 14100 },
  { name: 'Dez', receita: 49800, despesas: 13800 },
];

export const clientGrowthData = [
  { name: 'Jul', clientes: 712 },
  { name: 'Ago', clientes: 745 },
  { name: 'Set', clientes: 778 },
  { name: 'Out', clientes: 812 },
  { name: 'Nov', clientes: 843 },
  { name: 'Dez', clientes: 843 },
];

export const networkUsageData = [
  { name: '00h', download: 120, upload: 30 },
  { name: '03h', download: 45, upload: 12 },
  { name: '06h', download: 89, upload: 22 },
  { name: '09h', download: 320, upload: 85 },
  { name: '12h', download: 480, upload: 120 },
  { name: '15h', download: 390, upload: 98 },
  { name: '18h', download: 720, upload: 180 },
  { name: '21h', download: 850, upload: 210 },
  { name: '24h', download: 280, upload: 70 },
];

export const planDistributionData = [
  { name: 'Basico 50MB', value: 142 },
  { name: 'Essencial 100MB', value: 287 },
  { name: 'Plus 200MB', value: 198 },
  { name: 'Ultra 500MB', value: 95 },
  { name: 'Giga 1GB', value: 43 },
  { name: 'Radio 30MB', value: 78 },
];

export const PLAN_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
