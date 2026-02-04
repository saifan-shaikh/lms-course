"use client";
import React from 'react'
import qs from 'query-string';
import { IconType } from 'react-icons/lib';

import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface CategoryItemProps {
  label: string,
  value?: string,
  icon?: IconType
}
// main component
const CategoryItem = ({label, value, icon: Icon} : CategoryItemProps) => {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCatergoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCatergoryId === value;

  const handleOnClick = () => {
    const url = qs.stringifyUrl({
      url: pathName,
      query: {
        title: currentTitle,
        categoryId: isSelected ? null : value,
      }
    }, {skipNull: true, skipEmptyString: true })

    router.push(url);
  }

  // return statement
  return (
    <button
      className={cn(
      "cursor-pointer py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition",
      isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
    )}
    onClick={ handleOnClick }
    >
      { Icon && <Icon size={20}/>}
      <div className='truncate'>{ label }</div>
    </button>
  )
}

export default CategoryItem