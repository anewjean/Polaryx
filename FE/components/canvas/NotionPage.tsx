'use client'; // CSR

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { ExtendedRecordMap } from 'notion-types';
import 'react-notion-x/src/styles.css'; 
import { NotionRenderer } from 'react-notion-x';

interface NotionPageProps {
  recordMap: ExtendedRecordMap;
}

export default function NotionPage({ recordMap }: NotionPageProps) {
  const Code = dynamic(
    () => import('react-notion-x/build/third-party/code').then((m) => m.Code),
    {
      ssr: false,
    },
  );
  const Collection = dynamic(
    () => import('react-notion-x/build/third-party/collection').then((m) => m.Collection),
    {
      ssr: false,
    },
  );
  const Equation = dynamic(
    () => import('react-notion-x/build/third-party/equation').then((m) => m.Equation),
    {
      ssr: false,
    },
  );
  const Modal = dynamic(
    () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
    {
      ssr: false,
    },
  );

  return (
    <div className="flex flex-1 justfy-start ml-10 max-h-screen">
      <div className=' flex flex-1 min-h-0 w-full overflow-y-auto scrollbar-thin'>
        <NotionRenderer
          recordMap={recordMap}
          fullPage
          darkMode={false}
          previewImages
          components={{
            Code,
            Collection,
            Equation,
            Modal,
            nextImage: Image,
            nextLink: Link,
          }}
        />
      </div>
    </div>
  );
}