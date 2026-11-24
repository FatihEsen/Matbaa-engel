import { ArrowRight } from 'lucide-react';
import { TranslationBundle } from '../i18n/translations';
import { ClueArrowSvg } from './ClueArrowSvg';

interface GuideViewProps {
  t: TranslationBundle;
  onReturnToPlay: () => void;
}

export function GuideView({ t, onReturnToPlay }: GuideViewProps) {
  return (
    <section className="no-print max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="pb-5 mb-7 border-b border-[#1c1917]">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#171614] text-balance">
          {t.guideTitle}
        </h1>
        <p className="mt-2 font-editorial text-base text-[#5c564d] max-w-2xl">
          {t.guideSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article className="bg-[#faf7f0] border border-[#1c1917] p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-[#ebe4d4] border border-[#1c1917]">
              <ClueArrowSvg arrow="right" size={14} />
            </span>
            <span className="inline-flex items-center justify-center w-7 h-7 bg-[#ebe4d4] border border-[#1c1917]">
              <ClueArrowSvg arrow="down" size={14} />
            </span>
            <span className="inline-flex items-center justify-center w-7 h-7 bg-[#ebe4d4] border border-[#1c1917]">
              <ClueArrowSvg arrow="right-down" accent size={14} />
            </span>
          </div>
          <h2 className="font-display text-xl font-bold text-[#171614] mb-2">
            01. {t.guideArrowsTitle}
          </h2>
          <p className="font-editorial text-[15px] text-[#3f3b35] leading-relaxed">
            {t.guideArrowsDesc}
          </p>
        </article>

        <article className="bg-[#faf7f0] border border-[#1c1917] p-6">
          <div className="w-24 border border-[#1c1917] bg-[#ebe4d4] mb-3 text-[10px] font-semibold text-center">
            <div className="py-1 px-1.5 border-b border-[#1c1917]/60">Ses, yankı →</div>
            <div className="py-1 px-1.5">Susamlı ↴</div>
          </div>
          <h2 className="font-display text-xl font-bold text-[#171614] mb-2">
            02. {t.guideSplitTitle}
          </h2>
          <p className="font-editorial text-[15px] text-[#3f3b35] leading-relaxed">
            {t.guideSplitDesc}
          </p>
        </article>

        <article className="bg-[#faf7f0] border border-[#1c1917] p-6">
          <h2 className="font-display text-xl font-bold text-[#171614] mb-2">
            03. {t.guidePhotoTitle}
          </h2>
          <p className="font-editorial text-[15px] text-[#3f3b35] leading-relaxed">
            {t.guidePhotoDesc}
          </p>
        </article>

        <article className="bg-[#faf7f0] border border-[#1c1917] p-6">
          <h2 className="font-display text-xl font-bold text-[#171614] mb-2">
            04. {t.guideKeysTitle}
          </h2>
          <p className="font-editorial text-[15px] text-[#3f3b35] leading-relaxed">
            {t.guideKeysDesc}
          </p>
        </article>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={onReturnToPlay}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#faf7f0] bg-[#b42318] hover:bg-[#911b12] rounded-sm transition-colors cursor-pointer"
        >
          <span>{t.guideStartPlaying}</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
