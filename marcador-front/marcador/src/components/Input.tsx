import { type ComponentPropsWithRef, type ReactNode } from "react";

interface InputProps extends ComponentPropsWithRef<"input"> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
}

const Input = ({
      label,
      error,
      leftIcon,
      rightIcon,
      containerClassName = "",
      className = "",
      id,
      ref,
      ...props
    }: InputProps) => {
    const inputId = id || props.name;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label htmlFor={inputId} className="text-[11.5px] font-semibold font-source tracking-widest text-stone-700">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-stone-500 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            className={`
              w-full bg-white border border-stone-300 rounded-xl py-3 text-md text-stone-800 
              placeholder:text-stone-400 outline-none transition-all shadow-xs
              focus:border-amber-800 focus:ring-1 focus:ring-amber-800
              ${leftIcon ? "pl-10" : "px-3"}
              ${rightIcon ? "pr-10" : "px-3"}
              ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
              ${className}
            `}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 text-stone-400 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <span className="text-xs text-red-500 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
;

Input.displayName = "Input";

export default Input;