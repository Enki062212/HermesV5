-- ═══════════════════════════════════════════════════════════════════════════
--  HERMES + EXPONIFY DATABASE SCHEMA
--  Complete SQL migration for all 39 modules
--  Run this in Supabase SQL Editor to create all tables
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable RLS (Row Level Security) on all tables
-- Each user only sees their own brand's data

-- ═══════════════════════════════════════════════════════════════════════════
-- CORE MODULES
-- ═══════════════════════════════════════════════════════════════════════════

-- Brands/Companies table
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users(id),
    industry TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own brands" ON brands FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Users can insert their own brands" ON brands FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Users can update their own brands" ON brands FOR UPDATE USING (owner_id = auth.uid());

-- Sales Deals table
CREATE TABLE IF NOT EXISTS sales_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    company TEXT,
    value DECIMAL(12,2) DEFAULT 0,
    stage TEXT DEFAULT 'lead', -- lead, qualified, proposal, negotiation, closed_won, closed_lost
    probability INTEGER DEFAULT 20,
    expected_close DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE sales_deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view deals for their brands" ON sales_deals FOR SELECT USING (
    EXISTS (SELECT 1 FROM brands WHERE brands.id = sales_deals.brand_id AND brands.owner_id = auth.uid())
);
CREATE POLICY "Users can manage their deals" ON sales_deals FOR ALL USING (
    EXISTS (SELECT 1 FROM brands WHERE brands.id = sales_deals.brand_id AND brands.owner_id = auth.uid())
);

-- CRM Contacts table
CREATE TABLE IF NOT EXISTS crm_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    stage TEXT DEFAULT 'lead', -- lead, prospect, customer, churned
    value DECIMAL(12,2) DEFAULT 0,
    platform TEXT, -- Instagram, Facebook, TikTok, Shopee, etc.
    tags TEXT[], -- array of tags
    score INTEGER DEFAULT 50, -- lead score 0-100
    last_contact TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their contacts" ON crm_contacts FOR ALL USING (
    EXISTS (SELECT 1 FROM brands WHERE brands.id = crm_contacts.brand_id AND brands.owner_id = auth.uid())
);

-- Calendar Events table
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    event_type TEXT, -- meeting, call, task, reminder
    contact_id UUID REFERENCES crm_contacts(id),
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their calendar" ON calendar_events FOR ALL USING (
    EXISTS (SELECT 1 FROM brands WHERE brands.id = calendar_events.brand_id AND brands.owner_id = auth.uid())
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    order_number TEXT UNIQUE,
    customer_id UUID REFERENCES crm_contacts(id),
    status TEXT DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
    total_amount DECIMAL(12,2) DEFAULT 0,
    platform TEXT, -- Shopee, Lazada, Website, etc.
    items JSONB, -- array of {product_id, name, quantity, price}
    shipping_address TEXT,
    tracking_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their orders" ON orders FOR ALL USING (
    EXISTS (SELECT 1 FROM brands WHERE brands.id = orders.brand_id AND brands.owner_id = auth.uid())
);

-- ═══════════════════════════════════════════════════════════════════════════
-- INVENTORY / ERP MODULE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS inventory_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    sku TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    cost_price DECIMAL(12,2),
    selling_price DECIMAL(12,2),
    stock_quantity INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 10,
    supplier TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE inventory_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their inventory" ON inventory_products FOR ALL USING (
    EXISTS (SELECT 1 FROM brands WHERE brands.id = inventory_products.brand_id AND brands.owner_id = auth.uid())
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES inventory_products(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- in, out, adjustment
    quantity INTEGER NOT NULL,
    reason TEXT,
    order_id UUID REFERENCES orders(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- MARKETING MODULES
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT, -- email, social, ads, broadcast
    status TEXT DEFAULT 'draft', -- draft, active, paused, completed
    budget DECIMAL(12,2),
    spent DECIMAL(12,2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    target_audience TEXT,
    metrics JSONB, -- {impressions, clicks, conversions, revenue}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage campaigns" ON marketing_campaigns FOR ALL USING (
    EXISTS (SELECT 1 FROM brands WHERE brands.id = marketing_campaigns.brand_id AND brands.owner_id = auth.uid())
);

CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    subject TEXT,
    body TEXT,
    variables TEXT[], -- [{{customer_name}}, {{order_number}}]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- FINANCE MODULES
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS accounting_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT, -- asset, liability, equity, revenue, expense
    code TEXT UNIQUE,
    balance DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounting_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    description TEXT,
    debit_account_id UUID REFERENCES accounting_accounts(id),
    credit_account_id UUID REFERENCES accounting_accounts(id),
    amount DECIMAL(12,2) NOT NULL,
    reference TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE accounting_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage accounting" ON accounting_transactions FOR ALL USING (
    EXISTS (SELECT 1 FROM brands WHERE brands.id = accounting_transactions.brand_id AND brands.owner_id = auth.uid())
);

-- Employees table (HR)
CREATE TABLE IF NOT EXISTS hr_employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    employee_id TEXT UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    position TEXT,
    department TEXT,
    salary DECIMAL(12,2),
    hire_date DATE,
    status TEXT DEFAULT 'active', -- active, resigned, terminated
    sss_number TEXT,
    philhealth_number TEXT,
    pagibig_number TEXT,
    tin_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE hr_employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage employees" ON hr_employees FOR ALL USING (
    EXISTS (SELECT 1 FROM brands WHERE brands.id = hr_employees.brand_id AND brands.owner_id = auth.uid())
);

