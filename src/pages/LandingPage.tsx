import React, { useRef } from 'react';
import { Star, Clock, Users, Award, Play, Check, Music, Calendar, MessageCircle, ArrowRight, Guitar, Mic, BookOpen, FileText, Activity } from 'lucide-react';
import { SEO } from '../shared/components';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Separator } from '@/src/components/ui/separator';
import { motion, useScroll, useTransform } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100
    }
  }
};

export const LandingPage: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="w-full min-h-screen bg-background font-sans overflow-hidden" ref={targetRef}>
      <SEO
        title="Уроки гитары онлайн"
        description="Профессиональные уроки игры на гитаре от Дмитрия. Индивидуальный подход, гибкий график, обучение с нуля до профи."
        keywords="уроки гитары, обучение гитаре, репетитор по гитаре, гитара онлайн, курсы гитары"
      />
      
      {/* Hero Section with Parallax */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 to-background z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        </motion.div>

        <div className="container mx-auto px-4 md:px-6 relative z-20">
          <motion.div 
            className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-background/80 backdrop-blur-sm text-foreground border border-border shadow-sm">
                🎸 Профессиональное обучение музыке
              </Badge>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground drop-shadow-sm">
              Раскройте свой <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">музыкальный потенциал</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed bg-background/50 backdrop-blur-sm p-4 rounded-xl">
              От первых аккордов до виртуозных соло. Индивидуальная программа обучения, адаптированная под ваши цели и музыкальные вкусы.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" className="text-lg px-8 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90">
                Записаться на пробное
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 h-14 rounded-full border-2 bg-background/80 backdrop-blur-sm hover:bg-secondary/80 transition-all duration-300">
                <Play className="mr-2 h-5 w-5 fill-current" />
                Смотреть видео-обзор
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Site Features Section */}
      <section className="py-24 bg-secondary/30 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Инструменты для обучения</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Всё необходимое для вашего прогресса в одном месте
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Guitar,
                title: "Онлайн Тюнер",
                description: "Точная настройка гитары через микрофон вашего устройства. Поддержка различных строев.",
                color: "text-orange-500",
                bg: "bg-orange-50"
              },
              {
                icon: Activity,
                title: "Метроном",
                description: "Развивайте чувство ритма. Настраиваемый темп, размеры и звуковые акценты.",
                color: "text-blue-500",
                bg: "bg-blue-50"
              },
              {
                icon: Mic,
                title: "Музыкальный диктант",
                description: "Тренируйте слух, определяя ноты и интервалы. Интерактивные упражнения разной сложности.",
                color: "text-purple-500",
                bg: "bg-purple-50"
              },
              {
                icon: Music,
                title: "Тренажер аккордов",
                description: "Библиотека аккордов с аппликатурами. Учитесь строить и распознавать аккорды.",
                color: "text-green-500",
                bg: "bg-green-50"
              },
              {
                icon: FileText,
                title: "Табы и ноты",
                description: "Коллекция разборов популярных песен. Удобный просмотр и воспроизведение.",
                color: "text-red-500",
                bg: "bg-red-50"
              },
              {
                icon: BookOpen,
                title: "Блог о музыке",
                description: "Статьи, советы и уроки по теории музыки, технике игры и оборудованию.",
                color: "text-teal-500",
                bg: "bg-teal-50"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-none bg-background group cursor-pointer">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Почему выбирают мои уроки</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Сочетание классической школы и современных методик для быстрого и качественного результата
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Индивидуальный подход",
                description: "Программа строится на основе ваших интересов. Учим только то, что вам действительно нужно и интересно."
              },
              {
                icon: Award,
                title: "Опыт и квалификация",
                description: "Более 10 лет сценического опыта и 5 лет преподавания. Профильное музыкальное образование."
              },
              {
                icon: Clock,
                title: "Гибкий график",
                description: "Занимайтесь в удобное время. Возможность переноса занятий и онлайн формат через Zoom/Skype."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full border shadow-sm hover:shadow-md transition-all duration-300 bg-background group">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Направления обучения</h2>
            <p className="text-lg text-muted-foreground">Выберите свой путь в мире музыки</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full overflow-hidden border-2 hover:border-primary/20 transition-colors bg-background">
                <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600" />
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <Guitar className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Академическая гитара</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Фундаментальное музыкальное образование
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {[
                      "Основы музыкальной грамоты и сольфеджио",
                      "Правильная постановка рук и посадка",
                      "Чтение нот с листа",
                      "Классический репертуар (Бах, Джулиани, Сор)",
                      "Подготовка к поступлению в муз. училище"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1 bg-green-100 rounded-full p-1">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full overflow-hidden border-2 hover:border-primary/20 transition-colors bg-background">
                <div className="h-2 bg-gradient-to-r from-indigo-400 to-purple-600" />
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-indigo-50 rounded-xl">
                      <Music className="h-8 w-8 text-indigo-600" />
                    </div>
                    <CardTitle className="text-2xl">Современная гитара</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Рок, блюз, джаз и популярная музыка
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {[
                      "Игра на электрогитаре и акустике",
                      "Разбор любимых песен и риффов",
                      "Импровизация и основы композиции",
                      "Работа со звуком и эффектами",
                      "Основы звукозаписи в домашних условиях"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1 bg-green-100 rounded-full p-1">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Стоимость обучения</h2>
            <p className="text-lg text-muted-foreground">Честные цены без скрытых платежей</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
            {/* Free Trial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow bg-background">
                <CardHeader>
                  <CardTitle>Пробное занятие</CardTitle>
                  <CardDescription>Познакомимся и определим цели</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">Бесплатно</div>
                  <p className="text-sm text-muted-foreground mb-6">30 минут</p>
                  <Separator className="mb-6" />
                  <ul className="space-y-3">
                    {["Знакомство с инструментом", "Оценка текущего уровня", "Составление плана обучения"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">Записаться</Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Standard Lesson */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <Badge className="bg-primary text-primary-foreground px-3 py-1 text-sm shadow-lg">
                  Популярный выбор
                </Badge>
              </div>
              <Card className="h-full shadow-xl border-primary/50 scale-105 bg-background">
                <CardHeader>
                  <CardTitle>Разовое занятие</CardTitle>
                  <CardDescription>Максимальная гибкость</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">1 500 ₽</div>
                  <p className="text-sm text-muted-foreground mb-6">60 минут</p>
                  <Separator className="mb-6" />
                  <ul className="space-y-3">
                    {["Персональная программа", "Материалы для занятий (PDF/Tabs)", "Проверка домашних заданий", "Поддержка в мессенджере"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg">Записаться</Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Subscription */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow bg-background">
                <CardHeader>
                  <CardTitle>Абонемент</CardTitle>
                  <CardDescription>Для серьезного настроя</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">10 800 ₽</div>
                  <p className="text-sm text-muted-foreground mb-6">8 занятий (выгода 1200₽)</p>
                  <Separator className="mb-6" />
                  <ul className="space-y-3">
                    {["Все преимущества разового", "Фиксированное время", "Доступ к закрытому чату", "Видеозаписи уроков"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">Купить абонемент</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 overflow-hidden bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden shadow-2xl">
                <Music className="w-48 h-48 text-primary/20" />
                {/* Placeholder for real photo */}
                <div className="absolute inset-0 flex items-center justify-center text-primary/40 font-bold text-2xl">
                  Фото преподавателя
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-background p-6 rounded-2xl shadow-xl border">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">10+</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Лет опыта</div>
                  </div>
                  <Separator orientation="vertical" className="h-10" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">50+</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Учеников</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Badge variant="outline" className="w-fit">О преподавателе</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Привет! Меня зовут Дмитрий</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Я профессиональный музыкант и преподаватель гитары. Моя цель — не просто научить вас нажимать на струны, а помочь вам полюбить музыку и найти свой собственный стиль.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                За 10 лет игры я прошел путь от дворовых песен до сложных джазовых импровизаций и классических произведений. Я знаю, с какими трудностями сталкиваются новички, и знаю, как их преодолеть максимально эффективно.
              </p>
              <div className="pt-4">
                <Button variant="secondary" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Задать вопрос лично
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            Что говорят ученики
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                text: "Дмитрий - отличный преподаватель! Начинал с нуля, уже через 3 месяца мог играть любимые песни. Объясняет просто и понятно.",
                name: "Александр К.",
                role: "Учится 6 месяцев",
                initials: "АК"
              },
              {
                text: "Занимаюсь с Дмитрием полгода. Очень нравится подход - всегда подстраивается под мои цели и музыкальные вкусы.",
                name: "Мария П.",
                role: "Учится 6 месяцев",
                initials: "МП"
              },
              {
                text: "Пробовал разных преподавателей, но Дмитрий лучший. Помог преодолеть плато в обучении и начал играть соло!",
                name: "Игорь С.",
                role: "Учится 1 год",
                initials: "ИС"
              }
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full bg-background border shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic">"{review.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {review.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{review.name}</div>
                        <div className="text-xs text-muted-foreground">{review.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground px-6 py-16 md:px-16 md:py-20 text-center shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Готовы начать играть на гитаре?
              </h2>
              <p className="text-xl text-primary-foreground/80">
                Запишитесь на бесплатное пробное занятие прямо сейчас и сделайте первый шаг к своей мечте.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" variant="secondary" className="text-lg h-14 px-8 rounded-full shadow-lg">
                  <Calendar className="mr-2 h-5 w-5" />
                  Записаться на урок
                </Button>
                <Button size="lg" variant="outline" className="text-lg h-14 px-8 rounded-full bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Задать вопрос
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};