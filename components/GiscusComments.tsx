'use client';

import Giscus from '@giscus/react';

export function GiscusComments() {
  return (
    <div className="mt-12 pt-8 border-t border-white/10">
      <Giscus
        id="comments"
        repo="agnogad/openlibtr"
        repoId="R_kgDOSAxLnQ"
        category="General"
        categoryId="DIC_kwDOSAxLnc4C6sr5"
        mapping="pathname"
        term="Welcome to giscus!"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="dark"
        lang="tr"
        loading="lazy"
      />
    </div>
  );
}
