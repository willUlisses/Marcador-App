import { type ComponentPropsWithRef } from "react";

interface TextareaProps extends ComponentPropsWithRef<"textarea"> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Textarea = ({
      label,
      error,
      containerClassName = "",
      className = "",
      id,
      ref,
      rows = 4,
      ...props
    }: TextareaProps) => {
    const textareaId = id || props.name;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label htmlFor={textareaId} className="text-[11px] font-bold tracking-widest text-stone-700">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={!!error}
          className={`min-h-24 max-h-36
            w-full bg-white border border-stone-400/50 rounded-xl py-3 px-3 text-md text-stone-800 
            placeholder:text-stone-400 outline-none transition-all shadow-xs resize-none
            focus:border-amber-800 focus:ring-1 focus:ring-amber-800
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
          {...props}
        />

        {error && (
          <span className="text-xs text-red-500 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
;

Textarea.displayName = "Textarea";

export default Textarea;