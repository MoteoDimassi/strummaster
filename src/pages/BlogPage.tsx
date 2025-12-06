import React from 'react';

export const BlogPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
      <h1 className="text-3xl font-bold text-amber-500">Блог</h1>
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 w-full">
        <p className="text-slate-400 text-center">Раздел находится в разработке. Скоро здесь появятся интересные статьи о музыке и гитаре.</p>
      </div>
    </div>
  );
};