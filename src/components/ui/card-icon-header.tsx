import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface CardSectionHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function CardSectionHeader({
  title,
  description,
  action
}: CardSectionHeaderProps) {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-gray-900">
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {action}
      </div>
    </CardHeader>
  )
}
