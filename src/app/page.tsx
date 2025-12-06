import Link from 'next/link';
import { Header } from '../shared/components/Header';
import { Footer } from '../shared/components/Footer';
import { Music, Guitar, Brain, Play, ArrowRight, Star, Zap, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20"></div>
          <div className="container mx-auto px-6 py-24 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-8">
                <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-4 rounded-2xl shadow-2xl shadow-orange-500/20">
                  <Music className="text-white" size={48} />
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-amber-200 to-orange-400 bg-clip-text text-transparent">
                StrumMaster
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-8 font-light">
                Ваш персональный тренер для изучения игры на гитаре
              </p>
              <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
                Оттачивайте ритм, настраивайте инструмент и развивайте музыкальный слух с помощью интерактивных упражнений
              </p>
              
              {/* Main Feature Cards */}
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Link href="/strumbuilder" className="group">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-white/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-2">
                    <div className="flex justify-center mb-6">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl">
                        <Guitar className="text-white" size={32} />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-white group-hover:text-amber-400 transition-colors">
                      StrumBuilder
                    </h2>
                    <p className="text-slate-300 mb-6">
                      Создавайте и оттачивайте ритмические паттерны для игры на гитаре. Идеально для развития чувства ритма и координации.
                    </p>
                    <div className="flex items-center justify-center text-amber-400 font-medium group-hover:text-amber-300 transition-colors">
                      <span>Начать тренировку</span>
                      <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
                
                <Link href="/dictation" className="group">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-white/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-2">
                    <div className="flex justify-center mb-6">
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl">
                        <Brain className="text-white" size={32} />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-white group-hover:text-amber-400 transition-colors">
                      Музыкальный диктант
                    </h2>
                    <p className="text-slate-300 mb-6">
                      Развивайте музыкальный слух и способность распознавать ноты. Тренируйтесь в интерактивном формате.
                    </p>
                    <div className="flex items-center justify-center text-amber-400 font-medium group-hover:text-amber-300 transition-colors">
                      <span>Начать тренировку</span>
                      <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-slate-900/50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
              Преимущества StrumMaster
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Zap className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Быстрый прогресс</h3>
                <p className="text-slate-400">
                  Интерактивные упражнения помогают быстро развивать навыки игры на гитаре
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Play className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Практика в любом месте</h3>
                <p className="text-slate-400">
                  Тренируйтесь где угодно и когда угодно без необходимости носить гитару
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Users className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Для всех уровней</h3>
                <p className="text-slate-400">
                  Упражнения подойдут как для начинающих, так и для опытных гитаристов
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
              Что говорят пользователи
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-amber-400 fill-amber-400" size={16} />
                  ))}
                </div>
                <p className="text-slate-300 mb-4 italic">
                  "Отличное приложение! Помогло мне значительно улучшить чувство ритма всего за пару недель."
                </p>
                <p className="text-slate-500 text-sm font-medium">- Александр К.</p>
              </div>
              
              <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-amber-400 fill-amber-400" size={16} />
                  ))}
                </div>
                <p className="text-slate-300 mb-4 italic">
                  "Музыкальный диктант - просто находка! Наконец-то начал развивать свой музыкальный слух."
                </p>
                <p className="text-slate-500 text-sm font-medium">- Мария П.</p>
              </div>
              
              <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-amber-400 fill-amber-400" size={16} />
                  ))}
                </div>
                <p className="text-slate-300 mb-4 italic">
                  "Использую каждый день. StrumBuilder помог мне освоить сложные ритмические рисунки."
                </p>
                <p className="text-slate-500 text-sm font-medium">- Дмитрий В.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}