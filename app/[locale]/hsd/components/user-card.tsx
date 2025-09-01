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

  const getRoleText = () => {
    switch (variant) {
      case 'ambassador':
        return 'Kampüs Elçisi';
      case 'secretary':
        return 'Genel Sekreter';
      default:
        return user.role === 'responsible' ? 'Sorumlu' : 'Asistan';
    }
  };

  const styles = getVariantStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative min-w-40"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${styles.glow} rounded-2xl blur-xl group-hover:blur-2xl group-hover:${styles.glowHover} transition-all duration-500`}></div>
      <div className="relative bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-700/95 backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-2xl p-4 shadow-xl">
        {/* Role Badge */}
        <div className="absolute -top-3 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${styles.badge}`}>
            {getRoleText()}
          </span>
        </div>
        
        {/* User Avatar and Info */}
        <div className="mt-6 text-center">
          <div className={`w-20 h-20 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${styles.avatar} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
            {user.image ? (
              <Image 
                src={user.image} 
                alt={`${user.firstName} ${user.lastName}`}
                width={80}
                height={80}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              <span>
                {user.firstName?.[0]}{user.lastName?.[0]}
              </span>
            )}
          </div>
          
          <h4 className="font-bold text-base text-gray-900 dark:text-white mb-2">
            {user.firstName} {user.lastName}
          </h4>
          
          {/* Contact Info - Only show for default variant */}
          {variant === 'default' && (
            <div className="space-y-1">
              {user.phone && (
                <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                  <span className="text-blue-500">📞</span>
                  {user.phone}
                </p>
              )}
              {user.email && (
                <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                  <span className="text-blue-500">📧</span>
                  {user.email}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
