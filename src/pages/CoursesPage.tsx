import React from 'react';
import { BookOpen, Clock, Users, Star } from 'lucide-react';

export const CoursesPage: React.FC = () => {
  // Моковые данные для курсов
  const courses = [
    {
      id: 1,
      title: "Основы игры на гитаре",
      description: "Начальный курс для тех, кто только знакомится с гитарой",
      level: "Начальный",
      duration: "8 недель",
      students: 1234,
      rating: 4.8,
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "Ритмические фигуры и бои",
      description: "Изучение различных ритмических паттернов и техник боя",
      level: "Средний",
      duration: "6 недель",
      students: 892,
      rating: 4.7,
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "Соло и импровизация",
      description: "Основы сольной игры и импровизации на гитаре",
      level: "Продвинутый",
      duration: "10 недель",
      students: 567,
      rating: 4.9,
      image: "/api/placeholder/300/200"
    },
    {
      id: 4,
      title: "Аккомпанемент вокалу",
      description: "Искусство сопровождения вокальных партий на гитаре",
      level: "Средний",
      duration: "5 недель",
      students: 743,
      rating: 4.6,
      image: "/api/placeholder/300/200"
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Начальный":
        return "bg-green-900/30 text-green-400 border-green-800";
      case "Средний":
        return "bg-yellow-900/30 text-yellow-400 border-yellow-800";
      case "Продвинутый":
        return "bg-red-900/30 text-red-400 border-red-800";
      default:
        return "bg-gray-900/30 text-gray-400 border-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent">
            Курсы игры на гитаре
          </h1>
          <p className="text-slate-400 text-lg">
            Выберите подходящий курс и начните своё путешествие в мир музыки
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden hover:border-amber-600/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/10"
            >
              <div className="h-48 bg-slate-800 flex items-center justify-center">
                <BookOpen className="text-slate-600" size={48} />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>
                
                <p className="text-slate-400 mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500" />
                    <span>{course.rating}</span>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]">
                  Начать обучение
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-800 p-8">
            <h2 className="text-2xl font-semibold mb-4">Не нашли подходящий курс?</h2>
            <p className="text-slate-400 mb-6">
              Мы постоянно работаем над новими курсами. Оставьте свою почту, чтобы быть в курсе обновлений.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Ваш email" 
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                Подписаться
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};