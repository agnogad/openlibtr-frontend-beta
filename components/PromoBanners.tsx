'use client';

import { Github, MessageSquare, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export function PromoBanners() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
      {/* Discord Banner */}
      <motion.a
        href="https://discord.gg/vPjmyZtkpr"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        className="relative overflow-hidden group p-4 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center gap-4 transition-all hover:bg-[#5865F2]/15"
      >
        <div className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center shadow-lg shadow-[#5865F2]/20 shrink-0">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
            Discord
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-xs text-[#8E8E93] leading-tight truncate">
            Hata bildirimi ve sohbet için katılın.
          </p>
        </div>
      </motion.a>

      {/* GitHub Banner */}
      <motion.a
        href="https://github.com/agnogad/openlibtr"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.01 }}
        className="relative overflow-hidden group p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 transition-all hover:bg-white/10"
      >
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
          <Github className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
            GitHub
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-xs text-[#8E8E93] leading-tight truncate">
            Kaynak kodu inceleyin ve katkıda bulunun.
          </p>
        </div>
      </motion.a>
    </div>
  );
}
