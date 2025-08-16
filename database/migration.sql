-- Temple Construction Platform Database Schema
-- Migration file for Supabase PostgreSQL

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('homeowner', 'builder', 'project_manager', 'subcontractor', 'admin');
CREATE TYPE project_status AS ENUM ('planning', 'in_progress', 'completed', 'on_hold');
CREATE TYPE milestone_status AS ENUM ('pending', 'in_progress', 'completed', 'delayed');
CREATE TYPE document_category AS ENUM ('contract', 'permit', 'photo', 'video', 'plan', 'invoice', 'other');
CREATE TYPE message_type AS ENUM ('message', 'notification', 'update', 'alert');
CREATE TYPE financial_category AS ENUM ('budget_item', 'payment', 'expense', 'change_order');
CREATE TYPE financial_status AS ENUM ('pending', 'approved', 'paid', 'overdue');
CREATE TYPE change_order_status AS ENUM ('proposed', 'pending_approval', 'approved', 'rejected', 'implemented');

-- Companies table (for white-label functionality)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    logo_url TEXT,
    brand_colors JSONB DEFAULT '{}',
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'homeowner',
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project phases (standardized construction phases)
CREATE TABLE project_phases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    typical_duration_days INTEGER,
    sort_order INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sort_order)
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    homeowner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    address TEXT,
    description TEXT,
    status project_status DEFAULT 'planning',
    start_date DATE,
    estimated_completion DATE,
    actual_completion DATE,
    total_budget DECIMAL(12,2),
    current_spent DECIMAL(12,2) DEFAULT 0,
    contract_signed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project milestones (timeline items)
CREATE TABLE project_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    phase_id UUID REFERENCES project_phases(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status milestone_status DEFAULT 'pending',
    scheduled_start DATE,
    scheduled_end DATE,
    actual_start DATE,
    actual_end DATE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    file_type TEXT,
    category document_category DEFAULT 'other',
    milestone_id UUID REFERENCES project_milestones(id) ON DELETE SET NULL,
    description TEXT,
    is_client_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communications table
CREATE TABLE communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE SET NULL, -- NULL for broadcast messages
    message TEXT NOT NULL,
    message_type message_type DEFAULT 'message',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financial records table
CREATE TABLE financial_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    category financial_category NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    status financial_status DEFAULT 'pending',
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Change orders table
CREATE TABLE change_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    cost_impact DECIMAL(12,2) DEFAULT 0,
    time_impact_days INTEGER DEFAULT 0,
    status change_order_status DEFAULT 'proposed',
    requested_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI chat history table
CREATE TABLE ai_chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    context_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_company_id ON projects(company_id);
CREATE INDEX idx_projects_homeowner_id ON projects(homeowner_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_milestones_project_id ON project_milestones(project_id);
CREATE INDEX idx_project_milestones_status ON project_milestones(status);
CREATE INDEX idx_documents_project_id ON documents(project_id);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_communications_project_id ON communications(project_id);
CREATE INDEX idx_communications_recipient_id ON communications(recipient_id);
CREATE INDEX idx_financial_records_project_id ON financial_records(project_id);
CREATE INDEX idx_change_orders_project_id ON change_orders(project_id);
CREATE INDEX idx_ai_chat_history_project_id ON ai_chat_history(project_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_milestones_updated_at BEFORE UPDATE ON project_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_records_updated_at BEFORE UPDATE ON financial_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_change_orders_updated_at BEFORE UPDATE ON change_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default project phases
INSERT INTO project_phases (name, description, typical_duration_days, sort_order) VALUES
('Pre-Construction', 'Planning, permits, and site preparation', 30, 1),
('Foundation', 'Excavation and foundation work', 14, 2),
('Framing', 'Structural framing and roof', 21, 3),
('Mechanical', 'Plumbing, electrical, and HVAC rough-in', 14, 4),
('Insulation & Drywall', 'Insulation installation and drywall', 10, 5),
('Interior Finishes', 'Flooring, paint, and interior fixtures', 21, 6),
('Exterior Finishes', 'Siding, roofing, and exterior work', 14, 7),
('Final Inspections', 'Final inspections and walk-through', 7, 8);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Users can view their own company" ON companies FOR SELECT USING (
    id IN (SELECT company_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Company admins can update their company" ON companies FOR UPDATE USING (
    id IN (SELECT company_id FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Users policies
CREATE POLICY "Users can view users in their company" ON users FOR SELECT USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
    OR id = auth.uid()
);

CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (id = auth.uid());

-- Projects policies
CREATE POLICY "Users can view projects in their company or where they're involved" ON projects FOR SELECT USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
    OR homeowner_id = auth.uid()
    OR project_manager_id = auth.uid()
);

CREATE POLICY "Project managers and company admins can update projects" ON projects FOR UPDATE USING (
    project_manager_id = auth.uid()
    OR company_id IN (SELECT company_id FROM users WHERE id = auth.uid() AND role IN ('admin', 'builder'))
);

-- Project milestones policies
CREATE POLICY "Users can view milestones for accessible projects" ON project_milestones FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE 
        company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
        OR homeowner_id = auth.uid()
        OR project_manager_id = auth.uid()
    )
);

-- Documents policies
CREATE POLICY "Users can view documents for accessible projects" ON documents FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE 
        company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
        OR homeowner_id = auth.uid()
        OR project_manager_id = auth.uid()
    )
    AND (
        is_client_visible = true 
        OR uploaded_by = auth.uid()
        OR auth.uid() IN (SELECT project_manager_id FROM projects WHERE id = project_id)
    )
);

-- Communications policies
CREATE POLICY "Users can view communications for accessible projects" ON communications FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE 
        company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
        OR homeowner_id = auth.uid()
        OR project_manager_id = auth.uid()
    )
    AND (recipient_id = auth.uid() OR recipient_id IS NULL OR sender_id = auth.uid())
);

-- Financial records policies
CREATE POLICY "Users can view financial records for accessible projects" ON financial_records FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE 
        company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
        OR homeowner_id = auth.uid()
        OR project_manager_id = auth.uid()
    )
);

-- Change orders policies
CREATE POLICY "Users can view change orders for accessible projects" ON change_orders FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE 
        company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
        OR homeowner_id = auth.uid()
        OR project_manager_id = auth.uid()
    )
);

-- AI chat history policies
CREATE POLICY "Users can view their own chat history" ON ai_chat_history FOR SELECT USING (
    user_id = auth.uid()
    AND project_id IN (SELECT id FROM projects WHERE 
        company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
        OR homeowner_id = auth.uid()
        OR project_manager_id = auth.uid()
    )
);

-- Storage buckets (create these in Supabase Dashboard)
-- project-documents: For contracts, permits, plans
-- project-photos: For progress photos and videos  
-- company-assets: For logos and branding materials

-- Note: Run this migration in Supabase SQL Editor or via migrations