import { useEffect, useState } from 'react';
import { remark } from 'remark';
import gfm from 'remark-gfm'
import html from 'remark-html';

const Details = ({ markdown }: { markdown: string }) => {
  const [contentHtml, setContentHtml] = useState('');
  
  useEffect(() => {
    const convertMarkdown = async () => {
      const processed = await remark().use(gfm).use(html).process(markdown)
      setContentHtml(processed.toString());
    };
    convertMarkdown();
  }, [markdown]);
  return (
    contentHtml ? <div
      className="prose prose-neutral max-w-none"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />:<></>
  );
}

export default Details;