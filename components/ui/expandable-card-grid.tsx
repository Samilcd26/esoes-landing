"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useOutsideClick } from "@/hooks/use-outside-click";

export default function ExpandableCardGrid() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const id = useId();
  const ref = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`} className="relative w-full h-80 lg:h-80">
                <Image
                  src={active.src}
                  alt={active.title}
                  fill
                  className="sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-medium text-neutral-700 dark:text-neutral-200 text-base"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-base"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-start gap-4">
        {cards.map((card) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={card.title}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col  hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col  w-full">
              <motion.div layoutId={`image-${card.title}-${id}`} className="relative h-60 w-full">
                <Image
                  src={card.src}
                  alt={card.title}
                  fill
                  className="rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="flex justify-center items-center flex-col">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: "Eğitim ve Organizasyon",
    title: "Eğitim ve Organizasyon",
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ctaText: "Daha Fazla",
    ctaLink: "#",
    content: () => {
      return (
        <p>
          Eğitim ve Organizasyon Departmanı, mühendislik öğrencilerinin ihtiyacı olan 
          hem sosyal hem de teknik eğitim programları düzenler. Ayrıca, HEBOCON, 
          GameJam ve İmza etkinliğimiz olan SOF&apos;un organizasyonu ile ilgilenir. <br /> <br /> 
          Departmanımız, öğrencilerin hem akademik hem de sosyal gelişimlerini destekleyerek 
          kapsamlı eğitim fırsatları sunar. Teknik becerilerin yanı sıra liderlik, 
          takım çalışması ve proje yönetimi konularında da eğitimler verilir.
        </p>
      );
    },
  },
  {
    description: "Kurumsal İlişkiler",
    title: "Kurumsal İlişkiler",
    src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ctaText: "Daha Fazla",
    ctaLink: "#",
    content: () => {
      return (
        <p>
          EsTalks ve teknik geziler düzenleyerek öğrencilere mesleki ağ kazandırılması, 
          daha donanımlı bireyler olmalarını amaçlar. Aynı zamanda büyük etkinliklere 
          konuşmacı bulunması Kurumsal İlişkiler departmanının sorumluluğu altındadır. <br /> <br /> 
          Departmanımız, sektör profesyonelleri ile öğrenciler arasında köprü görevi görür 
          ve kariyer fırsatları yaratır. Şirket ziyaretleri, networking etkinlikleri ve 
          mentörlük programları organize eder.
        </p>
      );
    },
  },
  {
    description: "Medya ve Tanıtım",
    title: "Medya ve Tanıtım",
    src: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ctaText: "Daha Fazla",
    ctaLink: "#",
    content: () => {
      return (
        <p>
          Kulübün tüm medya hesaplarını yönetir ve bu mecraları etkili bir şekilde kullanır. 
          Aynı zamanda sosyal medya PR&apos;ını üstlenir; paylaşılacak içeriklerin tasarımı 
          ve editlenmesinden sorumludur. <br /> <br /> 
          Departmanımız, kulübün görünürlüğünü artırarak marka değerini yükseltir. 
          Grafik tasarım, video prodüksiyonu, sosyal medya yönetimi ve içerik 
          stratejisi konularında uzmanlaşmış ekibimiz bulunur.
        </p>
      );
    },
  },
  {
    description: "Sponsorluk",
    title: "Sponsorluk",
    src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ctaText: "Daha Fazla",
    ctaLink: "#",
    content: () => {
      return (
        <p>
          Kulübün şirketler, esnaflar ve sponsor adayı olan tüm firmalarla bağlantı 
          kurulmasını sağlar. Kulübün maddi ihtiyaçlarının neredeyse tamamını 
          sponsorluk departmanı tarafından karşılanır. <br /> <br /> 
          Departmanımız, sürdürülebilir finansal kaynak yaratarak kulübün 
          büyümesini destekler. Sponsor ilişkileri yönetimi, proje finansmanı 
          ve bütçe planlaması konularında aktif rol oynar.
        </p>
      );
    },
  },
  {
    description: "İnsan Kaynakları",
    title: "İnsan Kaynakları",
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ctaText: "Daha Fazla",
    ctaLink: "#",
    content: () => {
      return (
        <p>
          Sosyal etkinlik ve sosyal sorumluluk projeleri düzenleyerek kulübe 
          üye katmaktan ve daha sosyal bir ortam sağlanmasından sorumludur. 
          Ayrıca düzenlenmesi planlanan büyük etkinliklerin PR çalışmalarının 
          bir bölümü İnsan kaynakları departmanının görevidir. <br /> <br /> 
          Departmanımız, kulüp kültürünü güçlendirerek üye memnuniyetini artırır. 
          Takım ruhu, motivasyon ve kişisel gelişim aktiviteleri organize eder.
        </p>
      );
    },
  },
];
