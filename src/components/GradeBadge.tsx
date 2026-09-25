import React, { useState } from 'react';
import { GradeLevel } from '../types';
import { getGradeMeta } from '../utils/formatters';
import { ShieldCheck, Info } from 'lucide-react';

interface GradeBadgeProps {
  grade: GradeLevel;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showLabel?: boolean;
  interactive?: boolean;
}

export const GradeBadge: React.FC<GradeBadgeProps> = ({
  grade,
  size = 'md',
  showLabel = false,
  interactive = true,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const meta = getGradeMeta(grade);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
    hero: 'text-xl px-5 py-2.5 gap-2.5 font-extrabold shadow-sm'
  }[size];

  return (
    <div className="relative inline-block">
      <div
        className={`inline-flex items-center rounded-lg border backdrop-blur-sm cursor-pointer select-none transition-transform active:scale-95 ${meta.badgeBg} ${meta.badgeBorder} ${sizeClasses}`}
        onClick={() => interactive && setShowTooltip(!showTooltip)}
        onMouseEnter={() => interactive && setShowTooltip(true)}
        onMouseLeave={() => interactive && setShowTooltip(false)}
        title="Klik untuk melihat penjelasan grade inspeksi"
      >
        <span className={`w-2 h-2 rounded-full ${meta.dotColor} shrink-0 animate-pulse`} />
        <span>GRADE {grade}</span>
        {showLabel && <span className="opacity-90 font-normal">· {meta.label.split('(')[1]?.replace(')', '') || ''}</span>}
        {interactive && <Info className="w-3 h-3 opacity-60 hover:opacity-100 shrink-0" />}
      </div>

      {showTooltip && (
        <div
          role="tooltip"
          className="absolute z-50 bottom-full left-0 mb-2 w-64 p-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs leading-relaxed border border-slate-700 pointer-events-none transform -translate-x-2 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Hasil Inspeksi 150+ Titik</span>
          </div>
          <p className="font-semibold text-white mb-0.5">{meta.label}</p>
          <p className="text-slate-300">{meta.description}</p>
          <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Garansi Mesin & Transmisi</span>
            <span className="text-emerald-400 font-medium">Terverifikasi</span>
          </div>
        </div>
      )}
    </div>
  );
};
