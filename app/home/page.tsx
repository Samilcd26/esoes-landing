"use client";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import Image from "next/image";

export default function Home() {








  return (
    <>
      {/* Hero Section with Background Effects */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        {/* Background Effects */}
        <BackgroundBeams className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/20 to-black/50" />

        {/* Background Image with Overlay */}
        <Image
          src="/assets/images/backgrounds/nova-04.jpeg"
          alt="ESOES Background"
          fill
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            ESOES
          </h1>
          <div className="w-full max-w-[40rem] h-32 sm:h-36 md:h-40 relative">
            {/* Gradients */}
            <div className="absolute left-5 right-5 sm:inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute left-5 right-5 sm:inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
            <div className="absolute left-20 right-20 sm:inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute left-20 right-20 sm:inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
            <p className="text-base sm:text-lg md:text-2xl lg:text-3xl font-medium text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-400 bg-opacity-70 mt-4">
              Engineering Society of Eskişehir
            </p>
          </div>




          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl">
            Girişimci ESOGÜ Mühendislik Fakültesi öğrencileri tarafından kurulan, keşfederek fark yaratmayı amaçlayan bir öğrenci kulübüdür.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeDHO9m0yJvLWpvzZgwek2tfovrCagfI58MqffHhrixxekyTw/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              <HoverBorderGradient
                containerClassName="rounded-full"
                className="bg-black text-white px-8 py-3 text-lg font-semibold cursor-pointer"
              >
                Topluluğa Katıl
              </HoverBorderGradient>
            </a>
          </div>
        </div>
      </section>

      {/* Kimiz & Hedeflerimiz Section */}
      <section className="py-20 px-4 bg-black relative w-full">
        <div className="max-w-6xl mx-auto space-y-24">

          {/* Biz Kimiz */}
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 mb-6 text-center">
              Biz Kimiz?
            </h2>
            <p className="text-gray-300 text-lg md:text-xl text-center max-w-3xl mx-auto leading-relaxed">
              Kulüpçülük tecrübesine sahip, çeşitli organizasyonlarda rol alarak kendini geliştirmiş, farklı bölümlerden birleşerek bütünü oluşturan bir öğrenci topluluğuyuz.
            </p>
          </div>

          {/* Hedeflerimiz */}
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 mb-12 text-center">
              Hedeflerimiz
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GoalCard
                title="Koordinasyon"
                description="Farklı bölümlerden öğrencilere ulaşarak, çeşitli üniversite ve kulüplerle iş birliği yaparak bir arada ve disiplinler arası çalışma imkanı sunmak kulübümüzün amaçlarından biridir."
              />
              <GoalCard
                title="Gelişim"
                description="Üyelerimizin kariyer yönelimine yardımcı olmak ve kendilerini geliştirmelerini sağlamak, bu alanda çeşitli imkanlar sunmak öncelikli hedeflerimizden biridir."
              />
              <GoalCard
                title="Sosyallik"
                description="Kulüp olarak mühendislerin aktif sıfatına sahip olması ve asosyal tabularının yıkılması için; üyelerimizin iletişim becerilerini geliştirecek, onları sosyal yaşama katacak organizasyon ve etkinlikler yapmaktayız."
              />
              <GoalCard
                title="Sürdürülebilirlik"
                description="Kulübümüzün aktifliğini korurken aynı zamanda kazandığımız birikimlerle sahip olduğu prestijin daimiliğini sağlamak hedeflerimiz arasındadır. Bu amaçla yıl içinde çeşitli etkinlikler düzenlemekteyiz."
              />
            </div>
          </div>

          {/* TÜSİAD Info */}
          <div className="relative z-10 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-8 text-center max-w-4xl mx-auto backdrop-blur-sm">
            <p className="text-blue-200 text-base md:text-2xl font-semibold">
              TÜSİAD “Bu Gençlikte İş Var” Yarışmasınının destekçi kulüplerinden biriyiz.
            </p>
            <p className="text-blue-300/80 text-sm md:text-lg mt-2">
              (Bu yarışmaya destek veren ilk ve tek ESOGÜ kulübüyüz.)
            </p>
          </div>

        </div>
      </section>
    </>
  );
}

function GoalCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="relative group p-8 rounded-3xl border border-gray-800 bg-gray-900/50 hover:bg-gray-900/80 transition-all duration-300 hover:border-gray-700">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
      <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
        {description}
      </p>
    </div>
  );
}

