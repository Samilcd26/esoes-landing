"use client";

import { motion } from "motion/react";
import Image from "next/image";

interface UserCardProps {
  user: {
    firstName?: string;
    lastName?: string;
    title?: string;
    phone?: string;
    email?: string;
    image?: string;
    role: string;
  };
  variant?: 'default' | 'ambassador' | 'secretary';
  index?: number;
}

export default function UserCard({ user, variant = 'default', index = 0 }: UserCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'ambassador':
        return {
          badge: 'bg-gradient-to-r from-yellow-500 to-orange-600',
          avatar: 'from-yellow-400 to-orange-500',
          glow: 'from-yellow-500/10 via-orange-500/5 to-yellow-500/10',
          glowHover: 'from-yellow-500/20 to-orange-500/20'
        };
      case 'secretary':
        return {
          badge: 'bg-gradient-to-r from-orange-500 to-red-600',
          avatar: 'from-orange-400 to-red-500',
          glow: 'from-yellow-500/10 via-orange-500/5 to-yellow-500/10',
          glowHover: 'from-yellow-500/20 to-orange-500/20'
        };
      default:
        return {
          badge: user.role === 'responsible' 
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
            : 'bg-gradient-to-r from-purple-500 to-pink-600',
          avatar: 'from-blue-400 to-purple-500',
          glow: 'from-blue-500/10 via-purple-500/5 to-blue-500/10',
          glowHover: 'from-blue-500/20 to-purple-500/20'
        };
    }
  };



  const styles = getVariantStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.03 }}
      className="group relative min-w-56 w-full max-w-72"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${styles.glow} rounded-3xl blur-xl group-hover:blur-2xl group-hover:${styles.glowHover} transition-all duration-500`}></div>
      <div className="relative bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-700/95 backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-3xl p-4 shadow-xl">
        {/* Role Badge - Redesigned for better title handling */}
        <div className="mb-4">
          <div className={`px-4 py-2 rounded-2xl text-sm font-semibold text-white ${styles.badge} text-center shadow-lg min-h-[2.5rem] flex items-center justify-center`}>
            <span className="leading-tight break-words hyphens-auto">
              {user.title}
            </span>
          </div>
        </div>
        
        {/* User Avatar and Info */}
        <div className="text-center">
          <div className={`w-48 h-48 mx-auto mb-4 rounded-3xl bg-gradient-to-br ${styles.avatar} flex items-center justify-center text-white font-bold text-5xl shadow-lg`}>
            {user.image ? (
              <Image 
                src={user.image} 
                alt={`${user.firstName} ${user.lastName}`}
                width={192}
                height={192}
                className="w-full h-full rounded-3xl object-cover"
              />
            ) : (
              <span>
                {user.firstName?.[0]}{user.lastName?.[0]}
              </span>
            )}
          </div>
          
          <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3 leading-tight">
            <span className="block">{user.firstName}</span>
            <span className="block">{user.lastName}</span>
          </h4>
          
          {/* Contact Info - Only show for default variant */}
          {variant === 'default' && (
            <div className="space-y-2">
              {user.phone && (
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                  <span className="text-blue-500 text-base">📞</span>
                  <span className="truncate">{user.phone}</span>
                </p>
              )}
              {user.email && (
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                  <span className="text-blue-500 text-base">📧</span>
                  <span className="truncate">{user.email}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
