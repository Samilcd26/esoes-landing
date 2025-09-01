"use client";

import { motion } from "motion/react";
import UserCard from "./user-card";
import DepartmentHeader from "./department-header";

interface User {
  firstName?: string;
  lastName?: string;
  title?: string;
  phone?: string;
  email?: string;
  image?: string;
  role: string;
}

interface DepartmentGroup {
  departmentName: string;
  users: User[];
}

interface UsersSectionProps {
  groupedUsers: DepartmentGroup[];
  title: string;
  subtitle: string;
}

export default function UsersSection({ groupedUsers, title, subtitle }: UsersSectionProps) {
  if (groupedUsers.length === 0) return null;

  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-800 via-purple-900/40 to-slate-700">
      {/* Soft top gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-800/80 via-transparent to-transparent"></div>
      {/* Soft bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50/80 via-transparent to-transparent dark:from-gray-900/80"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent mb-6">
            {title}
          </h3>
          <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
            {subtitle}
          </p>
        </motion.div>
        
        {/* HSD Elçileri Section - Single centered card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 flex justify-center"
        >
          <div className="bg-gradient-to-br from-white/10 to-gray-50/10 dark:from-gray-800/20 dark:to-gray-700/20 backdrop-blur-sm border border-white/20 dark:border-gray-600/30 rounded-3xl p-8 shadow-2xl max-w-2xl w-full">
            <DepartmentHeader 
              title="HSD Elçileri" 
              variant="ambassador" 
              className="mb-8"
            />
            
            {/* Users Grid */}
            <div className="flex justify-center">
              <div className="flex flex-row gap-8 items-center justify-center">
                {/* Mert Yıldız - HSD Elçisi */}
                <UserCard
                  user={{
                    firstName: "Mert",
                    lastName: "Yıldız",
                    role: "ambassador"
                  }}
                  variant="ambassador"
                  index={0}
                />
                
                {/* Nida - Elçi Yardımcısı */}
                <UserCard
                  user={{
                    firstName: "Nida",
                    lastName: "",
                    role: "secretary"
                  }}
                  variant="secretary"
                  index={1}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {groupedUsers.map((departmentGroup, deptIndex) => (
            <motion.div
              key={departmentGroup.departmentName}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: deptIndex * 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white/10 to-gray-50/10 dark:from-gray-800/20 dark:to-gray-700/20 backdrop-blur-sm border border-white/20 dark:border-gray-600/30 rounded-3xl p-6 shadow-2xl"
            >
              <DepartmentHeader 
                title={`${departmentGroup.departmentName} koordinatörleri`}
                variant="department"
              />
              
              {/* Users Grid */}
              <div className="flex justify-center">
                <div className="flex flex-row flex-wrap gap-4 items-center justify-center">
                  {departmentGroup.users.map((user, userIndex) => (
                    <UserCard
                      key={`${user.firstName}-${user.lastName}-${userIndex}`}
                      user={user}
                      variant="default"
                      index={userIndex}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
