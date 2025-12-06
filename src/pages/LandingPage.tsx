import React from 'react';
import { Star, Clock, Users, Award, Play, Check, Music, Calendar, MessageCircle } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
            Профессиональные уроки гитары
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            От новичка до уверенного гитариста. Индивидуальный подход и современные методики обучения.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg">
              Записаться на пробное занятие
            </button>
            <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
              <Play size={20} />
              Смотреть видео-обзор
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          Почему выбирают мои уроки
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-amber-500/30 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Индивидуальный подход</h3>
            <p className="text-slate-300">
              Программа занятий разрабатывается персонально под ваши цели, музыкальные предпочтения и темп обучения.
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-amber-500/30 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center mb-4">
              <Award className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Опыт и квалификация</h3>
            <p className="text-slate-300">
              Более 10 лет опыта игры на гитаре и 5 лет преподавательской практики. Музыкальное образование.
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-amber-500/30 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center mb-4">
              <Clock className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Гибкий график</h3>
            <p className="text-slate-300">
              Удобное время занятий, возможность переносить уроки. Онлайн и офлайн форматы обучения.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          Услуги и направления
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-800/30 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Music className="text-amber-500" size={24} />
              Академическая гитара
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span>Основы музыкальной грамоты</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span>Техника игры и постановка рук</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span>Классический репертуар</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span>Подготовка к выступлениям и экзаменам</span>
              </li>
            </ul>
          </div>
          <div className="bg-slate-800/30 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Music className="text-amber-500" size={24} />
              Современная гитара
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span>Игра на электрогитаре и акустике</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span>Изучение любимых песен</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span>Импровизация и соло</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span>Основы звукозаписи</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          Стоимость занятий
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800/30 rounded-xl p-6 border border-white/10 hover:border-amber-500/30 transition-all">
            <h3 className="text-xl font-semibold text-white mb-2">Пробное занятие</h3>
            <div className="text-3xl font-bold text-amber-500 mb-4">Бесплатно</div>
            <p className="text-slate-300 mb-4">30 минут</p>
            <ul className="space-y-2 text-slate-300 mb-6">
              <li className="flex items-start gap-2">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span>Знакомство с гитарой</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span>Определение уровня</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span>План обучения</span>
              </li>
            </ul>
            <button className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors">
              Записаться
            </button>
          </div>
          <div className="bg-slate-800/30 rounded-xl p-6 border border-amber-500/30 hover:border-amber-500/50 transition-all relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full">
              Популярный выбор
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Индивидуальное занятие</h3>
            <div className="text-3xl font-bold text-amber-500 mb-4">1500₽</div>
            <p className="text-slate-300 mb-4">60 минут</p>
            <ul className="space-y-2 text-slate-300 mb-6">
              <li className="flex items-start gap-2">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span>Персональная программа</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span>Материалы для занятий</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span>Домашние задания</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span>Поддержка в мессенджере</span>
              </li>
            </ul>
            <button className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all">
              Записаться
            </button>
          </div>
          <div className="bg-slate-800/30 rounded-xl p-6 border border-white/10 hover:border-amber-500/30 transition-all">
            <h3 className="text-xl font-semibold text-white mb-2">Абонемент на 8 занятий</h3>
            <div className="text-3xl font-bold text-amber-500 mb-4">10800₽</div>
            <p className="text-slate-300 mb-4">Сэкономьте 1200₽</p>
            <ul className="space-y-2 text-slate-300 mb-6">
              <li className="flex items-start gap-2">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span>Все из индивидуального</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span>Гибкий график</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span>Дополнительные материалы</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                <span>Запись уроков по запросу</span>
              </li>
            </ul>
            <button className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors">
              Записаться
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          Обо мне
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="aspect-square bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl mb-6 flex items-center justify-center">
              <Music className="text-white" size={120} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-white mb-4">Привет! Я - ваш будущий преподаватель гитары</h3>
            <p className="text-slate-300 mb-4">
              Меня зовут Дмитрий, и я более 10 лет играю на гитаре. За это время я прошел путь от новичка до профессионального музыканта и преподавателя.
            </p>
            <p className="text-slate-300 mb-4">
              Я окончил музыкальную школу по классу классической гитары, затем расширил свои знания в области современной музыки. Играю в нескольких музыкальных коллективах и участвую в концертах.
            </p>
            <p className="text-slate-300 mb-6">
              Моя философия преподавания - это не просто обучение нотам и аккордам, а развитие музыкального слуха, креативности и любви к музыке. Я адаптирую методику под каждого ученика, помогая достичь конкретных целей.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-amber-500">50+</div>
                <div className="text-slate-400">Учеников</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-500">10+</div>
                <div className="text-slate-400">Лет опыта</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          Отзывы учеников
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800/30 rounded-xl p-6 border border-white/10">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-amber-500 fill-current" size={18} />
              ))}
            </div>
            <p className="text-slate-300 mb-4 italic">
              "Дмитрий - отличный преподаватель! Начинал с нуля, уже через 3 месяца мог играть любимые песни. Объясняет просто и понятно."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">АК</span>
              </div>
              <div>
                <div className="text-white font-medium">Александр К.</div>
                <div className="text-slate-500 text-sm">Учится 6 месяцев</div>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/30 rounded-xl p-6 border border-white/10">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-amber-500 fill-current" size={18} />
              ))}
            </div>
            <p className="text-slate-300 mb-4 italic">
              "Занимаюсь с Дмитрием полгода. Очень нравится подход - всегда подстраивается под мои цели и музыкальные вкусы."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">МП</span>
              </div>
              <div>
                <div className="text-white font-medium">Мария П.</div>
                <div className="text-slate-500 text-sm">Учится 6 месяцев</div>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/30 rounded-xl p-6 border border-white/10">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-amber-500 fill-current" size={18} />
              ))}
            </div>
            <p className="text-slate-300 mb-4 italic">
              "Пробовал разных преподавателей, но Дмитрий лучший. Помог преодолеть плато в обучении и начал играть соло!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">ИС</span>
              </div>
              <div>
                <div className="text-white font-medium">Игорь С.</div>
                <div className="text-slate-500 text-sm">Учится 1 год</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 rounded-2xl p-8 md:p-12 border border-amber-500/30">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Готовы начать играть на гитаре?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Запишитесь на бесплатное пробное занятие и сделайте первый шаг к освоению гитары
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                <Calendar size={20} />
                Записаться на пробное занятие
              </button>
              <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
                <MessageCircle size={20} />
                Задать вопрос
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};