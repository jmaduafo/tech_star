import { User } from '@/types/types';
import React from 'react'

function StagesDisplay({user,
  loading,
  sort,
  searchValue,
  projectId,
  
}: {
  readonly user: User | undefined;
  readonly sort: string;
  readonly projectId: string;
  readonly searchValue: string;
  readonly loading: boolean;
}) {
  return (
    <div>StagesDisplay</div>
  )
}

export default StagesDisplay