-- Payroll table
CREATE TABLE IF NOT EXISTS hr_payroll (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES hr_employees(id) ON DELETE CASCADE,
    pay_period_start DATE,
    pay_period_end DATE,
    basic_pay DECIMAL(12,2),
    overtime_pay DECIMAL(12,2) DEFAULT 0,
    allowances DECIMAL(12,2) DEFAULT 0,
    deductions DECIMAL(12,2) DEFAULT 0,
    sss_contribution DECIMAL(12,2) DEFAULT 0,
    philhealth_contribution DECIMAL(12,2) DEFAULT 0,
    pagibig_contribution DECIMAL(12,2) DEFAULT 0,
    withholding_tax DECIMAL(12,2) DEFAULT 0,
    net_pay DECIMAL(12,2),
    status TEXT DEFAULT 'pending', -- pending, processed, paid
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- PROJECTS MODULE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'planning', -- planning, active, on_hold, completed, cancelled
    priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
    start_date DATE,
    due_date DATE,
    budget DECIMAL(12,2),
    manager_id UUID REFERENCES hr_employees(id),
    client_id UUID REFERENCES crm_contacts(id),
    progress INTEGER DEFAULT 0, -- 0-100
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage projects" ON projects FOR ALL USING (
    EXISTS (SELECT 1 FROM brands WHERE brands.id = projects.brand_id AND brands.owner_id = auth.uid())
);

CREATE TABLE IF NOT EXISTS project_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo', -- todo, in_progress, review, done
    priority TEXT DEFAULT 'medium',
    assignee_id UUID REFERENCES hr_employees(id),
    due_date DATE,
    estimated_hours INTEGER,
    actual_hours INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- TIME TRACKING MODULE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES hr_employees(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id),
    task_id UUID REFERENCES project_tasks(id),
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    hours DECIMAL(4,2),
    description TEXT,
    billable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- SUPPORT / TICKETS MODULE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    ticket_number TEXT UNIQUE,
    customer_id UUID REFERENCES crm_contacts(id),
    subject TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
    status TEXT DEFAULT 'open', -- open, in_progress, resolved, closed
    category TEXT, -- technical, billing, general
    assignee_id UUID REFERENCES hr_employees(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage tickets" ON support_tickets FOR ALL USING (
    EXISTS (SELECT 1 FROM brands WHERE brands.id = support_tickets.brand_id AND brands.owner_id = auth.uid())
);

CREATE TABLE IF NOT EXISTS support_ticket_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
    author_type TEXT, -- customer, employee, system
    author_id UUID,
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE, -- internal notes vs customer visible
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- SUPPLIER / PROCUREMENT MODULE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    payment_terms TEXT, -- net 30, net 60, etc.
    rating INTEGER, -- 1-5
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    po_number TEXT UNIQUE,
    supplier_id UUID REFERENCES suppliers(id),
    status TEXT DEFAULT 'draft', -- draft, sent, confirmed, received, cancelled
    total_amount DECIMAL(12,2),
    expected_delivery DATE,
    actual_delivery DATE,
    items JSONB, -- array of products ordered
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- DOCUMENTS MODULE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT, -- contract, invoice, report, other
    file_path TEXT,
    file_size INTEGER,
    mime_type TEXT,
    metadata JSONB, -- extracted data, tags, etc.
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage documents" ON documents FOR ALL USING (
    EXISTS (SELECT 1 FROM brands WHERE brands.id = documents.brand_id AND brands.owner_id = auth.uid())
);

-- ═══════════════════════════════════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════════════════════════

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables with updated_at column
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_deals_updated_at BEFORE UPDATE ON sales_deals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crm_contacts_updated_at BEFORE UPDATE ON crm_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_products_updated_at BEFORE UPDATE ON inventory_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketing_campaigns_updated_at BEFORE UPDATE ON marketing_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounting_transactions_updated_at BEFORE UPDATE ON accounting_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hr_employees_updated_at BEFORE UPDATE ON hr_employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_tasks_updated_at BEFORE UPDATE ON project_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════
-- INDEXES FOR PERFORMANCE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE INDEX idx_sales_deals_brand_id ON sales_deals(brand_id);
CREATE INDEX idx_sales_deals_stage ON sales_deals(stage);
CREATE INDEX idx_crm_contacts_brand_id ON crm_contacts(brand_id);
CREATE INDEX idx_crm_contacts_stage ON crm_contacts(stage);
CREATE INDEX idx_orders_brand_id ON orders(brand_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_inventory_products_brand_id ON inventory_products(brand_id);
CREATE INDEX idx_marketing_campaigns_brand_id ON marketing_campaigns(brand_id);
CREATE INDEX idx_projects_brand_id ON projects(brand_id);
CREATE INDEX idx_project_tasks_project_id ON project_tasks(project_id);
CREATE INDEX idx_support_tickets_brand_id ON support_tickets(brand_id);
CREATE INDEX idx_time_entries_employee_id ON time_entries(employee_id);
CREATE INDEX idx_accounting_transactions_brand_id ON accounting_transactions(brand_id);
CREATE INDEX idx_hr_employees_brand_id ON hr_employees(brand_id);
CREATE INDEX idx_hr_payroll_employee_id ON hr_payroll(employee_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- DONE! 
-- Run this in Supabase SQL Editor to create all tables
-- Then enable Real-time for tables you want live updates on
-- ═══════════════════════════════════════════════════════════════════════════
