import { LucideIcon } from "lucide-react";

export interface IFieldConfig {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'file' | 'checkbox' | 'radio' | 'requirements' | 'phone'; 
    placeholder?: string;
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    step?: number;
    options?: { value: string; label: string }[];
    validation?: {
      pattern?: string;
      message?: string;
    };
    icon?: LucideIcon;
    className?: string;
    colSpan?: number;
    requirementsConfig?: {
      title?: string;
      subtitle?: string;
      placeholder?: string;
      maxHeight?: string;
    };
    showPasswordRules?: boolean;
}