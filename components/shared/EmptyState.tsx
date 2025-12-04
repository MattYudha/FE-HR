interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ElementType; // Optional icon component
}

export function EmptyState({ title, description, icon: Icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
      {Icon && <Icon className="mx-auto h-12 w-12 text-gray-400" />}
      <h3 className="mt-2 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm">{description}</p>
    </div>
  );
}
