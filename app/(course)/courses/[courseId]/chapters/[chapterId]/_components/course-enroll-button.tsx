"use client";
import React, { useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}

const CourseEnrollButton = ({
  courseId,
  price,
}: CourseEnrollButtonProps) => {
  // state declarations
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/courses/${courseId}/checkout`);

      window.location.assign(response.data.url);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  // return statement
  return (
    <Button
      className='w-full md:w-auto'
      disabled={isLoading}
      onClick={onClick}
      size={'sm'}
    >
      Enroll for {formatPrice(price)}
    </Button>
  )
}

export default CourseEnrollButton