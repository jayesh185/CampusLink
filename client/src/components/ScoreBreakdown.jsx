import React from 'react';
import Badge from './Badge.jsx';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

export const ScoreBreakdown = ({ breakdown, matchedSkills = [], missingSkills = [] }) => {
  if (!breakdown) {
    return (
      <div className="text-sm text-slate-500 italic p-4 text-center bg-slate-50 rounded-xl">
        No score breakdown available yet.
      </div>
    );
  }

  const {
    skillCoverage = 0,
    docSimilarity = 0,
    projectRelevance = 0,
    weights = { skill: 0.5, doc: 0.3, project: 0.2 },
  } = breakdown;

  return (
    <div className="space-y-5">
      {/* Component Weights and Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Skill Match ({Math.round(weights.skill * 100)}%)</span>
            <span className="font-semibold text-slate-800">{Math.round(skillCoverage * 100)}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round(skillCoverage * 100))}%` }}
            />
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Doc Semantic ({Math.round(weights.doc * 100)}%)</span>
            <span className="font-semibold text-slate-800">{Math.round(docSimilarity * 100)}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round(docSimilarity * 100))}%` }}
            />
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Project Fit ({Math.round(weights.project * 100)}%)</span>
            <span className="font-semibold text-slate-800">{Math.round(projectRelevance * 100)}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-sky-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round(projectRelevance * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Matched Skills with Evidence */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Matched Skills ({matchedSkills.length})
        </h4>
        {matchedSkills.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No skills matched directly.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((item, idx) => {
              const skillName = typeof item === 'string' ? item : item.required;
              const via = item.via || item.bestResumeItem;
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-emerald-800"
                >
                  <span className="font-semibold">{skillName}</span>
                  {via && (
                    <span className="text-[11px] text-emerald-600 border-l border-emerald-200 pl-1.5">
                      via "{via}"
                    </span>
                  )}
                  {item.similarity && (
                    <Badge variant="success" size="sm">
                      {Math.round(item.similarity * 100)}%
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Missing Skills */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
          <XCircle className="w-4 h-4 text-rose-500" />
          Missing Skills ({missingSkills.length})
        </h4>
        {missingSkills.length === 0 ? (
          <p className="text-xs text-emerald-600 font-medium">All required skills present!</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-rose-50 border border-rose-200 rounded-md text-xs font-medium text-rose-700"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreBreakdown;

