"use client";

import ExpandableCardGrid from "@/components/ui/expandable-card-grid";

interface Card {
  description: string;
  title: string;
  src: string;
  ctaText: string;
  ctaLink: string;
  content: () => React.ReactNode;
}

interface DepartmentsSectionProps {
  title: string;
  subtitle: string;
  departmentCards: Card[];
  emptyMessage: string;
}

export default function DepartmentsSection({ 
  title, 
  subtitle, 
  departmentCards, 
  emptyMessage 
}: DepartmentsSectionProps) {
  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-50 via-gray-100/50 to-gray-50 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
      {/* Soft top gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-50/80 via-transparent to-transparent dark:from-gray-900/80"></div>
      {/* Soft bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50/80 via-transparent to-transparent dark:from-gray-900/80"></div>
      <div className="relative z-10 text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{subtitle}</p>
      </div>
      {departmentCards.length > 0 ? (
        <ExpandableCardGrid cards={departmentCards} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">{emptyMessage}</p>
        </div>
      )}
    </section>
  );
}
