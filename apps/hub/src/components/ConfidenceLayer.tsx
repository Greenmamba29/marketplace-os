import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, TrendingUp, Users, Award, Lock, Globe, Zap } from 'lucide-react';

const TRUST_STATS = [
  { icon: Clock,       value: '< 2 hrs',   label: 'Avg RFQ response',      color: '#0ABFBC' },
  { icon: ShieldCheck, value: '14,200+',   label: 'Verified suppliers',     color: '#16A34A' },
  { icon: Users,       value: '2,400+',    label: 'Active buyer orgs',      color: '#2563EB' },
  { icon: TrendingUp,  value: '99.1%',     label: 'On-time delivery rate',  color: '#F97316' },
  { icon: Award,       value: 'ISO 9001',  label: 'All suppliers certified', color: '#7C3AED' },
  { icon: Globe,       value: '62 countries', label: 'Supplier network',    color: '#EAB308' },
  { icon: Lock,        value: 'SOC 2 II',  label: 'Data security standard', color: '#0891B2' },
  { icon: Zap,         value: '60 sec',    label: 'Time to first RFQ',      color: '#DC2626' },
];

const COMPLIANCE_BADGES = [
  'ISO 9001', 'ISO 14001', 'SOC 2 Type II', 'GDPR', 'CCPA',
  'NIST CSF', 'FAR/DFARS', 'FSMA', 'FDA 21 CFR', 'REACH / RoHS',
];

const BUYER_LOGOS = [
  'Boeing', 'Siemens', 'Kaiser', 'Sysco', 'Amazon', 'Tesla',
  'BASF', 'Caterpillar', '3M', 'Honeywell', 'GE', 'Bosch',
];

export const ConfidenceLayer: React.FC = () => {
  return (
    <section className="py-24 border-y border-surface-200/30 bg-[#0F1623]">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-4">Why Buyers Trust GrahmOS</p>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tighter">
            Built for Enterprise Procurement
          </h2>
          <p className="text-surface-400 mt-4 max-w-xl mx-auto">
            Every supplier is verified. Every transaction is protected. Every RFQ is tracked.
          </p>
        </div>

        {/* 8-stat grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {TRUST_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-6 bg-surface-50 border border-surface-200 rounded-2xl text-center group hover:border-primary/40 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110 duration-300"
                  style={{ backgroundColor: stat.color + '18', border: `1px solid ${stat.color}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <p className="text-2xl font-display font-black text-white mb-1">{stat.value}</p>
                <p className="text-[10px] text-surface-400 uppercase tracking-widest font-bold">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Compliance badges */}
        <div className="mb-16">
          <p className="text-[10px] text-surface-500 uppercase tracking-[0.2em] font-black text-center mb-6">
            Compliance Standards Covered Across All 20 Verticals
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {COMPLIANCE_BADGES.map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="px-4 py-2 bg-surface-50 border border-surface-200 rounded-xl text-xs font-black text-white flex items-center gap-2 hover:border-primary/40 transition-colors"
              >
                <ShieldCheck className="w-3 h-3 text-primary" />
                {badge}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Buyer logos */}
        <div>
          <p className="text-[10px] text-surface-500 uppercase tracking-[0.2em] font-black text-center mb-8">
            Trusted by Procurement Teams At
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
            {BUYER_LOGOS.map((logo, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-xl font-display font-black text-surface-300/40 hover:text-surface-300/80 transition-colors cursor-default tracking-tighter"
              >
                {logo}
              </motion.span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
