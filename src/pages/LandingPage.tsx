import React from 'react';
import { Star, Clock, Users, Award, Play, Check, Music, Calendar, MessageCircle } from 'lucide-react';
import { SEO } from '../shared/components';

export const LandingPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-background-primary text-text-primary font-sans">
      <SEO
        title="Уроки гитары онлайн"
        description="Профессиональные уроки игры на гитаре от Дмитрия. Индивидуальный подход, гибкий график, обучение с нуля до профи."
        keywords="уроки гитары, обучение гитаре, репетитор по гитаре, гитара онлайн, курсы гитары"
      />
      
      {/* Hero Section */}
      <section className="w-full max-w-[1280px] mx-auto px-md py-xl md:py-24 flex flex-col items-center text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-hero mb-6 text-text-primary">
            Профессиональные уроки гитары
          </h1>
          <p className="text-section text-text-secondary mb-8 max-w-2xl mx-auto font-normal">
            От новичка до уверенного гитариста. Индивидуальный подход и современные методики обучения.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-brand-blue hover:bg-brand-hover text-text-button-dark rounded-image transition-all shadow-minimal hover:shadow-hover-card font-medium text-body">
              Записаться на пробное занятие
            </button>
            <button className="px-6 py-3 bg-white text-brand-blue hover:bg-background-surface-tinted rounded-image transition-all shadow-minimal flex items-center justify-center gap-2 font-medium text-body">
              <Play size={20} className="fill-current" />
              Смотреть видео-обзор
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-[1280px] mx-auto px-md py-xl">
        <h2 className="text-section text-center mb-12 text-text-primary">
          Почему выбирают мои уроки
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {/* Feature 1 */}
          <div className="bg-background-secondary rounded-card p-md shadow-minimal hover:shadow-hover-card transition-all duration-DEFAULT">
            <div className="w-12 h-12 bg-background-surface-tinted rounded-soft flex items-center justify-center mb-4 text-brand-blue">
              <Users size={24} />
            </div>
            <h3 className="text-card mb-2 text-text-primary">Индивидуальный подход</h3>
            <p className="text-body text-text-secondary">
              Программа занятий разрабатывается персонально под ваши цели, музыкальные предпочтения и темп обучения.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-background-secondary rounded-card p-md shadow-minimal hover:shadow-hover-card transition-all duration-DEFAULT">
            <div className="w-12 h-12 bg-background-surface-tinted rounded-soft flex items-center justify-center mb-4 text-brand-blue">
              <Award size={24} />
            </div>
            <h3 className="text-card mb-2 text-text-primary">Опыт и квалификация</h3>
            <p className="text-body text-text-secondary">
              Более 10 лет опыта игры на гитаре и 5 лет преподавательской практики. Музыкальное образование.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-background-secondary rounded-card p-md shadow-minimal hover:shadow-hover-card transition-all duration-DEFAULT">
            <div className="w-12 h-12 bg-background-surface-tinted rounded-soft flex items-center justify-center mb-4 text-brand-blue">
              <Clock size={24} />
            </div>
            <h3 className="text-card mb-2 text-text-primary">Гибкий график</h3>
            <p className="text-body text-text-secondary">
              Удобное время занятий, возможность переносить уроки. Онлайн и офлайн форматы обучения.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full max-w-[1280px] mx-auto px-md py-xl">
        <h2 className="text-section text-center mb-12 text-text-primary">
          Услуги и направления
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="bg-background-secondary rounded-card p-lg shadow-card">
            <h3 className="text-section mb-6 text-text-primary flex items-center gap-3">
              <div className="p-2 bg-brand-blue/10 rounded-soft text-brand-blue">
                <Music size={28} />
              </div>
              Академическая гитара
            </h3>
            <ul className="space-y-4">
              {[
                "Основы музыкальной грамоты",
                "Техника игры и постановка рук",
                "Классический репертуар",
                "Подготовка к выступлениям и экзаменам"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-body text-text-secondary">
                  <Check className="text-brand-blue mt-0.5 flex-shrink-0" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-background-secondary rounded-card p-lg shadow-card">
            <h3 className="text-section mb-6 text-text-primary flex items-center gap-3">
              <div className="p-2 bg-brand-blue/10 rounded-soft text-brand-blue">
                <Music size={28} />
              </div>
              Современная гитара
            </h3>
            <ul className="space-y-4">
              {[
                "Игра на электрогитаре и акустике",
                "Изучение любимых песен",
                "Импровизация и соло",
                "Основы звукозаписи"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-body text-text-secondary">
                  <Check className="text-brand-blue mt-0.5 flex-shrink-0" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full max-w-[1280px] mx-auto px-md py-xl">
        <h2 className="text-section text-center mb-12 text-text-primary">
          Стоимость занятий
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md items-start">
          {/* Card 1 */}
          <div className="bg-background-secondary rounded-card p-md shadow-minimal hover:shadow-hover-card transition-all">
            <h3 className="text-card text-text-primary mb-2">Пробное занятие</h3>
            <div className="text-3xl font-bold text-brand-blue mb-4">Бесплатно</div>
            <p className="text-caption text-text-secondary mb-4 uppercase tracking-wide">30 минут</p>
            <ul className="space-y-3 mb-6">
              {["Знакомство с гитарой", "Определение уровня", "План обучения"].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-body text-text-secondary">
                  <Check className="text-brand-blue" size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 bg-background-surface-tinted hover:bg-gray-200 text-text-primary font-medium rounded-image transition-colors text-body">
              Записаться
            </button>
          </div>

          {/* Card 2 (Featured) */}
          <div className="bg-background-secondary rounded-card p-md shadow-card ring-2 ring-brand-blue relative transform md:-translate-y-4">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-brand-blue text-white text-xs font-semibold rounded-full">
              Популярный выбор
            </div>
            <h3 className="text-card text-text-primary mb-2">Индивидуальное занятие</h3>
            <div className="text-3xl font-bold text-brand-blue mb-4">1500₽</div>
            <p className="text-caption text-text-secondary mb-4 uppercase tracking-wide">60 минут</p>
            <ul className="space-y-3 mb-6">
              {["Персональная программа", "Материалы для занятий", "Домашние задания", "Поддержка в мессенджере"].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-body text-text-secondary">
                  <Check className="text-brand-blue" size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 bg-brand-blue hover:bg-brand-hover text-white font-medium rounded-image transition-all shadow-lg text-body">
              Записаться
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-background-secondary rounded-card p-md shadow-minimal hover:shadow-hover-card transition-all">
            <h3 className="text-card text-text-primary mb-2">Абонемент на 8 занятий</h3>
            <div className="text-3xl font-bold text-brand-blue mb-4">10800₽</div>
            <p className="text-caption text-text-secondary mb-4 uppercase tracking-wide">Сэкономьте 1200₽</p>
            <ul className="space-y-3 mb-6">
              {["Все из индивидуального", "Гибкий график", "Дополнительные материалы", "Запись уроков по запросу"].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-body text-text-secondary">
                  <Check className="text-brand-blue" size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 bg-background-surface-tinted hover:bg-gray-200 text-text-primary font-medium rounded-image transition-colors text-body">
              Записаться
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="w-full max-w-[1280px] mx-auto px-md py-xl bg-background-secondary rounded-image my-xl shadow-minimal">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center p-lg">
          <div className="flex justify-center">
            <div className="aspect-square w-full max-w-md bg-background-surface-tinted rounded-image flex items-center justify-center text-brand-blue">
              <Music size={120} strokeWidth={1} />
            </div>
          </div>
          <div>
            <h2 className="text-section mb-6 text-text-primary">Обо мне</h2>
            <h3 className="text-card text-text-secondary mb-4">Привет! Я - ваш будущий преподаватель гитары</h3>
            <p className="text-body text-text-secondary mb-4">
              Меня зовут Дмитрий, и я более 10 лет играю на гитаре. За это время я прошел путь от новичка до профессионального музыканта и преподавателя.
            </p>
            <p className="text-body text-text-secondary mb-4">
              Я окончил музыкальную школу по классу классической гитары, затем расширил свои знания в области современной музыки. Играю в нескольких музыкальных коллективах и участвую в концертах.
            </p>
            <p className="text-body text-text-secondary mb-8">
              Моя философия преподавания - это не просто обучение нотам и аккордам, а развитие музыкального слуха, креативности и любви к музыке.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-3xl font-bold text-brand-blue">50+</div>
                <div className="text-caption text-text-secondary uppercase tracking-wide">Учеников</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-blue">10+</div>
                <div className="text-caption text-text-secondary uppercase tracking-wide">Лет опыта</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full max-w-[1280px] mx-auto px-md py-xl">
        <h2 className="text-section text-center mb-12 text-text-primary">
          Отзывы учеников
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {[
            {
              text: "Дмитрий - отличный преподаватель! Начинал с нуля, уже через 3 месяца мог играть любимые песни. Объясняет просто и понятно.",
              name: "Александр К.",
              time: "Учится 6 месяцев",
              initials: "АК"
            },
            {
              text: "Занимаюсь с Дмитрием полгода. Очень нравится подход - всегда подстраивается под мои цели и музыкальные вкусы.",
              name: "Мария П.",
              time: "Учится 6 месяцев",
              initials: "МП"
            },
            {
              text: "Пробовал разных преподавателей, но Дмитрий лучший. Помог преодолеть плато в обучении и начал играть соло!",
              name: "Игорь С.",
              time: "Учится 1 год",
              initials: "ИС"
            }
          ].map((review, i) => (
            <div key={i} className="bg-background-secondary rounded-card p-md shadow-minimal">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-brand-blue fill-current" size={16} />
                ))}
              </div>
              <p className="text-body text-text-secondary mb-6 italic">
                "{review.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-background-surface-tinted rounded-full flex items-center justify-center text-text-primary font-semibold text-sm">
                  {review.initials}
                </div>
                <div>
                  <div className="text-body font-medium text-text-primary">{review.name}</div>
                  <div className="text-caption text-text-secondary">{review.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-[1280px] mx-auto px-md py-xl mb-xl">
        <div className="bg-background-secondary rounded-image p-lg md:p-12 shadow-card text-center border border-accents-neutral-border">
          <h2 className="text-section text-text-primary mb-4">
            Готовы начать играть на гитаре?
          </h2>
          <p className="text-body-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Запишитесь на бесплатное пробное занятие и сделайте первый шаг к освоению гитары
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-brand-blue hover:bg-brand-hover text-white font-semibold rounded-image transition-all shadow-lg flex items-center justify-center gap-2 text-body">
              <Calendar size={20} />
              Записаться на пробное занятие
            </button>
            <button className="px-8 py-4 bg-background-surface-tinted hover:bg-gray-200 text-text-primary font-semibold rounded-image transition-all flex items-center justify-center gap-2 text-body">
              <MessageCircle size={20} />
              Задать вопрос
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};