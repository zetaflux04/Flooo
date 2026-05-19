import { cn } from "@/lib/utils";

type BaseProps = {
  label: string;
  id?: string;
  className?: string;
  hint?: string;
};

type InputFieldProps = BaseProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    as?: "input";
  };

type TextareaFieldProps = BaseProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as: "textarea";
  };

type SelectFieldProps = BaseProps &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    as: "select";
    children: React.ReactNode;
  };

export type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps;

export default function FormField(props: FormFieldProps) {
  const { label, id, className, hint, as = "input", ...rest } = props;
  const fieldId = id || (typeof rest.name === "string" ? rest.name : undefined);

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={fieldId} className="text-sm font-medium text-secondary block">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          id={fieldId}
          className="input-field min-h-[100px]"
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : as === "select" ? (
        <select
          id={fieldId}
          className="input-field"
          {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {(props as SelectFieldProps).children}
        </select>
      ) : (
        <input id={fieldId} className="input-field" {...(rest as React.InputHTMLAttributes<HTMLInputElement>)} />
      )}
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
