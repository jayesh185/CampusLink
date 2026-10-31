import React from 'react';
import Badge from './Badge.jsx';
import { Sparkles, Brain, Code2 } from 'lucide-react';

export const MethodComparison = ({ comparison, semanticOnlySkills = [] }) => {
  if (!comparison) {
    return null;
  }

  const { keyword = 0, tfidf = 0, embeddings = 0 } = comparison;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-600" />
          3-Way Match Method Comparison
        </h3>
        <Badge variant="primary">AI Explainability</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Keyword Exact Match */}
        <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2 text-slate-600 mb-1 text-xs font-medium">
            <Code2 className="w-3.5 h-3.5" />
            Keyword Exact Match
          </div>
          <div className="text-2xl font-bold text-slate-700">{keyword}%</div>
          <p className="text-[11px] text-slate-400 mt-1">Exact token match only, no synonyms or context</p>
        </div>

        {/* TF-IDF + Synonyms */}
        <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2 text-slate-600 mb-1 text-xs font-medium">
            <span className="font-mono text-xs font-bold">TF</span>
            TF-IDF + Synonyms
          </div>
          <div className="text-2xl font-bold text-slate-700">{tfidf}%</div>
          <p className="text-[11px] text-slate-400 mt-1">Token frequency with curated skill dictionary</p>
        </div>

        {/* Local Embeddings */}
        <div className="p-3.5 rounded-lg border border-brand-200 bg-brand-50/40">
          <div className="flex items-center gap-2 text-brand-700 mb-1 text-xs font-semibold">
            <Brain className="w-3.5 h-3.5" />
            Neural Embeddings
          </div>
          <div className="text-2xl font-bold text-brand-700">{embeddings}%</div>
          <p className="text-[11px] text-brand-600/80 mt-1">all-MiniLM-L6-v2 vector space semantic fit</p>
        </div>
      </div>

      {semanticOnlySkills.length > 0 && (
        <div className="pt-2">
          <div className="text-xs font-medium text-brand-900 mb-1.5">
            Skills unlocked by Semantic AI (missed by exact keyword match):
          </div>
          <div className="flex flex-wrap gap-1.5">
            {semanticOnlySkills.map((skill, idx) => (
              <Badge key={idx} variant="primary" size="sm">
                ✦ {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MethodComparison;

