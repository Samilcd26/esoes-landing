"use client";

interface DepartmentHeaderProps {
  title: string;
  variant?: 'default' | 'ambassador' | 'department';
  className?: string;
}

export default function DepartmentHeader({ title, variant = 'default', className = '' }: DepartmentHeaderProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'ambassador':
        return {
          title: 'from-yellow-400 to-orange-400',
          line: 'from-yellow-400 to-orange-400',
          lineWidth: 'w-24'
        };
      case 'department':
        return {
          title: 'from-green-400 to-emerald-400',
          line: 'from-green-400 to-emerald-400',
          lineWidth: 'w-20'
        };
      default:
        return {
          title: 'from-blue-400 to-cyan-400',
          line: 'from-blue-400 to-cyan-400',
          lineWidth: 'w-16'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`text-center mb-8 ${className}`}>
      <h4 className={`text-2xl font-bold bg-gradient-to-r ${styles.title} bg-clip-text text-transparent mb-2`}>
        {title}
      </h4>
      <div className={`${styles.lineWidth} h-1 bg-gradient-to-r ${styles.line} mx-auto rounded-full`}></div>
    </div>
  );
}
