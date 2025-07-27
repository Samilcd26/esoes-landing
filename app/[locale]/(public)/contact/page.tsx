"use client";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Mail, Instagram, Linkedin, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const tContact = useTranslations("contact");
  const tFooter = useTranslations("footer");

  const socialLinks = [
    {
      name: "Instagram",
      url: tFooter("social.instagramUrl"),
      icon: Instagram,
      color: "from-pink-500 to-purple-600",
      hoverColor: "hover:from-pink-600 hover:to-purple-700"
    },
    {
      name: "LinkedIn",
      url: tFooter("social.linkedinUrl"),
      icon: Linkedin,
      color: "from-blue-500 to-blue-700",
      hoverColor: "hover:from-blue-600 hover:to-blue-800"
    },
    {
      name: "Email",
      url: tFooter("contact.emailUrl"),
      icon: Mail,
      color: "from-green-500 to-teal-600",
      hoverColor: "hover:from-green-600 hover:to-teal-700"
    }
  ];

  const contactInfo = [
    {
      icon: MapPin,
      title: tFooter("contact.address"),
      description: tFooter("contact.address")
    },
    {
      icon: Phone,
      title: tFooter("contact.phone"),
      description: tFooter("contact.phone")
    },
    {
      icon: Mail,
      title: tFooter("contact.email"),
      description: tFooter("contact.email")
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Beams */}
      <BackgroundBeams className="opacity-60" variant="contact" />
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
              {tContact("header.title")}
            </h1>
            <p className="relative z-10 text-lg md:text-xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-300 to-neutral-500 max-w-2xl mx-auto">
              {tContact("header.description1")}
              <br />
              {tContact("header.description2")}
            </p>
          </motion.div>

       
         
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            <h2 className="relative z-10 text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold mb-6">
              {tContact("form.title")}
            </h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="relative z-10 block bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-400 font-medium mb-2">
                    {tContact("form.fullNameLabel")}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder={tContact("form.fullNamePlaceholder")}
                  />
                </div>
                <div>
                  <label className="relative z-10 block bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-400 font-medium mb-2">
                    {tContact("form.emailLabel")}
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder={tContact("form.emailPlaceholder")}
                  />
                </div>
              </div>
              <div>
                <label className="relative z-10 block bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-400 font-medium mb-2">
                  {tContact("form.subjectLabel")}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder={tContact("form.subjectPlaceholder")}
                />
              </div>
              <div>
                <label className="relative z-10 block bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-400 font-medium mb-2">
                  {tContact("form.messageLabel")}
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder={tContact("form.messagePlaceholder")}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                type="submit"
              >
                {tContact("form.sendButton")}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
