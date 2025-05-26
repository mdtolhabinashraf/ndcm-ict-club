import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface WebLearning {
    id?: number | null;
    title: string;
    svgImage?: string | File | null;
    description: string;
    url?: string;
    updated_at?: string;
}

export interface Achievement {
    achievement: string;
}

export interface Mission {
    mission: string;
}

export interface FAQs {
    faq: {
        question: string;
        answer: string;
    };
}

export interface AdmissionDetails {
    admission_rules?: {
        admission_rule: string;
    }[];

    admission_fee?: number;
}

export interface Event {
    id?: number | null;
    title: string;
    description?: string;
    image?: File | string | null;
    terms_condition?: File | string | null;
    location: string;
    registration_fee: number;
    registration_for: string;
    registration_start?: string | null;
    registration_end?: string | null;
    start: string;
    end?: string | null;
    status: 'Hidden' | 'Publish';
    contact_details?:
        | {
              name?: string | null;
              title?: string | null;
              country_code?: string | null;
              phone?: string | null;
          }[]
        | null;
}

export interface SiteDetails {
    favicon?: File | string | null;
    logo?: File | string | null;
    title: string;
    slogan: string;
    history: string;
    contactEmail?: string;
}

interface ContactForm {
    id?: number | null;
    name?: string;
    email: string;
    message: string;
    created_at?: string | null;
}

interface Visitor {
    user_id?: number | null;
    ip_address?: string | null;
    user_agent?: string | null;
    last_activity?: number | null;
}
