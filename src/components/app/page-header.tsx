export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-medium tracking-tight text-navy">{title}</h1>
        {description && <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: { icon: React.ReactNode; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed bg-white/60 px-6 py-14 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-cobalt-soft text-cobalt [&_svg]:size-5">{icon}</div>
      <h2 className="font-display text-xl text-navy">{title}</h2>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-xl border border-[#f1c8c2] bg-[#fdf0ee] px-6 py-10 text-center">
      <p className="font-medium text-[#7c2219]">Something went wrong</p>
      <p className="mt-1 max-w-sm text-sm text-[#7c2219]/80">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-4 rounded-md border border-[#e3a79f] bg-white px-3 py-1.5 text-sm font-medium text-[#7c2219] hover:bg-[#fff7f6]">
          Try again
        </button>
      )}
    </div>
  );
}
