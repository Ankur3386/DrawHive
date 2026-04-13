import { ReactNode } from "react"

export function IconButton({
  icon,
  onClick,
  activated,
  className,
  label,
}: {
  icon: ReactNode
  onClick: () => void
  activated: boolean
  className?: string
  label?: string
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`
        relative flex flex-col items-center justify-center gap-1
        w-10 h-10 rounded-lg transition-all duration-150
        border border-transparent
        ${
          activated
            ? "bg-violet-100 border-violet-400 text-violet-700"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }
        ${className ?? ""}
      `}
    >
      <span className="w-[18px] h-[18px] flex items-center justify-center">
        {icon}
      </span>
      {label && (
        <span className="text-[9px] font-medium leading-none tracking-wide">
          {label}
        </span>
      )}
    </button>
  )
}