"use client";
import React from "react";
import { IconType } from "react-icons/lib";
import {
  FcMultipleDevices,
  FcDataSheet,
  FcGlobe,
  FcIphone,
  FcSportsMode,
  FcIdea,
} from "react-icons/fc";

import { Category } from "@prisma/client";

import CategoryItem from "./category-item";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  "Data Science": FcDataSheet,
  "Web Development": FcGlobe,
  "Computer Science": FcMultipleDevices,
  "Mobile Development": FcIphone,
  "Game Development": FcSportsMode,
  "Artificial Intelligence": FcIdea,
};

// main component
const Categories = ({ items }: CategoriesProps) => {
  // return statement
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={ item.id }
          label={ item.name }
          icon={ iconMap[item.name] }
          value= { item.id }
        />
      ))}
    </div>
  );
};

export default Categories;
