/**
 * InputField - Reusable form input component
 *
 * Features:
 * - Consistent styling across all forms
 * - Built-in error state handling
 * - Supports react-hook-form integration
 * - Accessible labels and error messages
 * - Optional icon support
 *
 * Props:
 * @param {string} label - Field label text
 * @param {string} type - Input type (text, email, password, etc.)
 * @param {string} placeholder - Placeholder text
 * @param {object} register - React Hook Form register function
 * @param {object} error - Error object from react-hook-form
 * @param {string} name - Input field name
 * @param {object} validation - Validation rules for react-hook-form
 * @param {node} icon - Optional icon element
 * @param {string} helperText - Optional helper text below input
 */
const InputField = ({
    label,
    type = 'text',
    placeholder,
    register,
    error,
    name,
    validation = {},
    icon = null,
    helperText = '',
    className = ''
}) => {
    return (
        <div className={`form-control ${className}`}>
            {/* Label */}
            {label && (
                <label className="label">
                    <span className="label-text font-medium">{label}</span>
                </label>
            )}

            {/* Input wrapper with optional icon */}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40">
                        {icon}
                    </div>
                )}

                <input
                    type={type}
                    placeholder={placeholder}
                    className={`
            input input-bordered w-full
            ${icon ? 'pl-10' : ''}
            ${error ? 'input-error' : ''}
            transition-all duration-200
            focus:scale-[1.01]
          `}
                    {...register(name, validation)}
                />
            </div>

            {/* Error message or helper text */}
            {error ? (
                <label className="label">
                    <span className="label-text-alt text-error flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error.message}
                    </span>
                </label>
            ) : helperText ? (
                <label className="label">
                    <span className="label-text-alt text-base-content/60">{helperText}</span>
                </label>
            ) : null}
        </div>
    );
};

export default InputField;
